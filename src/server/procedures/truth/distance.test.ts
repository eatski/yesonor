import {euclideanDistance} from "./calcInputIsCloseToExamples";
import { describe, test, expect } from "vitest";
import { sample1, sample2 } from "@/sample/story";

import Cache from "file-system-cache";
import { resolve } from "path";
import { getEmbedding } from "./adapter";
import { cosineSimilarity } from "./math";

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

describe.each([{
    calcDistance: cosineSimilarity,
    name: "cosineSimilarity"
},{
    calcDistance: (arg1,arg2) => - euclideanDistance(arg1,arg2),
    name: "euclideanDistance"
}])("$name", ({calcDistance}) => {
    test.each([
        {
            normals: {
                a: sample1.truthExamples[0],
                b: sample1.truthExamples[1],
            },
            abnormal: "太郎さんは目が良いことを隠すためにメガネをかけている。", 
        },
        {
            normals: {
                a: sample1.truthExamples[0],
                b: sample1.truthExamples[1],
            },
            abnormal: "太郎さんは賢く見られるためにメガネをかけている。",
        },
        {
            normals: {
                a: sample2.truthExamples[0],
                b: sample2.truthExamples[1],
            },
            abnormal: "山田さんは人を殺し、その死体が他の男に見つからないように隠すために女性用トイレに入った。",
        },{
            normals: {
                a: sample2.truthExamples[0],
                b: sample2.truthExamples[1],
            },
            abnormal: "山田さんはまだ小さな子供であり、母親に連れられて女性トイレに入った。",
        }
    ])("正常値の類似度が異常値の類似度より高いこと", async (args) => {
        const [aEmbedding, bEmbedding,abnormalsEmbedding] = await Promise.all([
            getEmbeddingCached(args.normals.a),
            getEmbeddingCached(args.normals.b),
            getEmbeddingCached(args.abnormal)
        ])
        const normalSimilarity = calcDistance(aEmbedding, bEmbedding);
        const abnormalSimilarityA = calcDistance(aEmbedding, abnormalsEmbedding);
        const abnormalSimilarityB = calcDistance(bEmbedding, abnormalsEmbedding);
        console.log({
            args,
            normalSimilarity,
            abnormalSimilarityA,
            abnormalSimilarityB
        })
        expect(normalSimilarity).greaterThan(abnormalSimilarityA)
        expect(normalSimilarity).greaterThan(abnormalSimilarityB)
    })
})