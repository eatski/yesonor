import { InformationParagragh } from "@/designSystem/components/information";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";

export type Props = {
	title: string | null;
	solution: string | null;
	truth: string | null;
	distance: string | null;
	onBackButtonClicked: () => void;
	information: React.ReactNode | null;
};

export const AnswerResult: React.FC<Props> = ({
	title,
	solution,
	truth,
	onBackButtonClicked,
	distance,
	information,
}) => {
	return (
		<div className={styles.container} data-truth={truth !== null}>
			{title && <h2>{title}</h2>}
			{distance && <p>惜しい度: {distance}</p>}
			{information && (
				<InformationParagragh size="small">{information}</InformationParagragh>
			)}
			<dl>
				{truth && (
					<>
						<dt>真相</dt>
						<dd>{truth}</dd>
					</>
				)}
				{solution && (
					<>
						<dt>あなたの推理</dt>
						<dd>{solution}</dd>
					</>
				)}
			</dl>
			{
				<div className={styles.buttonContainer}>
					<button
						type={"button"}
						onClick={onBackButtonClicked}
						className={components.buttonLink}
					>
						戻る
					</button>
				</div>
			}
		</div>
	);
};
