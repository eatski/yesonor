import { router } from "@/server/trpc";
import { putName } from "./putName";
import { thankyou } from "./thankyou";

export const user = router({
	putName,
	thankyou,
});
