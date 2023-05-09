import { PrismaClient, Answer } from '@prisma/client';
import dotenv from "dotenv";
import { parseYaml } from "../src/features/storyYamlFileDrop/parseYaml";
import { readFileSync } from "fs";
import { resolve } from "path";
dotenv.config();

const prisma = new PrismaClient();

async function insertStory(name: string) {
    const story = parseYaml(readFileSync(resolve(process.cwd(), "samples",name), "utf-8"));
    if(!story.success){
        console.error("Failed to parse sample1.yaml",story.error);
        return;
    }
    const { questionExamples, ...rest } = story.data;
    const questionExamplesInput = questionExamples.map(qe => ({
        ...qe,
        answer: Answer[qe.answer],

    }));
    await prisma.story.create({
        data: {
            ...rest,
            draft: false,
            authorEmail: "yesonor@example.com",
            questionExamples: {
                create: questionExamplesInput
            },
        },
    });
}

(async () => {
    await insertStory("sample1.yaml");
    await insertStory("sample2.yaml");
    await insertStory("sample3.yaml");
    await prisma.$disconnect();
    console.info("Done.");
})();


