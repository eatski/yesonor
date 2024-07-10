import { useRouter } from "next/router";
import type React from "react";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export const TransitionProgress: React.FC = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const onStart = () => {
			setLoading(true);
		};
		const onEnd = () => {
			setLoading(false);
		};
		router.events.on("routeChangeStart", onStart);
		router.events.on("routeChangeComplete", onEnd);
		router.events.on("routeChangeError", onEnd);
		return () => {
			router.events.off("routeChangeStart", onStart);
			router.events.off("routeChangeComplete", onEnd);
			router.events.off("routeChangeError", onEnd);
		};
	}, [router]);

	return loading ? <div className={styles.transitionProgress}></div> : null;
};
