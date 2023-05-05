import { openai } from "@/libs/openapi"
import { getSampleStory } from "@/sample/story"
import { TRPCError } from "@trpc/server"
import { readFile } from "fs/promises"
import { resolve } from "path"
import { z } from "zod"
import { answer } from "../../model/schemas"
import { procedure } from "../../trpc"
import { parseHeadToken } from "./parse"

const systemPromptPromise = readFile(resolve(process.cwd(),"prompts","question.md")) ;

export const question = procedure.input(z.object({
    storyId: z.string(),
    text: z.string()
})).mutation(async ({input}) => {
    const systemPrompt = await systemPromptPromise;
    const story = getSampleStory(input.storyId);
    if (!story) {
        throw new TRPCError({
            code: "NOT_FOUND"
        })
    }
    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: systemPrompt.toString()
            },
            {
                role: "assistant",
                content: story.quiz
            },
            {
                role: "assistant",
                content: story.truth
            },
            ...story.questionExamples.flatMap(({ question: question, answer: answer, supplement }) => {
                return [
                    {
                        role: "user",
                        content: question
                    },
                    {
                        role: "assistant",
                        content: answer + ": " + supplement
                    },
                ] as const
            }),
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
    return answer.parse(parseHeadToken(message.content))
})