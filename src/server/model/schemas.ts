import { z } from "zod";

export const answer = z.enum(["TRUE", "FALSE","UNKNOWN","INVALID"]);

export const story = z.object({
    title: z.string(),
    description: z.string(),
    mystery: z.string(),
    truth: z.string(),
    truthExamples: z.array(z.string()),
    examples: z.array(z.object({
        question: z.string(),
        answer,
        supplement: z.string(),
    }))
});

export const truthCoincidence = z.enum(["Covers", "Wrong","Insufficient"]);