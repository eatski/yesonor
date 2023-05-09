import { authConfig } from '@/pages/api/auth/[...nextauth]';
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth/next';
import { setTimeout } from 'timers/promises';

export const createContext = async (context: CreateNextContextOptions) => {
    const session = await getServerSession(context.req, context.res, authConfig);
    if(!session || !session.user?.email){
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        })
    }
    return {
      user: {
        email: session.user.email,
      },
      doRevalidate(url: string){
        const retryable = (count: number,error?: any): Promise<void> => {
          if(count){
            return setTimeout(3000).then(() => context.res.revalidate(url).catch((e) => {
              return retryable(count - 1,e)
            }))
          }
          console.error(error);
          return Promise.reject( new Error("revalidation failed",{
            cause: error
          }))
        }
        return retryable(10)
      },
    };
};

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