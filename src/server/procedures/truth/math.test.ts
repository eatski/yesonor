import { sample1, sample2 } from "@/sample/story";
import { describe, test, expect } from "vitest";
import { getEmbedding } from "./adapter";
import { THRESHOLD } from "./constants";
import { cosineSimilarity } from "./math";

describe("類似度の計算", () => {
    test.each([
        {
            a: sample1.truthExamples[0],
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"
        }, 
        {
            a: sample1.truthExamples[1],
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"
        },
        {
            a: sample2.truthExamples[0],
            b: "山田は人を殺害し、男性用トイレに隠そうとしたが用を足しに来た別の男に見つかりそうになったために慌てて女子トイレに逃げ込んだ。"
        }
    ])("類似度が計算できる: 類似度が高い", async (texts) => {
        const [aEmbedding, bEmbedding] = await Promise.all([
            getEmbedding(texts.a),
            getEmbedding(texts.b),
        ])
        const similarity = cosineSimilarity(aEmbedding, bEmbedding);
        console.log(texts, similarity)
        expect(similarity).toBeGreaterThan(THRESHOLD)
    })
    test.skip.each([
        {
            a: "太郎さんは目が良いことを隠すためにメガネをかけている。",
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"
        }, 
        {
            a: "太郎さんは賢く見られるためにメガネをかけている。",
            b: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"
        },
        {
            a: "山田は人を殺し、女性用トイレに隠した。",
            b: "山田は人を殺害し、男性用トイレに隠そうとしたが用を足しに来た別の男に見つかりそうになったために慌てて女子トイレに逃げ込んだ。"
        }
    ])("類似度が計算できる: 類似度が低い", async (texts) => {
        const [aEmbedding, bEmbedding] = await Promise.all([
            getEmbedding(texts.a),
            getEmbedding(texts.b),
        ])
        const similarity = cosineSimilarity(aEmbedding, bEmbedding);
        console.log(texts, similarity)
        expect(similarity).toBeLessThan(THRESHOLD)
    })
})