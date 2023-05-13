import { PrismaClient } from "@prisma/client";

export const getStories = (args: { count: number }) => {
    const prisma = new PrismaClient();
    return prisma.story.findMany({
        take: args.count,
        where: {
            published: true,
        },
        orderBy: {
            publishedAt: 'desc',
        }
    });
}

export const getStory = (args: { storyId: number }) => {
    const prisma = new PrismaClient();
    return prisma.story.findFirst({
        where: {
            id: args.storyId,
            published: true,
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
                    published: true,
                }
            ]
        },
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
        },
        orderBy: [
            {
              publishedAt: 'desc',
            },
            {
              createdAt: 'desc',
            },
        ],
    });
}