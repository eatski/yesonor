import { texts } from "@/texts"
import styles from "./styles.module.scss"
import Link from "next/link"

export const Landing: React.FC = () => {
    return <div className={styles.container}>
        <h2>{texts.serviceDescription}</h2>
        <p>「はい」か「いいえ」で答えられる質問をAIが回答する</p>
        <Link href={"/stories"}>
            ゲームを探す
        </Link>
    </div>
}