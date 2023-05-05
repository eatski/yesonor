import { sample1, sample2 } from "../src/sample/story";
import type { Story } from "../src/server/model/types";
import { PrismaClient, Answer } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function insertStory(story: Story) {
    const { questionExamples, ...rest } = story;
    const questionExamplesInput = questionExamples.map(qe => ({
        ...qe,
        answer: Answer[qe.answer]
    }));
    await prisma.story.create({
        data: {
            ...rest,
            questionExamples: {
                create: questionExamplesInput
            },
        },
    });
}

(async () => {
    await insertStory(sample1);
    await insertStory(sample2);
    await prisma.$disconnect();
    console.info("Done.");
})();


