import { QuestionExample } from "@/server/model/story";
import { OpenAIApi } from "openai";
import { calculateEuclideanDistance } from "@/libs/math";

export const pickSmallDistanceExampleQuestionInput = async <
	E extends QuestionExample,
>(
	input: string,
	questionExamples: E[],
	openai: OpenAIApi,
): Promise<E | null> => {
	const inputEmbeddingPromise = openai
		.createEmbedding({
			model: "text-embedding-ada-002",
			input: input,
		})
		.then((res) => res.data.data);
	const exampleEmbeddings = await openai
		.createEmbedding({
			model: "text-embedding-ada-002",
			input: questionExamples.map(({ question }) => question),
		})
		.then((res) => res.data.data);
	const [inputEmbedding] = await inputEmbeddingPromise;
	const calculated = exampleEmbeddings.map((exampleEmbedding) => {
		return {
			index: exampleEmbedding.index,
			distance: calculateEuclideanDistance(
				inputEmbedding.embedding,
				exampleEmbedding.embedding,
			),
		};
	});
	calculated.sort((a, b) => a.distance - b.distance);
	const nearby = calculated.at(0);
	if (nearby && nearby.distance < 0.3) {
		return questionExamples.at(nearby.index) || null;
	}
	return null;
};
