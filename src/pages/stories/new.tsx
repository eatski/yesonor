import { Device } from "@/common/util/device";
import { Layout } from "@/features/layout";
import { NewStoryYaml } from "@/features/newStoryYaml";
import { getDeviceServer } from "@/server/getServerSideProps/getDevice";
import { GetServerSideProps } from "next";

export const config = {
    runtime: 'experimental-edge'
};

type Props = {
    device: Device
}

export const getServerSideProps : GetServerSideProps<Props> = async (context) => {
    return {
        props: {
            device: getDeviceServer(context)
        }
    };
}

export default function NewStoryPage(props: Props) {
    const { device } = props;

    return (
        <Layout>
            <NewStoryYaml canUseFileDrop={device === "desktop"} />
        </Layout>
    );
}
