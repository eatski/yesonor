import { delete_ } from "./procedures/delete";
import { deleteAccount } from "./procedures/deleteAccount";
import { post } from "./procedures/post";
import { publishFirst } from "./procedures/publish";
import { put } from "./procedures/put";
import { question } from "./procedures/question";
import { questionLog } from "./procedures/questionLog";
import { truth } from "./procedures/truth";
import { user } from "./procedures/user";
import { router } from "./trpc";

export const appRouter = router({
	question,
	truth,
	post,
	put,
	delete: delete_,
	deleteAccount,
	publish: publishFirst,
	user,
	questionLog,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
