import React, { useCallback } from 'react';
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from './styles.module.scss';
import { YamlFileDrop } from "../storyYamlFileDrop";
import { StoryInit } from "@/server/services/story/schema";
import { H2 } from '@/common/components/h2';
import components from '@/styles/components.module.scss';

export const NewStoryYaml: React.FC<{ canUseFileDrop: boolean }> = ({ canUseFileDrop }) => {
    const router = useRouter();
    const { mutate, isIdle } = trpc.post.useMutation();

    const handleFileRead = useCallback((story: StoryInit) => {
        mutate(story, {
            onSuccess: (data) => {
                router.push(`/my/stories/${data.id}`);
            }
        });
    }, [mutate, router]);

    return (
        <div className={styles.container}>
            <H2>新しいストーリーを投稿</H2>
            <p>YAML形式で記述したストーリーを投稿できます。</p>
            {
                isIdle ? <>
                    <h3>YAMLファイルをアップロードして投稿する</h3>
                    <div className={styles.fileDropContainer}>
                        <YamlFileDrop onFileRead={handleFileRead} canUseFileDrop={canUseFileDrop} />
                    </div>
                    <a href="/howToWriteStory" target="_blank" className={components.buttonLink}>
                        ストーリーの書き方
                    </a>
                </> : <p>投稿中</p>
            }
        </div>
    );
}
