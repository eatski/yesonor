"use client";
import { Device } from "@/common/util/device";
import { EditStory } from "@/components/editStory";
import { EditStoryYaml } from "@/components/editStoryYaml";
import { Story, StoryInit } from "@/server/model/story";
import { useSearchParams } from "next/navigation";

export const EditStorySwitchMode = ({
	story,
	device,
	onSubmit,
}: {
	story: Story;
	device: Device;
	onSubmit: (data: StoryInit) => Promise<void>;
}) => {
	const searchParams = useSearchParams();
	const mode = searchParams?.get("mode");
	if (mode === "yaml") {
		return (
			<EditStoryYaml
				story={{
					title: story.title,
					id: story.id,
				}}
				onSubmit={onSubmit}
			/>
		);
	} else {
		return (
			<EditStory
				storyId={story.id}
				story={story}
				device={device}
				onSubmit={onSubmit}
			/>
		);
	}
};
