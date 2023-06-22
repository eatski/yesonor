import { getRecaptchaToken } from "@/common/util/grecaptcha";
import { trpc } from "@/libs/trpc";
import { Answer } from "@/server/model/types";
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

export const useQuestion = (storyId: string) => {
	const [history, setHistory] = useState<
		{ id: number; input: string; result: string }[]
	>([]);
	const { mutate, isLoading, variables, isError, error } =
		trpc.question.useMutation();
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
			mutate(
				{
					storyId,
					text,
					recaptchaToken: await getRecaptchaToken(),
				},
				{
					onSuccess(result) {
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
								result: result.customMessage
									? `${simpleMessage}: ${result.customMessage}`
									: simpleMessage,
							},
						]);
					},
				},
			);
		},
		latest,
		history,
		isLoading,
	};
};
