import { trpc } from "@/libs/trpc";
import { useState } from "react";
import { Feed } from "./components/feed";
import styles from "./styles.module.scss";
import { QuestionForm } from "./components/questionForm";
import { AnswerForm } from "./components/answerForm";
import { QuestionResult } from "./components/questionResult";
import { AnswerResult } from "./components/answerResult";
import { useQuestion } from "./useQuestion";
import { gtag } from "@/common/util/gtag";
import { CLIENT_KEY, getRecaptchaToken } from "@/common/util/grecaptcha";
import Script from "next/script";
import { calcPercentage } from "@/libs/math";
import { Story } from "@/server/model/types";

type Props = {
	story: Story;
};

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
const calcDisplayDistance = (distance: number): number => {
	if (distance <= 0.3) {
		return 0.99;
	} else if (distance > 0.3 && distance <= 0.6) {
		return 0.99 - (distance - 0.3) * (0.99 / (0.6 - 0.3));
	} else {
		return 0;
	}
};

const AnswerFormContainer: React.FC<{
	storyId: string;
	onCancel: () => void;
}> = ({ storyId, onCancel }) => {
	const { mutate, isLoading, data, reset, isError } = trpc.truth.useMutation();
	return data ? (
		<AnswerResult
			reasoning={data.input}
			onBackButtonClicked={reset}
			result={
				(
					{
						Covers: "正解",
						Wrong: "間違いがあります",
						Insufficient: "説明が不十分です。",
					} as const satisfies Record<typeof data.result, string>
				)[data.result]
			}
			truth={data.truth}
			distance={
				data.result !== "Covers"
					? `${calcPercentage(calcDisplayDistance(data.distance))}%`
					: null
			}
		/>
	) : (
		<AnswerForm
			isLoading={isLoading}
			onCancel={onCancel}
			isError={isError}
			onSubmit={async (input) => {
				gtag("click_submit_answer");
				mutate({
					storyId,
					text: input,
					recaptchaToken: await getRecaptchaToken(),
				});
			}}
		/>
	);
};

export function Play(props: Props) {
	const question = useQuestion(props.story);
	const [isAnswerMode, setIsAnswerMode] = useState(false);
	return (
		<>
			<Script
				strategy="lazyOnload"
				src={`https://www.google.com/recaptcha/api.js?render=${CLIENT_KEY}`}
			/>
			{!isAnswerMode && (
				<div className={styles.sectionWrapper}>
					<QuestionForm
						onSubmit={question.onSubmit}
						isLoading={question.isLoading}
					/>
				</div>
			)}
			{!isAnswerMode && question.latest && (
				<div className={styles.sectionWrapper}>
					<QuestionResult
						question={question.latest.input}
						answer={question.latest.result}
						onAnswerButtonClicked={() => {
							setIsAnswerMode(true);
						}}
						onHintButtonClicked={null}
					/>
				</div>
			)}
			{isAnswerMode && (
				<div className={styles.sectionWrapper}>
					<AnswerFormContainer
						storyId={props.story.id}
						onCancel={() => {
							setIsAnswerMode(false);
						}}
					/>
				</div>
			)}

			{question.history.length > 0 && (
				<div className={styles.sectionWrapper}>
					<Feed
						items={question.history.map(({ id, input, result }) => ({
							id: id.toString(),
							question: input,
							answer: result,
						}))}
					/>
				</div>
			)}
		</>
	);
}
