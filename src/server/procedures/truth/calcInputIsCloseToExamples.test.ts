import { initTioc } from "@/libs/tioc";
import { getEmbedding } from "./adapter";
import { describe, test, expect } from "vitest";
import { sample1, sample2 } from "@/sample/story";
import { calcInputIsCloseToExamples, calculateDistanceThreshold } from "./calcInputIsCloseToExamples";

const tioc = initTioc(getEmbedding);

describe("calculateDistanceThreshold",() => {
    test.each([
        {
            examples: sample1.truthExamples,
        },
        {
            examples: sample2.truthExamples,
        }
    ])("閾値の計算",async ({examples}) => {
        const embeddings = await Promise.all(examples.map(tioc.getCached));
        const threshold = calculateDistanceThreshold(embeddings);
        expect({
            threshold,
            examples
        }).toMatchSnapshot();
    });
})

describe("calcInputIsCloseToExamples",() => {
    test.each([
        {
            examples: sample1.truthExamples,
            input: "太郎さんはオシャレとして伊達メガネをかけている。"
        },
        {
            examples: sample2.truthExamples,
            input: "山田さんは人を殺し、男用のトイレにそれを隠そうとしたが、用を足しにきた男たちに見つかりそうになり女用のトイレに入った。"
        }
    ])("近い文章が入力された場合trueを返す",async ({examples,input}) => {
        const [inputEmbedding,...embeddings] = await Promise.all([tioc.getCached(input),...examples.map(tioc.getCached)]);
        expect(calcInputIsCloseToExamples(inputEmbedding,embeddings)).toBe(true);
    });
    test.each([
        {
            examples: sample1.truthExamples,
            input: "太郎さんは賢そうに見せるために伊達メガネをかけている。"
        },
        {
            examples: sample2.truthExamples,
            input: "山田さんは心は女性であり、周りに人がいないような場合は女性用のトイレを使う。"
        }
    ])("意味の違う文章が入力された場合falseを返す",async ({examples,input}) => {
        const [inputEmbedding,...embeddings] = await Promise.all([tioc.getCached(input),...examples.map(tioc.getCached)]);
        expect(calcInputIsCloseToExamples(inputEmbedding,embeddings)).toBe(false);
    });
})