import React, {useRef} from "react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss"

export const AnswerForm: React.FC<{
    onSubmit: (text: string) => void;
    onCancel: () => void;
    isLoading: boolean;
    isError: boolean;
}> = ({isLoading,onSubmit,onCancel,isError}) => {
    const inputRef = useRef<string>("");
    return <form className={styles.form} onSubmit={
        (e) => {
            e.preventDefault();
            if(e.target instanceof HTMLFormElement && e.target.checkValidity()){
                onSubmit(inputRef.current);
            }
        }
    }>
        <label className={styles.formLabel}>あなたの推理</label>
        <textarea required className={styles.formTextarea} onChange={(e) => {
            inputRef.current = e.target.value
        }}
        />
        <div className={styles.buttonContainer}>
            <button className={components.buttonSecondary} type="button" onClick={onCancel} disabled={isLoading}>まだわからない</button>
            <button className={components.button} type="submit" disabled={isLoading}>回答する</button>
        </div>
        {
            isError && <p className={styles.error}>エラーが発生しました。</p>
        }
    </form>
}
