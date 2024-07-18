import { deleteAccount } from "./procedures/deleteAccount";
import { storyEvalution } from "./procedures/storyEvalution";
import { user } from "./procedures/user";
import { router } from "./trpc";

export const appRouter = router({
	deleteAccount,
	user,
	storyEvalution,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
