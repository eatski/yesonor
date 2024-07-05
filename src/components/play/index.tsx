import { getDevice } from "@/common/util/device";
import { CLIENT_KEY, getRecaptchaToken } from "@/common/util/grecaptcha";
import { gtagEvent } from "@/common/util/gtag";
import components from "@/designSystem/components.module.scss";
import { trpc } from "@/libs/trpc";
import type { Story } from "@/server/model/story";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { useConfirmModal } from "../confirmModal";
import { AnswerForm } from "./components/answerForm";
import { AnswerResult } from "./components/answerResult";
import { Feed } from "./components/feed";
import { MobileLimitation } from "./components/mobileLimitation";
import { QuestionForm } from "./components/questionForm";
import { QuestionResult } from "./components/questionResult";
import { RequireLogin } from "./components/requireLogin";
import { SeeTrurh } from "./components/seeTruth";
import styles from "./styles.module.scss";
import { useQuestion } from "./useQuestion";

type Props = {
	story: Story;
};

const AnswerFormContainer: React.FC<{
	story: Story;
	changeMode: (mode: Mode) => void;
}> = ({ story, changeMode }) => {
	const { mutate, isLoading, data, reset, isError } = trpc.truth.useMutation({
		onSuccess(data) {
			const resultToEvent = {
				Incorrect: "success_answer_incorrect",
				Correct: "success_answer_correct",
			} as const;
			gtagEvent(resultToEvent[data.result]);
		},
	});
	const { confirm, view } = useConfirmModal();
	const onSubmit = useCallback(
		async (input: string) => {
			gtagEvent("click_submit_answer");
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
			{view}
			<AnswerResult
				storyId={story.id}
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
	const { confirm, view } = useConfirmModal();
	const session = useSession();
	const [mobileLimitation, setMobileLimitation] = useState(false);
	const { data: isThankyouUser } = trpc.user.thankyou.useQuery();
	useEffect(() => {
		const device = getDevice(undefined);
		if (device === "mobile" && process.env.NEXT_PUBLIC_MOBILE_LIMITATION) {
			setMobileLimitation(true);
		}
	}, []);
	if (isThankyouUser === false && mobileLimitation) {
		return <MobileLimitation />;
	}
	if (process.env.NEXT_PUBLIC_REQUIRE_LOGIN_TO_PLAY) {
		if (session.status !== "loading" && !session.data?.user) {
			return <RequireLogin />;
		}
	}
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
