import React, { useCallback } from "react";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import { YamlFileDrop } from "../storyYamlFileDrop";
import { StoryHead, StoryInit } from "@/server/model/types";
import { H1 } from "@/designSystem/components/heading";
import components from "@/styles/components.module.scss";

export const EditStoryYaml: React.FC<{ initialStory: StoryHead }> = ({
	initialStory,
}) => {
	const router = useRouter();
	const { mutate, isIdle } = trpc.put.useMutation();

	const handleFileRead = useCallback(
		(story: StoryInit) => {
			mutate(
				{
					id: initialStory.id,
					story: story,
				},
				{
					onSuccess: () => {
						router.push(`/my/stories/${initialStory.id}`);
					},
				},
			);
		},
		[initialStory.id, mutate, router],
	);

	return (
		<main className={styles.container}>
			<H1>{initialStory.title}</H1>
			<p>ストーリーをYAML形式で記述して編集できます。</p>
			{isIdle ? (
				<>
					<h2>YAMLファイルをアップロードして編集する</h2>
					<div className={styles.fileDropContainer}>
						<YamlFileDrop onFileRead={handleFileRead} />
					</div>
					<div className={styles.buttons}>
						<a
							href="/howToWriteStory"
							target="_blank"
							className={components.buttonLink}
							rel="noreferrer"
						>
							ストーリーの書き方
						</a>
						<a
							href={`/my/stories/${initialStory.id}`}
							className={components.buttonLink}
						>
							ストーリーに戻る
						</a>
					</div>
				</>
			) : (
				<p>編集中</p>
			)}
		</main>
	);
};
