import { procedure } from "@/server/trpc";

export const thankyou = procedure.query(async ({ ctx }) => {
	return ctx.isThankYouUser();
});
