import Script from "next/script";
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

const AdsScriptsContext = createContext<boolean>(false);

export const AdsScriptsProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [state, setState] = useState<boolean>(false);
	return (
		<AdsScriptsContext.Provider value={state}>
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4007955646272580"
				crossOrigin="anonymous"
				onLoad={() => {
					setState(true);
				}}
			/>
			{children}
		</AdsScriptsContext.Provider>
	);
};

export const Ads = () => {
	const scriptsLoading = useContext(AdsScriptsContext);
	const ref = useRef<HTMLModElement>(null);
	useEffect(() => {
		if (!scriptsLoading) {
			return;
		}

		if (ref.current && ref.current.childNodes.length > 0) {
			return;
		}

		try {
			//@ts-expect-error
			adsbygoogle = window.adsbygoogle || [];
			//@ts-expect-error
			adsbygoogle.push({});
		} catch (e) {
			console.error(e);
		}
	}, [scriptsLoading]);
	return (
		<ins
			ref={ref}
			className="adsbygoogle"
			style={{ display: "block" }}
			data-ad-client="ca-pub-4007955646272580"
			data-ad-slot="3140493959"
			data-ad-format="auto"
			data-full-width-responsive="true"
		/>
	);
};
