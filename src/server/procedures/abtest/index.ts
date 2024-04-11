import { procedure, router } from "@/server/trpc";

export const abtest = router({
	setup: procedure.mutation(({ ctx }) => {
		ctx.setupABTestingVariant();
	}),
});
