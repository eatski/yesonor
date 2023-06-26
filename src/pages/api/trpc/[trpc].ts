import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/server";
import { createContext } from "@/server/context";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	onError({ error }) {
		const status = getHTTPStatusCodeFromError(error);
		if (status >= 500) {
			console.error(error);
		}
	},
});
