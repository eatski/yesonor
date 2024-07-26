import { Button } from "@/designSystem/components/button";
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
						<Button onClick={onBackButtonClicked} color="none" size="medium">
							戻る
						</Button>
					</div>
				}
			</Card>
		</div>
	);
};
