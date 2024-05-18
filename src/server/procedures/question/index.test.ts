import { resolve } from "node:path";
import { generateId } from "@/common/util/id";
import { applyTestHooks } from "@/libs/msw-cache/vitest";
import { router } from "@/server/trpc";
import { prepareStoryFromYaml } from "@/test/prepareStory";
import { beforeAll, describe, expect, test } from "vitest";
import { question } from ".";
const never = () => {
	throw new Error("Never");
};

const TEST_ID = generateId();
const TEST_ID_PRIVATE = generateId();

const testeeRouter = router({
	question,
});

describe("trpc/question", () => {
	const ab = "WITH_HAIKU" as const;
	const testYamlPath = resolve(process.cwd(), "fixtures", "test.yaml");
	const TEST_USER1 = {
		id: generateId(),
		email: "yesonor@example.com",
	};

	const TEST_USER2 = {
		id: generateId(),
		email: "not-yesonor@example.com",
	};
	applyTestHooks();
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
	const testee = testeeRouter.createCaller({
		getUserOptional: async () => null,
		getUser: never,
		doRevalidate: never,
		verifyRecaptcha: () => Promise.resolve(),
		setupABTestingVariant: async () => ab,
		isThankYouUser: never,
	});
	describe("質問した内容に対して、結果が返る", () => {
		test.concurrent.each(["山田さんは犯罪者ですか？"])(
			"真相に対して正しい質問をするとTrueが返る %s",
			async (text) => {
				const result = await testee.question({
					storyId: TEST_ID,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.answer).toEqual("True");
			},
		);
	});
	describe("storyの参照権限", () => {
		test.each([TEST_USER1, TEST_USER2, null])(
			"publicなstoryに対して質問すると回答が返ってくる",
			async (user) => {
				const testee = testeeRouter.createCaller({
					getUserOptional: async () => user,
					getUser: never,
					doRevalidate: never,
					verifyRecaptcha: () => Promise.resolve(),
					setupABTestingVariant: async () => ab,
					isThankYouUser: never,
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
				const testee = testeeRouter.createCaller({
					getUserOptional: async () => user,
					getUser: never,
					doRevalidate: never,
					verifyRecaptcha: () => Promise.resolve(),
					setupABTestingVariant: async () => ab,
					isThankYouUser: never,
				});
				const text = "人を殺しましたか？";
				expect(
					testee.question({
						storyId: TEST_ID_PRIVATE,
						text,
						recaptchaToken: "anytoken",
					}),
				).rejects.toMatchSnapshot("エラー");
			},
		);
		test("自分の作成したstoryの場合、privateなstoryに対して質問しても回答が返ってくる", async () => {
			const testee = testeeRouter.createCaller({
				getUserOptional: async () => TEST_USER2,
				getUser: never,
				doRevalidate: never,
				verifyRecaptcha: () => Promise.resolve(),
				setupABTestingVariant: async () => ab,
				isThankYouUser: never,
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
