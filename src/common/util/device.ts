import UAParser from "ua-parser-js";

export type Device = "mobile" | "desktop"

export const getDevice = (ua: string | undefined | null): Device => {
    const parser = new UAParser(ua || undefined);
    const result = parser.getResult();
    const deviceType = result.device.type; // "mobile", "desktop" or undefined
    const device = deviceType === 'mobile' ? 'mobile' : 'desktop';
    return device
}