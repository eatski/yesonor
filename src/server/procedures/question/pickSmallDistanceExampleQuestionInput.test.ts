import { describe,expect,test } from "vitest";
import {pickSmallDistanceExampleQuestionInput} from "./pickSmallDistanceExampleQuestionInput";
import { setupOpenaiForTest } from "@/libs/openai/forTest";
import { QuestionExample } from "@/server/services/story/schema";

describe("question/pickSmallDistanceExampleQuestionInput",() => {
    const openai = setupOpenaiForTest();
    const examples: QuestionExample[] = [
        {
            question: "太郎はメガネをかけていますか？",
            answer: "True",
            supplement: "太郎はメガネをかけています。"
        },
        {
            question: "太郎はメガネを壊しましたか？",
            answer: "Unknown",
            supplement: "太郎はメガネを壊したかどうかには言及されていません。"
        },
        {
            question: "太郎は怒っていますか？",
            answer: "False",
            supplement: "太郎は怒っていません。"
        }
    ];
    test.each([
        {
            input: "太郎はメガネをかけている？",
            nearest: "太郎はメガネをかけていますか？"
        },{
            input: "太郎はメガネを破壊した？",
            nearest: "太郎はメガネを壊しましたか？"
        },{
            input: "太郎さんは怒っていますか？",
            nearest: "太郎は怒っていますか？"
        },
        {
            input: "太郎はメガネをかけていませんか？",
            nearest: "太郎はメガネをかけていますか？"
        }
    ])("should return the question example with the smallest distance",async ({input,nearest}) => {
        const result = await pickSmallDistanceExampleQuestionInput(
            input,
            examples,
            openai
        )
        expect(result?.question).toEqual(nearest);
    });
    test.each([
        "花子はメガネをかけている？",
        "太郎はカツラをかぶっている？",
        "太郎は日本語を話せる？",
    ])("should return undefined if the distance is too large",async (input) => {
        const result = await pickSmallDistanceExampleQuestionInput(
            input,
            examples,
            openai
        )
        expect(result?.question).toEqual(undefined);
    })
})