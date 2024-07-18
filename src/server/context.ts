import { setTimeout } from "node:timers/promises";
import { RECAPTCHA_COOKIE_KEY } from "@/common/util/grecaptcha";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { verifyRecaptcha } from "./services/recaptcha";

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
		verifyRecaptcha(token: string) {
			if (
				context.req.cookies[RECAPTCHA_COOKIE_KEY] === process.env.MACHINE_TOKEN
			) {
				return setTimeout(100);
			}
			return verifyRecaptcha(token).catch((e) => {
				throw new TRPCError({
					code: "BAD_REQUEST",
					cause: e,
				});
			});
		},
	};
};
