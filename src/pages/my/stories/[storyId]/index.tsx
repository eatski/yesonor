import { Play } from '@/features/play';
import { Layout } from '@/features/layout';
import { StoryDescription } from '@/features/storyDescription';
import { GetServerSideProps } from 'next';
import { z } from 'zod';
import { MyStoryMenu } from '@/features/myStoryMenu';
import { getStoryPrivate } from '@/server/services/story';
import { getUserInGetServerSideProps } from '@/server/session/getUserInGetServerSideProps';

type Story = {
    title: string,
    quiz: string,
    published: boolean,
    publishedAt: number | null
}

type Props = {
    storyId: number;
    story: Story;
}

const querySchema = z.object({
    storyId: z.string().transform(e => parseInt(e)).refine(e => !Number.isNaN(e))
})

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const validated = querySchema.safeParse(context.params);
    if (!validated.success) {
        return {
            notFound: true
        }
    }
    const user = await getUserInGetServerSideProps(context);
    if(!user) {
        return {
            notFound: true
        }
    }
    const story = await getStoryPrivate({
        storyId: validated.data.storyId,
        autherEmail: user.email
    })
    if(!story) {
        return {
            notFound: true,
        }
    }
    return {
      props: {
        storyId: validated.data.storyId,
        story: {
            title: story.title,
            quiz: story.quiz,
            publishedAt: story.publishedAt?.getTime() ?? null,
            published: story.published
        }
      },
    }
}

export default function StoryDraftPage(props: Props) {
    return <Layout upper={<MyStoryMenu storyId={props.storyId} published={props.story.published}/>}>
        <StoryDescription title={props.story.title} quiz={props.story.quiz} publishedAt={props.story.publishedAt}/>
        <Play storyId={props.storyId} />
    </Layout>
}