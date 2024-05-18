import type { User as DbUser } from "@prisma/client";
import type { Public } from "./util";

export type User = Public<DbUser, "id" | "name">;
