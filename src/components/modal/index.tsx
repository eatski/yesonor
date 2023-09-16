import ReactModal from "react-modal";

export const Modal: React.FC<React.PropsWithChildren<{ isOpen: boolean }>> = ({
	children,
	isOpen,
}) => {
	return (
		<ReactModal
			isOpen={isOpen}
			style={{
				content: {
					width: "80%",
					height: "fit-content",
					margin: "auto",
					padding: "12px",
					backgroundColor: "var(--color-base-bg)",
				},
				overlay: {
					backgroundColor: "var(--color-base-bg-overlay)",
				},
			}}
		>
			{children}
		</ReactModal>
	);
};
