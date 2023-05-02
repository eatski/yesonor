import { Story } from "@/server/model/types";

export const sample1: Story = {
    title: "太郎さんのメガネ",
    description: "サンプルです。",
    mystery: "太郎さんは視力がとてもいいのにメガネをかけている。なぜか？",
    truth: "太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。",
    truthExamples: [
        "太郎さんはファッションとして伊達メガネをかけている。",
        "太郎さんは伊達メガネをオシャレのためにかけている。",
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

export const sample2: Story = {
    title: "女性用トイレの男性",
    description: "サンプルです。",
    mystery: "山田さんは男性であるが、今、女性用トイレにいる。なぜか？",
    truth: `
    山田さんがいるのは人気のない深夜の公園の公衆便所。
    その日、山田さん人を殺害し男性用トイレに死体を隠そうとした。
    しかし、その途中で山田さんはトイレに向かってくる複数の男性の喋り声に気づく。
    幸い、男性の位置からはトイレの入り口は見えない。
    山田さんは彼らに見つからないように、そっと女性用トイレに入った。
    `,
    truthExamples: [
        "山田さんは人を殺害し男性用トイレに死体を隠そうとしたが、用を足しに来た男性に見つかりそうになり女性用トイレに逃げ込んだ。",
        "山田さんは人を殺し、男用のトイレにそれを隠していたが、他の男たちに見つかりそうになり女用のトイレに入った。",
    ],
    examples: [
        {
            question: "山田さんは人を殺害しましたか？",
            answer: "TRUE" ,
            supplement: "山田さんは人を殺害し、男性用トイレに死体を隠そうとしました。",
        },
        {
            question: "山田さんは心が女性ですか？",
            answer: "UNKNOWN",
            supplement: "山田さんの心の性別については言及されていません。",
        },
        {
            question: "山田さんは子供であり、保護者と一緒にいますか？",
            answer: "FALSE" ,
            supplement: "山田さんは大人であり、1人で女性トイレにいます。",
        },
        {
            question: "山田さんは隠れるために女性用トイレに入りましたか？",
            answer: "TRUE",
            supplement: "山田さんは男性用トイレに死体を隠そうとしましたが、他の男性が来たため隠れるために女性用トイレに入りました。",
        },
        {
            question: "トイレは公園にありますか？",
            answer: "TRUE",
            supplement: "トイレは公園にある公衆便所です。",
        },
        {
            question: "トイレは山田さんの家にありますか？",
            answer: "FALSE",
            supplement: "トイレは山田さんの家にはありません。",
        },
        {
            question: "トイレは人目につく場所にありますか？",
            answer: "UNKNOWN",
            supplement: "トイレは人目につく場所にはあるかは言及されていませんが、深夜の公園の公衆便所であるため、その時点では人目につくとは考えにくいです。",
        },
        {
            question: "山田さんはトイレに用を足しに来ましたか？",
            answer: "FALSE",
            supplement: "山田さんはトイレに用を足しに来たのではなく、死体を隠そうとしました。",
        },
        {
            question: "山田さんはトイレに用を足しに来た男性を殺害しましたか？",
            answer: "FALSE",
            supplement: "山田さんはトイレに用を足しに来た男性を殺害せず、見つからないようにかくれました。",
        },
        {
            question: "山田さんは意図的に女性用トイレに入りましたか？",
            answer: "TRUE",
            supplement: "山田さんは隠れるために意図して女性用トイレに入りました。",
        },
        {
            question: "トイレは山田さんの家の近くにありますか？",
            answer: "UNKNOWN",
            supplement: "トイレは山田さんの家の近くにあるかは言及されていません。",
        },
        {
            question: "山田さんの他に登場人物はいますか？",
            answer: "TRUE",
            supplement: "山田さんの他に、トイレに用を足しに来た男性がいます。",
        },
        {
            question: "女性用トイレに山田さん以外に人はいますか？",
            answer: "UNKNOWN",
            supplement: "女性用トイレに山田さん以外に人がいるかは言及されていません。",
        },
        {
            question: "男性用トイレに人はいますか？",
            answer: "TRUE" ,
            supplement: "男性用トイレには、トイレに用を足しに来た男性が入ろうとしているか、既に入っています。",
        }
    ]
}

export const getSampleStory = (id: string): Story | null => {
    switch (id) {
        case "sample1":
            return sample1
        case "sample2":
            return sample2
        default:
            return null
    }
}