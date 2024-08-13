import { useEffect, useState } from "react";
import { VERIFICATION_PARAMETER_NAME } from "./constants";

const getNow = () => new Date().getTime().toString();

export const useVerificationIframe = () => {
	const [verificationId, setVerificationId] = useState(getNow);
	useEffect(() => {
		const id = setInterval(() => {
			const now = getNow();
			setVerificationId(now);
		}, 1000);
	}, []);

	return {
		iframe: (
			<iframe
				src={`/verification?${VERIFICATION_PARAMETER_NAME}=${verificationId}`}
			/>
		),
	};
};
