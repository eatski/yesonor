import { hello } from './procedures/hello';
import { question } from './procedures/question';
import { router } from './trpc';

export const appRouter = router({
  hello,
  question
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;