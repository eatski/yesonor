import { Markdown } from "@/components/markdown";
import { Layout } from "@/components/layout";
import { readFile } from "fs/promises";
import { GetStaticPaths, GetStaticProps } from "next";
import { resolve } from "path";

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
		</Layout>
	);
}
