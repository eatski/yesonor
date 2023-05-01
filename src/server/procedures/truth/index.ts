import { sampleStory } from "@/sample/story";
import { procedure } from "@/server/trpc";
import { z } from "zod";
import { getEmbedding } from "./adapter";
import { THRESHOLD } from "./constants";
import { cosineSimilarity } from "./math";

export const truth = procedure.input(z.object({
    storyId: z.string(),
    text: z.string(),
})).mutation(async ({ input }) => {
    const [inputEmbedding, ...truthEmbeddings] = await Promise.all([getEmbedding(input.text), getEmbedding(sampleStory.truth), ...sampleStory.truthExamples.map(getEmbedding)])
    return truthEmbeddings.some(truthEmbedding => cosineSimilarity(inputEmbedding, truthEmbedding) > THRESHOLD);
})