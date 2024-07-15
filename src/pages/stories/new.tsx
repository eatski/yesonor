import type { Device } from "@/common/util/device";
import { Layout } from "@/components/layout";
import { NewStory } from "@/components/newStory";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { getUserSession } from "@/server/getServerSideProps/getUserSession";
import type { GetServerSideProps } from "next";

type Props = {
	device: Device;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
	context,
) => {
	const user = await getUserSession(context);
	if (!user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(
					context.resolvedUrl,
				)}`,
				permanent: false,
			},
		};
	}
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
