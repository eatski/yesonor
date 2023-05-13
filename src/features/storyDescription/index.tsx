import { H2 } from "@/common/components/h2";
import styles from "./styles.module.scss";
import dayjs from "dayjs";

export type Story = {
    title: string,
    quiz: string,
    publishedAt: number | null
}
dayjs.locale('ja');

export const StoryDescription: React.FC<Story> = ({title,quiz,publishedAt}) => {
    return  <div className={styles.container}>
        <H2 label={title} />
        {
            publishedAt && 
                <dl>
                    <div className={styles.basic}>
                        <dt>投稿日</dt>
                        <dd>{dayjs(publishedAt).format("YYYY/MM/DD")}</dd>
                    </div>
                </dl>
        }
        <p>{quiz}</p>
    </div>
}