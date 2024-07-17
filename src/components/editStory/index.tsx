"use client";
import { Device } from "@/common/util/device";
import components from "@/designSystem/components.module.scss";
import { H1 } from "@/designSystem/components/heading";
import type { StoryInit } from "@/server/model/story";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { StoryForm } from "../storyForm";
import styles from "./styles.module.scss";

export type Props = {
	storyId: string;
	story: StoryInit;
	device: Device;
	onSubmit: (data: StoryInit) => Promise<void>;
};

export const EditStory: React.FC<Props> = ({
	storyId,
	story,
	device,
	onSubmit,
}) => {
	const { isLoading, mutate, isError } = useMutation(onSubmit);
	const router = useRouter();
	return (
		<main>
			<H1>{story.title}</H1>
			{device === "desktop" && (
				<div className={styles.navigation}>
					<Link
						href={`/stories/${storyId}/edit/yaml`}
						className={components.button0}
					>
						<AiOutlineUpload />
						YAMLファイルをアップロードして編集する
					</Link>
				</div>
			)}
			<StoryForm
				storyInit={story}
				onSubmit={(input) => {
					mutate(input, {
						onSuccess: () => {
							router.push(`/stories/${storyId}`);
						},
					});
				}}
				isLoading={isLoading}
				isError={isError}
			/>
		</main>
	);
};
