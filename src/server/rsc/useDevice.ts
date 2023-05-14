import { getDevice } from "@/common/util/device"
import { headers } from "next/headers"

export const useDevice = () => {
    return getDevice(headers().get("user-agent"))
}