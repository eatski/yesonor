"use client";
import { useConfirmModal } from "@/components/confirmModal";
import { useToast } from "@/components/toast";
import {
	Button,
	ButtonIconWrapper,
	GenericButton,
} from "@/designSystem/components/button";
import { ToggleWithLabel } from "@/designSystem/components/toggle";
import type { Story } from "@/server/model/story";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import styles from "./styles.module.scss";

export type Props = {
	story: Story;
	deleteStory: () => Promise<void>;
	publishStory: () => Promise<void>;
};

export const MyStoryMenu: React.FC<Props> = ({
	story,
	deleteStory,
	publishStory,
}) => {
	const storyId = story.id;
	const del = useMutation(deleteStory);
	const publish = useMutation(publishStory);
	const router = useRouter();
	const isLoading = del.isLoading || publish.isLoading;
	const isError = del.error || publish.error;
	const { confirm, view } = useConfirmModal();
	const toast = useToast();

	return (
		<>
			{view}
			<div className={styles.container} data-loading={isLoading}>
				{isLoading ? <div className={styles.loader} /> : null}
				<div className={styles.content}>
					{
						<>
							<div className={styles.buttons}>
								<ToggleWithLabel
									label={story.published ? "公開中" : "公開する"}
									onToggle={() => {
										if (!story.published) {
											publish.mutate();
										} else {
											toast("ストーリーの非公開機能はまだ実装されていません。");
										}
									}}
									isOn={story.published}
								/>
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
