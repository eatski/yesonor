import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { setTimeout } from "timers/promises";
import { verifyRecaptcha } from "./services/recaptcha";
import { Configuration, OpenAIApi } from "openai";

export const createContext = async (context: CreateNextContextOptions) => {
	return {
		getUserOptional: async () => {
			const session = await getServerSession(
				context.req,
				context.res,
				authConfig,
			);
			return session?.user?.email
				? {
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
			if (!session?.user?.email) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			}
			return {
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
		openai: new OpenAIApi(
			new Configuration({
				apiKey: process.env.OPENAI_API_KEY,
			}),
		),
	};
};
