import { Chat } from '@/features/chat';
import { Header } from '@/features/header';
import { getSampleStory, sample1 } from '@/sample/story';
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
        quiz: story.mystery,
      }
    }
}

export default function Story(props: Props) {
    return <>
        <Header />
        <Chat {...props}/>
    </>
}