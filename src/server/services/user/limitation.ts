import { get } from "@vercel/edge-config";
import { z } from "zod";
import { Device } from "../../../common/util/device";

const questionLimitationSchema = z.object({
	desktopOnly: z.boolean(),
});
export const getQuestionLimitation = async ({
	getCookie,
	device,
}: {
	getCookie: (key: string) => string | null;
	device: Device;
}) => {
	const thankyouCodeCookie = getCookie("thankyouCode");
	if (thankyouCodeCookie && thankyouCodeCookie === process.env.THANKYOU_CODE) {
		return false;
	}

	const questionLimitation = questionLimitationSchema.parse(
		await get("questionLimitation"),
	);

	if (questionLimitation.desktopOnly && device !== "desktop") {
		return "desktop_only";
	}

	return false;
};
