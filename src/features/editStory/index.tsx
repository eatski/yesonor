import React, { useCallback } from 'react';
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from './styles.module.scss';
import { YamlFileDrop } from "../storyYamlFileDrop";
import { StoryInit } from "@/server/services/story/schema";
import components from "@/styles/components.module.scss";
import Link from 'next/link';

export const EditStoryYaml: React.FC<{ title: string, storyId: number }> = ({ title, storyId }) => {
    const router = useRouter();
    const { mutate, isIdle } = trpc.put.useMutation();

    const handleFileRead = useCallback((story: StoryInit) => {
        mutate({
            id: storyId,
            story
        }, {
            onSuccess: () => {
                router.push(`/stories/${storyId}/draft`);
            }
        });
    }, [mutate, router, storyId]);

    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            {
                isIdle ? <>
                    <h3>ストーリーを修正する</h3>
                    <div className={styles.fileDropContainer}>
                        <YamlFileDrop onFileRead={handleFileRead} />
                    </div>
                    <Link href={`/stories/${storyId}/draft`} className={components.buttonLink}>
                        戻る
                    </Link>
                </> : <p>
                    編集中
                </p>
                
            }
        </div>
    );
}
