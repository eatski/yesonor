import { Chat } from '@/features/chat';
import { Header } from '@/features/header';
import { sampleStory } from '@/sample/story';
import { GetServerSideProps } from 'next';

type Props = {
    storyId: string;
    title: string;
    quiz: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const story = sampleStory;
    return {
      props: {
        storyId: "sample",
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