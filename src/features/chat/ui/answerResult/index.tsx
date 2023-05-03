
import styles from "./styles.module.scss";

export type Props = {
    result: string,
    reasoning: string,
    truth: string | null
}

export const AnswerResult: React.FC<Props> = ({result,reasoning,truth}) => {
    return  <div className={styles.container}>
            <h3>{result}</h3>
            <dl>
                {
                    truth && <>
                        <dt>真相</dt>
                        <dd>{truth}</dd>
                    </>
                }
                <dt className={styles.small}>あなたの推理</dt>
                <dd className={styles.small}>{reasoning}</dd>
            </dl>
        </div>
}