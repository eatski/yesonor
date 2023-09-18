import { Suspense, lazy } from "react";
import { MenuIcon } from "./icon";

const UserMenuLazy = lazy(() => import("./menu"));

export const UserMenu = () => {
	return (
		<Suspense fallback={<MenuIcon loading={true} />}>
			<UserMenuLazy />
		</Suspense>
	);
};
