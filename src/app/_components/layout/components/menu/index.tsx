import { getUserSession } from "@/server/serverComponent/getUserSession";
import { Suspense, lazy } from "react";
import { MenuIcon } from "./icon";

const UserMenuLazy = lazy(() => import("./menu"));

export const UserMenu = async () => {
	const session = await getUserSession();
	return (
		<Suspense fallback={<MenuIcon loading={true} />}>
			<UserMenuLazy isLogin={!!session} />
		</Suspense>
	);
};
