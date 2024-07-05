import { Button } from "@/designSystem/components/button";
import React, { useCallback } from "react";
import { useState } from "react";
import { Modal } from "./../modal";
import styles from "./styles.module.scss";

export function useConfirmModal() {
	const [state, setState] = useState<{
		text: string;
		resolve: (value: boolean) => void;
	} | null>(null);
	const confirm = useCallback((text: string) => {
		return new Promise<boolean>((resolve) => {
			setState({
				text,
				resolve: (value) => {
					resolve(value);
					setState(null);
				},
			});
		});
	}, []);

	return {
		confirm,
		view: (
			<Modal isOpen={!!state}>
				<p className={styles.text}>{state?.text}</p>
				<div className={styles.buttons}>
					<Button
						color="none"
						size="medium"
						onClick={() => state?.resolve(false)}
					>
						キャンセル
					</Button>
					<Button
						color="primary"
						size="medium"
						onClick={() => state?.resolve(true)}
					>
						OK
					</Button>
				</div>
			</Modal>
		),
	};
}
