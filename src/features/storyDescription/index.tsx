import styles from "./styles.module.scss";

export type Story = {
    title: string,
    quiz: string,
    createdAt: number
}

export const StoryDescription: React.FC<Story> = ({title,quiz,createdAt}) => {
    return  <div className={styles.container}>
        <h2>
            {title}
        </h2>
        <dl>
            <div className={styles.basic}>
                <dt>投稿日</dt>
                <dd>{new Date(createdAt).toLocaleDateString()}</dd>
            </div>
            <div className={styles.content}>
                <dt>問題</dt>
                <dd>{quiz}</dd>
            </div>
            
        </dl>
    </div>
}