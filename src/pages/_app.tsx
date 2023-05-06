import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useMemo } from 'react';
import { trpc } from "@/libs/trpc";
import 'sanitize.css';
import '@/styles/base.css';
import { SessionProvider } from "next-auth/react"

import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
    , []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="IOUrzGJWxf4PAzsbT3sjOdM63TI1ELMEpDhmtX0QlWQ" />
      </Head>
      <SessionProvider session={pageProps.session} basePath={"http://localhost:3000"}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </trpc.Provider>
      </SessionProvider>
    </>
  );
}