import React from "react";
import { Suspense } from "react";

const LazyReactModal = React.lazy(() => import("react-modal"));

export const Modal: React.FC<React.PropsWithChildren<{ isOpen: boolean }>> = ({
	children,
	isOpen,
}) => {
	return (
		<Suspense>
			<LazyReactModal
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
				parentSelector={() => document.body}
			>
				{children}
			</LazyReactModal>
		</Suspense>
	);
};
