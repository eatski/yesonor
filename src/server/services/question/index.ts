import { ToUnionWithField } from "@/common/util/type";
import DataLoader from "dataloader";
import {
	type ABTestingVariant,
	AB_TESTING_VARIANTS,
} from "../../../common/abtesting";
import { calculateEuclideanDistance } from "../../../libs/math";
import { createOpenAIEmbedding } from "../../../libs/openai";
import type {
	QuestionExample,
	QuestionExampleWithCustomMessage,
	Story,
} from "../../../server/model/story";
import { questionToAI } from "./ai/questionToAI";
import { questionToAI as questionToAISonnet } from "./ai/questionToAIClaude";

const abTestVarToQuestionToAI = {
	[AB_TESTING_VARIANTS.ONLY_SONNET]: questionToAISonnet,
	[AB_TESTING_VARIANTS.GPT4O]: questionToAI,
} as const;

export const askQuestion = async (
	question: string,
	story: Story,
	abPromise: Promise<ABTestingVariant>,
) => {
	const embeddingsDataLoader = new DataLoader((texts: readonly string[]) => {
		return createOpenAIEmbedding({
			model: "text-embedding-ada-002",
			input: [...texts],
		}).then((res) =>
			res.data.map(({ index, embedding }) => {
				const text = texts[index];
				if (text === undefined) {
					throw new Error("index out of range");
				}
				return {
					input: text,
					embedding: embedding,
				};
			}),
		);
	});
	const questonEmbedding = embeddingsDataLoader.load(question);
	const examplesEmbeddings = embeddingsDataLoader.loadMany(
		story.questionExamples.map(({ question }) => question),
	);

	const sortedExamplesWithDistance = examplesEmbeddings.then(
		async (embeddings) => {
			return questonEmbedding.then((questonEmbedding) => {
				return embeddings
					.map((item) => {
						if (item instanceof Error) {
							console.error(item);
							return null;
						}
						const distance = calculateEuclideanDistance(
							questonEmbedding.embedding,
							item.embedding,
						);
						const example = story.questionExamples.find(
							({ question }) => question === item.input,
						);
						if (!example) {
							throw new Error("example not found");
						}
						return {
							example,
							distance,
						};
					})
					.filter((e) => e !== null)
					.toSorted((a, b) => a.distance - b.distance);
			});
		},
	);

	const answer = sortedExamplesWithDistance
		.then((examples) => {
			return ["True", "False", "Unknown"]
				.map((answer) => {
					return examples.find(({ example }) => example.answer === answer);
				})
				.filter((e) => e !== undefined);
		})
		.then((pickedFewExamples) => {
			const inputStory = {
				quiz: story.quiz,
				truth: story.truth,
				questionExamples: pickedFewExamples.map(({ example }) => example),
			};
			return abPromise.then((ab) => {
				const selected = abTestVarToQuestionToAI[ab];
				return selected(inputStory, question);
			});
		});

	const hitQuestionExample = sortedExamplesWithDistance.then((examples) => {
		return answer.then((answer) => {
			return examples
				.filter(({ example }) => example.answer === answer)
				.filter(({ distance }) => distance < 0.3)
				.map(({ example }) => example)
				.find<QuestionExampleWithCustomMessage>(
					(example: ToUnionWithField<QuestionExample, "customMessage">) =>
						typeof example.customMessage === "string",
				);
		});
	});

	return {
		answer: await answer,
		hitQuestionExample: (await hitQuestionExample) || null,
	};
};
