import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	test,
	vi,
	vitest,
} from "vitest";

import { resolveFixturePath } from "../../../../fixtures";
import { prepareStoryFromYaml } from "../../../test/prepareStory";
import * as nextCache from "../../serverComponent/nextCache";
import { getStory } from "./getStory";

describe("getStory", () => {
	beforeEach(() => {
		vi.spyOn(nextCache, "nextCache").mockImplementation((fn) => fn);
	});
	describe("onlyPublic", () => {
		test("should return the story if it is public", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: true,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);

			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "onlyPublic" },
			});
			expect(story).toMatchSnapshot();
		});
		test("should return null if the story is not public", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: false,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);
			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "onlyPublic" },
			});
			expect(story).toBe(null);
		});
	});
	describe("publicOrWithAuthor", () => {
		test("should return the story if it is public", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: true,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);

			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "publicOrWithAuthor", authorId },
			});
			expect(story).toMatchSnapshot();
		});
		test("should return the story if it is authored by the author", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: false,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);

			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "publicOrWithAuthor", authorId },
			});
			expect(story).toMatchSnapshot();
		});
		test("should return null if the story is not public and not authored by the author", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: false,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);

			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "publicOrWithAuthor", authorId: "otherAuthorId" },
			});
			expect(story).toBe(null);
		});
	});
	describe("withAuthorId", () => {
		test("should return the story if it is authored by the author", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: false,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);

			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "withAuthorId", authorId },
			});
			expect(story).toMatchSnapshot();
		});
		test("should return null if the story is not authored by the author", async (test) => {
			const storyId = test.task.name + "-storyId";
			const authorId = test.task.name + "-authorId";
			const cleanup = await prepareStoryFromYaml(
				resolveFixturePath("test.yaml"),
				{
					authorId,
					storyId,
					published: false,
					date: new Date("2024-08-28T13:54:41.065Z"),
				},
			);

			test.onTestFinished(() => {
				cleanup();
			});

			const story = await getStory({
				storyId,
				filter: { type: "withAuthorId", authorId: "otherAuthorId" },
			});

			expect(story).toBe(null);
		});
	});
});
