import { Story } from "@/server/model/types";

export const sampleStory: Story = {
    title: "太郎さんのメガネ",
    description: "サンプルです。",
    mystery: "太郎さんは視力がとてもいいのにメガネをかけている。なぜか？",
    truth: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
    truthExamples: [
        "太郎さんはファッションとして伊達メガネをかけている。",
        "太郎さんはおしゃれのために伊達メガネをかけている。",
    ],
    examples: [
        {
            question: "太郎さんのメガネには度が入っていますか？",
            answer: "FALSE",
            supplement: "太郎さんのメガネは伊達メガネであり、度は入っていません。",
        },
        {
            question: "太郎さんのメガネはブルーライトカットですか？",
            answer: "FALSE",
            supplement: "太郎さんのメガネにブルーライトカット機能はありません。",
        },
        {
            question: "太郎さんはおしゃれのためにメガネをかけていますか？",
            answer: "TRUE",
            supplement: "太郎さんはオシャレ好きであり、オシャレのためにメガネをかけています。",
        },
        {
            question: "太郎さんは男ですか?",
            answer: "UNKNOWN",
            supplement: "太郎さんの性別については言及されていません。",
        }

    ]
}