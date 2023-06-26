import { describe, test, expect, beforeAll } from "vitest";
import { appRouter } from "@/server";
import { setupOpenaiForTest } from "@/libs/openai/forTest";
import { resolve } from "path";
import { prepareStoryFromYaml } from "@/test/prepareStory";
import { generateId } from "@/common/util/id";
const never = () => {
	throw new Error("Never");
};

const TEST_USER1 = {
	id: generateId(),
	email: "yesonor@example.com",
};

const TEST_USER2 = {
	id: generateId(),
	email: "not-yesonor@example.com",
};

const TEST_ID = generateId();
const TEST_ID_PRIVATE = generateId();
describe("trpc/truth", () => {
	const testYamlPath = resolve(process.cwd(), "fixtures", "test.yaml");
	beforeAll(async () => {
		const cleanup1 = await prepareStoryFromYaml(testYamlPath, {
			storyId: TEST_ID,
			authorId: TEST_USER1.id,
			published: true,
		});
		const cleanup2 = await prepareStoryFromYaml(testYamlPath, {
			storyId: TEST_ID_PRIVATE,
			authorId: TEST_USER2.id,
			published: false,
		});
		return async () => {
			await cleanup1();
			await cleanup2();
		};
	});
	const openai = setupOpenaiForTest();
	const testee = appRouter.createCaller({
		getUserOptional: async () => null,
		getUser: never,
		doRevalidate: never,
		verifyRecaptcha: () => Promise.resolve(),
		openai,
	});
	describe("解答した内容に対して、結果が返る", () => {
		test.concurrent.each([
			"太郎はおしゃれのために度が入っていない眼鏡をかけている。",
			"太郎さんはオシャレで伊達メガネをかけている。",
		])("真相に対して正しい解答をするとCoversが返る", async (text) => {
			const result = await testee.truth({
				storyId: TEST_ID,
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
				storyId: TEST_ID,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.result).toEqual("Insufficient");
		});
		test.concurrent.each(["太郎は友達に無理やりメガネをかけさせられた。"])(
			"真相に対して間違えた解答をするとがWrong返る",
			async (text) => {
				const result = await testee.truth({
					storyId: TEST_ID,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.result).toEqual("Wrong");
			},
		);
	});
	describe("storyの参照権限", () => {
		test.each([TEST_USER1, TEST_USER2, null])(
			"publicなstoryに対して質問すると回答が返ってくる",
			async (user) => {
				const testee = appRouter.createCaller({
					getUserOptional: async () => user,
					getUser: never,
					doRevalidate: never,
					verifyRecaptcha: () => Promise.resolve(),
					openai,
				});
				const text = "太郎はおしゃれのために度が入っていない眼鏡をかけている。";
				const result = await testee.truth({
					storyId: TEST_ID,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.result).toEqual("Covers");
			},
		);
		test.each([TEST_USER1, null])(
			"privateなstoryに対して質問すると回答が返ってこない",
			async (user) => {
				const testee = appRouter.createCaller({
					getUserOptional: async () => user,
					getUser: never,
					doRevalidate: never,
					verifyRecaptcha: () => Promise.resolve(),
					openai,
				});
				const text = "太郎はおしゃれのために度が入っていない眼鏡をかけている。";
				expect(
					testee.truth({
						storyId: TEST_ID_PRIVATE,
						text,
						recaptchaToken: "anytoken",
					}),
				).rejects.toMatchInlineSnapshot("[TRPCError: NOT_FOUND]");
			},
		);
		test("自分の作成したstoryの場合、privateなstoryに対して質問しても回答が返ってくる", async () => {
			const testee = appRouter.createCaller({
				getUserOptional: async () => TEST_USER2,
				getUser: never,
				doRevalidate: never,
				verifyRecaptcha: () => Promise.resolve(),
				openai,
			});
			const text = "太郎はおしゃれのために度が入っていない眼鏡をかけている。";
			const result = await testee.truth({
				storyId: TEST_ID_PRIVATE,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.result).toEqual("Covers");
		});
	});
});
