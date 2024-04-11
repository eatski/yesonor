import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { setTimeout } from "timers/promises";
import { verifyRecaptcha } from "./services/recaptcha";
import {
	AB_TESTING_COOKIE_NAME,
	AB_TESTING_VARIANTS,
	getAorBRandom,
	validateABTestingVariant,
} from "@/common/abtesting";
import { get } from "@vercel/edge-config";

export const createContext = async (context: CreateNextContextOptions) => {
	return {
		setupABTestingVariant: async () => {
			const abTestRate = await get("abTestRate");
			if (
				!abTestRate ||
				!(typeof abTestRate === "number") ||
				isNaN(abTestRate) ||
				abTestRate < 0 ||
				abTestRate > 1
			) {
				return AB_TESTING_VARIANTS.ONLY_SONNET;
			}
			const cookieValue = context.req.cookies[AB_TESTING_COOKIE_NAME];
			const validated = cookieValue && validateABTestingVariant(cookieValue);
			if (validated) {
				return validated;
			}
			const random = getAorBRandom(abTestRate);
			context.res.setHeader(
				"Set-Cookie",
				`${AB_TESTING_COOKIE_NAME}=${random}; Path=/; HttpOnly; Secure; SameSite=Strict`,
			);
			return random;
		},
		getUserOptional: async () => {
			const session = await getServerSession(
				context.req,
				context.res,
				authConfig,
			);
			return session?.user?.email && session.custom?.userId
				? {
						id: session.custom.userId,
						email: session.user.email,
				  }
				: null;
		},
		getUser: async () => {
			const session = await getServerSession(
				context.req,
				context.res,
				authConfig,
			);
			if (!session?.user?.email || !session.custom?.userId) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			}
			return {
				id: session.custom.userId,
				email: session.user.email,
			};
		},
		doRevalidate(url: string) {
			const retryable = (count: number, error?: any): Promise<void> => {
				if (count) {
					return setTimeout(3000).then(() =>
						context.res.revalidate(url).catch((e) => {
							return retryable(count - 1, e);
						}),
					);
				}
				console.error(error);
				return Promise.reject(
					new Error("revalidation failed", {
						cause: error,
					}),
				);
			};
			return retryable(10);
		},
		verifyRecaptcha(token: string) {
			return verifyRecaptcha(token).catch((e) => {
				throw new TRPCError({
					code: "BAD_REQUEST",
					cause: e,
				});
			});
		},
		isThankYouUser: () =>
			context.req.cookies.thankyou === process.env.THANKYOU_CODE,
	};
};
