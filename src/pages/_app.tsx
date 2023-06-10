import type { AppProps } from "next/app";

import React from "react";
import "sanitize.css";
import "@/styles/base.css";
import { SessionProvider } from "next-auth/react";

import Head from "next/head";
import { texts } from "@/texts";
import Script from "next/script";
import { TrpcContextProvider } from "@/context/TrpcContext";
import { BaseHead } from "@/features/headMeta";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<BaseHead />
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
				<TrpcContextProvider>
					<Component {...pageProps} />
				</TrpcContextProvider>
			</SessionProvider>
		</>
	);
}
