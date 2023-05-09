import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import { StoryInit } from "@/server/services/story/schema";
import { YamlFileDrop } from "../storyYamlFileDrop";

export type Props = {
    storyId: number;
    draft: boolean;
}

export const MyStoryMenu: React.FC<Props> = ({storyId,draft}) => {
    const {mutate} = trpc.delete.useMutation();
    const { mutate: put } = trpc.put.useMutation();
    const handleFileRead = (story: StoryInit) => {
        put({
            id: storyId,
            story
        }, {
            onSuccess: () => {
                router.reload();
            }
        });
    };
    const router = useRouter();
    return  <div className={styles.container}>
        {
            draft && <p>
                このストーリーは未公開です。
            </p>
        }
        <div className={styles.buttons}>
            <button className={components.buttonLink} onClick={() => {
                mutate({
                    id: storyId
                },{
                    onSuccess: () => {
                        router.push(`/stories`);
                    }
                })
            }}>
                削除
            </button>
            <button className={components.buttonDanger}>
                公開
            </button>
        </div>
        <p>YAMLファイルでストーリーを修正</p>
        <div className={styles.fileDropContainer}>
            <YamlFileDrop onFileRead={handleFileRead} />
        </div>
        
    </div>
}