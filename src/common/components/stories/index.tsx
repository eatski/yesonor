import Link from "next/link";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss"
import { AiFillRightCircle as StartIcon } from "react-icons/ai";

export type Story = {
    id: number,
    title: string,
    quiz: string,
}

export const Stories: React.FC<{stories: Story[]}> = ({stories}) => {
    return <ul className={styles.container}>
        {stories.map((story) => {
            return <li key={story.id}>
                <Link href={`/stories/${story.id}`}>
                    <div className={styles.title}>
                        {story.title}
                    </div>
                    <p>
                        {story.quiz}
                    </p>
                </Link>
                <Link href={`/stories/${story.id}`} className={styles.iconContainer}>
                    <StartIcon className={components.iconButton} />
                </Link>
            </li>
        })}
    </ul>
}