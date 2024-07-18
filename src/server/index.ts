import { deleteAccount } from "./procedures/deleteAccount";
import { user } from "./procedures/user";
import { router } from "./trpc";

export const appRouter = router({
	deleteAccount,
	user,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
