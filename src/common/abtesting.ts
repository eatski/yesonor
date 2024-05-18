export const AB_TESTING_COOKIE_NAME = "abtesting";

export const AB_TESTING_VARIANTS = {
	ONLY_SONNET: "ONLY_SONNET",
	GPT4O: "GPT4O",
} as const;
export type ABTestingVariant = keyof typeof AB_TESTING_VARIANTS;

export const validateABTestingVariant = (
	variant: string,
): ABTestingVariant | null => {
	return variant === AB_TESTING_VARIANTS.ONLY_SONNET ||
		variant === AB_TESTING_VARIANTS.GPT4O
		? variant
		: null;
};

export const getAorBRandom = (rate: number): ABTestingVariant => {
	return Math.random() < rate
		? AB_TESTING_VARIANTS.ONLY_SONNET
		: AB_TESTING_VARIANTS.GPT4O;
};
