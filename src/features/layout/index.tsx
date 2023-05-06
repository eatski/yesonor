import { texts } from "@/texts";
import Link from "next/link";
import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
    return <>
        <header className={styles.header}>
            <Link href="/">
                <h1>{texts.serviceName}</h1>
                <p>{texts.serviceDescription}</p>
            </Link>
        </header>
        <main className={styles.main}>
            {children}
        </main>
        <footer className={styles.footer}>
            <p>{texts.serviceName}</p>
            <div className={styles.footerLinks}>
                <a href="https://github.com/eatski/yesonor/blob/main/docs/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84.md">利用規約</a>
                <a href="https://github.com/eatski/yesonor/blob/main/docs/%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC.md>">プライバシーポリシー</a>
                <a href="https://github.com/eatski/yesonor/issues">報告</a>
                <a href="https://twitter.com/eatski629">問い合わせ</a>
            </div>
        </footer>
    </>
}