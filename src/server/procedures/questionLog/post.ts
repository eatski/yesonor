import { decrypt } from "@/libs/crypto";
import { prisma } from "@/libs/prisma";
import { questionLog } from "@/server/model/schemas";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const INVALID_INPUT = "INVALID_INPUT";

export const post = procedure
	.input(
		z.object({
			encrypted: z.string(),
		}),
	)
	.mutation(async ({ input }) => {
		const data = decrypt(input.encrypted);
		if (!data) {
			throw new TRPCError({
				code: "PARSE_ERROR",
				message: INVALID_INPUT,
			});
		}
		const parsed = questionLog.safeParse(JSON.parse(data));
		if (!parsed.success)
			throw new TRPCError({
				code: "PARSE_ERROR",
				message: INVALID_INPUT,
			});
		const questionLogInit = parsed.data;
		// 保存
		await prisma.questionLog.create({
			data: questionLogInit,
		});
		return true;
	});
