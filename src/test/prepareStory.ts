import { parseYaml } from "@/features/storyYamlFileDrop/parseYaml";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

export const prepareStoryFromYaml = async (
	yamlPath: string,
	meta: {
		authorEmail: string;
		storyId: string;
		published: boolean;
	},
) => {
	const story = parseYaml(readFileSync(yamlPath, "utf-8"));
	if (story.error != null) {
		console.error(`Failed to parse ${yamlPath}`, story.error);
		throw new Error("Failed to parse yaml");
	}
	await prisma.story.deleteMany({
		where: {
			id: meta.storyId,
		},
	});
	const { questionExamples, ...rest } = story.data;
	await prisma.story.create({
		data: {
			...rest,
			id: meta.storyId,
			published: meta.published,
			authorEmail: meta.authorEmail,
			publishedAt: new Date(),
			questionExamples: JSON.stringify(questionExamples),
		},
	});
	return () => {
		return prisma.story.deleteMany({
			where: {
				id: meta.storyId,
			},
		});
	};
};
