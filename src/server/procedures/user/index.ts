import { router } from "@/server/trpc";
import { putName } from "./putName";

export const user = router({
	putName,
});
