import { router } from "@/server/trpc";
import { getByIdPrivate } from "./get";
import { publishFirst } from "./publish";
import { put } from "./put";
import { post } from "./post";
import { delete_ } from "./delete";

export const story = router({
	getByIdPrivate,
	publishFirst,
	put,
	post,
	delete_,
});
