import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Markdown } from "@/components/markdown";
import { z } from "zod";

const paramsSchema = z.object({
	markdownName: z.string(),
});

type Params = z.infer<typeof paramsSchema>;

export const generateStaticParams = (): Params[] => {
	return [
		{
			markdownName: "privacy",
		},
		{
			markdownName: "terms",
		},
		{
			markdownName: "about",
		},
		{
			markdownName: "howToWriteStory",
		},
		{
			markdownName: "situationPuzzle",
		},
		{
			markdownName: "sponsor",
		},
	];
};

export default async function MarkdownDocumentPage({
	params,
}: { params: unknown }) {
	const { markdownName } = paramsSchema.parse(params);
	const markdown = await readFile(
		resolve(process.cwd(), "docs", `${markdownName}.md`),
		"utf-8",
	);
	return <Markdown source={markdown} />;
}
