import '@/styles/globals.css'
import type { AppProps } from 'next/app'


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useMemo } from 'react';
import { trpc } from "@/libs/trpc";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(),[]);
  const trpcClient = useMemo(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  ,[]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}