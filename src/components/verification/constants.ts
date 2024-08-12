export const VERIFICATION_PARAMETER_NAME = "verificationId";
export const createVerificationDonePostMessage = (messageId: string) => {
	return `VerificationDone-${messageId}`;
};
