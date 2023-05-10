import { PrismaClient } from "@prisma/client";

export const getStories = (args: { count: number }) => {
    const prisma = new PrismaClient();
    return prisma.story.findMany({
        take: args.count,
        where: {
            draft: false,
        }
    });
}

export const getStory = (args: { storyId: number }) => {
    const prisma = new PrismaClient();
    return prisma.story.findFirst({
        where: {
            id: args.storyId,
            draft: false,
        }
    });
}

export const getStoryDeepPrivate = (args: { storyId: number, autherEmail: string }) => {
    const prisma = new PrismaClient();
    return prisma.story.findFirst({
        where: {
            OR: [
                {
                    id: args.storyId,
                    authorEmail: args.autherEmail,
                },
                {
                    id: args.storyId,
                    draft: false,
                }
            ]
        },
        include: {
            questionExamples: true
        }
    });
}

export const getStoryPrivate = async (args: { storyId: number, autherEmail: string }) => {
    const prisma = new PrismaClient();
    return prisma.story.findFirst({
        where: {
            id: args.storyId,
            authorEmail: args.autherEmail,
        }
    });
}

export const getStoriesPrivate = async (args: { autherEmail: string }) => {
    const prisma = new PrismaClient();
    return prisma.story.findMany({
        where: {
            authorEmail: args.autherEmail,
        }
    });
}