import { GetServerSidePropsContext } from "next"
import UAParser from "ua-parser-js";

export type Device = "mobile" | "desktop"

export const getDevice = ({ req }: GetServerSidePropsContext): Device => {
    // User Agent の解析
    const ua = req.headers['user-agent'];
    const parser = new UAParser(ua);
    const result = parser.getResult();
    const deviceType = result.device.type; // "mobile", "desktop" or undefined

    const device = deviceType === 'mobile' ? 'mobile' : 'desktop';
    return device
}