import { signIn } from "next-auth/react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";

export const RequireLogin: React.FC = () => {
    return <div className={styles.container}>
        <p>ログインが必要です。</p>
        <div>
            <button className={components.button} onClick={() => {
                signIn();
            }}>ログイン</button>
        </div>
        
    </div>
}