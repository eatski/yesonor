import React, { useCallback } from "react";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import { YamlFileDrop } from "../storyYamlFileDrop";
import { StoryInit } from "@/server/model/types";
import { H1 } from "@/common/components/heading";
import components from "@/styles/components.module.scss";

export const NewStoryYaml: React.FC = () => {
	const router = useRouter();
	const { mutate, isIdle } = trpc.post.useMutation();

	const handleFileRead = useCallback(
		(story: StoryInit) => {
			mutate(story, {
				onSuccess: (data) => {
					router.push(`/my/stories/${data.id}`);
				},
			});
		},
		[mutate, router],
	);

	return (
		<div className={styles.container}>
			<H1>新しいストーリーを投稿</H1>
			<p>YAML形式で記述したストーリーを投稿できます。</p>
			{isIdle ? (
				<>
					<h3>YAMLファイルをアップロードして投稿する</h3>
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
		</div>
	);
};
