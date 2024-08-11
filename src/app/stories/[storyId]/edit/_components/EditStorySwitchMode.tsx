"use client";
import { Device } from "@/common/util/device";
import { EditStory } from "@/components/editStory";
import { EditStoryYaml } from "@/components/editStoryYaml";
import { Story, StoryInit } from "@/server/model/story";
import { useSearchParams } from "next/navigation";

export const EditStorySwitchMode = ({
	story,
	device,
	saveStory,
}: {
	story: Story;
	device: Device;
	saveStory: (data: StoryInit) => Promise<void>;
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
				saveStory={saveStory}
			/>
		);
	} else {
		return (
			<EditStory
				storyId={story.id}
				story={story}
				device={device}
				saveStory={saveStory}
			/>
		);
	}
};
