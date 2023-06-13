import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { setTimeout } from "timers/promises";
import { verifyRecaptcha } from "./services/recaptcha";
import { Configuration, OpenAIApi } from "openai";
import { revalidatePath } from "next/cache";

export const createContext = async (context: CreateNextContextOptions) => {
	return {
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
			try {
				revalidatePath(url);
			} catch (e) {
				console.error(e);
			}
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
