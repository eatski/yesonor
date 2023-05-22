import { HTMLProps } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss"

export type Props = {
    index: number;
    questionInput: HTMLProps<HTMLInputElement>;
    questionError: string | null;
    answerInput: HTMLProps<HTMLSelectElement>;
    supplementInput: HTMLProps<HTMLInputElement>;
    supplementError: string | null;
    onClickRemove: () => void;
}

export const QuestionExampleForm = ({
    index,
    questionInput,
    questionError,
    answerInput,
    supplementInput,
    supplementError,
    onClickRemove
}: Props) => {
    return <div key={index} className={styles.container}>
        <div className={styles.head}>
            Q{index + 1}
            {index > 0 ? <button type="button" onClick={onClickRemove}>
                <AiOutlineMinusCircle className={components.iconButtonDanger} />
            </button> : null}
        </div>
        <div className={styles.field}>
            <label>
                質問
                <input
                    {...questionInput}
                    placeholder='例: 太郎さんは男ですか？'
                    className={components.input}
                />
                {questionError && <p className={components.formErrorMessage}>{questionError}</p>}
            </label>
        </div>
        <div className={styles.field}>
            <label>
                回答
                <div className={components.selectWrapper}>
                    <select
                        {...answerInput}
                    >
                        <option value="True">はい</option>
                        <option value="False">いいえ</option>
                        <option value="Unknown">わからない（言及されてない・真相には関係ない）</option>
                    </select>
                </div>
            </label>
        </div>
        <div className={styles.field}>
            <label>
                補足説明
                <input
                    {...supplementInput}
                    placeholder='例: 太郎さんの性別については言及されていません。'
                    className={components.input}
                />
                {supplementError && <p className={components.formErrorMessage}>{supplementError}</p>}
            </label>
        </div>
    </div>
}