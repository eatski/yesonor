import { Play } from '@/features/play';
import { Layout } from '@/features/layout';
import { StoryDescription } from '@/features/storyDescription';
import { GetStaticPaths, GetStaticProps } from 'next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

type Props = {
    storyId: number;
    title: string;
    quiz: string;
}

const querySchema = z.object({
    storyId: z.string().transform(e => parseInt(e)).refine(e => !Number.isNaN(e))
})

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
    const validated = querySchema.safeParse(params);
    if (!validated.success) {
        return {
            notFound: true
        }
    }

    const prisma = new PrismaClient();
    const story = await prisma.story.findFirst({
        where: {
            id: validated.data.storyId
        }
    })
    if(!story) {
        return {
            notFound: true
        }
    }
    return {
      props: {
        storyId: validated.data.storyId,
        title: story.title,
        quiz: story.quiz,
      },
      revalidate: 60
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const prisma = new PrismaClient();
    const stories = await prisma.story.findMany();
    return {
        paths: stories.map(({id}) => ({
            params: {
                storyId: id.toString()
            }
        })),
        fallback: false
    }
}

export default function Story(props: Props) {
    return <Layout>
        <StoryDescription title={props.title} description={props.quiz}/>
        <Play storyId={props.storyId} />
    </Layout>
}