import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { checkAnswer } from ".";
import { parseYaml } from "../../../common/util/parseYaml";
import { applyTestHooks } from "../../../libs/msw-cache/vitest";
import { Story } from "../../../server/model/story";
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

describe("services/answer/checkAnswer", () => {
	const story1 = loadStory("test.yaml");
	const story2 = loadStory("test2.yaml");

	applyTestHooks();

	describe("解答した内容に対して、結果が返る", () => {
		test.each([
			{
				story: story1,
				text: "山田さんは男性用トイレにいたが、他の男性に見つかりそうになり女性用トイレに逃げ込んだ。",
			},
			{
				story: story1,
				text: "山田さんは男性用トイレにいたが、男性から隠れるために女性用トイレに移動した。",
			},
			{
				story: story2,
				text: "花子さんは運転手であり、終点についてもずっと運転席に座っている。",
			},
			{
				story: story2,
				text: "花子さんはバスの運転手なので運転席から離れない。",
			},
			{
				story: story2,
				text: "花子さんは運転手なので、終点の後も乗っていた。",
			},
			{
				story: story2,
				text: "花子さんは市営バスの運転手なので、終点の後も乗っている。",
			},
			{
				story: story2,
				text: "花子さんはバスの運転手だった",
			},
		])(
			"真相に対して正しい解答をするとCorrectが返る。 [$text]",
			async ({ text, story }) => {
				const result = await checkAnswer(text, story);
				expect(result.isCorrect).toEqual(true);
				expect(result).toMatchSnapshot();
			},
		);
		test.each([
			{
				story: story1,
				text: "山田さんは人を殺害し、見つからないように女性トイレに隠れた",
			},
			{
				story: story1,
				text: "山田さんは覗きをするために女性用トイレに入った。",
			},
			{
				story: story1,
				text: "山田さんは女性になりたくて女性用トイレに入った",
			},
			{
				story: story1,
				text: "山田さんは女性用トイレに入った",
			},
			{
				story: story1,
				text: "山田さんは隠れるために女性用トイレに入った",
			},
			{
				story: story2,
				text: "花子さんは死んでしまったため、終点でもずっと座っていた。",
			},
		])(
			"真相に対して間違えた解答をするとがIncorrect返る [$text]",
			async ({ text, story }) => {
				const result = await checkAnswer(text, story);
				expect(result.isCorrect).toEqual(false);
				expect(result).toMatchSnapshot();
			},
		);
	});
});
