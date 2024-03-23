import { trpc } from "@/libs/trpc";
import { useCallback, useState } from "react";
import { Feed } from "./components/feed";
import styles from "./styles.module.scss";
import { QuestionForm } from "./components/questionForm";
import { AnswerForm } from "./components/answerForm";
import { QuestionResult } from "./components/questionResult";
import { AnswerResult } from "./components/answerResult";
import { useQuestion } from "./useQuestion";
import { gtagEvent } from "@/common/util/gtag";
import { CLIENT_KEY, getRecaptchaToken } from "@/common/util/grecaptcha";
import Script from "next/script";
import { Story } from "@/server/model/story";
import components from "@/designSystem/components.module.scss";
import { SeeTrurh } from "./components/seeTruth";
import { useConfirmModal } from "../confirmModal";

type Props = {
	story: Story;
};

const AnswerFormContainer: React.FC<{
	story: Story;
	changeMode: (mode: Mode) => void;
}> = ({ story, changeMode }) => {
	const { mutate, isLoading, data, reset, isError } = trpc.truth.useMutation();
	const modalConfrim = useConfirmModal<boolean>();
	const onSubmit = useCallback(
		async (input: string) => {
			gtagEvent("click_submit_answer", {
				enableAbTesting: true,
			});
			mutate({
				storyId: story.id,
				text: input,
				recaptchaToken: await getRecaptchaToken(),
			});
		},
		[mutate, story.id],
	);
	return data ? (
		<>
			<AnswerResult
				solution={data.input}
				onBackButtonClicked={reset}
				onSeeTruthButtonClicked={async () => {
					if (
						await modalConfrim(
							"本当に真相を見ますか？一度真相を見てしまうとこのストーリーを楽しむことができなくなります。",
						)
					) {
						changeMode("truth");
					}
				}}
				truth={story.truth}
				isCorrect={data.result === "Correct"}
				distance={data.distance}
			/>
		</>
	) : (
		<AnswerForm
			isLoading={isLoading}
			onCancel={() => changeMode("question")}
			isError={isError}
			onSubmit={onSubmit}
		/>
	);
};

const Truth: React.FC<{ story: Story; onBackButtonClicked: () => void }> = ({
	story,
	onBackButtonClicked,
}) => {
	return (
		<SeeTrurh onBackButtonClicked={onBackButtonClicked} truth={story.truth} />
	);
};

type Mode = "question" | "solution" | "truth";

export function Play(props: Props) {
	const question = useQuestion(props.story);
	const [mode, setMode] = useState<Mode>("question");
	const backToQuestion = useCallback(() => {
		setMode("question");
	}, []);
	const goToSolution = useCallback(() => {
		setMode("solution");
	}, []);
	const confirm = useConfirmModal();
	return (
		<>
			<Script
				strategy="lazyOnload"
				src={`https://www.google.com/recaptcha/api.js?render=${CLIENT_KEY}`}
			/>
			{mode === "question" && (
				<div className={styles.sectionWrapper}>
					<QuestionForm
						onSubmit={question.onSubmit}
						isLoading={question.isLoading}
					/>
				</div>
			)}
			{mode === "question" && question.latest && (
				<div className={styles.sectionWrapper}>
					<QuestionResult
						question={question.latest.input}
						answer={question.latest.result}
						onAnswerButtonClicked={goToSolution}
						onHintButtonClicked={null}
					/>
				</div>
			)}
			{mode === "solution" && (
				<div className={styles.sectionWrapper}>
					<AnswerFormContainer story={props.story} changeMode={setMode} />
				</div>
			)}
			{mode === "truth" && (
				<div className={styles.sectionWrapper}>
					<Truth story={props.story} onBackButtonClicked={backToQuestion} />
				</div>
			)}
			{question.history.length > 0 && (
				<>
					<div className={styles.sectionWrapper}>
						<Feed
							items={question.history.map(({ id, input, result }) => ({
								id: id.toString(),
								question: input,
								answer: result,
							}))}
						/>
					</div>
					{mode !== "truth" && question.history.length > 5 && (
						<div className={styles.sectionWrapper}>
							<section className={styles.buttonContainer}>
								<button
									onClick={async () => {
										if (
											await confirm(
												"本当に真相を見ますか？一度真相を見てしまうとこのストーリーを楽しむことができなくなります。",
											)
										) {
											setMode("truth");
										}
									}}
									className={components.button2}
								>
									諦めて真相を見る
								</button>
							</section>
						</div>
					)}
				</>
			)}
		</>
	);
}
