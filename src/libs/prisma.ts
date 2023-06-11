import { PrismaClient } from "@prisma/client";
import { setTimeout } from "timers/promises";

const prismaInner = new PrismaClient();

if (process.env.NODE_ENV === "development") {
	prismaInner.$use(async (params, next) => {
		await setTimeout(1500);
		return next(params);
	});
}

export const prisma = prismaInner;
