import { describe, test, expect, afterAll } from "vitest";
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
	test.concurrent("真相に対して正しい質問をするとTrueが返る", async () => {
		const result = await testee.question({
			storyId: "test",
			text: "太郎のメガネには度が入っていませんか？",
			recaptchaToken: "anytoken",
		});
		expect(result).toEqual("True");
	});
	test.concurrent("真相に対して正しくない質問をするとFalseが返る", async () => {
		const result = await testee.question({
			storyId: "test",
			text: "太郎のメガネには度が入っていますか？",
			recaptchaToken: "anytoken",
		});
		expect(result).toEqual("False");
	});
	test.concurrent(
		"真相では言及されていない質問をするとUnknownが返る",
		async () => {
			const result = await testee.question({
				storyId: "test",
				text: "太郎には恋人がいますか？",
				recaptchaToken: "anytoken",
			});
			expect(result).toEqual("Unknown");
		},
	);
});
