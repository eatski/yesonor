import { texts } from "@/texts"
import styles from "./styles.module.scss"
import Image from "next/image"

export const Landing: React.FC = () => {
    return <div className={styles.container}>
        <h2>{texts.serviceDescription}</h2>
        <p>「はい」か「いいえ」で答えられる質問をAIが回答する</p>
    </div>
}