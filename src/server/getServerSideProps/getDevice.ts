import { type Device, getDevice } from "@/common/util/device";
import type { GetServerSidePropsContext } from "next";

export const getDeviceServer = ({ req }: GetServerSidePropsContext): Device => {
	// User Agent の解析
	const ua = req.headers["user-agent"];
	return getDevice(ua);
};
