import UAParser from "ua-parser-js";

export type Device = "mobile" | "desktop";

export const uaToDevice = (ua: string): Device => {
	const parser = new UAParser(ua);
	const result = parser.getResult();
	const deviceType = result.device.type; // "mobile", "desktop" or undefined
	const device = deviceType === "mobile" ? "mobile" : "desktop";
	return device;
};
