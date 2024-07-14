"use client";
import components from "@/designSystem/components.module.scss";
import { H1 } from "@/designSystem/components/heading";
import { trpc } from "@/libs/trpc";
import type { StoryInit } from "@/server/model/story";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback } from "react";
import { YamlFileDrop } from "../storyYamlFileDrop";
import styles from "./styles.module.scss";

export const NewStoryYaml: React.FC = () => {
	const router = useRouter();
	const { mutate, isIdle } = trpc.story.post.useMutation();

	const handleFileRead = useCallback(
		(story: StoryInit) => {
			mutate(story, {
				onSuccess: (data) => {
					router.push(`/stories/${data.id}`);
				},
			});
		},
		[mutate, router],
	);

	return (
		<main className={styles.container}>
			<H1>新しいストーリーを投稿</H1>
			<p>YAML形式で記述したストーリーを投稿できます。</p>
			{isIdle ? (
				<>
					<h2>YAMLファイルをアップロードして投稿する</h2>
					<div className={styles.fileDropContainer}>
						<YamlFileDrop onFileRead={handleFileRead} />
					</div>
					<a
						href="/howToWriteStory"
						target="_blank"
						className={components.buttonLink}
						rel="noreferrer"
					>
						ストーリーの書き方
					</a>
				</>
			) : (
				<p>投稿中</p>
			)}
		</main>
	);
};
