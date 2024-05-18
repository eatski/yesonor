import components from "@/designSystem/components.module.scss";
import { FormErrorMessage } from "@/designSystem/components/formErrorMessage";
import { InformationParagragh } from "@/designSystem/components/information";
import { type StoryInit, storyInit } from "@/server/model/story";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useId } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AiFillPlayCircle, AiOutlinePlus } from "react-icons/ai";
import { QuestionExampleForm } from "./components/questionExample";
import styles from "./styles.module.scss";

export type Props = {
	storyInit?: StoryInit;
	onSubmit: (data: StoryInit) => void;
	isLoading: boolean;
	isError: boolean;
};

export const StoryForm: React.FC<Props> = ({
	onSubmit,
	isError,
	isLoading,
	storyInit: story,
}) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<StoryInit>({
		defaultValues: story ?? {
			title: "",
			quiz: "",
			truth: "",
			simpleTruth: "",
			questionExamples: [
				{ question: "", answer: "True", customMessage: "" },
				{ question: "", answer: "False", customMessage: "" },
				{ question: "", answer: "Unknown", customMessage: "" },
			],
		},
		resolver: zodResolver(storyInit),
	});

	const { fields, append, remove } = useFieldArray<StoryInit>({
		control,
		name: "questionExamples",
	});
	const titleFormErrorMessageId = useId();
	const quizFormErrorMessageId = useId();
	const truthFormErrorMessageId = useId();
	const simpleTruthFormErrorMessageId = useId();
	const questionExampleFormErrorMessageId = useId();

	return (
		<form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
			{isError && <p className={styles.error}>エラーが発生しました</p>}
			<div className={styles.upperMenu}>
				<button
					disabled={isLoading}
					type="submit"
					className={components.button}
				>
					<span>テストプレイ</span>
					<AiFillPlayCircle />
				</button>
			</div>
			<div className={styles.field}>
				<label>
					タイトル
					<input
						{...register("title")}
						placeholder="例: 太郎さんのメガネ"
						className={components.input}
						aria-errormessage={titleFormErrorMessageId}
					/>
					{errors.title && (
						<FormErrorMessage id={titleFormErrorMessageId}>
							{errors.title.message}
						</FormErrorMessage>
					)}
				</label>
			</div>
			<div className={styles.field}>
				<label>
					問題文
					<textarea
						{...register("quiz")}
						placeholder="例: 太郎さんは視力がとてもいいのにメガネをかけている。なぜか？"
						className={components.textarea}
						aria-errormessage={quizFormErrorMessageId}
					/>
					{errors.quiz && (
						<FormErrorMessage id={quizFormErrorMessageId}>
							{errors.quiz.message}
						</FormErrorMessage>
					)}
				</label>
			</div>
			<div className={styles.field}>
				<label>
					真相
					<InformationParagragh>
						AIは質問に対する回答を生成する際にこの文章を参照します。そのため、真相は詳細まで記述することをお勧めします。
					</InformationParagragh>
					<textarea
						{...register("truth")}
						placeholder="例: 太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。"
						className={components.input}
						aria-errormessage={truthFormErrorMessageId}
					/>
					{errors.truth && (
						<FormErrorMessage id={truthFormErrorMessageId}>
							{errors.truth.message}
						</FormErrorMessage>
					)}
				</label>
			</div>
			<div className={styles.field}>
				<label>
					簡潔な真相
					<InformationParagragh>
						この文章はAIが解答者の解答を判定する際に使用します。詳細に説明しすぎると、AIに解答者の解答が「情報が不足している」と判断されてしまうため、
						<strong>真相の核心を最低限の言葉で</strong>記述してください。
					</InformationParagragh>
					<textarea
						{...register("simpleTruth")}
						placeholder="例: 太郎さんは伊達メガネをかけている。"
						className={components.input}
						aria-errormessage={simpleTruthFormErrorMessageId}
					/>
					{errors.simpleTruth && (
						<FormErrorMessage id={simpleTruthFormErrorMessageId}>
							{errors.simpleTruth.message}
						</FormErrorMessage>
					)}
				</label>
			</div>
			<fieldset
				aria-errormessage={questionExampleFormErrorMessageId}
				aria-invalid={!!errors.questionExamples}
			>
				<legend>質問の例を教えてください。</legend>
				<InformationParagragh>
					AIは質問に対する回答を生成する際にこれらを参照するため、より多くの例を参照させることで解答の精度が上がります。
					<br />
					AIが最低限有用な回答を返せるようにするために3つ以上（答えが「はい」「いいえ」「わからない」の質問を1つずつ）の例を記述してください。
					<br />
					また、カスタムメッセージを設定することで、AIの回答を決めることができます。
				</InformationParagragh>
				{errors.questionExamples && (
					<FormErrorMessage id={questionExampleFormErrorMessageId}>
						{errors.questionExamples.message}
					</FormErrorMessage>
				)}
				{fields.map((field, index) => (
					<div key={index} className={styles.questionExampleItem}>
						<QuestionExampleForm
							index={index}
							questionInput={register(`questionExamples.${index}.question`)}
							questionError={
								errors.questionExamples?.[index]?.question?.message ?? null
							}
							answerInput={register(`questionExamples.${index}.answer`)}
							customMessageInput={register(
								`questionExamples.${index}.customMessage`,
							)}
							customMessageError={
								errors.questionExamples?.[index]?.customMessage?.message ?? null
							}
							onClickRemove={() => remove(index)}
						/>
					</div>
				))}
				<div className={styles.questionExampleFoot}>
					<button
						type="button"
						aria-label="質問例を追加"
						onClick={() =>
							append({ question: "", answer: "Unknown", customMessage: "" })
						}
					>
						<AiOutlinePlus className={components.iconButtonLink} />
					</button>
				</div>
			</fieldset>
		</form>
	);
};
