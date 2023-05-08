import React, { useCallback } from 'react';
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from './styles.module.scss';
import { YamlFileDrop } from "../storyYamlFileDrop";
import { StoryInit } from "@/server/procedures/schema";

export const NewStoryYaml = () => {
    const router = useRouter();
    const { mutate, isIdle } = trpc.post.useMutation();

    const handleFileRead = useCallback((story: StoryInit) => {
        mutate(story, {
            onSuccess: (data) => {
                router.push(`/stories/${data.id}/draft`);
            }
        });
    }, [mutate, router]);

    return (
        <div className={styles.container}>
            <h2>新しいストーリーを投稿</h2>
            <p>当アプリはbeta版のため、YAML形式でのストーリーの投稿のみサポートしています。</p>
            {
                isIdle ? <>
                   <h3>YAMLファイルをアップロードして投稿する</h3>
                    <div className={styles.fileDropContainer}>
                        <YamlFileDrop onFileRead={handleFileRead} />
                    </div></> : <p>
                    投稿中
                </p>
            }
        </div>
    );
}
