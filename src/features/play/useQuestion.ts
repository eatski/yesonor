import { trpc } from "@/libs/trpc";
import { Answer } from "@/server/model/types";
import { useState } from "react";

export const useQuestion = (storyId: number) => {
    const [history,setHistory] = useState<{id: number,input: string,result: string}[]>([]);
    const {mutate,isLoading,variables} = trpc.question.useMutation();
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
                                "FALSE": "いいえ",
                                "TRUE": "はい",
                                "UNKNOWN": "わからない",
                                "INVALID": "不正な質問"
                            } as const satisfies Record<Answer,string>)[result]
                        }
                    ]);
                }
            });
        },
        latest: isLoading && variables?.text ? {
            input: variables.text,
            result: null
        } : history.at(-1),
        history,
        isLoading
    }
}