"use client";
import { trpc } from "@/libs/trpc";
import React from "react";
import { useRouter } from "next/navigation";
import { StoryForm } from "../storyForm";
import { H2 } from "@/common/components/h2";
import Link from "@/common/components/link";
import components from "@/styles/components.module.scss";
import { AiOutlineUpload } from "react-icons/ai";
import styles from "./styles.module.scss";
import { Device } from "@/common/util/device";
import { TrpcContextProvider } from "@/context/TrpcContext";

export type Props = {
	device: Device;
};

const NewStoryInner: React.FC<Props> = ({ device }) => {
	const { mutate, isError, isLoading } = trpc.post.useMutation();
	const router = useRouter();

	return (
		<>
			<H2>新しいストーリーを投稿</H2>
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
		</>
	);
};

export const NewStory: React.FC<Props> = ({ device }) => {
	return (
		<TrpcContextProvider>
			<NewStoryInner device={device} />
		</TrpcContextProvider>
	);
};
