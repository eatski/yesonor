import { type Device } from "@/common/util/device";
import { NewStory } from "@/components/newStory";
import { NewStoryYaml } from "@/components/newStoryYaml";
import { StoryInit } from "@/server/model/story";
import { useSearchParams } from "next/navigation";

export const NewStorySwitchMode = ({
	device,
	createStory,
}: {
	device: Device;
	createStory: (data: StoryInit) => Promise<string>;
}) => {
	const searchParams = useSearchParams();
	const mode = searchParams?.get("mode");
	if (mode === "yaml") {
		return <NewStoryYaml createStory={createStory} />;
	} else {
		return <NewStory device={device} createStory={createStory} />;
	}
};
