"use client";
import { AnchorButton } from "@/designSystem/components/button";
import { Heading } from "@/designSystem/components/heading";
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
		<div className={styles.container}>
			<Heading level={1}>新しいストーリーを投稿</Heading>
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
					<AnchorButton
						href="/howToWriteStory"
						target="_blank"
						rel="noreferrer"
						color="none"
						size="medium"
					>
						ストーリーの書き方
					</AnchorButton>
				</>
			) : (
				<p>投稿中</p>
			)}
		</div>
	);
};
