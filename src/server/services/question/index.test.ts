import { AB_TESTING_VARIANTS } from "@/common/abtesting";
import { parseYaml } from "@/common/util/parseYaml";
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, test, expect } from "vitest";
import { getAnswer } from ".";
import { applyTestHooks } from "@/libs/msw-cache/vitest";
import { Story } from "@/server/model/story";
const loadStory = (storyYaml: string): Story => {
	const parsed = parseYaml(
		readFileSync(resolve(process.cwd(), "fixtures", storyYaml), "utf-8"),
	);
	if (parsed.error != null) {
		throw parsed.error;
	}
	const story = parsed.data;
	return {
		id: "test",
		quiz: story.quiz,
		truth: story.truth,
		questionExamples: story.questionExamples,
		simpleTruth: story.simpleTruth,
		title: story.title,
		published: false,
		publishedAt: null,
		author: {
			id: "test",
			name: "test",
		},
	};
};
describe.each([
	AB_TESTING_VARIANTS.ONLY_SONNET,
	AB_TESTING_VARIANTS.WITH_HAIKU,
] as const)("service/question/getAnswer %s", (ab) => {
	applyTestHooks();
	const storyTamada = loadStory("test.yaml");
	const storyHanako = loadStory("test2.yaml");
	test.concurrent.each([
		{
			story: storyTamada,
			question: "山田さんは犯罪者ですか？",
		},
		{
			story: storyTamada,
			question: "人が死んでますか？",
		},
		{
			story: storyTamada,
			question: "近くに他の人がいますか？",
		},
		{
			story: storyTamada,
			question: "山田さんの近くにいる人は男ですか？",
		},
		{
			story: storyHanako,
			question: "花子さんは運転手ですか？",
		},
		{
			story: storyHanako,
			question: "花子さんは出ようと思えばバスから出られる状態？",
		},
		{
			story: storyHanako,
			question: "花子さんにとってそこが仕事場ですか？",
		},
		{
			story: storyHanako,
			question: "これはいつものことですか？",
		},
	])(
		"真相に対して正しい質問をするとTrueが返る $question",
		async ({ question, story }) => {
			const result = await getAnswer(
				question,
				Promise.resolve(story),
				Promise.resolve(),
				Promise.resolve(ab),
			);
			expect(result.answer).toEqual("True");
		},
	);
	test.concurrent.each([
		{
			story: storyTamada,
			question: "山田さんは誰かに襲われていますか？",
		},
		{
			story: storyTamada,
			question: "性的な興味で女性用トイレに入りましたか？",
		},
		{
			story: storyTamada,
			question: "山田さんは死んでいますか？",
		},
		{
			story: storyTamada,
			question: "女子トイレには他に誰かいますか？",
		},
		{
			story: storyHanako,
			question: "花子さんは死亡していますか？",
		},
		{
			story: storyHanako,
			question: "花子さんは客としてバスに乗ってる？",
		},
		{
			story: storyHanako,
			question: "バスが壊れてますか？",
		},
	])(
		"真相に対して正しくない質問をするとFalseが返る $question",
		async ({ question, story }) => {
			const result = await getAnswer(
				question,
				Promise.resolve(story),
				Promise.resolve(),
				Promise.resolve(ab),
			);
			expect(result.answer).toEqual("False");
		},
	);
	test.concurrent.each([
		{
			story: storyTamada,
			question: "山田には恋人がいますか？",
		},
		{
			story: storyTamada,
			question: "山田さんはパンよりライス派？",
		},
		{
			story: storyHanako,
			question: "花子さんは良い人ですか？",
		},
	])(
		"真相では言及されていない質問をするとUnknownが返る $question",
		async ({ question, story }) => {
			const result = await getAnswer(
				question,
				Promise.resolve(story),
				Promise.resolve(),
				Promise.resolve(ab),
			);
			expect(result.answer).toEqual("Unknown");
		},
	);
	test.concurrent.each([
		{
			story: storyTamada,
			question: "山田は人を殺しましたか？",
			expected: "いい質問ですね！山田さんは人を殺しています。",
		},
		{
			story: storyTamada,
			question: "山田は人を殺害しちゃった？",
			expected: "いい質問ですね！山田さんは人を殺しています。",
		},
		{
			story: storyTamada,
			question: "山田は人を殺したの？",
			expected: "いい質問ですね！山田さんは人を殺しています。",
		},
		{
			story: storyHanako,
			question: "バスではトラブルが発生していますか？",
			expected: "バスは今日も平常運転です。",
		},
	])(
		"customMessageを持つquestionExamlpeに近しい質問をすると、customMessageが返る $question",
		async ({ question, story, expected }) => {
			const result = await getAnswer(
				question,
				Promise.resolve(story),
				Promise.resolve(),
				Promise.resolve(ab),
			);
			expect(result.hitQuestionExample?.customMessage).toBe(expected);
		},
	);
	test.concurrent.each([
		{
			story: storyTamada,
			question: "山田さんは犯罪者ですか？",
		},
	])(
		"customMessageを持つquestionExamlpeに近しくない質問をすると、customMessageが返らない",
		async ({ question, story }) => {
			const result = await getAnswer(
				question,
				Promise.resolve(story),
				Promise.resolve(),
				Promise.resolve(ab),
			);
			expect(result.hitQuestionExample?.customMessage).not.toBeDefined();
		},
	);
});
