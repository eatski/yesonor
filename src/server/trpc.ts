import { authConfig } from '@/pages/api/auth/[...nextauth]';
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth/next';

export const createContext = async (context: CreateNextContextOptions) => {
    const session = await getServerSession(context.req, context.res, authConfig);
    if(!session){
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        })
    }
    return {
      user: session.user,
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