import { texts } from "@/texts";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { AiOutlineUnorderedList as Menu } from "react-icons/ai";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { useRouter } from "next/router";
import { Device, getDevice } from "@/common/util/device";

export const Layout: React.FC<PropsWithChildren<{ upper?: React.ReactElement }>> = ({ children, upper }) => {
    const session = useSession();
    const [device,setDevice] = useState<Device | null>(null)
    useEffect(() => {
        setDevice(getDevice(window.navigator.userAgent))
    },[])
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const [loading,setLoading] = useState(false)


    useEffect(() => {
        const onStart = () => {
            setLoading(true)
        }
        const onEnd = () => {
            setLoading(false)
        }
        router.events.on("routeChangeStart", onStart)
        router.events.on("routeChangeComplete",onEnd)
        router.events.on("routeChangeError",onEnd)
        return () => {
            router.events.off("routeChangeStart",onStart)
            router.events.off("routeChangeComplete",onEnd)
            router.events.off("routeChangeError",onEnd)
        }
    },[router])

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement) {
                if (ref.current?.contains(e.target)) {
                    return;
                }
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", listener);
        return () => {
            document.removeEventListener("click", listener);
        };
    }, [menuOpen])
    return <>
        <header className={styles.header}>
            <Link href="/">
                <h1>{texts.serviceName}</h1>
                <p>{texts.serviceDescription}</p>
            </Link>
            <div className={styles.right}>
                {
                    session.status !== "loading" ? session.data?.user ? <button className={styles.iconWrapper} onClick={() => {
                        setMenuOpen((flg) => !flg);
                    }}>
                        <Menu className={components.iconButtonLink} />
                    </button> :
                        <div className={styles.loginButtonWrapper}>
                            <button className={components.buttonPure} onClick={() => {
                                signIn();
                            }}>
                                ログイン
                            </button>
                        </div> : null
                }
            </div>
        </header>
        {loading && <div className={styles.transitionStatus} />}
        {
            menuOpen && <div className={styles.menu} ref={ref}>
                {device === "desktop" && <Link href={"/stories/new"}>ストーリーを作成</Link>}
                <Link href={"/my/stories"}>自分のストーリー</Link>
                <Link href={"/my/settings"}>設定</Link>
                <hr />
                <button className={styles.danger} onClick={() => { signOut(); }}>ログアウト</button>
            </div>
        }
        {
            upper ? <div className={styles.upper}>
                <div className={styles.content}>
                    {upper}
                </div>
            </div> : process.env.NODE_ENV === "production" && <p className={styles.alert}>
                このWebサイトは開発中です。
            </p>
        }
        
        <main className={styles.main}>
            
            {children}
        </main>
        <footer className={styles.footer}>
            <p>{texts.serviceName}</p>
            <div className={styles.footerLinks}>
                <Link href="/terms">利用規約</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
                <Link href="/about">このサイトについて</Link>
                <a href="https://github.com/eatski/yesonor">開発</a>
            </div>
        </footer>
    </>
}