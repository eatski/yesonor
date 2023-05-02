import { sample1, sample2 } from "@/sample/story";
import { describe, test, expect } from "vitest";
import { getEmbedding } from "./adapter";
import { THRESHOLD } from "./constants";
import { cosineSimilarity } from "./math";
import Cache from "file-system-cache";
import { resolve } from "path";

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
}

describe("類似度の計算", () => {
    test.each([
        {
            a: sample1.truthExamples[0],
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
            threshold: THRESHOLD
        }, 
        {
            a: sample1.truthExamples[1],
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
            threshold: THRESHOLD
        },
        {
            a: sample2.truthExamples[0],
            b: "山田は人を殺害し、男性用トイレに隠そうとしたが用を足しに来た別の男に見つかりそうになったために慌てて女子トイレに逃げ込んだ。",
            threshold: THRESHOLD
        },
        {
            a: sample2.truthExamples[1],
            b: "山田は人を殺害し、男性用トイレに隠そうとしたが用を足しに来た別の男に見つかりそうになったために慌てて女子トイレに逃げ込んだ。",
            threshold: THRESHOLD
        }
        
    ])("類似度が計算できる: 類似度が高い", async (args) => {
        const [aEmbedding, bEmbedding] = await Promise.all([
            getEmbeddingCached(args.a),
            getEmbeddingCached(args.b),
        ])
        const similarity = cosineSimilarity(aEmbedding, bEmbedding);
        console.log(args, similarity)
        expect(similarity).toBeGreaterThan(args.threshold)
    })
    test.each([
        {
            a: "太郎さんは目が良いことを隠すためにメガネをかけている。",
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
            threshold: THRESHOLD
        }, 
        {
            a: "太郎さんは賢く見られるためにメガネをかけている。",
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
            threshold: THRESHOLD
        },
        {
            a: "山田は人を殺し、女性用トイレに隠した。",
            b: "山田は人を殺害し、男性用トイレに隠そうとしたが用を足しに来た別の男に見つかりそうになったために慌てて女子トイレに逃げ込んだ。",
            threshold: 0.97
        },
    ])("類似度が計算できる: 類似度が低い", async (args) => {
        const [aEmbedding, bEmbedding] = await Promise.all([
            getEmbeddingCached(args.a),
            getEmbeddingCached(args.b),
        ])
        const similarity = cosineSimilarity(aEmbedding, bEmbedding);
        console.log(args, similarity)
        expect(similarity).toBeLessThan(args.threshold)
    })
})