import { describe, test, expect, beforeAll } from "vitest";
import { appRouter } from "@/server";
import { resolve } from "path";
import { prepareStoryFromYaml } from "@/test/prepareStory";
import { generateId } from "@/common/util/id";
import { applyTestHooks } from "@/libs/msw-cache/vitest";
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

describe("trpc/truth", () => {
	const testYamlPath1 = resolve(process.cwd(), "fixtures", "test.yaml");
	const testYamlPath2 = resolve(process.cwd(), "fixtures", "test2.yaml");
	const TEST1_ID = generateId();
	const TEST2_ID = generateId();
	const TEST_ID_PRIVATE = generateId();
	applyTestHooks();
	beforeAll(async () => {
		console.log(TEST1_ID, TEST2_ID, TEST_ID_PRIVATE);
		const cleanup1 = await prepareStoryFromYaml(testYamlPath1, {
			storyId: TEST1_ID,
			authorId: TEST_USER1.id,
			published: true,
		});
		const cleanup2 = await prepareStoryFromYaml(testYamlPath2, {
			storyId: TEST2_ID,
			authorId: TEST_USER1.id,
			published: true,
		});
		const cleanup3 = await prepareStoryFromYaml(testYamlPath1, {
			storyId: TEST_ID_PRIVATE,
			authorId: TEST_USER2.id,
			published: false,
		});
		return async () => {
			await cleanup1();
			await cleanup2();
			await cleanup3();
		};
	});
	const testee = appRouter.createCaller({
		getUserOptional: async () => null,
		getUser: never,
		doRevalidate: never,
		verifyRecaptcha: () => Promise.resolve(),
		isDeveloper: () => false,
	});
	describe("解答した内容に対して、結果が返る", () => {
		test.each([
			{
				storyId: TEST1_ID,
				text: "山田さんは男性用トイレにいたが、他の男性に見つかりそうになり女性用トイレに逃げ込んだ。",
			},
			{
				storyId: TEST1_ID,
				text: "山田さんは男性用トイレにいたが、男性から隠れるために女性用トイレに移動した。",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんは運転手なので、終点の後も乗っていた。",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんは運転手であり、終点についてもずっと運転席に座っている。",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんはバスの運転手なので運転席から離れない。",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんは運転手なので、終点の後も乗っていた。",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんは市営バスの運転手なので、終点の後も乗っている。",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんはバスの運転手だった",
			},
		])(
			"真相に対して正しい解答をするとCoversが返る。 [$text]",
			async ({ text, storyId }) => {
				const result = await testee.truth({
					storyId,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.result).toEqual("Covers");
				expect(result).toMatchSnapshot();
			},
		);
		test.each([
			{
				storyId: TEST1_ID,
				text: "山田さんは人を殺害し、見つからないように女性トイレに隠れた",
			},
			{
				storyId: TEST1_ID,
				text: "山田さんは覗きをするために女性用トイレに入った。",
			},
			{
				storyId: TEST1_ID,
				text: "山田さんは女性になりたくて女性用トイレに入った",
			},
			{
				storyId: TEST1_ID,
				text: "山田さんは女性用トイレに入った",
			},
			{
				storyId: TEST1_ID,
				text: "山田さんは隠れるために女性用トイレに入った",
			},
			{
				storyId: TEST2_ID,
				text: "花子さんは死んでしまったため、終点でもずっと座っていた。",
			},
		])(
			"真相に対して間違えた解答をするとがWrong返る [$text]",
			async ({ text, storyId }) => {
				const result = await testee.truth({
					storyId,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.result).toEqual("Wrong");
				expect(result).toMatchSnapshot();
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
					isDeveloper: () => false,
				});
				const text =
					"山田さんは人を殺害し、男性用トイレに隠そうとしていたが、見つかりそうになり女性用トイレに逃げた。";
				const result = await testee.truth({
					storyId: TEST1_ID,
					text,
					recaptchaToken: "anytoken",
				});
				expect(result.result).toBeDefined();
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
					isDeveloper: () => false,
				});
				const text =
					"山田さんは人を殺害し、男性用トイレに隠そうとしていたが、見つかりそうになり女性用トイレに逃げた。";
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
				isDeveloper: () => false,
			});
			const text =
				"山田さんは人を殺害し、男性用トイレに隠そうとしていたが、見つかりそうになり女性用トイレに逃げた。";
			const result = await testee.truth({
				storyId: TEST_ID_PRIVATE,
				text,
				recaptchaToken: "anytoken",
			});
			expect(result.result).toBeDefined();
		});
	});
});
