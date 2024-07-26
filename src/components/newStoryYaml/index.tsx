"use client";
import components from "@/designSystem/components.module.scss";
import { H1 } from "@/designSystem/components/heading";
import type { StoryInit } from "@/server/model/story";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import { YamlFileDrop } from "../storyYamlFileDrop";
import styles from "./styles.module.scss";

export const NewStoryYaml: React.FC<{
	createStory: (story: StoryInit) => Promise<string>;
}> = ({ createStory }) => {
	const router = useRouter();
	const { mutateAsync, isIdle } = useMutation(createStory);

	return (
		<main className={styles.container}>
			<H1>新しいストーリーを投稿</H1>
			<p>YAML形式で記述したストーリーを投稿できます。</p>
			{isIdle ? (
				<>
					<h2>YAMLファイルをアップロードして投稿する</h2>
					<div className={styles.fileDropContainer}>
						<YamlFileDrop
							onFileRead={async (story) => {
								const id = await mutateAsync(story);
								router.push(`/stories/${id}`);
							}}
						/>
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
