export const gtag = (name: string, data?: unknown) => {
	if (process.env.NODE_ENV === "production") {
		try {
			// @ts-ignore
			window.gtag(name, data);
		} catch (e) {
			console.error(e);
		}
	} else {
		console.log("gtag", name, data);
	}
};
