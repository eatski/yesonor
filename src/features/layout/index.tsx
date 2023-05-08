import { texts } from "@/texts";
import { signIn,signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { AiOutlineUnorderedList as Menu } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";

export const Layout: React.FC<PropsWithChildren<{upper?: React.ReactElement}>> = ({children,upper}) => {
    const session = useSession();
    return <>
        <header className={styles.header}>
             <Link href="/">
                <h1>{texts.serviceName}</h1>
                <p>{texts.serviceDescription}</p>
            </Link>
            <div className={styles.right}>
                {
                    session.data?.user ? <button className={styles.iconWrapper} onClick={() => {
                        signOut();
                    }}>
                        <Menu className={components.iconButtonLink}/>
                    </button> : <button onClick={() => {
                        signIn();
                    }}>
                        ログイン
                    </button>
                }
            </div>
        </header>
        {
            upper && <div className={styles.upper}>
                <div className={styles.content}>
                    {upper}
                </div>
            </div>
        }
        <main className={styles.main}>
            {children}
        </main>
        <footer className={styles.footer}>
            <p>{texts.serviceName}</p>
            <div className={styles.footerLinks}>
                <Link href="/terms">利用規約</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
                <a href="https://github.com/eatski/yesonor/issues">報告</a>
                <a href="https://twitter.com/eatski629">問い合わせ</a>
            </div>
        </footer>
    </>
}