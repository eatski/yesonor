import { trpc } from '@/libs/trpc';
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
        quiz: story.quiz,
      }
    }
}

export default function Story(props: Props) {
    const {mutate,data,isLoading} = trpc.question.useMutation();
     return <main>
        <h1>{props.title}</h1>
        <p>{props.quiz}</p>
        <form onSubmit={(e) => {
            e.preventDefault();
            if(!(e.target instanceof HTMLFormElement)){
                return;
            }
            const questionInput = e.target.elements.namedItem("question");
            if(!(questionInput instanceof HTMLTextAreaElement)){
                return;
            }
            mutate({
                storyId: props.storyId,
                text: questionInput.value,
            })
        }}>
            <label>質問</label>
            <textarea name="question" />
            <button type="submit">送信</button>
        </form>
        {isLoading && <p>送信中</p>}
        {data && <p>{data}</p>}
     </main>
}