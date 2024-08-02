import { get } from "http";
import {
	Button,
	ButtonIconWrapper,
	IconButton,
} from "@/designSystem/components/button";
import { FormErrorMessage } from "@/designSystem/components/formErrorMessage";
import { InformationParagragh } from "@/designSystem/components/information";
import { Input } from "@/designSystem/components/input";
import { TextArea } from "@/designSystem/components/textArea";
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

const resolver = zodResolver(storyInit);

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
		resolver,
	});

	const { fields, append, remove } = useFieldArray<StoryInit>({
		control,
		name: "questionExamples",
	});
	const simpleTruthFormErrorMessageId = useId();
	const questionExampleFormErrorMessageId = useId();

	const uniqueId = useId();
	const getFieldId = (name: keyof StoryInit, type: "err" | "input") =>
		`${uniqueId}-${name}-${type}`;

	return (
		<form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
			{isError && <p className={styles.error}>エラーが発生しました</p>}
			<div className={styles.upperMenu}>
				<Button
					disabled={isLoading}
					type="submit"
					color="primary"
					size="medium"
				>
					保存して確認
					<ButtonIconWrapper>
						<AiFillPlayCircle />
					</ButtonIconWrapper>
				</Button>
			</div>
			<div className={styles.field}>
				<label htmlFor={getFieldId("title", "input")}>タイトル</label>
				<Input
					originalProps={{
						id: getFieldId("title", "input"),
						placeholder: "例: 太郎さんのメガネ",
						"aria-errormessage": errors.title
							? getFieldId("title", "err")
							: undefined,
						...register("title"),
					}}
				/>
				{errors.title && (
					<FormErrorMessage id={getFieldId("title", "err")}>
						{errors.title.message}
					</FormErrorMessage>
				)}
			</div>
			<div className={styles.field}>
				<label htmlFor={getFieldId("quiz", "input")}>問題文</label>
				<TextArea
					originalProps={{
						id: getFieldId("quiz", "input"),
						placeholder:
							"例: 太郎さんは視力がとてもいいのにメガネをかけている。なぜか？",
						"aria-errormessage": errors.quiz
							? getFieldId("quiz", "err")
							: undefined,
						...register("quiz"),
					}}
				/>
				{errors.quiz && (
					<FormErrorMessage id={getFieldId("quiz", "err")}>
						{errors.quiz.message}
					</FormErrorMessage>
				)}
			</div>
			<div className={styles.field}>
				<label htmlFor={getFieldId("truth", "input")}>真相</label>
				<InformationParagragh>
					AIは質問に対する回答を生成する際にこの文章を参照します。そのため、真相は詳細まで記述することをお勧めします。
				</InformationParagragh>
				<TextArea
					originalProps={{
						id: getFieldId("truth", "input"),
						placeholder:
							"例: 太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
						"aria-errormessage": errors.truth
							? getFieldId("truth", "err")
							: undefined,
						...register("truth"),
					}}
				/>
				{errors.truth && (
					<FormErrorMessage id={getFieldId("truth", "err")}>
						{errors.truth.message}
					</FormErrorMessage>
				)}
			</div>
			<div className={styles.field}>
				<label htmlFor={getFieldId("simpleTruth", "input")}>簡潔な真相</label>
				<InformationParagragh>
					この文章はAIが解答者の解答を判定する際に使用します。詳細に説明しすぎると、AIに解答者の解答が「情報が不足している」と判断されてしまうため、
					<strong>真相の核心を最低限の言葉で</strong>記述してください。
				</InformationParagragh>
				<TextArea
					originalProps={{
						id: getFieldId("simpleTruth", "input"),
						"aria-errormessage": errors.simpleTruth
							? getFieldId("simpleTruth", "err")
							: undefined,
						placeholder: "例: 太郎さんは伊達メガネをかけている。",
						...register("simpleTruth"),
					}}
				/>
				{errors.simpleTruth && (
					<FormErrorMessage id={getFieldId("simpleTruth", "err")}>
						{errors.simpleTruth.message}
					</FormErrorMessage>
				)}
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
				<div className={styles.addQuestionButton}>
					<IconButton
						aria-label="追加"
						color="zero"
						onClick={() =>
							append({ question: "", answer: "Unknown", customMessage: "" })
						}
					>
						<AiOutlinePlus />
					</IconButton>
				</div>
			</fieldset>
		</form>
	);
};
