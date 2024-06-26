import { setTimeout } from "node:timers/promises";
import { TRPCError, initTRPC } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { createContext } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createContext>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const procedure =
	process.env.NODE_ENV !== "production"
		? t.procedure.use(async ({ next }) => {
				const timer = setTimeout(500);
				const result = await next();
				await timer;
				return result;
			})
		: t.procedure.use(async ({ next }) => {
				return await next().then((result) => {
					if (result.ok) {
						return result;
					}
					const status = getHTTPStatusCodeFromError(result.error);
					if (status >= 500) {
						console.error(result.error);
					}
					result.error = new TRPCError({
						code: result.error.code,
					});
					return result;
				});
			});
