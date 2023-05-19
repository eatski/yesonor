import { openai } from "@/libs/openapi";
import { truthCoincidence } from "@/server/model/schemas";
import { verifyRecaptcha } from "@/server/services/recaptcha";
import { getStory, getStoryPrivate } from "@/server/services/story";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { z } from "zod";

const systemPromptPromise = readFile(resolve(process.cwd(),"prompts","truth.md")) ;

export const truth = procedure.input(z.object({
    storyId: z.string(),
    text: z.string(),
    recaptchaToken: z.string()
})).mutation(async ({ input,ctx }) => {
    const verifyPromise = verifyRecaptcha(input.recaptchaToken).catch(e => {
        throw new TRPCError({
            code: "BAD_REQUEST",
            cause: e
        })
    });
    const user = await ctx.getUserOptional();
    const story = user ? 
        await getStoryPrivate({
            storyId: input.storyId,
            autherEmail: user.email
        }) : 
        await getStory({
            storyId: input.storyId
        })
    if (!story) {
        throw new TRPCError({
            code: "NOT_FOUND"
        })
    }
    await verifyPromise;
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