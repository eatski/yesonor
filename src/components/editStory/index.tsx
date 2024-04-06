import { trpc } from "@/libs/trpc";
import React from "react";
import { useRouter } from "next/router";
import { StoryForm } from "../storyForm";
import { StoryInit } from "@/server/model/story";
import { H1 } from "@/designSystem/components/heading";

export type Props = {
	storyId: string;
	story: StoryInit;
};

export const EditStory: React.FC<Props> = ({ storyId, story }) => {
	const { mutate, isError, isLoading } = trpc.story.put.useMutation();
	const router = useRouter();
	return (
		<main>
			<H1>{story.title}</H1>
			<StoryForm
				storyInit={story}
				onSubmit={(input) => {
					mutate(
						{
							id: storyId,
							story: input,
						},
						{
							onSuccess: () => {
								router.push(`/my/stories/${storyId}`);
							},
						},
					);
				}}
				isLoading={isLoading}
				isError={isError}
			/>
		</main>
	);
};
