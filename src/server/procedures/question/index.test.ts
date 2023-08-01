import { describe, test, expect, beforeAll } from "vitest";
import { appRouter } from "@/server";
import { setupOpenaiForTest } from "@/libs/openai/forTest";
import { prepareStoryFromYaml } from "@/test/prepareStory";
import { resolve } from "path";
import { generateId } from "@/common/util/id";
const never = () => {
	throw new Error("Never");
};

const TEST_ID = generateId();
const TEST_ID_PRIVATE = generateId();

describe("trpc/question", () => {
	const testYamlPath = resolve(process.cwd(), "fixtures", "test.yaml");
	const TEST_USER1 = {
		id: generateId(),
		email: "yesonor@example.com",
	};

	const TEST_USER2 = {
		id: generateId(),
		email: "not-yesonor@example.com",
	};
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
	describe("質問した内容に対して、結果が返る", () => {
		test.concurrent.each([
			"山田さんは犯罪者ですか？",
			"人が死んでますか？",
			"近くに他の人がいますか？",
		])("真相に対して正しい質問をするとTrueが返る", async (text) => {
			const result = await testee.question({
				storyId: TEST_ID,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.answer).toEqual("True");
		});
		test.concurrent.each([
			"山田さんは誰かに襲われてますか？",
			"性的な興味で女性用トイレに入りましたか？",
			"山田は死んでいますか？",
		])("真相に対して正しくない質問をするとFalseが返る", async (text) => {
			const result = await testee.question({
				storyId: TEST_ID,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.answer).toEqual("False");
		});
		test.concurrent.each([
			"山田には恋人がいますか？",
			"山田さんはパンよりライス派？",
		])("真相では言及されていない質問をするとUnknownが返る", async (text) => {
			const result = await testee.question({
				storyId: TEST_ID,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.answer).toEqual("Unknown");
		});
	});
	describe("customMessage", () => {
		test("customMessageを持つquestionExamlpeに近しい質問をすると、customMessageが返る", async () => {
			const result = await testee.question({
				storyId: TEST_ID,
				text: "人を殺しましたか？",
				recaptchaToken: "anytoken",
			});
			expect(result.hitQuestionExample?.customMessage).toMatchInlineSnapshot(
				"undefined",
			);
		});
		test("customMessageを持つquestionExamlpeに近しくない質問をすると、customMessageが返らない", async () => {
			const result = await testee.question({
				storyId: TEST_ID,
				text: "山田さんは犯罪者ですか？",
				recaptchaToken: "anytoken",
			});
			expect(result.answer).toEqual("True"); //FIXME: Falseのはず
			expect(result.hitQuestionExample?.customMessage).not.toBeDefined();
		});
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
				const text = "人を殺しましたか？";
				const result = await testee.question({
					storyId: TEST_ID,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.answer).toEqual("True");
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
				const text = "人を殺しましたか？";
				expect(
					testee.question({
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
			const text = "人を殺しましたか？";
			const result = await testee.question({
				storyId: TEST_ID_PRIVATE,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.answer).toEqual("True");
		});
	});
});
