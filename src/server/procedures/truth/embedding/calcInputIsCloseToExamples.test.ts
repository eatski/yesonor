import { initTioc } from "@/libs/tioc";
import { getEmbedding } from "./adapter";
import { describe, test, expect } from "vitest";
import { calcInputIsCloseToExamples, calculateDistanceThreshold } from "./calcInputIsCloseToExamples";

const tioc = initTioc(getEmbedding);

const examples1 = [
    "太郎さんはファッションとして伊達メガネをかけている。",
    "太郎さんは伊達メガネをオシャレのためにかけている。",
    "太郎さんはオシャレのために伊達メガネをつけている。",
    "太郎さんはオシャレになるために度の入っていないメガネをかけている。",
    "太郎さんがかけているのは度の入っていない伊達メガネである。",
    "太郎さんはオシャレ好きで、オシャレのために伊達メガネをかけている。",
]

const example2 = [
    "山田さんは人を殺害し男性用トイレに死体を隠そうとしたが、用を足しに来た男性に見つかりそうになり女性用トイレに逃げ込んだ。",
    "山田さんは人を殺し、男用のトイレにそれを隠していたが、他の男たちに見つかりそうになり女用のトイレに入った。",
    "山田さんは人を殺害し、男性用トイレに死体を隠そうとした。しかし、小便をしに来た男性に見つかりそうになり女性用トイレへ逃げ込んだ。",
    "山田さんは人を殺害した後男性用トイレに死体を隠そうとした。しかし、用を足しに来た男性に見つかりそうになり女性用トイレに逃げ込んだ。",
    "山田さんは人を殺害し、男子トイレに死体を隠そうとした。が、用を足しに来た男に見つかりそうになり女子トイレに逃げ込んだ。",
]

describe("calculateDistanceThreshold",() => {
    test.each([
        {
            examples: examples1,
        },
        {
            examples: example2,
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
            examples: examples1,
            input: "太郎さんはオシャレとして伊達メガネをかけている。"
        },
        {
            examples: example2,
            input: "山田さんは人を殺し、男用のトイレにそれを隠そうとしたが、用を足しにきた男たちに見つかりそうになり女用のトイレに入った。"
        }
    ])("近い文章が入力された場合trueを返す",async ({examples,input}) => {
        const [inputEmbedding,...embeddings] = await Promise.all([tioc.getCached(input),...examples.map(tioc.getCached)]);
        expect(calcInputIsCloseToExamples(inputEmbedding,embeddings)).toBe(true);
    });
    test.each([
        {
            examples: examples1,
            input: "太郎さんは賢そうに見せるために伊達メガネをかけている。"
        },
        {
            examples: example2,
            input: "山田さんは心は女性であり、周りに人がいないような場合は女性用のトイレを使う。"
        }
    ])("意味の違う文章が入力された場合falseを返す",async ({examples,input}) => {
        const [inputEmbedding,...embeddings] = await Promise.all([tioc.getCached(input),...examples.map(tioc.getCached)]);
        expect(calcInputIsCloseToExamples(inputEmbedding,embeddings)).toBe(false);
    });
})