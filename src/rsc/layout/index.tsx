import { texts } from "@/texts";
import Link from "next/link";
import React, { PropsWithChildren, use } from "react";
import styles from "@/features/layout/styles.module.scss";
import components from "@/styles/components.module.scss";
import Image from "next/image";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Login } from "./login";
import { Menu } from "../menu";
import { useDevice } from "@/server/rsc/useDevice";

const Logo = () => {
    return <div className={styles.logo}><Image loading="eager" width={92} height={24} src={"/Yesonor.svg"} alt="Yesonor" /><span>beta版</span></div>
}

export const Layout: React.FC<PropsWithChildren<{ upper?: React.ReactElement }>> = ({ children, upper }) => {
    
    const device = useDevice();
    const session = use(getServerSession(authConfig));
    
    return <>
        <header className={styles.header}>
            <Link href="/">
                <h1>
                    <Logo />
                </h1>
                <p>{texts.serviceDescription}</p>
            </Link>
            <div className={styles.right}>
                {
                    device === "desktop" && session && <Link className={components.buttonBright} href={"/stories/new"}>ストーリーを投稿</Link>
                }
                {
                    session ? <Menu /> :
                        <div className={styles.loginButtonWrapper}>
                            <Login />
                        </div>
                }
            </div>
        </header>
        {
            upper ? <div className={styles.upper}>
                <div className={styles.content}>
                    {upper}
                </div>
            </div> : null
        }
        
        <main className={styles.main}>
            {children}
        </main>
        <footer className={styles.footer}>
            <Logo></Logo>
            <div className={styles.footerLinks}>
                <Link href="/terms">利用規約</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
                <Link href="/about">ベータ版について</Link>
                <a href="https://github.com/eatski/yesonor">開発</a>
            </div>
        </footer>
    </>
}