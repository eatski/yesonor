import { trpc } from '@/libs/trpc';
import { sampleStory } from '@/sample/story';
import { GetServerSideProps } from 'next';
import { useRef, useState } from 'react';

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



const TruthForm: React.FC<{storyId: string,onAnswered: (arg: {input: string,result: string}) => void}> = ({storyId,onAnswered}) => {
    const {mutate,isLoading} = trpc.truth.useMutation();
    const inputRef = useRef<string>("");
    return <form onSubmit={(e) => {
        e.preventDefault();
        mutate({
            storyId,
            text: inputRef.current
        },{
            onSuccess: (data) => {
                onAnswered({
                    input: inputRef.current,
                    result: data.toString()
                })
            }
        })
    }}>
        <label>回答欄</label>
        <textarea onChange={(e) => {
            inputRef.current = e.target.value
        }}/>
        <button type="submit" disabled={isLoading}>送信</button>
    </form>
}

const QuestionForm: React.FC<{storyId: string,onAnswered: (arg: {input: string,result: string}) => void}> = ({storyId,onAnswered}) => {
    const {mutate,isLoading} = trpc.question.useMutation();
    const inputRef = useRef<string>("");
    return <form onSubmit={(e) => {
        e.preventDefault();
        mutate({
            storyId,
            text: inputRef.current
        },{
            onSuccess: (data) => {
                onAnswered({
                    input: inputRef.current,
                    result: data.toString()
                })
            }
        })
    }}>
        <label>質問</label>
        <textarea onChange={(e) => {
            inputRef.current = e.target.value
        }}
        />
        <button type="submit" disabled={isLoading}>送信</button>
    </form>
}

export default function Story(props: Props) {
    const [history,setHistory] = useState<{input: string,result: string}[]>([])
     return <main>
        <h1>{props.title}</h1>
        <p>{props.quiz}</p>
        <QuestionForm storyId={props.storyId} onAnswered={(arg) => {
            setHistory((prev) => {
                return [...prev,arg]
            })
        }} />
        <TruthForm storyId={props.storyId} onAnswered={(arg) => {
            setHistory((prev) => {
                return [...prev,arg]
            })
        }} />
        <ul>
            {
                history.map((item) => {
                    // eslint-disable-next-line react/jsx-key
                    return <li>
                        <p>{item.input}</p>
                        <p>{item.result}</p>
                    </li>
                })
            }
        </ul>
     </main>
}