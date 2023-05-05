import { texts } from "@/texts";
import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
    return <>
        <header className={styles.header}>
            <h1>{texts.serviceName}</h1>
            <p>{texts.serviceDescription}</p>
        </header>
        <main className={styles.main}>
            {children}
        </main>
    </>
}