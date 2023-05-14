import { useDevice } from "@/common/hooks/useDevice";
import { useSession } from "next-auth/react";
import { RequireLogin } from "../requireLogin";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import Link from "next/link";
import { gtag } from "@/common/util/gtag";


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
            自作のストーリーを投稿しませんか？
        </h3>
        <Link onClick={() => {
            gtag("click_recommend_create_story");
        }} href="/stories/new" className={components.button}>投稿する</Link>
    </section>
   
}