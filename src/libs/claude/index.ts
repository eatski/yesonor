import {
	Message,
	type MessageCreateParamsNonStreaming,
} from "@anthropic-ai/sdk/resources";

const apiKey = process.env["ANTHROPIC_API_KEY"];

export const createMessage = async (
	config: MessageCreateParamsNonStreaming,
) => {
	const result = await fetch("https://api.anthropic.com/v1/messages", {
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey || "",
			"anthropic-version": "2023-06-01",
		},
		method: "POST",
		body: JSON.stringify(config),
	});
	if (!result.ok) {
		const text = await result.text();
		throw new Error(`Failed ${result.status}: ${text}`);
	}
	const json = await result.json();
	return json as Message;
};
