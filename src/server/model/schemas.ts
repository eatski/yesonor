import { z } from "zod";

export const answer = z.enum(["TRUE", "FALSE","UNKNOWN","INVALID"]);

export const story = z.object({
    title: z.string(),
    description: z.string(),
    mystery: z.string(),
    truth: z.string(),
    examples: z.array(z.object({
        question: z.string(),
        answer,
        supplement: z.string(),
    }))
});
