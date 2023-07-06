import { parse } from "yaml";
import { z } from "zod";

const answer = z.enum(["はい", "いいえ", "わからない"]).transform((text) => {
	switch (text) {
		case "はい":
			return "True";
		case "いいえ":
			return "False";
		case "わからない":
			return "Unknown";
	}
});

const questionExample = z.object({
	question: z.string(),
	answer,
	supplement: z.string().optional(),
	customMessage: z.string().optional(),
});

export const storyInitYaml = z.object({
	title: z.string(),
	quiz: z.string(),
	truth: z.string(),
	simpleTruth: z.string(),
	questionExamples: z.array(questionExample),
});

type ParseResult =
	| {
			error: null;
			data: z.infer<typeof storyInitYaml>;
	  }
	| {
			error: string;
	  };

export const parseYaml = (yaml: string): ParseResult => {
	try {
		parse(yaml);
		const parsed = parse(yaml);
		const typed = storyInitYaml.safeParse(parsed);
		if (!typed.success)
			return {
				error: `値に不備もしくは不足があります: ${typed.error.errors
					.flatMap((e) => e.path)
					.join(",")}`,
			};
		return {
			error: null,
			data: typed.data,
		};
	} catch (e) {
		return {
			error: "YAMLの形式が不正です。",
		};
	}
};
