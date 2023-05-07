import { parseYaml } from "./parseYaml";
import React, { useCallback, useState } from 'react';
import components from '@/styles/components.module.css';
import { StoryInit } from "@/server/procedures/post/type";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from './styles.module.scss';
import { FileDrop } from "@/components/fileDrop";

export const NewStoryYaml = () => {
    const router = useRouter();
    const { mutate, isIdle } = trpc.post.useMutation();

    const handleFileRead = useCallback((fileContent: string) => {
        const parsed = parseYaml(fileContent);
        if (parsed.success) {
            mutate(parsed.data, {
                onSuccess: (data) => {
                    router.push(`/stories/${data.id}/edit`);
                }
            });
        }
    }, [mutate, router]);

    return (
        <div className={styles.container}>
            <h2>新しいストーリーを投稿</h2>
            {
                isIdle ? <>
                    <p>当アプリはbeta版のため、YAML形式でのストーリーの投稿のみサポートしています。</p>
                    <div className={styles.fileDropContainer}>
                        <FileDrop onFileRead={handleFileRead} />
                    </div></> : <p>
                    投稿中
                </p>
            }
        </div>
    );
}
