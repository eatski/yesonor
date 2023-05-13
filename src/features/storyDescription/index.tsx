import { H2 } from "@/common/components/h2";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import dayjs from "dayjs";
import { texts } from "@/texts";
import { AiOutlineCopy, AiOutlineTwitter } from "react-icons/ai";
import CopyToClipboard from "react-copy-to-clipboard";

export type Story = {
    id: string,
    title: string,
    quiz: string,
    publishedAt: number | null,
    published: boolean
}
dayjs.locale('ja');

export const StoryDescription: React.FC<Story> = ({id,title,quiz,publishedAt,published}) => {
    const url = `https://yesonor.vercel.app/stories/${id}`;
    return  <div className={styles.container}>
        <H2 label={title} />
        {
            publishedAt && 
                <dl>
                    <div className={styles.basic}>
                        <dt>投稿日</dt>
                        <dd>{dayjs(publishedAt).format("YYYY/MM/DD")}</dd>
                    </div>
                </dl>
        }
        <p>{quiz}</p>
        {
            published && <div className={styles.share}>
            <a  
                href={`https://twitter.com/intent/tweet?url=${encodeURI(url)}&text=${encodeURI(quiz)}&hashtags=${encodeURI(texts.serviceNickname)},${encodeURI("水平思考クイズ")}`} 
                className={components.buttonLink}
                target="_blank"
            >
                <AiOutlineTwitter className={styles.twitter} />
                ツイート
            </a>
            <CopyToClipboard text={url} onCopy={() => {
                alert("クリップボードにコピーしました");
            }}>
                <button className={components.buttonLink}>
                    <AiOutlineCopy />
                    URLをコピー
                </button>
            </CopyToClipboard>
            
        </div>
        }
        
    </div>
}