import { resolve } from "path";
import { readFile } from "fs/promises";

export const markdownNames = [
	"privacy",
	"terms",
	"about",
	"howToWriteStory",
	"situationPuzzle",
	"sponsor",
] as const;

export const readMarkdownDoc = (
	markdownName: (typeof markdownNames)[number],
) => {
	return readFile(
		resolve(process.cwd(), "src", "docs", `${markdownName}.md`),
		"utf-8",
	);
};
