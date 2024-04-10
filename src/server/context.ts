import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { setTimeout } from "timers/promises";
import { verifyRecaptcha } from "./services/recaptcha";
import {
	AB_TESTING_COOKIE_NAME,
	AB_TESTING_VARIANTS,
	validateABTestingVariant,
} from "@/common/abtesting";

export const createContext = async (context: CreateNextContextOptions) => {
	return {
		getABTestingVariant: () => {
			const cookieValue = context.req.cookies[AB_TESTING_COOKIE_NAME];
			// AもしくはBのクッキーがあるならそれを返す // なければランダムでAかBを返す
			const variant =
				(cookieValue && validateABTestingVariant(cookieValue)) ||
				AB_TESTING_VARIANTS.ONLY_SONNET;
			return variant;
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
