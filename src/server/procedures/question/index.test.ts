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
	test.concurrent.each([
		"太郎のメガネには度が入っていませんか？",
		"太郎は自分のためにメガネをかけていますか？",
	])("真相に対して正しい質問をするとTrueが返る", async (text) => {
		const result = await testee.question({
			storyId: "test",
			text,
			recaptchaToken: "anytoken",
		});
		expect(result).toEqual("True");
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
		expect(result).toEqual("False");
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
		expect(result).toEqual("Unknown");
	});
});
