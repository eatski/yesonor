import { delete_ } from "./procedures/delete";
import { deleteAccount } from "./procedures/deleteAccount";
import { hello } from "./procedures/hello";
import { post } from "./procedures/post";
import { publishFirst } from "./procedures/publish";
import { put } from "./procedures/put";
import { question } from "./procedures/question";
import { truth } from "./procedures/truth";
import { router } from "./trpc";

export const appRouter = router({
	hello,
	question,
	truth,
	post,
	put,
	delete: delete_,
	deleteAccount,
	publish: publishFirst,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
