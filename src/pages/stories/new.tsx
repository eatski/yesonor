import { Device } from "@/common/util/device";
import { Layout } from "@/components/layout";
import { NewStory } from "@/components/newStory";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { GetServerSideProps } from "next";

export const config = {
	runtime: "experimental-edge",
};

type Props = {
	device: Device;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	return {
		props: {
			device: getDeviceServer(context),
		},
	};
};

export default function NewStoryPage(props: Props) {
	return (
		<Layout>
			<NewStory device={props.device} />
		</Layout>
	);
}
