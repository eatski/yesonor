import { useState, useEffect } from "react";
import { type Device } from "../util/device";

export const useDevice = () => {
	const [device, setDevice] = useState<Device | null>(null);
	useEffect(() => {
		import("../util/device").then(({ getDevice }) => {
			setDevice(getDevice(window.navigator.userAgent));
		});
	}, []);
	return device;
};
