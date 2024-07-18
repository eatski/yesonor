import { createMessage } from "@/libs/claude";
import { FALLBACK_DISTANCE, calculateEuclideanDistance } from "@/libs/math";
import { openai } from "@/libs/openai";
import { prepareProura } from "@/libs/proura";
import { Story } from "@/server/model/story";
import { createPrompt } from "./createPrompt";

export const checkAnswer = async (answer: string, story: Story) => {
	const proura = prepareProura();
	return proura
		.add("distance", async () => {
			const {
				data: [textA, textB],
			} = await openai.embeddings.create({
				model: "text-embedding-ada-002",
				input: [story.simpleTruth, answer],
			});
			if (!textA || !textB) {
				return FALLBACK_DISTANCE;
			}
			const distanceVal = calculateEuclideanDistance(
				textA.embedding,
				textB.embedding,
			);
			return Math.round(distanceVal * 100) / 100;
		})
		.add("isCorrect", async () => {
			const systemPrompt = await createPrompt(story.simpleTruth);
			const { content } = await createMessage({
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
			});
			const text = content[0]?.type === "text" ? content[0].text : null;
			const result = (["Correct", "Incorrect"] as const).find((word) =>
				text?.includes(word),
			);
			if (!result) {
				throw new Error(`Unexpected response from Claude: ${content}`);
			}
			return result === "Correct";
		})
		.exec();
};
