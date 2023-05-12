import { trpc } from "@/libs/trpc";
import { Answer } from "@/server/model/types";
import { useState } from "react";

export const useQuestion = (storyId: number) => {
    const [history,setHistory] = useState<{id: number,input: string,result: string}[]>([]);
    const {mutate,isLoading,variables,isError} = trpc.question.useMutation();
    const latest = ((isLoading || isError) && variables?.text) 
        ? {
            input: variables.text,
            result: isLoading ? null : "エラーです。AIが回答を生成できませんでした。"
        } 
        : history.at(-1)
    return {
        onSubmit(text: string) {
            mutate({
                storyId,
                text
            },{
                onSuccess(result) {
                    setHistory(history => [...history,
                        {
                            id: history.length,
                            input: text,
                            result: ({
                                "False": "いいえ",
                                "True": "はい",
                                "Unknown": "わからない",
                                "Invalid": "不正な質問"
                            } as const satisfies Record<Answer,string>)[result]
                        }
                    ]);
                }
            });
        },
        latest,
        history,
        isLoading
    }
}