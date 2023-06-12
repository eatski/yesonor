import { MainContent } from "@/app/_components/main";
import { NewStory } from "@/features/newStory";
import { getDeviceServer } from "@/server/serverComponent/getDevice";

export default function NewStoryPage() {
	return (
		<MainContent>
			<NewStory device={getDeviceServer()} />;
		</MainContent>
	);
}
