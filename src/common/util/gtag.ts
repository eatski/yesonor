import { AB_TESTING_COOKIE_NAME } from "../abtesting";

const jsCookiePromise = import("js-cookie");
const getGlobalCookieValues = async () => {
	const { default: jsCookie } = await jsCookiePromise;
	const cookieValue = jsCookie.get(AB_TESTING_COOKIE_NAME);
	return {
		global_abtesting: cookieValue,
	};
};

export const gtagEvent = async (
	name: string,
	options?: {
		data?: Record<string, string | number>;
	},
) => {
	try {
		const mergedData = {
			...(options?.data || {}),
			...(await getGlobalCookieValues()),
		};

		if (process.env.NODE_ENV === "production") {
			// @ts-ignore
			window.gtag("event", name, mergedData);
		} else {
			console.log("gtag", name, mergedData);
		}
	} catch (e) {
		console.error("gtagEvent error", e);
	}
};
