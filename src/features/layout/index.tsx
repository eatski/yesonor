import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
    return <>
        <header className={styles.header}>
            <h1>Yesonor</h1>
            <p>AIと遊ぶ水平思考クイズ投稿サイト</p>
        </header>
        <main className={styles.main}>
            {children}
        </main>
    </>
}