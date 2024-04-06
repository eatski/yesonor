import { trpc } from "@/libs/trpc";
import React from "react";
import { useRouter } from "next/router";
import { StoryForm } from "../storyForm";
import { H1 } from "@/designSystem/components/heading";
import Link from "next/link";
import components from "@/designSystem/components.module.scss";
import { AiOutlineUpload } from "react-icons/ai";
import styles from "./styles.module.scss";
import { Device } from "@/common/util/device";

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
					<Link href="/stories/newYaml" className={components.button0}>
						<AiOutlineUpload />
						YAMLファイルをアップロードして投稿する
					</Link>
				</div>
			)}
			<StoryForm
				onSubmit={(input) => {
					mutate(input, {
						onSuccess: (e) => {
							router.push(`/my/stories/${e.id}`);
						},
					});
				}}
				isLoading={isLoading}
				isError={isError}
			/>
		</main>
	);
};
