import { trpc } from "@/libs/trpc";
import { useRef, useState } from "react";
import { Feed } from "./ui/feed";
import styles from "./styles.module.css";
import { QuestionForm } from "./ui/questionForm";
import { AnswerForm } from "./ui/answerForm";

type Props = {
    storyId: string;
    title: string;
    quiz: string;
}

const AnswerFormContainer: React.FC<{storyId: string,onAnswered: (arg: {input: string,result: string}) => void}> = ({storyId,onAnswered}) => {
    const {mutate,isLoading} = trpc.truth.useMutation();
    return <AnswerForm isLoading={isLoading} onSubmit={(input) => {
        mutate({
            storyId,
            text: input
        },{
            onSuccess: (data) => {
                onAnswered({
                    input,
                    result: data.toString()
                })
            }
        })
    }}/>
}

const QuestionFormContainer: React.FC<{storyId: string,onAnswered: (arg: {input: string,result: string}) => void}> = ({storyId,onAnswered}) => {
    const {mutate,isLoading} = trpc.question.useMutation();
    return <QuestionForm isLoading={isLoading} onSubmit={(input) => {
        mutate({
            storyId,
            text: input
        },{
            onSuccess: (data) => {
                onAnswered({
                    input,
                    result: data.toString()
                })
            }
        })
    }}/>
}

export function Chat(props: Props) {
    const [history,setHistory] = useState<{id: number,input: string,result: string}[]>([])
     return <main className={styles.main}>
        <h2 className={styles.mainTitle}>{props.title}</h2>
        <p className={styles.problemStatement}>{props.quiz}</p>
        <div className={styles.feedWrapper}>
            <Feed items={history.map(({id,input,result}) => ({
                id: id.toString(),
                question: input,
                answer: result
            }))} />
        </div>
       
        <div className={styles.bottom}>
            <QuestionFormContainer storyId={props.storyId} onAnswered={(arg) => {
                setHistory((prev) => {
                    return [...prev,{
                        id: prev.length,
                        ...arg
                    }]
                })
            }} />
            <AnswerFormContainer storyId={props.storyId} onAnswered={(arg) => {
                setHistory((prev) => {
                    return [...prev,{
                        id: prev.length,
                        ...arg
                    }]
                })
            }} />
        </div>
       
     </main>
}