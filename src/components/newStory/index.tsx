"use client";
import type { Device } from "@/common/util/device";
import components from "@/designSystem/components.module.scss";
import { H1 } from "@/designSystem/components/heading";
import { trpc } from "@/libs/trpc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { StoryForm } from "../storyForm";
import styles from "./styles.module.scss";

export type Props = {
	device: Device;
};

export const NewStory: React.FC<Props> = ({ device }) => {
	const { mutate, isError, isLoading } = trpc.story.post.useMutation();
	const router = useRouter();

	return (
		<main>
			<H1>新しいストーリーを投稿</H1>
			{device === "desktop" && (
				<div className={styles.navigation}>
					<Link href="/stories/new/yaml" className={components.button0}>
						<AiOutlineUpload />
						YAMLファイルをアップロードして投稿する
					</Link>
				</div>
			)}
			<StoryForm
				onSubmit={(input) => {
					mutate(input, {
						onSuccess: (e) => {
							router.push(`/stories/${e.id}`);
						},
					});
				}}
				isLoading={isLoading}
				isError={isError}
			/>
		</main>
	);
};
