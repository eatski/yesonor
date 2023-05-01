import React, {useRef} from "react";
import styles from "./styles.module.css";

export const AnswerForm: React.FC<{
    onSubmit: (text: string) => void;
    isLoading: boolean;
}> = ({isLoading,onSubmit}) => {
    const inputRef = useRef<string>("");
    return <form className={styles.form} onSubmit={
        (e) => {
            e.preventDefault();
            onSubmit(inputRef.current);
        }
    }>
        <label className={styles.formLabel}>回答</label>
        <textarea className={styles.formTextarea} onChange={(e) => {
            inputRef.current = e.target.value
        }}
        />
        <button className={styles.formSubmit} type="submit" disabled={isLoading}>送信</button>
    </form>
}
