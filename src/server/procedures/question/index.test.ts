import { describe, test, expect } from "vitest";
import { appRouter } from "@/server";
import { setupOpenaiForTest } from "@/libs/openai/forTest";
const never = () => {
	throw new Error("Never");
};
const getUserOptionalMock = async () =>
	({
		id: "aaa",
		email: "aaa",
	}) as const;
describe("trpc/question", () => {
    const openai = setupOpenaiForTest();
    const testee = appRouter.createCaller({
        getUserOptional: getUserOptionalMock,
        getUser: never,
        doRevalidate: never,
        verifyRecaptcha: () => Promise.resolve(),
        openai,
    });
    describe("質問した内容に対して、結果が返る",() => {
        
        test.concurrent.each([
            "太郎のメガネには度が入っていませんか？",
            "太郎は自分のためにメガネをかけていますか？",
        ])("真相に対して正しい質問をするとTrueが返る", async (text) => {
            const result = await testee.question({
                storyId: "test",
                text,
                recaptchaToken: "anytoken",
            });
            expect(result.answer).toEqual("True");
        });
        test.concurrent.each([
            "太郎のメガネには度が入っていますか？",
            "太郎は命令されてメガネをかけていますか？",
        ])("真相に対して正しくない質問をするとFalseが返る", async (text) => {
            const result = await testee.question({
                storyId: "test",
                text,
                recaptchaToken: "anytoken",
            });
            expect(result.answer).toEqual("False");
        });
        test.concurrent.each([
            "太郎には恋人がいますか？",
            "太郎はパンよりライス派？",
        ])("真相では言及されていない質問をするとUnknownが返る", async (text) => {
            const result = await testee.question({
                storyId: "test",
                text,
                recaptchaToken: "anytoken",
            });
            expect(result.answer).toEqual("Unknown");
        });
    }),
    describe("customMessage",() => {
        test("customMessageを持つquestionExamlpeに近しい質問をすると、customMessageが返る",async () => {
            const result = await testee.question({
                storyId: "test",
                text: "太郎さんのメガネは度が入ってますか？",
                recaptchaToken: "anytoken",
            });
            expect(result.customMessage).toEqual("いい質問ですね！太郎さんのメガネは伊達メガネであり、度は入っていません。");
        })
        test("customMessageを持つquestionExamlpeに近しくない質問をすると、customMessageが返らない",async () => {
            const result = await testee.question({
                storyId: "test",
                text: "太郎さんのメガネはブルーライトカットですか？",
                recaptchaToken: "anytoken",
            });
            expect(result.answer).toEqual("Unknown"); //FIXME: Falseのはず
            expect(result.customMessage).not.toBeDefined();
        })
    })
	
});
