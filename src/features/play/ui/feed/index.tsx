import styles from "./styles.module.scss";

export type FeedProps = {
	items: {
		id: string;
		question: string;
		answer: string;
	}[];
};

export const Feed: React.FC<FeedProps> = (props) => {
	return (
		<section className={styles.feed}>
			<h3>今までの質問</h3>
			<ul>
				{props.items.map((item) => {
					return (
						<li key={item.id} className={styles.feedItem}>
							<div>{item.question}</div>
							<div>{item.answer}</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
};
