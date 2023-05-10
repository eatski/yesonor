import { H2 } from "@/common/components/h2";
import styles from "./styles.module.scss";

export type Story = {
    title: string,
    quiz: string,
    createdAt: number | null
}

export const StoryDescription: React.FC<Story> = ({title,quiz,createdAt}) => {
    return  <div className={styles.container}>
        <H2 label={title} />
        {
            createdAt && 
                <dl>
                    <div className={styles.basic}>
                        <dt>投稿日</dt>
                        <dd>{new Date(createdAt).toLocaleDateString()}</dd>
                    </div>
                </dl>
        }
        <p>{quiz}</p>
    </div>
}