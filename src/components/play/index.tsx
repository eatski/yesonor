"use client";
import { gtagEvent } from "@/common/util/gtag";
import { Button } from "@/designSystem/components/button";
import type {
	QuestionExampleWithCustomMessage,
	Story,
	answer as answerSchema,
} from "@/server/model/story";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { z } from "zod";
import { useConfirmModal } from "../confirmModal";
import { AnswerForm } from "./components/answerForm";
import { AnswerResult } from "./components/answerResult";
import { Feed } from "./components/feed";
import { MobileLimitation } from "./components/mobileLimitation";
import { QuestionForm } from "./components/questionForm";
import { QuestionResult } from "./components/questionResult";
import { SeeTrurh } from "./components/seeTruth";
import styles from "./styles.module.scss";
import { useQuestion } from "./useQuestion";

type Props = {
	story: Story;
	fetchCanPlay: () => Promise<
		| {
				canPlay: true;
		  }
		| {
				canPlay: false;
				reason: "desktop_only";
		  }
	>;
	sendQuestion: (args: {
		text: string;
	}) => Promise<{
		answer: z.infer<typeof answerSchema>;
		hitQuestionExample: QuestionExampleWithCustomMessage | null;
	}>;
	checkAnswer: (args: {
		text: string;
	}) => Promise<{
		isCorrect: boolean;
		distance: number;
	}>;
	postStoryEvalution: () => Promise<void>;
};

const AnswerFormContainer: React.FC<{
	story: Story;
	changeMode: (mode: Mode) => void;
	checkAnswer: (args: {
		text: string;
	}) => Promise<{
		isCorrect: boolean;
		distance: number;
	}>;
	postStoryEvalution: () => Promise<void>;
}> = ({ story, changeMode, checkAnswer, postStoryEvalution }) => {
	const { mutate, isLoading, data, reset, isError } = useMutation(
		async (text: string) => {
			const response = await checkAnswer({
				text: text,
			});
			return {
				...response,
				input: text,
			};
		},
		{
			onSuccess(data) {
				gtagEvent(
					data.isCorrect
						? "success_answer_correct"
						: "success_answer_incorrect",
				);
			},
		},
	);
	const { confirm, view } = useConfirmModal();
	const onSubmit = useCallback(
		async (input: string) => {
			gtagEvent("click_submit_answer");
			mutate(input);
		},
		[mutate],
	);
	return data ? (
		<>
			{view}
			<AnswerResult
				solution={data.input}
				onBackButtonClicked={reset}
				onSeeTruthButtonClicked={async () => {
					if (
						await confirm(
							"本当に真相を見ますか？一度真相を見てしまうとこのストーリーを楽しむことができなくなります。",
						)
					) {
						changeMode("truth");
					}
				}}
				truth={story.truth}
				isCorrect={data.isCorrect}
				distance={data.distance}
				postStoryEvalution={postStoryEvalution}
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

export function Play({
	story,
	fetchCanPlay,
	sendQuestion,
	checkAnswer,
	postStoryEvalution,
}: Props) {
	const question = useQuestion(sendQuestion);
	const [mode, setMode] = useState<Mode>("question");
	const backToQuestion = useCallback(() => {
		setMode("question");
	}, []);
	const goToSolution = useCallback(() => {
		setMode("solution");
	}, []);
	const { data: canPlayResult } = useQuery({
		queryKey: [fetchCanPlay],
		queryFn: () => fetchCanPlay(),
	});
	const { confirm, view } = useConfirmModal();
	if (canPlayResult && !canPlayResult.canPlay) {
		switch (canPlayResult.reason) {
			case "desktop_only":
				return <MobileLimitation />;
		}
	}

	return (
		<>
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
					<AnswerFormContainer
						story={story}
						changeMode={setMode}
						checkAnswer={checkAnswer}
						postStoryEvalution={postStoryEvalution}
					/>
				</div>
			)}
			{mode === "truth" && (
				<div className={styles.sectionWrapper}>
					<Truth story={story} onBackButtonClicked={backToQuestion} />
				</div>
			)}
			{question.history.length > 0 && (
				<>
					{view}
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
								<Button
									onClick={async () => {
										if (
											await confirm(
												"本当に真相を見ますか？一度真相を見てしまうとこのストーリーを楽しむことができなくなります。",
											)
										) {
											setMode("truth");
										}
									}}
									color="secondary"
									size="medium"
								>
									諦めて真相を見る
								</Button>
							</section>
						</div>
					)}
				</>
			)}
		</>
	);
}
