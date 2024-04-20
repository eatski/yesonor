import { useEffect, useState } from "react";
import { Modal } from "../modal";
import { Ads } from "../ads";
import styles from "./styles.module.scss";
import { Button } from "@/designSystem/components/button";
import { z } from "zod";

const STORAGE_KEY = "adsModalCount";

const ValueWithExpireSchema = z.object({
	value: z.number(),
	updatedAt: z.number(),
});

//30分(ms)
const EXPIRE_DATE = 30 * 60 * 1000;

const getCount = () => {
	const jsonStr = localStorage.getItem(STORAGE_KEY);
	const safeparsed =
		jsonStr !== null && ValueWithExpireSchema.safeParse(safeJsonParse(jsonStr));
	if (!!safeparsed && safeparsed.success) {
		// 期限切れの場合は0にする
		if (
			safeparsed.data.updatedAt !== null &&
			safeparsed.data.updatedAt + EXPIRE_DATE < Date.now()
		) {
			return 0;
		}
		return safeparsed.data.value;
	} else {
		return 0;
	}
};

export const countUp = () => {
	const currentCount = getCount();
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({ value: currentCount + 1, updatedAt: Date.now() }),
	);
};

const safeJsonParse = (jsonStr: string) => {
	try {
		return JSON.parse(jsonStr);
	} catch {
		return null;
	}
};

const useLocalStorage = () => {
	const [value, setValue] = useState<number>(0);
	useEffect(() => {
		setValue(getCount());
		const listener = (e: StorageEvent) => {
			if (e.key === STORAGE_KEY) {
				setValue(getCount());
			}
		};
		addEventListener("storage", listener);
		return () => {
			removeEventListener("storage", listener);
		};
	}, [value]);
	return [value, setValue] as const;
};

export const AdsModal = () => {
	const [count, setCount] = useLocalStorage();
	const numberCount = Number(count);
	const open = numberCount > 5;

	useEffect(() => {
		if (open) {
			localStorage.removeItem(STORAGE_KEY);
		}
	}, [open]);
	return (
		<Modal isOpen={open}>
			<div className={styles.container}>
				<div className={styles.content}>
					<Ads slot="8290299737" />
				</div>
				<div className={styles.lower}>
					<Button
						onClick={() => {
							setCount(0);
						}}
						color={"none"}
						size={"medium"}
					>
						閉じる
					</Button>
				</div>
			</div>
		</Modal>
	);
};
