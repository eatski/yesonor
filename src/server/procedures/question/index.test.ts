import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { appRouter } from "@/server";
import { openaiForTest } from "@/libs/openai/forTest";
const never = () => {
    throw new Error("Never");
}
const getUserOptionalMock = async () => ({
    id: "aaa",
    email: "aaa",
} as const) 
describe("trpc/question", () => {
    test("test1",async  () => {
        const result = await appRouter.createCaller({
            getUserOptional: getUserOptionalMock,
            getUser: never,
            doRevalidate: never,
            verifyRecaptcha: () => Promise.resolve(),
            openai: openaiForTest
        }).question({
            storyId: "test",
            text: "太郎のメガネには度が入っていませんか？",
            recaptchaToken: "anytoken"
        })
        expect(result).toEqual("True");
    })
})