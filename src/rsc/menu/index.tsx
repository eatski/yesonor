"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/features/layout/styles.module.scss";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { AiOutlineUnorderedList as MenuIcon } from "react-icons/ai";
import components from "@/styles/components.module.scss";

export const Menu = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
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
        <button aria-label="メニュー" className={styles.iconWrapper} onClick={() => {
                        setMenuOpen((flg) => !flg);
         }}>
            <MenuIcon className={components.iconButtonLink} />
         </button>
        {
            menuOpen && <div className={styles.menu} ref={ref}>
                <Link href={"/my/stories"}>自分のストーリー</Link>
                <Link href={"/my/settings"}>設定</Link>
                <hr />
                <button className={styles.danger} onClick={() => { signOut(); }}>ログアウト</button>
            </div>
        }
    </>
}