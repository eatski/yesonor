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
    </>
}