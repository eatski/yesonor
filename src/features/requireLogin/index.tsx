"use client"
import { signIn } from "next-auth/react";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { gtag } from "@/common/util/gtag";

export const RequireLogin: React.FC<{

}> = () => {
    return <section className={styles.container}>
        <p>ログインをすると以下のことができるようになります。</p>
        <ul>
            <li>ストーリーの謎についてAIに質問</li>
            <li>自作のストーリーを投稿</li>
        </ul>
        <div>
            <button className={components.button} onClick={() => {
                gtag("click_login_recommend");
                signIn();
            }}>ログイン</button>
        </div>

    </section>
}