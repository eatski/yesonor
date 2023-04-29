import { hello } from './procedures/hello';
import { question } from './procedures/question';
import { truth } from './procedures/truth';
import { router } from './trpc';

export const appRouter = router({
  hello,
  question,
  truth
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;