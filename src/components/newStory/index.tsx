"use client";
import type { Device } from "@/common/util/device";
import {
	ButtonIconWrapper,
	GenericButton,
} from "@/designSystem/components/button";
import { Heading } from "@/designSystem/components/heading";
import { StoryInit } from "@/server/model/story";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { StoryForm } from "../storyForm";
import styles from "./styles.module.scss";

export type Props = {
	device: Device;
	createStory: (data: StoryInit) => Promise<string>;
};

export const NewStory: React.FC<Props> = ({ device, createStory }) => {
	const router = useRouter();
	const { mutateAsync, isError, isLoading } = useMutation(createStory);

	return (
		<div className={styles.container}>
			<Heading level={1}>新しいストーリーを投稿</Heading>
			{device === "desktop" && (
				<div className={styles.navigation}>
					<Link href={`/stories/new/yaml`}>
						<GenericButton color={"zero"} size={"small"}>
							<ButtonIconWrapper>
								<AiOutlineUpload />
							</ButtonIconWrapper>
							YAMLファイルをアップロードして投稿する
						</GenericButton>
					</Link>
				</div>
			)}
			<StoryForm
				onSubmit={async (input) => {
					const id = await mutateAsync(input);
					router.push(`/stories/${id}`);
				}}
				isLoading={isLoading}
				isError={isError}
			/>
		</div>
	);
};
