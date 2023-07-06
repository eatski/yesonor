import { StoryInit } from "@/server/model/types";
import { useCallback, useState } from "react";
import { parseYaml } from "@/common/util/parseYaml";
import styles from "./styles.module.scss";

interface FileDropZoneProps {
	onFileRead: (story: StoryInit) => void;
}

export const YamlFileDrop: React.FC<FileDropZoneProps> = ({ onFileRead }) => {
	const [error, setError] = useState<string | null>(null);
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
				if (typeof fileContent !== "string") {
					setError("ファイルの読み込みに失敗しました。");
					return;
				}
				const story = parseYaml(fileContent);
				if (story.error != null) {
					setError(story.error);
					return;
				}
				onFileRead(story.data);
			};
			reader.readAsText(file);
		},
		[onFileRead],
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
			<p>ドラッグしてYAMLファイルを読み込む</p>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	);
};
