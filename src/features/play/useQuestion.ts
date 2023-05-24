import { getRecaptchaToken } from "@/common/util/grecaptcha";
import { trpc } from "@/libs/trpc";
import { Answer } from "@/server/model/types";
import { useState } from "react";

export const useQuestion = (storyId: string) => {
	const [history, setHistory] = useState<
		{ id: number; input: string; result: string }[]
	>([]);
	const { mutate, isLoading, variables, isError } = trpc.question.useMutation();
	const latest = variables?.text
		? isLoading || isError
			? {
					input: variables.text,
					result: isError
						? "エラーです。AIが回答を生成できませんでした。"
						: null,
			  }
			: history.at(-1) ?? {
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
						setHistory((history) => [
							...history,
							{
								id: history.length,
								input: text,
								result: (
									{
										False: "いいえ",
										True: "はい",
										Unknown: "わからない",
										Invalid: "不正な質問",
									} as const satisfies Record<Answer, string>
								)[result],
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
