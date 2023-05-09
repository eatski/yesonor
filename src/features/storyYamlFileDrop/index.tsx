
import { StoryInit } from "@/server/services/story/schema";;
import { useCallback } from 'react';
import { parseYaml } from './parseYaml';
import styles from './styles.module.scss';

interface FileDropZoneProps {
    onFileRead: (story: StoryInit) => void;
}

export const YamlFileDrop: React.FC<FileDropZoneProps> = ({ onFileRead }) => {
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
                if (typeof fileContent !== 'string') {
                    // TODO: error handling
                    return;
                }
                const story = parseYaml(fileContent);
                if(!story.success) {
                    // TODO: error handling
                    return;
                }
                onFileRead(story.data);
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
            className={styles.container}
            onDrop={handleFileRead}
            onDragOver={handleDragOver}
        >
            ドラッグしてYAMLファイルを読み込む
        </div>
    );
};