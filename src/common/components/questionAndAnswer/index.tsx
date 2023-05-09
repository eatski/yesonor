import { AiFillRobot, AiOutlineComment } from "react-icons/ai"
import styles from "./styles.module.scss"

type Props = {
    question: string,
    answer: string | null,
}

export const QuestionAndAnswer: React.FC<Props> = (props) => {

    return <dl className={styles.container}>
    <div className={styles.content}>
        <div className={styles.row}>
            <dt><AiOutlineComment /></dt>
            <dd className={styles.question}>{props.question}</dd>
        </div>
        <hr />
        <div className={styles.row} data-loading={props.answer === null}>
            <dt><AiFillRobot /></dt>
            <dd>{props.answer === null ? "考え中..." : props.answer}</dd>
        </div>
    </div>
</dl>
}