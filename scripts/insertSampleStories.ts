import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import { parseYaml } from "../src/features/storyYamlFileDrop/parseYaml";
import { readFileSync } from "fs";
import { resolve } from "path";
import { generateId } from '@/common/util/id';
dotenv.config();

const prisma = new PrismaClient();

async function insertStory(name: string) {
    const story = parseYaml(readFileSync(resolve(process.cwd(), "samples",name), "utf-8"));
    if(story.error != null){
        console.error("Failed to parse sample1.yaml",story.error);
        return;
    }
    const { questionExamples, ...rest } = story.data;
    await prisma.story.create({
        data: {
            ...rest,
            id: generateId(),
            published: true,
            authorEmail: "yesonor@example.com",
            publishedAt: new Date(),
            questionExamples: JSON.stringify(questionExamples),
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


