import "sanitize.css";
import "@/designSystem/base.scss";
import { ReactQueryContextProvider } from "@/common/context/ReactQueryContextProvider";
import { brand } from "@/common/texts";
import { Toast } from "@/components/toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import Script from "next/script";
import { Layout } from "../components/layout";

export const metadata: Metadata = {
	title: `${brand.serviceName}(${brand.serviceNickname}) - ${brand.serviceDescription}`,
	description: brand.serviceDescriptionLong,
	openGraph: {
		title: `${brand.serviceName}(${brand.serviceNickname}) - ${brand.serviceDescription}`,
		description: brand.serviceDescriptionLong,
		siteName: brand.serviceName,
		url: brand.origin,
		type: "website",
		images: `${brand.origin}/card.png`,
	},
	twitter: {
		card: "summary",
		images: `${brand.origin}/card_square.png`,
	},
	verification: {
		google: "toLriA_msPJP10377YaTkJyFwrtjpZUR9NqyWeug61s",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/favicon.ico" />
			</head>
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
			<body>
				<ReactQueryContextProvider>
					<Toast>
						<Layout>{children}</Layout>
					</Toast>
				</ReactQueryContextProvider>
				<SpeedInsights />
			</body>
		</html>
	);
}
