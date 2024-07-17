import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const logSchema = z.enum(["query", "error", "info", "warn"]);

export const prisma = new PrismaClient({
	log: process.env.PRISMA_LOG
		? z.array(logSchema).parse(process.env.PRISMA_LOG.split(","))
		: undefined,
});
