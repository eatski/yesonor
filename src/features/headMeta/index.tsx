import { texts } from "@/texts";
import Head from "next/head";

const keysOverride = {
	description: "description",
	metaOgpTitle: "metaOgpTitle",
	metaOgpDescription: "metaOgpDescription",
};

export const HeadMetaOverride: React.FC<{
	titleHeadOverride?: string;
	descriptionOverride?: string;
}> = ({ titleHeadOverride, descriptionOverride }) => {
	const title = titleHeadOverride
		? `${titleHeadOverride} - ${texts.serviceName}(${texts.serviceNickname})`
		: `${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`;
	const description = descriptionOverride ?? texts.serviceDescription;
	return (
		<Head>
			<title>{title}</title>
			<meta
				key={keysOverride.description}
				name="description"
				content={description}
			/>
			<meta
				key={keysOverride.metaOgpTitle}
				property="og:title"
				content={title}
			/>
			<meta
				key={keysOverride.metaOgpDescription}
				property="og:description"
				content={description}
			/>
		</Head>
	);
};

export const BaseHead = () => {
	return (
		<Head>
			<title>{`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta
				name="google-site-verification"
				content="IOUrzGJWxf4PAzsbT3sjOdM63TI1ELMEpDhmtX0QlWQ"
			/>
			<meta
				key={keysOverride.description}
				name="description"
				content={texts.serviceDescription}
			/>
			<link rel="icon" href="/favicon.ico" />
			<meta property="og:url" content="https://iesona.com" />
			<meta
				key={keysOverride.metaOgpTitle}
				property="og:title"
				content={`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`}
			/>
			<meta
				key={keysOverride.metaOgpDescription}
				property="og:description"
				content={texts.serviceDescription}
			/>
			<meta property="og:type" content="website" />
		</Head>
	);
};
