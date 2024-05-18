import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources";

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY || "dummy",
	fetch: (...args) => fetch(...args),
	timeout: 2000,
});

export const createMessage = async (
	config: MessageCreateParamsNonStreaming,
) => {
	return anthropic.messages.create(config);
};
