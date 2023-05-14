import { RequireLogin } from "../requireLogin";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { use } from "react";
import { useDevice } from "@/server/rsc/useDevice";


export const RecommendCreateStory = () => {
    const device = useDevice();
    if( device !== "desktop") {
        return null;
    }
    const session = use(getServerSession(authConfig));

    if(session === null) {
        return <section>
            <RequireLogin />
        </section>
    }

    return <section className={styles.container}>
        <h3>
            自作のストーリーを投稿しませんか？
        </h3>
        <Link href="/stories/new" className={components.button}>投稿する</Link>
    </section>
   
}