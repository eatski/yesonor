import { getSampleStory } from "@/sample/story";
import { procedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getEmbedding } from "./adapter";
import { THRESHOLD } from "./constants";
import { cosineSimilarity } from "./math";

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
    const [inputEmbedding, ...truthEmbeddings] = await Promise.all([getEmbedding(input.text), getEmbedding(story.truth), ...story.truthExamples.map(getEmbedding)])
    const mapped = truthEmbeddings.map(truthEmbedding => cosineSimilarity(inputEmbedding, truthEmbedding))
    console.log(mapped);
    return {
        result: mapped.some(s => s > THRESHOLD),
        input: input.text,
    };
})