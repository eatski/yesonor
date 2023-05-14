import { trpc } from "@/libs/trpc";
import { useState } from "react";
import { Feed } from "./ui/feed";
import styles from "./styles.module.scss";
import { QuestionForm } from "./ui/questionForm";
import { AnswerForm } from "./ui/answerForm";
import { QuestionResult } from "./ui/questionResult";
import { AnswerResult } from "./ui/answerResult";
import { useQuestion } from "./useQuestion";
import { gtag } from "@/common/util/gtag";

type Props = {
    storyId: string;
}

const AnswerFormContainer: React.FC<{ storyId: string, onCancel: () => void }> = ({ storyId, onCancel }) => {
    const { mutate, isLoading, data, reset,isError } = trpc.truth.useMutation();
    return data ? <AnswerResult reasoning={data.input} onBackButtonClicked={reset} result={({
        Covers: "正解",
        Wrong: "間違いがあります",
        Insufficient: "説明が不十分です。",

    } as const satisfies Record<typeof data.result, string>)[data.result]} truth={data.truth} />
        : <AnswerForm isLoading={isLoading} onCancel={onCancel} isError={isError} onSubmit={(input) => {
            gtag("click_submit_answer");
            mutate({
                storyId,
                text: input
            })
        }} />
}

export function Play(props: Props) {
    const question = useQuestion(props.storyId);
    const [isAnswerMode, setIsAnswerMode] = useState(false);
    return <>
     {
            !isAnswerMode && <div className={styles.sectionWrapper}>
                <QuestionForm onSubmit={question.onSubmit} isLoading={question.isLoading} />
            </div>
        }
        {
            !isAnswerMode && question.latest &&
            <div className={styles.sectionWrapper}>
                <QuestionResult
                    question={question.latest.input}
                    answer={question.latest.result}
                    onAnswerButtonClicked={() => {
                        setIsAnswerMode(true);
                    }}
                />
            </div>
        }
       
        {
            isAnswerMode &&
            <div className={styles.sectionWrapper}>
                <AnswerFormContainer
                    storyId={props.storyId}
                    onCancel={() => {
                        setIsAnswerMode(false);
                    }}
                />
            </div>
        }
        
        {
            question.history.length > 0 && <div className={styles.sectionWrapper}>
                <Feed items={question.history.map(({ id, input, result }) => ({
                    id: id.toString(),
                    question: input,
                    answer: result
                }))} />
            </div>
        }
    </>
}