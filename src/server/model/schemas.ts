import { z } from "zod";

export const answer = z.enum(["TRUE", "FALSE","UNKNOWN","INVALID"]);

export const story = z.object({
    title: z.string(),
    description: z.string(),
    quiz: z.string(),
    truth: z.string(),
    simpleTruth: z.string(),
    questionExamples: z.array(z.object({
        question: z.string(),
        answer,
        supplement: z.string(),
    })),
    createdAt: z.date(),
});

export const truthCoincidence = z.enum(["Covers", "Wrong","Insufficient"]);