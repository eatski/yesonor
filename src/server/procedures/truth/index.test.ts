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
describe("trpc/truth", () => {
	const openai = setupOpenaiForTest();
	const testee = appRouter.createCaller({
		getUserOptional: getUserOptionalMock,
		getUser: never,
		doRevalidate: never,
		verifyRecaptcha: () => Promise.resolve(),
		openai,
	});
	describe("解答した内容に対して、結果が返る", () => {
		test.concurrent.each([
			"太郎はおしゃれのために度が入っていない眼鏡をかけている。",
			"太郎さんは伊達メガネをかけている。",
		])("真相に対して正しい解答をするとCoversが返る", async (text) => {
			const result = await testee.truth({
				storyId: "test",
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.result).toEqual("Covers");
		});
        test.concurrent.each([
			"太郎はメガネをかけている。",
			"太郎さんはおしゃれをしている。",
		])("真相に対して不十分な解答をするとInsufficientが返る", async (text) => {
			const result = await testee.truth({
				storyId: "test",
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.result).toEqual("Insufficient");
		});
        test.concurrent.each([
            "太郎は友達に無理やりメガネをかけさせられた。",
        ])("真相に対して間違えた解答をするとがWrong返る", async (text) => {
			const result = await testee.truth({
				storyId: "test",
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.result).toEqual("Wrong");
		});
	})
});
