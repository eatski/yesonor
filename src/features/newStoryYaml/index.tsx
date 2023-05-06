import { parseYaml } from "./parseYaml";
import React, { useCallback, useState } from 'react';
import components from '@/styles/components.module.css';
import { StoryInit } from "@/server/procedures/post/type";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from './styles.module.scss';

interface FileDropZoneProps {
    onFileRead: (fileContent: string) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileRead }) => {
    const handleFileRead = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer.files;
            if (files.length === 0) return;

            const file = files[0];
            const reader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                const fileContent = event.target?.result;
                if (typeof fileContent === 'string') {
                    onFileRead(fileContent);
                }
            };
            reader.readAsText(file);
        },
        [onFileRead]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    return (
        <div
            className={styles.drag}
            onDrop={handleFileRead}
            onDragOver={handleDragOver}
        >
            ドラッグしてYAMLファイルを読み込む
        </div>
    );
};

export const NewStoryYaml = () => {
    const [yaml, setYaml] = useState<StoryInit | null>(null);

    const handleFileRead = useCallback((fileContent: string) => {
        const parsed = parseYaml(fileContent);
        if (parsed.success) {
            setYaml(parsed.data);
        }
    }, [setYaml]);

    return (
        <div className={styles.container}>
            <h2>新しいストーリーを投稿</h2>
            <p>当アプリはbeta版のため、YAML形式でのストーリーの投稿のみサポートしています。</p>
            {yaml ? <YamlParsed yaml={yaml}/> : <FileDropZone onFileRead={handleFileRead} />}
        </div>
    );
}

const YamlParsed = ({ yaml }: { yaml: StoryInit }) => {
    const router = useRouter();
    const { mutate, isLoading, isSuccess } = trpc.post.useMutation();
    if (isLoading) {
        return <p>投稿中</p>
    }

    if (isSuccess) {
        return <p>投稿しました。</p>
    }
    return <div className={styles.beforeSubmit}>
        <dl>
            <dt>タイトル</dt>
            <dd>{yaml.title}</dd>
            <dt>問題文</dt>
            <dd>{yaml.quiz}</dd>
        </dl>
        <button onClick={() => {
        mutate(yaml, {
            onSuccess: (data) => {
                router.push(`/stories/${data.id}`);
            }
        });
    }} className={components.button}>
       この内容で投稿する
    </button>
    </div>
}

