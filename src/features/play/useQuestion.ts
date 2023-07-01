import { getRecaptchaToken } from "@/common/util/grecaptcha";
import { trpc } from "@/libs/trpc";
import { Answer, Story } from "@/server/model/types";
import { OPENAI_ERROR_MESSAGE } from "@/server/procedures/question/contract";
import { useState } from "react";

const last = <T>(array: T[]): T | null => {
	if (array.length === 0) {
		return null;
	}
	return array[array.length - 1];
};

const toErrorMessage = (error: unknown) => {
	if (error instanceof Error && error.message === OPENAI_ERROR_MESSAGE) {
		return "AIの調子が悪いみたいです。しばらく待ってからもう一度お試しください。";
	}
	return "エラーです。AIが回答を生成できませんでした。";
};

export type UseQuestionStory = Pick<Story, "id">;

export const useQuestion = (story: UseQuestionStory) => {
	const [history, setHistory] = useState<
		{ id: number; input: string; result: string }[]
	>([]);
	const { mutateAsync, isLoading, variables, isError, error } =
		trpc.question.useMutation();
	const { mutate } = trpc.questionLog.post.useMutation();
	const latest = variables?.text
		? isLoading || error
			? {
					input: variables.text,
					result: error ? toErrorMessage(error) : null,
			  }
			: last(history) ?? {
					input: variables.text,
					result: null,
			  }
		: null;
	return {
		async onSubmit(text: string) {
			const result = await mutateAsync({
				storyId: story.id,
				text,
				recaptchaToken: await getRecaptchaToken(),
			});
			const simpleMessage = (
				{
					False: "いいえ",
					True: "はい",
					Unknown: "わからない",
					Invalid: "不正な質問",
				} as const satisfies Record<Answer, string>
			)[result.answer];
			setHistory((history) => [
				...history,
				{
					id: history.length,
					input: text,
					result: result.hitQuestionExample?.customMessage
						? `${simpleMessage}: ${result.hitQuestionExample.customMessage}`
						: simpleMessage,
				},
			]);
			if (result.encrypted) {
				mutate({
					encrypted: result.encrypted,
				});
			}
		},
		latest,
		history,
		isLoading,
	};
};
