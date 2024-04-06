import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { parseYaml } from "../src/common/util/parseYaml";
import { readFileSync } from "fs";
import { resolve } from "path";

dotenv.config();
const prisma = new PrismaClient();

const TEST_AUTHOR_ID = "test-author";

async function insertStory(name: string) {
	const story = parseYaml(
		readFileSync(resolve(process.cwd(), "fixtures", name), "utf-8"),
	);
	if (story.error != null) {
		console.error("Failed to parse sample1.yaml", story.error);
		return;
	}
	const { questionExamples, ...rest } = story.data;
	await prisma.story.create({
		data: {
			...rest,
			id: "test",
			published: true,
			authorId: TEST_AUTHOR_ID,
			publishedAt: new Date(),
			questionExamples: JSON.stringify(questionExamples),
		},
	});
}

const deleteAll = async () => {
	await prisma.story.deleteMany({
		where: {
			authorId: TEST_AUTHOR_ID,
		},
	});
};

(async () => {
	await deleteAll();
	await insertStory("test.yaml");
	await prisma.$disconnect();
	console.info("Done.");
})();
