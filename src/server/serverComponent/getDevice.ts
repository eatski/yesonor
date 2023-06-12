import { Device, getDevice } from "@/common/util/device";
import { headers } from "next/headers";

export const getDeviceServer = (): Device => {
	// User Agent の解析
	const ua = headers().get("user-agent");
	return getDevice(ua || undefined);
};
