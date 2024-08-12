"use client";

import { useEffect } from "react";
import {
	VERIFICATION_PARAMETER_NAME,
	createVerificationDonePostMessage,
} from "./constants";

export const VerificationIframeContent = () => {
	useEffect(() => {
		const verificationId = new URLSearchParams(window.location.search).get(
			VERIFICATION_PARAMETER_NAME,
		);
		verificationId &&
			window.top?.postMessage(
				createVerificationDonePostMessage(verificationId),
				"*",
			);
	}, []);
};
