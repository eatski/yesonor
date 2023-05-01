import { openai } from "@/libs/openapi";
import { sampleStory } from "@/sample/story";
import { procedure } from "@/server/trpc";
import { z } from "zod";
import { getEmbedding } from "./adapter";
import { cosineSimilarity } from "./math";

export const truth = procedure.input(z.object({
    storyId: z.string(),
    text: z.string(),
})).mutation(async ({input}) => {
    const [inputEmbedding,truthEmbedding] = await Promise.all([getEmbedding(input.text),getEmbedding(sampleStory.truth)])
    const similarity = cosineSimilarity(inputEmbedding,truthEmbedding);
    return similarity;
})