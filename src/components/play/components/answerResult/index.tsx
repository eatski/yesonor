import { InformationParagragh } from "@/designSystem/components/information";
import styles from "./styles.module.scss";
import components from "@/designSystem/components.module.scss";
import { Card } from "@/designSystem/components/card";
import { DefinitionList } from "../definitionList";
import { AiOutlineLike } from "react-icons/ai";
import { Button, ButtonIconWrapper } from "@/designSystem/components/button";
import { gtagEvent } from "@/common/util/gtag";

export type Props = {
	solution: string;
	isCorrect: boolean;
	truth: string;
	distance: number;
	onBackButtonClicked: () => void;
	onSeeTruthButtonClicked: () => void;
};

type DistanceLevel = "almost" | "close" | "not-bad" | "way-off";

/**
 * 大体0.25あたりが正解であり0.6はかなり遠いためそれを基準に0.25~0.6を0.99~0に変換する。
 * 外れ値はそれぞれ0.99, 0にする。
 *
 * ~0.30 -> 0.99
 * 0.30~0.6 -> 0.99~0
 * 0.6~ -> 0
 *
 * @param distance 0.0 ~ 1.0
 */
const calcDisplayDistanceLebel = (distance: number): DistanceLevel => {
	if (distance <= 0.3) {
		return "almost";
	} else if (distance > 0.3 && distance <= 0.45) {
		return "close";
	} else if (distance > 0.45 && distance <= 0.6) {
		return "not-bad";
	} else {
		return "way-off";
	}
};

const levelToText: Record<DistanceLevel, string> = {
	almost: "99%",
	close: "75%",
	"not-bad": "50%",
	"way-off": "25%",
};
export const AnswerResult: React.FC<Props> = ({
	solution,
	truth,
	distance,
	isCorrect,
	onBackButtonClicked,
	onSeeTruthButtonClicked,
}) => {
	const distanceLevel = calcDisplayDistanceLebel(distance);
	return (
		<div className={styles.container}>
			<Card variant={isCorrect ? "success" : undefined}>
				<h2>{isCorrect ? "正解" : "間違いがあります"}</h2>
				{isCorrect || (
					<p>
						惜しい度: <>{levelToText[distanceLevel]}</>
					</p>
				)}
				{!isCorrect && distanceLevel === "almost" && (
					<InformationParagragh size="small">
						{
							<div className={styles.infoBody}>
								この判定に疑問がある場合、些細な点で不正解と捉えられている可能性があります。例えば、登場人物の敬称（さん・君など）を正確に入力してみるなどで結果が変わるかもしれません。
							</div>
						}
					</InformationParagragh>
				)}
				<DefinitionList>
					{isCorrect && (
						<>
							<dt>真相</dt>
							<dd>{truth}</dd>
						</>
					)}
					<dt>あなたの推理</dt>
					<dd>{solution}</dd>
				</DefinitionList>
				{
					<div className={styles.buttonContainer}>
						{isCorrect && (
							<Button
								type={"button"}
								onClick={() => {
									gtagEvent("like_story");
									window.alert("いいねしました！");
								}}
								color="none"
							>
								<ButtonIconWrapper>
									<AiOutlineLike />
								</ButtonIconWrapper>
								いいねする
							</Button>
						)}
						{!isCorrect && (
							<button
								type={"button"}
								onClick={onBackButtonClicked}
								className={components.buttonLink}
							>
								戻る
							</button>
						)}
						{!isCorrect && distanceLevel === "almost" && (
							<button
								type={"button"}
								onClick={onSeeTruthButtonClicked}
								className={components.button2}
							>
								真相を見る
							</button>
						)}
					</div>
				}
			</Card>
		</div>
	);
};
