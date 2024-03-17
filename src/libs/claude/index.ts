import {
	Message,
	type MessageCreateParamsNonStreaming,
} from "@anthropic-ai/sdk/resources";

if (!process.env["ANTHROPIC_API_KEY"]) {
	throw new Error("ANTHROPIC_API_KEY is not defined");
}

const apiKey = process.env["ANTHROPIC_API_KEY"];

export const createMessage = (config: MessageCreateParamsNonStreaming) => {
	return fetch("https://api.anthropic.com/v1/messages", {
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
		},
		method: "POST",
		body: JSON.stringify(config),
	}).then((res) => res.json() as Promise<Message>);
};
