import { router } from "@/server/trpc";
import { delete_ } from "./delete";
import { getByIdPrivate } from "./get";
import { post } from "./post";
import { publishFirst } from "./publish";
import { put } from "./put";

export const story = router({
	getByIdPrivate,
	publishFirst,
	put,
	post,
	delete_,
});
