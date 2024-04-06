export const AB_TESTING_COOKIE_NAME = "abtesting";

export const validateABTestingVariant = (variant: string) => {
	return variant === "A" || variant === "B" ? variant : null;
};

export const getAorBRandom = () => {
	return Math.random() < 0.5 ? "A" : "B";
};
