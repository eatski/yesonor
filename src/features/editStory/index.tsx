import { trpc } from "@/libs/trpc";
import React from "react";
import { useRouter } from "next/router";
import { StoryForm } from "../storyForm";
import { StoryInit } from "@/server/model/types";
import { H1 } from "@/common/components/heading";

export type Props = {
	storyId: string;
	story: StoryInit;
};

export const EditStory: React.FC<Props> = ({ storyId, story }) => {
	const { mutate, isError, isLoading } = trpc.put.useMutation();
	const router = useRouter();
	return (
		<>
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
		</>
	);
};
