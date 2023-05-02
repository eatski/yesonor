import styles from "./styles.module.scss";

export type Props = {
    title: string,
    description: string
}

export const StoryTitle: React.FC<Props> = ({title,description}) => {
    return  <div className={styles.problemStatement}>
            <h2>
                {title}
            </h2>
            <p>
                {description}
            </p>
        </div>
}