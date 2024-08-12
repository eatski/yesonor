import { Device, uaToDevice } from "@/common/util/device";
import { headers } from "next/headers";

export const getDevice = (): Device => {
	const ua = headers().get("user-agent") || undefined;
	if (!ua) {
		return "desktop";
	}
	return uaToDevice(ua);
};
