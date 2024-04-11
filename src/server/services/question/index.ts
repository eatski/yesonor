import { ABTestingVariant, AB_TESTING_VARIANTS } from "@/common/abtesting";
import { calculateEuclideanDistance } from "@/libs/math";
import { openai } from "@/libs/openai";
import { prepareProura } from "@/libs/proura";
import {
	QuestionExample,
	QuestionExampleWithCustomMessage,
	Story,
} from "@/server/model/story";
import { questionToAI, questionToAIWithHaiku } from "./ai/questionToAIClaude";
import DataLoader from "dataloader";

export const getAnswer = async (
	question: string,
	storyPromise: Promise<Story>,
	verifyRequestPromise: Promise<void>,
	abPromise: Promise<ABTestingVariant>,
) => {
	const proura = prepareProura();
	const embeddingsDataLoader = new DataLoader((texts: readonly string[]) => {
		return openai.embeddings
			.create({
				model: "text-embedding-ada-002",
				input: [...texts],
			})
			.then((res) => res.data);
	});
	const { answer, hitQuestionExample } = await proura
		.add("questionEmbedding", async () => {
			await verifyRequestPromise;
			return embeddingsDataLoader.load(question);
		})
		.add("sortedExamplesWithDistance", async (dependsOn) => {
			const story = await storyPromise;
			const embeddings = await embeddingsDataLoader.loadMany(
				story.questionExamples.map(({ question }) => question),
			);
			const questionEmbedding = await dependsOn("questionEmbedding");
			const result: {
				example: QuestionExample;
				distance: number;
			}[] = [];
			embeddings.forEach((embedding, index) => {
				const example = story.questionExamples[index];
				if (!example) {
					throw new Error("index out of range");
				}
				if (embedding instanceof Error) {
					console.error(embedding);
					return;
				}
				const distance = calculateEuclideanDistance(
					questionEmbedding.embedding,
					embedding.embedding,
				);
				result.push({
					example,
					distance,
				});
			});
			result.sort((a, b) => a.distance - b.distance);
			return result;
		})
		.add("answer", async (dependsOn) => {
			await verifyRequestPromise;
			const story = await storyPromise;
			const examples = await dependsOn("sortedExamplesWithDistance");
			const pickedFewExamples: typeof examples = [];
			["True", "False", "Unknown"].forEach((answer) => {
				const example = examples.find(
					({ example }) => example.answer === answer,
				);
				example && pickedFewExamples.push(example);
			});
			const inputStory = {
				quiz: story.quiz,
				truth: story.truth,
				questionExamples: pickedFewExamples.map(({ example }) => example),
			};
			const ab = await abPromise;
			return ab === AB_TESTING_VARIANTS.ONLY_SONNET
				? await questionToAI(inputStory, question)
				: await questionToAIWithHaiku(inputStory, question);
		})
		.add("hitQuestionExample", async (dependsOn) => {
			const answer = await dependsOn("answer");
			const examples = await dependsOn("sortedExamplesWithDistance");
			const recur = ([
				head,
				...tail
			]: typeof examples): QuestionExampleWithCustomMessage | null => {
				if (!head) {
					return null;
				}
				const { example, distance } = head;
				if (example.customMessage && distance < 0.3) {
					return {
						...example,
						customMessage: example.customMessage,
					};
				}
				return recur(tail);
			};
			const hit = recur(examples);
			return hit?.answer === answer ? hit : null;
		})
		.exec();
	return {
		answer,
		hitQuestionExample,
	};
};
