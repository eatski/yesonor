"use client";
import { useConfirmModal } from "@/components/confirmModal";
import { useToast } from "@/components/toast";
import components from "@/designSystem/components.module.scss";
import {
	Button,
	ButtonIconWrapper,
	GenericButton,
} from "@/designSystem/components/button";
import { ToggleWithLabel } from "@/designSystem/components/toggle";
import { trpc } from "@/libs/trpc";
import type { Story } from "@/server/model/story";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import styles from "./styles.module.scss";

export type Props = {
	initialStory: Story;
};

export const MyStoryMenu: React.FC<Props> = ({ initialStory }) => {
	const storyId = initialStory.id;
	const getUpdated = trpc.story.getByIdPrivate.useQuery(
		{
			id: storyId,
		},
		{
			enabled: false,
		},
	);
	const story = getUpdated.data ?? initialStory;

	const del = trpc.story.delete_.useMutation();
	const put = trpc.story.put.useMutation();
	const publish = trpc.story.publishFirst.useMutation();
	const router = useRouter();
	const isLoading =
		del.isLoading ||
		put.isLoading ||
		publish.isLoading ||
		getUpdated.isFetching;
	const isError = del.error || put.error || publish.error;
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
									label={story.published ? "公開中" : "未公開"}
									onToggle={() => {
										if (!story.published) {
											publish.mutate(
												{
													id: storyId,
												},
												{
													onSuccess: () => {
														getUpdated.refetch();
													},
												},
											);
										} else {
											toast("ストーリーの非公開機能はまだ実装されていません。");
										}
									}}
									isOn={story.published}
								/>
								<Link href={`/my/stories/${storyId}/edit`}>
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
										del.mutate(
											{
												id: storyId,
											},
											{
												onSuccess: () => {
													router.push("/my/stories");
												},
											},
										);
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
								{story.published || (
									<button
										className={components.button}
										onClick={() => {
											publish.mutate(
												{
													id: storyId,
												},
												{
													onSuccess: () => {
														getUpdated.refetch();
													},
												},
											);
										}}
										disabled={isLoading}
									>
										公開
									</button>
								)}
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
