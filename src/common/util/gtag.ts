export const gtagEvent = (name: string, data?: unknown) => {
	if (process.env.NODE_ENV === "production") {
		try {
			// @ts-ignore
			window.gtag("event", name, data);
		} catch (e) {
			console.error(e);
		}
	} else {
		console.log("gtag", name, data);
	}
};
