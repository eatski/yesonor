import { Button } from "@/designSystem/components/button";
import React, { useCallback } from "react";
import { useState } from "react";
import styles from "./styles.module.scss";
import { Modal } from "./../modal";

const Context = React.createContext<(text: string) => Promise<boolean>>(() => {
	throw new Error("Context is not provided");
});

export function ConfirmModal({
	children,
}: React.PropsWithChildren): React.ReactElement {
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
	return (
		<>
			<Context.Provider value={confirm}>{children}</Context.Provider>
			<Modal isOpen={!!state}>
				<p className={styles.text}>{state?.text}</p>
				<div className={styles.buttons}>
					<Button color="none" onClick={() => state?.resolve(false)}>
						キャンセル
					</Button>
					<Button color="primary" onClick={() => state?.resolve(true)}>
						OK
					</Button>
				</div>
			</Modal>
		</>
	);
}

export function useConfirmModal<V>() {
	return React.useContext(Context);
}
