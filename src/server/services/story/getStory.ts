import { revalidateTime } from "../../../common/revalidate";
import { prisma } from "../../../libs/prisma";
import type { Story } from "../../../server/model/story";
import { nextCache } from "../../../server/serverComponent/nextCache";
import { hydrateStory } from "./functions";

type FilterForFindFirst =
	| {
			type: "onlyPublic";
	  }
	| {
			type: "publicOrWithAuthor" | "withAuthorId";
			authorId: string;
	  };

const cacheKeyByFilter = (filter: FilterForFindFirst): string[] => {
	const simpleTypedFilter: {
		type: FilterForFindFirst["type"];
		authorId?: string;
	} = filter;
	return [simpleTypedFilter.type, simpleTypedFilter.authorId].filter(
		(v) => v != null,
	);
};

export const getStory = ({
	storyId,
	filter,
}: {
	storyId: string;
	filter: FilterForFindFirst;
}): Promise<Story | null> => {
	return nextCache(
		async () => {
			const story = await prisma.story.findFirst({
				where: {
					id: storyId,
				},
				include: {
					author: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			if (story == null) return null;

			if (filter.type === "withAuthorId" && story.authorId !== filter.authorId)
				return null;
			if (filter.type === "onlyPublic" && !story.published) return null;
			if (
				filter.type === "publicOrWithAuthor" &&
				!story.published &&
				story.authorId !== filter.authorId
			)
				return null;

			return hydrateStory(story);
		},
		["_getStory", storyId, ...cacheKeyByFilter(filter)],
		{
			revalidate: revalidateTime.short,
			tags: [`/stories/${storyId}`],
		},
	)();
};
