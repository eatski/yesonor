import React, { useState } from "react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss"
import { AiOutlineSend } from "react-icons/ai";


export const QuestionForm: React.FC<{
    onSubmit: (text: string) => void;
    isLoading: boolean;
}> = ({isLoading,onSubmit}) => {
    const [inputValue, setInputValue] = useState("");

    return (
        <form 
            className={styles.form} 
            onSubmit={(e) => {
                e.preventDefault();
                if(e.target instanceof HTMLFormElement && e.target.checkValidity()){
                    onSubmit(inputValue);
                    setInputValue(""); // reset form input after submission
                }
            }}
        >
            <label className={styles.formLabel}>質問をする</label>
            <div className={styles.formContent}>
                <input 
                    className={styles.formInput} 
                    required 
                    placeholder="はい or いいえ で答えられる質問" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className={components.button} type="submit" disabled={isLoading}>
                    <AiOutlineSend size={"16px"} />
                </button>
            </div>
        </form>
    );
}
