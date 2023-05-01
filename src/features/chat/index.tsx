import { trpc } from "@/libs/trpc";
import { useRef, useState } from "react";
import { Feed } from "./ui/feed";
import styles from "./styles.module.css";
import { QuestionForm } from "./ui/questionForm";
import { AnswerForm } from "./ui/answerForm";
import { Answer } from "@/server/model/types";
import { QuestionResult } from "./ui/questionResult";

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

const QuestionFormContainer: React.FC<{storyId: string,onAnswered: (arg: {input: string,result: Answer}) => void}> = ({storyId,onAnswered}) => {
    const {mutate,isLoading} = trpc.question.useMutation();
    return <QuestionForm isLoading={isLoading} onSubmit={(input) => {
        mutate({
            storyId,
            text: input
        },{
            onSuccess: (data) => {
                onAnswered({
                    input,
                    result: data
                })
            }
        })
    }}/>
}

export function Chat(props: Props) {
    const [history,setHistory] = useState<{id: number,input: string,result: string}[]>([]);
    const latest = history.at(-1);
     return <main className={styles.main}>
        <h2 className={styles.mainTitle}>{props.title}</h2>
        <p className={styles.problemStatement}>{props.quiz}</p>
        <div className={styles.questionResultContainer}>
        {
            latest && <QuestionResult question={latest.input} answer={latest.result} />
        }
        </div>

       
        <div className={styles.questionFormContainer}>
            <QuestionFormContainer storyId={props.storyId} onAnswered={(arg) => {
                setHistory((prev) => {
                    return [...prev,{
                        id: prev.length,
                        input: arg.input,
                        result: ({
                            "FALSE": "いいえ",
                            "TRUE": "はい",
                            "UNKNOWN": "わからない",
                            "INVALID": "不正な質問"
                        } as const satisfies Record<Answer,string>)[arg.result],
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
        {
            history.length > 0 && <div className={styles.feedWrapper}>
            <Feed items={history.map(({id,input,result}) => ({
                id: id.toString(),
                question: input,
                answer: result
            }))} />
        </div>
        }
        
     </main>
}