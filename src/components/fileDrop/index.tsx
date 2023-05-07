
import { useCallback } from 'react';
import styles from './styles.module.scss';

interface FileDropZoneProps {
    onFileRead: (fileContent: string) => void;
}

export const FileDrop: React.FC<FileDropZoneProps> = ({ onFileRead }) => {
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
            className={styles.container}
            onDrop={handleFileRead}
            onDragOver={handleDragOver}
        >
            ドラッグしてYAMLファイルを読み込む
        </div>
    );
};