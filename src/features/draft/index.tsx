import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";

export type Props = {
    storyId: number;
}

export const Draft: React.FC<Props> = () => {
    return  <div className={styles.container}>
        <p>
            このストーリーは未公開です。
        </p>
        <div className={styles.buttons}>
            <button className={components.buttonLink}>
                編集
            </button>
            <button className={components.buttonDanger}>
                公開
            </button>
        </div>
    </div>
}