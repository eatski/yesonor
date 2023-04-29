import { z } from "zod";
import { answer, story } from "./schemas";

export type Story = z.infer<typeof story>;
export type Answer = z.infer<typeof answer>;