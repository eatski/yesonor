import { Layout } from '@/features/layout';
import { GetServerSideProps } from 'next';
import { z } from 'zod';
import { EditStoryYaml } from '@/features/editStory';
import { getStoryPrivate } from '@/server/services/story';
import { getUserInGetServerSideProps } from '@/server/session/getUserInGetServerSideProps';

type Story = {
    title: string,
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
            createdAt: story.createdAt.getTime(),
            draft: story.draft
        }
      },
    }
}

export default function StoryDraftPage(props: Props) {
    return <Layout>
        <EditStoryYaml title={props.story.title} storyId={props.storyId} />
    </Layout>
}