
import styles from "./styles.module.scss";
import components from "@/styles/components.module.css"

export type Props = {
    result: string,
    reasoning: string,
    truth: string | null,
    onBackButtonClicked: () => void
}

export const AnswerResult: React.FC<Props> = ({result,reasoning,truth,onBackButtonClicked}) => {
    return  <div className={styles.container}>
            <h3>{result}</h3>
            <dl>
                {
                    truth && <>
                        <dt>真相</dt>
                        <dd>{truth}</dd>
                    </>
                }
                <dt>あなたの推理</dt>
                <dd>{reasoning}</dd>
            </dl>
            {<div className={styles.buttonContainer}>
                <button type={"button"} onClick={onBackButtonClicked} className={components.button}>
                    戻る
                </button>
            </div>
            }
        </div>
}