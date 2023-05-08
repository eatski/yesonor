import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";

export type Props = {
    storyId: number;
}

export const Draft: React.FC<Props> = ({storyId}) => {
    const {mutate} = trpc.delete.useMutation();
    const router = useRouter();
    return  <div className={styles.container}>
        <p>
            このストーリーは未公開です。
        </p>
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
    </div>
}