import styles from "./styles.module.scss";

export const FirstGuidance: React.FC = () => {
    return <div className={styles.container}>
        <h3>謎を解こう！</h3>
        <p>
            「はい」もしくは「いいえ」で答えられる質問をクイズマスターに投げかけて、謎を解きましょう！
        </p>
    </div>
}