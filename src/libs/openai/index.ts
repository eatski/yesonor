import { OpenAI } from "openai";
import {
	ChatCompletionCreateParamsNonStreaming,
	EmbeddingCreateParams,
} from "openai/resources";
const openai = new OpenAI({
	// fetchを直接使うとmswの上書きが間に合わないので、fetchのwrapperにする。
	fetch: (...args) => fetch(...args),
	timeout: 20000,
	apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export const createOpenAICompletion = async (
	config: ChatCompletionCreateParamsNonStreaming,
) => {
	return openai.chat.completions.create(config);
};

export const createOpenAIEmbedding = async (input: EmbeddingCreateParams) => {
	return openai.embeddings.create(input);
};
