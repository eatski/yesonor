import { ToUnionWithField } from "@/common/util/type";
import { OpenAI } from "openai";
import {
	ChatCompletionCreateParamsNonStreaming,
	ChatCompletionMessageParam,
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
	// いずれかのmessageの中身が1000文字を超えた場合、エラーを返す。
	const tooLong = config.messages
		.filter(
			(m: ToUnionWithField<ChatCompletionMessageParam, "content">) =>
				m.content !== null && m.content !== undefined,
		)
		.find((m) => m.content.length > 500);
	if (tooLong) {
		throw new Error(`message content is too long(${tooLong.content.length})`);
	}
	return openai.chat.completions.create(config);
};

export const createOpenAIEmbedding = async (input: EmbeddingCreateParams) => {
	return openai.embeddings.create(input);
};
