import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export const Ads = () => {
	const initialized = useRef<boolean>(false);
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		if (!loaded) {
			return;
		}
		if (initialized.current) {
			return;
		}
		try {
			//@ts-expect-error
			adsbygoogle = window.adsbygoogle || [];
			//@ts-expect-error
			adsbygoogle.push({});
			initialized.current = true;
		} catch (e) {
			console.error(e);
		}
	}, [loaded]);
	return (
		<>
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4007955646272580"
				crossOrigin="anonymous"
				onLoad={() => {
					setLoaded(true);
				}}
			/>
			<ins
				className="adsbygoogle"
				style={{ display: "block" }}
				data-ad-client="ca-pub-4007955646272580"
				data-ad-slot="3140493959"
				data-ad-format="auto"
				data-full-width-responsive="true"
			/>
		</>
	);
};
