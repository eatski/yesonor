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

export const MyStoryMenu: React.FC<Props> = ({ storyId, published }) => {
    const del = trpc.delete.useMutation();
    const put = trpc.put.useMutation();
    const publish = trpc.publish.useMutation();
    const isLoading = del.isLoading || put.isLoading || publish.isLoading;
    const isError = del.error || put.error || publish.error;
    const handleFileRead = (story: StoryInit) => {
        put.mutate({
            id: storyId,
            story
        }, {
            onSuccess: () => {
                router.reload();
            }
        });
    };
    const router = useRouter();
    return <div className={styles.container} data-loading={isLoading}>
        {isLoading ? <div className={styles.loader}/> : null}
        <div className={styles.content}>
            {
                published || <p className={styles.important}>
                    このストーリーは未公開です。
                </p>
            }
            <p>YAMLファイルでストーリーを修正</p>
            <div className={styles.fileDropContainer}>
                <YamlFileDrop onFileRead={handleFileRead} />
            </div>
            <div className={styles.buttons}>
                <button 
                    className={published ? components.buttonDanger : components.buttonLink} 
                    onClick={() => {
                        del.mutate({
                            id: storyId
                        }, {
                            onSuccess: () => {
                                router.push(`/my/stories`);
                            }
                        })
                    }}
                    disabled={isLoading}
                >
                    削除
                </button>
                {published || <button 
                    className={components.buttonDanger} 
                    onClick={() => {
                        publish.mutate({
                            id: storyId,
                        }, {
                            onSuccess: () => {
                                router.reload();
                            }
                        })
                    }}
                    disabled={isLoading}
                >
                    公開
                </button>}
            </div>
            {
                isError ? <p className={styles.error}>
                    エラーが発生しました。
                </p> : null
            }
        </div>
    </div>
}