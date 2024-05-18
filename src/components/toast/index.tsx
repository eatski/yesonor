import { IconButton } from "@/designSystem/components/button";
import React, { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.scss";

const Context = React.createContext<(text: string) => void>(() => {
	throw new Error("Context is not provided");
});

export const useToast = () => {
	return React.useContext(Context);
};

export const Toast: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [message, setMessage] = React.useState<{
		text: string;
		id: number;
	} | null>(null);
	const context = useCallback(async (text: string) => {
		const id = Math.random();
		setMessage({
			text,
			id,
		});
		setTimeout(() => {
			setMessage((message) => {
				if (message?.id === id) {
					return null;
				}
				return message;
			});
		}, 6000);
	}, []);
	return (
		<>
			<Context.Provider value={context}>{children}</Context.Provider>
			{message && (
				<div key={message.id} className={styles.toast}>
					<p role="log" aria-live="polite">
						{message.text}
					</p>
					<IconButton
						onClick={() => {
							setMessage(null);
						}}
						aria-label="消す"
					>
						<AiOutlineClose />
					</IconButton>
				</div>
			)}
		</>
	);
};
