import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { z } from "zod";
import type {
	Answer,
	QuestionExampleWithCustomMessage,
	Story,
	answer,
} from "../../server/model/story";

const last = <T>(array: T[]): T | null => {
	if (array.length === 0) {
		return null;
	}
	return array[array.length - 1] || null;
};

const toErrorMessage = (_: unknown) => {
	return "エラーです。AIが回答を生成できませんでした。";
};

export type UseQuestionStory = Pick<Story, "id">;

const useMutableHistory = () => {
	const idRef = useRef(0);
	const [history, setHistory] = useState<
		{ id: number; input: string; result: string | null }[]
	>([]);
	return {
		history,
		pushHistory: ({
			input,
			result,
		}: { input: string; result: string | null }) => {
			const id = idRef.current++;
			setHistory((prev) => [...prev, { id, input, result }]);
			return id;
		},
		updateHistory: (id: number, result: string) => {
			setHistory((prev) =>
				prev.map((item) => (item.id === id ? { ...item, result } : item)),
			);
		},
	};
};

export const useQuestion = (
	sendQuestion: (args: {
		text: string;
	}) => Promise<{
		answer: z.infer<typeof answer>;
		hitQuestionExample: QuestionExampleWithCustomMessage | null;
	}>,
) => {
	const { history, pushHistory, updateHistory } = useMutableHistory();
	const { mutateAsync, isLoading, variables, error } =
		useMutation(sendQuestion);
	const latest =
		error && variables
			? {
					input: variables.text,
					result: error ? toErrorMessage(error) : null,
				}
			: last(history);
	return {
		async onSubmit(text: string) {
			const id = pushHistory({ input: text, result: null });
			const result = await mutateAsync({
				text,
			});
			const simpleMessage = (
				{
					False: "いいえ",
					True: "はい",
					Unknown: "わからない",
					Invalid: "不正な質問",
				} as const satisfies Record<Answer, string>
			)[result.answer];
			updateHistory(
				id,
				result.hitQuestionExample?.customMessage
					? `${simpleMessage}: ${result.hitQuestionExample.customMessage}`
					: simpleMessage,
			);
		},
		latest: latest
			? {
					input: latest.input,
					result: latest.result,
				}
			: null,
		history: history.reduce<{ id: number; input: string; result: string }[]>(
			(acc, cur) => {
				return cur.result
					? [
							...acc,
							{
								id: cur.id,
								input: cur.input,
								result: cur.result,
							},
						]
					: acc;
			},
			[],
		),
		isLoading,
	};
};
