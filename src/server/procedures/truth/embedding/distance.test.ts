import { euclideanDistance } from "./euclideanDistance";
import { describe, test, expect } from "vitest";

import Cache from "file-system-cache";
import { resolve } from "path";
import { getEmbedding } from "./adapter";
import { cosineSimilarity } from "./cosineSimilarity";

const cache = Cache({
	basePath: resolve(process.cwd(), ".cache"),
});

const getEmbeddingCached = async (text: string): Promise<number[]> => {
	const cached = await cache.get(text);
	if (cached) {
		return cached;
	}
	const embedding = await getEmbedding(text);
	await cache.set(text, embedding);
	return embedding;
};

describe.each([
	{
		calcDistance: cosineSimilarity,
		name: "cosineSimilarity",
	},
	{
		calcDistance: (arg1, arg2) => -euclideanDistance(arg1, arg2),
		name: "euclideanDistance",
	},
])("$name", ({ calcDistance }) => {
	test.each([
		{
			normals: {
				a: "太郎さんはファッションとして伊達メガネをかけている。",
				b: "太郎さんは伊達メガネをオシャレのためにかけている。",
			},
			abnormal: "太郎さんは目が良いことを隠すためにメガネをかけている。",
		},
		{
			normals: {
				a: "太郎さんはファッションとして伊達メガネをかけている。",
				b: "太郎さんは伊達メガネをオシャレのためにかけている。",
			},
			abnormal: "太郎さんは賢く見られるためにメガネをかけている。",
		},
		{
			normals: {
				a: "山田さんは人を殺害し男性用トイレに死体を隠そうとしたが、用を足しに来た男性に見つかりそうになり女性用トイレに逃げ込んだ。",
				b: "山田さんは人を殺し、男用のトイレにそれを隠していたが、他の男たちに見つかりそうになり女用のトイレに入った。",
			},
			abnormal:
				"山田さんは人を殺し、その死体が他の男に見つからないように隠すために女性用トイレに入った。",
		},
		{
			normals: {
				a: "山田さんは人を殺害し男性用トイレに死体を隠そうとしたが、用を足しに来た男性に見つかりそうになり女性用トイレに逃げ込んだ。",
				b: "山田さんは人を殺し、男用のトイレにそれを隠していたが、他の男たちに見つかりそうになり女用のトイレに入った。",
			},
			abnormal:
				"山田さんはまだ小さな子供であり、母親に連れられて女性トイレに入った。",
		},
	])(
		"意味的に同じ文章同士の類似度が異なる文章との類似度より高いこと",
		async (args) => {
			const [aEmbedding, bEmbedding, abnormalsEmbedding] = await Promise.all([
				getEmbeddingCached(args.normals.a),
				getEmbeddingCached(args.normals.b),
				getEmbeddingCached(args.abnormal),
			]);
			const normalSimilarity = calcDistance(aEmbedding, bEmbedding);
			const abnormalSimilarityA = calcDistance(aEmbedding, abnormalsEmbedding);
			const abnormalSimilarityB = calcDistance(bEmbedding, abnormalsEmbedding);
			console.log({
				args,
				normalSimilarity,
				abnormalSimilarityA,
				abnormalSimilarityB,
			});
			expect(normalSimilarity).greaterThan(abnormalSimilarityA);
			expect(normalSimilarity).greaterThan(abnormalSimilarityB);
		},
	);
});
