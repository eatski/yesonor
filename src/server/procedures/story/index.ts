import { router } from "@/server/trpc";
import { delete_ } from "./delete";
import { getByIdPrivate } from "./get";
import { post } from "./post";
import { publishFirst } from "./publish";

export const story = router({
	getByIdPrivate,
	publishFirst,
	post,
	delete_,
});
