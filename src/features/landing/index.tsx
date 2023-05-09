/* eslint-disable @next/next/no-img-element */
import { texts } from "@/texts"
import styles from "./styles.module.scss"
import { QuestionAndAnswer } from "@/common/components/questionAndAnswer"

const QUESTIONS = [
    {
        question: "Yesonorでは質問に対してAIが回答をしてくれますか？",
        answer: "はい",
    },
    {
        question: "Yesonorでは自分の考えた水平思考クイズを投稿できますか？",
        answer: "はい",
    },
    {
        question: "Yesonorは他の人が投稿した水平思考クイズを遊べますか？",
        answer: "はい",
    },
    {
        question: "Yesonorでは回答を人間が考えていますか？",
        answer: "いいえ",
    },
    {
        question: "Yesonorの読み方は「いえそな」ですか？",
        answer: "はい",
    },
    {
        question: "Yesonorは無料で遊べますか？",
        answer: "はい",
    },
    
    {
        question: "Yesonorは最高ですか？",
        answer: "わからない",
    },
    {
        question: "Yesonorで水平思考クイズを遊ぶには2人以上の参加者が必要ですか？",
        answer: "いいえ",
    }
]

export const Landing: React.FC = () => {
    return <div className={styles.container}>
        <h2>{texts.serviceDescription}</h2>
        <p>あなたの質問にAIが「はい」か「いいえ」で答えます。</p>
        <QuestionAndAnswer question={QUESTIONS[0].question} answer={"はい"}/>
        
    </div>
}