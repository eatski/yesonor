import { sampleStory } from "@/sample/story";
import { describe, test, expect } from "vitest";
import { getEmbedding } from "./adapter";
import { THRESHOLD } from "./constants";
import { cosineSimilarity } from "./math";

describe("類似度の計算", () => {
    test.each(sampleStory.truthExamples)("類似度が計算できる: 類似度が高い", async (another) => {
        const [inputEmbedding, truthEmbedding] = await Promise.all([
            getEmbedding("太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"),
            getEmbedding(another)
        ])
        const similarity = cosineSimilarity(inputEmbedding, truthEmbedding);
        console.log(similarity)
        expect(similarity).toBeGreaterThan(THRESHOLD)
    })
    test.each(["太郎さんは目が良いことを隠すためにメガネをかけている。","太郎さんは賢く見られるためにメガネをかけている。"])("類似度が計算できる: 類似度が低い", async (another) => {
        const [inputEmbedding, truthEmbedding] = await Promise.all([
            getEmbedding("太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"),
            getEmbedding(another)
        ])
        const similarity = cosineSimilarity(inputEmbedding, truthEmbedding);
        console.log(similarity)
        expect(similarity).toBeLessThan(THRESHOLD)
    })
})