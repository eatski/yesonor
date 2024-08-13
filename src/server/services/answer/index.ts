import { createMessage } from "../../../libs/claude";
import {
	FALLBACK_DISTANCE,
	calculateEuclideanDistance,
} from "../../../libs/math";
import { createOpenAIEmbedding } from "../../../libs/openai";
import { Story } from "../../../server/model/story";
import { createPrompt } from "./createPrompt";

export const checkAnswer = async (answer: string, story: Story) => {
	const distance = createOpenAIEmbedding({
		model: "text-embedding-ada-002",
		input: [story.simpleTruth, answer],
	}).then(({ data: [textA, textB] }) => {
		if (!textA || !textB) {
			return FALLBACK_DISTANCE;
		}
		const distanceVal = calculateEuclideanDistance(
			textA.embedding,
			textB.embedding,
		);
		return Math.round(distanceVal * 100) / 100;
	});
	const isCorrect = createPrompt(story.simpleTruth).then((systemPrompt) =>
		createMessage({
			model: "claude-3-opus-20240229",
			system: systemPrompt,
			messages: [
				{
					role: "user",
					content: answer,
				},
			],
			temperature: 0.0,
			max_tokens: 8,
		}).then(({ content }) => {
			const text = content[0]?.type === "text" ? content[0].text : null;
			const result = (["Correct", "Incorrect"] as const).find((word) =>
				text?.includes(word),
			);
			if (!result) {
				throw new Error(`Unexpected response from Claude: ${content}`);
			}
			return result === "Correct";
		}),
	);
	return {
		isCorrect: await isCorrect,
		distance: await distance,
	};
};
