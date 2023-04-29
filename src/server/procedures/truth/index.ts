import { openai } from "@/libs/openapi";
import { sampleStory } from "@/sample/story";
import { procedure } from "@/server/trpc";
import { z } from "zod";
import { cosineSimilarity } from "./math";

const getEmbedding = async (text: string): Promise<number[]> => {
    const embedding = await openai.createEmbedding({
        input: text,
        model: "text-embedding-ada-002"
    })
    return embedding.data.data[0].embedding
}

export const truth = procedure.input(z.object({
    storyId: z.string(),
    text: z.string(),
})).mutation(async ({input}) => {
    const [inputEmbedding,truthEmbedding] = await Promise.all([getEmbedding(input.text),getEmbedding(sampleStory.truth)])
    const similarity = cosineSimilarity(inputEmbedding,truthEmbedding);
    return similarity;
})