import { z } from "zod";
import { answer, story, truthCoincidence } from "./schemas";

export type Story = z.infer<typeof story>;
export type Answer = z.infer<typeof answer>;
export type TruthCoincidence = z.infer<typeof truthCoincidence>;