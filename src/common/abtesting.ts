export const AB_TESTING_COOKIE_NAME = "abtesting";

export const AB_TESTING_VARIANTS = {
	ONLY_SONNET: "ONLY_SONNET",
	WITH_HAIKU: "WITH_HAIKU",
} as const;
type AB_TETSTING_VARIANT = keyof typeof AB_TESTING_VARIANTS;

export const validateABTestingVariant = (
	variant: string,
): AB_TETSTING_VARIANT | null => {
	return variant === AB_TESTING_VARIANTS.ONLY_SONNET ||
		variant === AB_TESTING_VARIANTS.WITH_HAIKU
		? variant
		: null;
};

export const getAorBRandom = (): AB_TETSTING_VARIANT => {
	return Math.random() < 0.5
		? AB_TESTING_VARIANTS.ONLY_SONNET
		: AB_TESTING_VARIANTS.WITH_HAIKU;
};
