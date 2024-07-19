import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import Mus from "mustache";

const systemPromptPromise = readFile(
	resolve(process.cwd(), "prompts", "truth.md"),
);

export const createPrompt = async (simpleTruth: string): Promise<string> => {
	const markdown = (await systemPromptPromise).toString();
	return Mus.render(markdown, { answer: simpleTruth });
};
