import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import { StoryInit } from "@/server/services/story/schema";
import { YamlFileDrop } from "../storyYamlFileDrop";

export type Props = {
    storyId: number;
    published: boolean;
}

export const MyStoryMenu: React.FC<Props> = ({storyId,published}) => {
    const {mutate} = trpc.delete.useMutation();
    const { mutate: put } = trpc.put.useMutation();
    const { mutate: publish } = trpc.publish.useMutation();
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
            published || <p>
                このストーリーは未公開です。
            </p>
        }
        
        <p>YAMLファイルでストーリーを修正</p>
        <div className={styles.fileDropContainer}>
            <YamlFileDrop onFileRead={handleFileRead} />
        </div>
        <div className={styles.buttons}>
            <button className={published ? components.buttonDanger : components.buttonLink} onClick={() => {
                mutate({
                    id: storyId
                },{
                    onSuccess: () => {
                        router.push(`/my/stories`);
                    }
                })
            }}>
                削除
            </button>
            {published || <button className={components.buttonDanger} onClick={() => {
                publish({
                    id: storyId,
                },{
                    onSuccess: () => {
                        router.reload();
                    }
                })
            }}>
                公開
            </button>}
        </div>
    </div>
}