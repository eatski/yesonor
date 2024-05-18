import components from "@/designSystem/components.module.scss";
import { Card } from "@/designSystem/components/card";
import { DefinitionList } from "../definitionList";
import styles from "./styles.module.scss";

export type Props = {
	truth: string;
	onBackButtonClicked: () => void;
};

export const SeeTrurh: React.FC<Props> = ({ truth, onBackButtonClicked }) => {
	return (
		<div className={styles.container}>
			<Card variant={"success"}>
				<DefinitionList>
					<dt>真相</dt>
					<dd>{truth}</dd>
				</DefinitionList>
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
			</Card>
		</div>
	);
};
