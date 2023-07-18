import { Public } from "./util";
import { User as DbUser } from "@prisma/client";

export type User = Public<DbUser, "id" | "name">;
