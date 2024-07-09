"use client";
import { SessionProvider } from "next-auth/react";
import { Suspense, lazy } from "react";
import { MenuIcon } from "./icon";

const UserMenuLazy = lazy(() => import("./menu"));

export const UserMenu = () => {
	return (
		<Suspense fallback={<MenuIcon loading={true} />}>
			<SessionProvider>
				<UserMenuLazy />
			</SessionProvider>
		</Suspense>
	);
};
