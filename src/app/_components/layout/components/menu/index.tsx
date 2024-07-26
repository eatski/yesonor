import { getUserSession } from "@/server/serverComponent/getUserSession";
import { Suspense, lazy } from "react";
import { MenuIcon } from "./icon";

const UserMenuLazy = lazy(() => import("./menu"));

export const UserMenu = () => {
	return (
		<Suspense fallback={<MenuIcon />}>
			<Inner />
		</Suspense>
	);
};

const Inner = async () => {
	const session = await getUserSession();
	return <UserMenuLazy userId={session?.userId || null} />;
};
