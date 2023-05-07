import styles from "./styles.module.scss";

export type Story = {
    title: string,
    quiz: string,
    createdAt: number | null
}

export const StoryDescription: React.FC<Story> = ({title,quiz,createdAt}) => {
    return  <div className={styles.container}>
        <h2>
            {title}
        </h2>
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