import styles from "./styles.module.scss";
import button from "@/styles/components.module.scss"
import { AiFillRobot, AiOutlineComment, AiOutlineQuestion } from "react-icons/ai";

export type Props = {
    question: string,
    answer: string | null,
    onAnswerButtonClicked: () => void
}

export const QuestionResult: React.FC<Props> = (props) => {
    return <section>
        <dl className={styles.container}>
            <div className={styles.content}>
                <div className={styles.row}>
                    <dt><AiOutlineComment /></dt>
                    <dd className={styles.question}>{props.question}</dd>
                </div>
                <hr />
                <div className={styles.row}>
                    <dt><AiFillRobot /></dt>
                    <dd className={props.answer ? styles.answer : styles.answerLoading}>{props.answer || "考え中..."}</dd>
                </div>
            </div>
            
        </dl>
        <div className={styles.buttonContainer}>
            <button className={button.button} onClick={props.onAnswerButtonClicked}>
                謎は解けましたか？
            </button>
        </div>
    </section>
}