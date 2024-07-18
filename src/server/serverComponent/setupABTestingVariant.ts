import {
	AB_TESTING_COOKIE_NAME,
	AB_TESTING_VARIANTS,
	getAorBRandom,
} from "@/common/abtesting";
import { get } from "@vercel/edge-config";
import { cookies } from "next/headers";

export const setupABTestValue = async () => {
	const abTestRate = await get("abTestRate").catch(() => null);
	if (
		!abTestRate ||
		!(typeof abTestRate === "number") ||
		Number.isNaN(abTestRate) ||
		abTestRate < 0 ||
		abTestRate > 1
	) {
		cookies().delete(AB_TESTING_COOKIE_NAME);
		return AB_TESTING_VARIANTS.ONLY_SONNET;
	}
	const random = getAorBRandom(abTestRate);
	cookies().set(AB_TESTING_COOKIE_NAME, random, {
		httpOnly: false,
		secure: true,
		sameSite: "none",
	});
	return random;
};
