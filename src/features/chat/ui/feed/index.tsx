import styles from "./styles.module.scss";

export type FeedProps = {
    items: {
        id: string,
        question: string,
        answer: string
    }[]
}

export const Feed: React.FC<FeedProps> = (props) => {
    return <section>
        <ul className={styles.feed}>
            {props.items.map((item) => {
                return <li key={item.id} className={styles.feedItem}>
                    <div>
                        {item.question}
                    </div>
                    <div>
                        {item.answer}
                    </div>
                </li>
            })}
        </ul>
    </section>;
}