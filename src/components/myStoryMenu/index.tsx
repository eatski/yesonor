"use client";
import { useConfirmModal } from "@/components/confirmModal";
import {
	Button,
	ButtonIconWrapper,
	GenericButton,
} from "@/designSystem/components/button";
import { ToggleButton } from "@/designSystem/components/toggle";
import type { Story } from "@/server/model/story";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import styles from "./styles.module.scss";

export type Props = {
	story: Story;
	deleteStory: () => Promise<void>;
	toggleStoryPublic: () => Promise<void>;
};

export const MyStoryMenu: React.FC<Props> = ({
	story,
	deleteStory,
	toggleStoryPublic,
}) => {
	const storyId = story.id;
	const del = useMutation(deleteStory);
	const toggle = useMutation(toggleStoryPublic);
	const router = useRouter();
	const isLoading = del.isLoading || toggle.isLoading;
	const isError = del.error || toggle.error;
	const { confirm, view } = useConfirmModal();
	const toggleId = useId();

	return (
		<>
			{view}
			<div className={styles.container} data-loading={isLoading}>
				{isLoading ? <div className={styles.loader} /> : null}
				<div className={styles.content}>
					{
						<>
							<div className={styles.buttons}>
								<div className={styles.toggleWithLabel}>
									<ToggleButton
										id={toggleId}
										isOn={story.published}
										onToggle={() => {
											toggle.mutate();
										}}
									/>
									<label htmlFor={toggleId}>
										{story.published ? "公開中" : "公開する"}
									</label>
								</div>
								<Link href={`/stories/${storyId}/edit`}>
									<GenericButton color={"zero"} size={"medium"}>
										<ButtonIconWrapper>
											<AiFillEdit />
										</ButtonIconWrapper>
										編集
									</GenericButton>
								</Link>
								<Button
									onClick={async () => {
										if (!(await confirm("本当に削除しますか？"))) {
											return;
										}
										await del.mutateAsync();
										router.push(`/users/${story.author.id}/stories`);
									}}
									disabled={isLoading}
									color="zero"
									size="medium"
								>
									<ButtonIconWrapper>
										<AiFillDelete />
									</ButtonIconWrapper>
									削除
								</Button>
							</div>
						</>
					}

					{isError ? (
						<p className={styles.error}>エラーが発生しました。</p>
					) : null}
				</div>
			</div>
		</>
	);
};
