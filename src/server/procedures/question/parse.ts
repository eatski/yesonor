export const parseHeadToken = (text: string): string => {
	const regex = /^(.+?):/;
	const result = text.match(regex);

	if (!result || !result[1]) {
		throw new Error(`Parse error: ${text}`);
	}
	return result[1];
};
