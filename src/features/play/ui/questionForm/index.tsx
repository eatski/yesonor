import React, {useRef} from "react";
import styles from "./styles.module.css";
import button from "@/styles/components.module.css"

export const QuestionForm: React.FC<{
    onSubmit: (text: string) => void;
    isLoading: boolean;
}> = ({isLoading,onSubmit}) => {
    const inputRef = useRef<string>("");
    return <form className={styles.form} onSubmit={
        (e) => {
            e.preventDefault();
            if(e.target instanceof HTMLFormElement && e.target.checkValidity()){
                onSubmit(inputRef.current);
            }
        }
    }>
        <label className={styles.formLabel}>質問をする</label>
        <div className={styles.formContent}>
            <input className={styles.formInput} required placeholder="はい or いいえ で答えられる質問" onChange={(e) => {
                inputRef.current = e.target.value
            }}
             />
            <button className={button.button} type="submit" disabled={isLoading}>送信</button>
        </div>
    </form>
}