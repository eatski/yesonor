import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useEffect, useMemo } from 'react';
import { trpc } from "@/libs/trpc";
import 'sanitize.css';
import '@/styles/base.css';
import { SessionProvider } from "next-auth/react"

import Head from 'next/head';
import { texts } from '@/texts';
import Script from 'next/script';
import router, { useRouter } from 'next/router';
import { gtag } from '@/common/util/gtag';
import { keysOverride } from '@/features/headMeta';

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

  const router = useRouter();

  useEffect(() => {
    const handler = () => {
      gtag("pageview");
    };
    router.events.on("routeChangeComplete", handler);

    return () => {
      router.events.off("routeChangeComplete", handler);
    };
  }, [router]);
  
  return (
    <>
      <Head>
        <title>{`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="IOUrzGJWxf4PAzsbT3sjOdM63TI1ELMEpDhmtX0QlWQ" />
        <meta key={keysOverride.description} name="description" content={texts.serviceDescription} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:url" content="https://yesonor.vercel.app"></meta>
        <meta key={keysOverride.metaOgpTitle}  property="og:title" content={`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`} />
        <meta key={keysOverride.metaOgpDescription} property="og:description" content={texts.serviceDescription} />
        <meta property="og:type" content="website" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1VTTNL7SR2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1VTTNL7SR2');
        `}
      </Script>
      <SessionProvider session={pageProps.session}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </trpc.Provider>
      </SessionProvider>
    </>
  );
}