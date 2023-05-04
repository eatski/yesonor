import styles from "./styles.module.scss";

export type Props = {
    title: string,
    description: string
}

export const StoryDescription: React.FC<Props> = ({title,description}) => {
    return  <div className={styles.container}>
        <h2>
            {title}
        </h2>
        <dl>
            <div className={styles.basic}>
                <dt>投稿日</dt>
                <dd>2021/01/01</dd>
            </div>
            <div className={styles.content}>
                <dt>問題</dt>
                <dd>{description}</dd>
            </div>
            
        </dl>
    </div>
}