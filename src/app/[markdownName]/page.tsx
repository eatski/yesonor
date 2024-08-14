import { brand } from "@/common/texts";
import { Markdown } from "@/components/markdown";
import { markdownNames, readMarkdownDoc } from "@/docs";
import { micromark } from "micromark";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { parse } from "node-html-parser";
import { z } from "zod";

export const dynamicParams = false;

const paramsSchema = z.object({
	markdownName: z.enum(markdownNames),
});

type Params = z.infer<typeof paramsSchema>;

export const generateStaticParams = (): Params[] => {
	return markdownNames.map((markdownName) => ({ markdownName }));
};

export const generateMetadata = async ({
	params,
}: { params: unknown }): Promise<Metadata> => {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		notFound();
	}
	const { markdownName } = parsed.data;
	const markdown = await readMarkdownDoc(markdownName);
	const htmlStr = micromark(markdown);
	const html = parse(htmlStr);
	const h1 = html.querySelector("h1");
	const title = h1?.text;
	const description = h1?.nextElementSibling?.text;
	if (!title) {
		throw new Error("Title not found");
	}
	return {
		title: `${title} - ${brand.serviceNickname}`,
		description: description || undefined,
	};
};

export default async function MarkdownDocumentPage({
	params,
}: { params: unknown }) {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		notFound();
	}
	const { markdownName } = parsed.data;
	const markdown = await readMarkdownDoc(markdownName);
	return <Markdown source={markdown} />;
}
