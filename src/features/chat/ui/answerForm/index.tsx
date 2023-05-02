import React, {useRef} from "react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.css"

export const AnswerForm: React.FC<{
    onSubmit: (text: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}> = ({isLoading,onSubmit,onCancel}) => {
    const inputRef = useRef<string>("");
    return <form className={styles.form} onSubmit={
        (e) => {
            e.preventDefault();
            onSubmit(inputRef.current);
        }
    }>
        <label className={styles.formLabel}>あなたの推理を聞かせて！</label>
        <textarea className={styles.formTextarea} onChange={(e) => {
            inputRef.current = e.target.value
        }}
        />
        <div className={styles.buttonContainer}>
            <button className={components.buttonSecondary} type="button" onClick={onCancel} disabled={isLoading}>やっぱりわからない</button>
            <button className={components.button} type="submit" disabled={isLoading}>回答</button>
        </div>
    </form>
}
