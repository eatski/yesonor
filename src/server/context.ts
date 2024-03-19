import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { setTimeout } from "timers/promises";
import { verifyRecaptcha } from "./services/recaptcha";

export const createContext = async (context: CreateNextContextOptions) => {
	return {
		getABTestingVariant: () => {
			const KEY = "abtesting";
			// AもしくはBのクッキーがあるならそれを返す
			if (
				context.req.cookies[KEY] === "A" ||
				context.req.cookies[KEY] === "B"
			) {
				return context.req.cookies[KEY];
			}
			// なければランダムでAかBを返す
			const variant = Math.random() < 0.5 ? "A" : "B";
			// クッキーをセットして返す 半日有効
			context.res.setHeader(
				"Set-Cookie",
				`${KEY}=${variant}; Path=/; Max-Age=${60 * 60 * 12}`,
			);
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
	};
};
