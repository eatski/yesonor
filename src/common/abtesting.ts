export const AB_TESTING_COOKIE_NAME = "abtesting";

export const validateABTestingVariant = (variant: string) => {
	return variant === "A" || variant === "B" ? variant : null;
};
