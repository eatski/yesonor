import { Play } from '@/features/play';
import { Layout } from '@/features/layout';
import { Story, StoryDescription } from '@/features/storyDescription';
import { GetStaticPaths, GetStaticProps } from 'next';
import { z } from 'zod';
import { getStories, getStory } from '@/server/services/story';
import { useSession } from 'next-auth/react';
import { RequireLogin } from '@/features/requireLogin';

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

    const story = await getStory({
        storyId: validated.data.storyId
    })
    if(!story) {
        return {
            notFound: true,
            revalidate: 30
        }
    }
    return {
      props: {
        storyId: validated.data.storyId,
        story: {
            title: story.title,
            quiz: story.quiz,
            publishedAt: story.publishedAt?.getTime() ?? null,
        }
      },
      revalidate: 30
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const stories = await getStories({
        count: 20
    });
    return {
        paths: stories.map(({id}) => ({
            params: {
                storyId: id.toString()
            }
        })),
        fallback: "blocking"
    }
}

export default function Story(props: Props) {
    const session = useSession();
    return <Layout>
        <StoryDescription title={props.story.title} quiz={props.story.quiz} publishedAt={props.story.publishedAt}/>
        {session.status === "loading" ? null : session.status === "authenticated" ? <Play storyId={props.storyId} /> : <RequireLogin />}
    </Layout>
}