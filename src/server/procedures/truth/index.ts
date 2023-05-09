import { openai } from "@/libs/openapi";
import { truthCoincidence } from "@/server/model/schemas";
import { getStory } from "@/server/services/story";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";

const systemPromptPromise = readFile(resolve(process.cwd(),"prompts","truth.md")) ;

export const truth = procedure.input(z.object({
    storyId: z.number(),
    text: z.string(),
})).mutation(async ({ input }) => {
    const story = await getStory({
        storyId: input.storyId,
    })
    if (!story) {
        throw new TRPCError({
            code: "NOT_FOUND"
        })
    }

    const systemPrompt = await systemPromptPromise;

    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: systemPrompt.toString()
            },
            {
                role: "assistant",
                content: story.simpleTruth
            },
            {
                role: "user",
                content: input.text
            }
        ],
        temperature: 0,
        max_tokens: 10,
    })
    
    const message = response.data.choices[0].message
    if (!message) {
        throw new Error("No message")
    }
    const result = truthCoincidence.parse(message.content);
    return {
        result,
        input: input.text,
        truth: result === "Covers" ? story.truth : null
    };
})