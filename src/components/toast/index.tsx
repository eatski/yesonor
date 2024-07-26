"use client";
import React, { useCallback } from "react";
import { ToastMessage } from "./ToastMessage";

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
		}, 60000);
	}, []);
	return (
		<>
			<Context.Provider value={context}>{children}</Context.Provider>
			{message && (
				<ToastMessage
					key={message.id}
					text={message.text}
					onDeleteClick={() => setMessage(null)}
				/>
			)}
		</>
	);
};
