import { Play } from '@/features/play';
import { Layout } from '@/features/layout';
import { StoryDescription } from '@/features/storyDescription';
import { getSampleStory } from '@/sample/story';
import { GetServerSideProps } from 'next';
import { z } from 'zod';

type Props = {
    storyId: string;
    title: string;
    quiz: string;
}

const querySchema = z.object({
    storyId: z.string()
})

export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const validated = querySchema.safeParse(query);
    if (!validated.success) {
        return {
            notFound: true
        }
    }
    const story = getSampleStory(validated.data.storyId);
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
      }
    }
}

export default function Story(props: Props) {
    return <Layout>
        <StoryDescription title={props.title} description={props.quiz}/>
        <Play storyId={props.storyId} />
    </Layout>
}