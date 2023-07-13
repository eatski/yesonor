import { deleteAccount } from "./procedures/deleteAccount";
import { question } from "./procedures/question";
import { story } from "./procedures/story";
import { truth } from "./procedures/truth";
import { user } from "./procedures/user";
import { router } from "./trpc";

export const appRouter = router({
	question,
	truth,
	deleteAccount,
	user,
	story,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
