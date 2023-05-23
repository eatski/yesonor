import { openai } from "@/libs/openapi";

export const getEmbedding = async (text: string): Promise<number[]> => {
	const embedding = await openai.createEmbedding({
		input: text,
		model: "text-embedding-ada-002",
	});
	return embedding.data.data[0].embedding;
};
