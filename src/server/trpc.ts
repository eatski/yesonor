import { initTRPC } from "@trpc/server";
import { type createContext } from "./context";

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
export const procedure = t.procedure;
