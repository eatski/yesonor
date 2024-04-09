import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useEffect, useMemo } from "react";
import { trpc } from "@/libs/trpc";
import "sanitize.css";
import "@/designSystem/base.css";
import { SessionProvider } from "next-auth/react";

import Head from "next/head";
import { brand } from "@/common/texts";
import Script from "next/script";
import { useRouter } from "next/router";
import { gtagEvent } from "@/common/util/gtag";
import { keysOverride } from "@/components/headMeta";
import { ConfirmModal } from "@/components/confirmModal";
import { Toast } from "@/components/toast";
import {
	AB_TESTING_COOKIE_NAME,
	getAorBRandom,
	validateABTestingVariant,
} from "@/common/abtesting";

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = useMemo(() => new QueryClient(), []);
	const trpcClient = useMemo(
		() =>
			trpc.createClient({
				links: [
					httpBatchLink({
						url: "/api/trpc",
					}),
				],
			}),
		[],
	);

	const router = useRouter();

	useEffect(() => {
		const handler = () => {
			gtagEvent("page_transition");
		};
		router.events.on("routeChangeComplete", handler);

		return () => {
			router.events.off("routeChangeComplete", handler);
		};
	}, [router]);

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_AB_TEST_RATE) {
			return;
		}
		const rate = Number(process.env.NEXT_PUBLIC_AB_TEST_RATE);
		if (rate < 0 || rate > 1 || isNaN(rate)) {
			console.error("NEXT_PUBLIC_AB_TEST_RATE must be between 0 and 1.");
			return;
		}
		//ABテストのためのクッキーを付与
		import("js-cookie").then((jsCookie) => {
			const cookieValue = jsCookie.default.get(AB_TESTING_COOKIE_NAME);
			if (!cookieValue || !validateABTestingVariant(cookieValue)) {
				jsCookie.default.set(AB_TESTING_COOKIE_NAME, getAorBRandom(rate));
			}
		});
	}, []);

	return (
		<>
			<Head>
				<title>{`${brand.serviceName}(${brand.serviceNickname}) - ${brand.serviceDescription}`}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="google-site-verification"
					content="IOUrzGJWxf4PAzsbT3sjOdM63TI1ELMEpDhmtX0QlWQ"
				/>
				<meta
					key={keysOverride.description}
					name="description"
					content={brand.serviceDescriptionLong}
				/>
				<link rel="icon" href="/favicon.ico" />
				<meta property="og:url" content="https://iesona.com" />
				<meta
					key={keysOverride.metaOgpTitle}
					property="og:title"
					content={`${brand.serviceName}(${brand.serviceNickname}) - ${brand.serviceDescription}`}
				/>
				<meta
					key={keysOverride.metaOgpTitle}
					property="og:site_name"
					content={brand.serviceName}
				/>
				<meta
					key={keysOverride.metaOgpDescription}
					property="og:description"
					content={brand.serviceDescriptionLong}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://iesona.com/card.png" />
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:image"
					content="https://iesona.com/card_square.png"
				/>
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
						<ConfirmModal>
							<Toast>
								<Component {...pageProps} />
							</Toast>
						</ConfirmModal>
					</QueryClientProvider>
				</trpc.Provider>
			</SessionProvider>
		</>
	);
}
