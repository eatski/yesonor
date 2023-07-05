import { brand } from "@/common/texts";
import Head from "next/head";

export const keysOverride = {
	description: "description",
	metaOgpTitle: "metaOgpTitle",
	metaOgpDescription: "metaOgpDescription",
};

export const HeadMetaOverride: React.FC<{
	titleHeadOverride?: string;
	descriptionOverride?: string;
}> = ({ titleHeadOverride, descriptionOverride }) => {
	const title = titleHeadOverride
		? `${titleHeadOverride} - ${brand.serviceName}(${brand.serviceNickname})`
		: `${brand.serviceName}(${brand.serviceNickname}) - ${brand.serviceDescription}`;
	const description = descriptionOverride ?? brand.serviceDescription;
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
