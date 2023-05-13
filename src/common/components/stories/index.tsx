import Link from "next/link";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss"
import { AiFillRightCircle as StartIcon } from "react-icons/ai";

export type Story = {
    id: string,
    title: string,
    quiz: string,
    url: string,
}

export const Stories: React.FC<{stories: Story[]}> = ({stories}) => {
    return <ul className={styles.container}>
        {stories.map((story) => {
            return <li key={story.id}>
                <Link href={story.url}>
                    <div className={styles.title}>
                        {story.title}
                    </div>
                    <p>
                        {story.quiz}
                    </p>
                </Link>
                <Link href={story.url} className={styles.iconContainer}>
                    <StartIcon className={components.iconButton} />
                </Link>
            </li>
        })}
    </ul>
}