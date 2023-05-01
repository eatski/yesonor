import { describe, test, expect } from "vitest";
import { getEmbedding } from "./adapter";
import { cosineSimilarity } from "./math";

describe("類似度の計算", () => {
    test("類似度が計算できる: 類似度が高い", async () => {
        const [inputEmbedding, truthEmbedding] = await Promise.all([
            getEmbedding("太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"),
            getEmbedding("太郎さんはファッションとして伊達メガネをかけている。")
        ])
        const similarity = cosineSimilarity(inputEmbedding, truthEmbedding);
        console.log(similarity)
        expect(similarity).toBeGreaterThan(0.95)
    })
    test("類似度が計算できる: 類似度が低い", async () => {
        const [inputEmbedding, truthEmbedding] = await Promise.all([
            getEmbedding("太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"),
            getEmbedding("太郎さんは目が良いことを隠すためにメガネをかけている。")
        ])
        const similarity = cosineSimilarity(inputEmbedding, truthEmbedding);
        console.log(similarity)
        expect(similarity).toBeLessThan(0.95)
    })
})