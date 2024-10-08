"use client";
import { AnchorButton, GenericButton } from "@/designSystem/components/button";
import { Heading } from "@/designSystem/components/heading";
import type { StoryInit } from "@/server/model/story";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback } from "react";
import { YamlFileDrop } from "../storyYamlFileDrop";
import styles from "./styles.module.scss";

export const EditStoryYaml: React.FC<{
	story: {
		title: string;
		id: string;
	};
	saveStory: (data: StoryInit) => Promise<void>;
}> = ({ story, saveStory }) => {
	const router = useRouter();
	const { mutate, isIdle } = useMutation(saveStory);
	const storyId = story.id;

	const handleFileRead = useCallback(
		(story: StoryInit) => {
			mutate(story, {
				onSuccess: () => {
					router.push(`/stories/${storyId}`);
				},
			});
		},
		[storyId, mutate, router],
	);

	return (
		<div className={styles.container}>
			<Heading level={1}>{story.title}</Heading>
			<p>ストーリーをYAML形式で記述して編集できます。</p>
			{isIdle ? (
				<>
					<h2>YAMLファイルをアップロードして編集する</h2>
					<div className={styles.fileDropContainer}>
						<YamlFileDrop onFileRead={handleFileRead} />
					</div>
					<div className={styles.buttons}>
						<AnchorButton
							href="/howToWriteStory"
							target="_blank"
							rel="noreferrer"
							color="none"
							size="medium"
						>
							ストーリーの書き方
						</AnchorButton>
						<Link href={`/stories/${story.id}`}>
							<GenericButton color="none" size="medium">
								ストーリーに戻る
							</GenericButton>
						</Link>
					</div>
				</>
			) : (
				<p>編集中</p>
			)}
		</div>
	);
};
