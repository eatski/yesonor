import { Markdown } from "@/components/markdown";
import { Layout } from "@/components/layout";
import { readFile } from "fs/promises";
import { GetStaticPaths, GetStaticProps } from "next";
import { resolve } from "path";
import Script from "next/script";
import { useEffect, useRef } from "react";

type Props = {
	markdown: string;
};

type Params = {
	markdownName: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
	params,
}) => {
	if (!params) {
		throw new Error("params not found");
	}
	const markdown = await readFile(
		resolve(process.cwd(), "docs", `${params.markdownName}.md`),
		"utf-8",
	);
	return {
		props: {
			markdown,
		},
	};
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
	return {
		paths: [
			{
				params: {
					markdownName: "privacy",
				},
			},
			{
				params: {
					markdownName: "terms",
				},
			},
			{
				params: {
					markdownName: "about",
				},
			},
			{
				params: {
					markdownName: "howToWriteStory",
				},
			},
			{
				params: {
					markdownName: "situationPuzzle",
				},
			},
			{
				params: {
					markdownName: "sponsor",
				},
			},
		],
		fallback: false,
	};
};

export default function MarkdownDocumentPage({ markdown }: Props) {
	return (
		<Layout>
			<Markdown source={markdown} />
			<Ads />
		</Layout>
	);
}

const Ads = () => {
	const initialized = useRef<boolean>(false);
	useEffect(() => {
		if (initialized.current) {
			return;
		}
		try {
			//@ts-expect-error
			(adsbygoogle === (window.adsbygoogle || [])).push({});
			initialized.current = true;
		} catch (e) {
			console.error(e);
		}
	}, []);
	return (
		<>
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4007955646272580"
				crossOrigin="anonymous"
			/>
			<ins
				className="adsbygoogle"
				style={{ display: "block" }}
				data-ad-client="ca-pub-4007955646272580"
				data-ad-slot="3140493959"
				data-ad-format="auto"
				data-full-width-responsive="true"
			/>
		</>
	);
};
