import { abtest } from "./procedures/abtest";
import { deleteAccount } from "./procedures/deleteAccount";
import { question } from "./procedures/question";
import { storyEvalution } from "./procedures/storyEvalution";
import { truth } from "./procedures/truth";
import { user } from "./procedures/user";
import { router } from "./trpc";

export const appRouter = router({
	question,
	truth,
	deleteAccount,
	user,
	storyEvalution,
	abtest,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
