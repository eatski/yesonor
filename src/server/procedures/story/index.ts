import { router } from "@/server/trpc";
import { getByIdPrivate } from "./get";

export const story = router({
	getByIdPrivate,
});
