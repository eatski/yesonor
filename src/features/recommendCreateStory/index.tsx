import { useDevice } from "@/common/hooks/useDevice";
import { useSession } from "next-auth/react";
import { RequireLogin } from "../requireLogin";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import Link from "next/link";


export const RecommendCreateStory: React.FC = () => {
    const session = useSession();
    const device = useDevice();
    if(
        session.status === "loading" || 
        device !== "desktop") {
        return null;
    }

    if(session.status === "unauthenticated") {
        return <section>
            <RequireLogin />
        </section>
    }

    return <section className={styles.container}>
        <h3>
            あなたの謎を投稿しませんか？
        </h3>
        <Link href="/stories/new" className={components.button}>投稿する</Link>
    </section>
   
}