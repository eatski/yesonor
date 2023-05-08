import { Play } from '@/features/play';
import { Layout } from '@/features/layout';
import { StoryDescription } from '@/features/storyDescription';
import { GetStaticPaths, GetStaticProps } from 'next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { Draft } from '@/features/draft';

type Story = {
    title: string,
    quiz: string,
    createdAt: number | null
    draft: boolean
}

type Props = {
    storyId: number;
    story: Story;
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
            notFound: true,
            revalidate: 1
        }
    }
    return {
      props: {
        storyId: validated.data.storyId,
        story: {
            title: story.title,
            quiz: story.quiz,
            createdAt: story.createdAt.getTime(),
            draft: story.draft
        }
      },
      revalidate: 1
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export default function StoryDraftPage(props: Props) {
    return <Layout upper={<Draft storyId={props.storyId} />}>
        <StoryDescription title={props.story.title} quiz={props.story.quiz} createdAt={null}/>
        <Play storyId={props.storyId} />
    </Layout>
}