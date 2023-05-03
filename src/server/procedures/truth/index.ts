import { openai } from "@/libs/openapi";
import { getSampleStory } from "@/sample/story";
import { truthCoincidence } from "@/server/model/schemas";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";

const systemPromptPromise = readFile(resolve(process.cwd(),"prompts","truth.md")) ;

export const truth = procedure.input(z.object({
    storyId: z.string(),
    text: z.string(),
})).mutation(async ({ input }) => {
    const story = getSampleStory(input.storyId);
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
                content: story.truthExamples[0]
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
    console.log(truthCoincidence)
    return {
        result: truthCoincidence.parse(message.content),
        input: input.text,
        truth: story.truth
    };
})