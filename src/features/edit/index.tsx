import styles from "./styles.module.scss";
import components from "@/styles/components.module.css";
import { FileDrop } from "@/components/fileDrop";

export type Props = {
    storyId: number;
    draft: boolean;
}

export const EditStory: React.FC<Props> = ({storyId,draft}) => {
    return  <div className={styles.container}>
        <p>
            このストーリーは未公開です。
        </p>
        <button className={components.button}>
            公開する
        </button>
        <label>
            ファイルをアップロードして修正する
        </label>
        <div className={styles.fileDropContainer}>
            <FileDrop onFileRead={function (fileContent: string): void {
                throw new Error("Function not implemented.");
            }}/>
        </div>
    </div>
}