import { router } from "@/server/trpc";
import { post } from "./post";

export const story = router({
	post,
});
