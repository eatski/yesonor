import ReactMarkdown from "react-markdown";
import styles from "./styles.module.scss";

export type Props = {
    source: string;
}

export const Markdown: React.FC<Props> = ({ source }) => {
    return  <ReactMarkdown className={styles.markdown}>
        {source}
    </ReactMarkdown>
}