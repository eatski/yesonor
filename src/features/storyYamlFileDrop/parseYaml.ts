import { parse } from "yaml";
import { storyInitYaml } from "./type";
import { z } from "zod";

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
