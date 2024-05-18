import components from "@/designSystem/components.module.scss";
import { trpc } from "@/libs/trpc";
import type { Story } from "@/server/model/story";
import Link from "next/link";
import { useRouter } from "next/router";
import { use } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { useConfirmModal } from "../confirmModal";
import styles from "./styles.module.scss";

export type Props = {
	canUseFileDrop: boolean;
	initialStory: Story;
};

export const MyStoryMenu: React.FC<Props> = ({
	canUseFileDrop,
	initialStory,
}) => {
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
	const success = del.isSuccess || put.isSuccess || publish.isSuccess;
	const isLoading =
		del.isLoading ||
		put.isLoading ||
		publish.isLoading ||
		getUpdated.isFetching;
	const isError = del.error || put.error || publish.error;
	const confirm = useConfirmModal();
	return (
		<div className={styles.container} data-loading={isLoading}>
			{isLoading ? <div className={styles.loader} /> : null}
			<div className={styles.content}>
				{success || (
					<p className={styles.important}>
						{story.published
							? "このストーリーは公開中です。"
							: "このストーリーは未公開です。"}
					</p>
				)}
				{
					<>
						<div className={styles.buttons}>
							<Link
								className={components.buttonLink}
								href={`/my/stories/${storyId}/edit`}
							>
								編集
							</Link>
							<button
								className={components.buttonDanger}
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
							>
								削除
							</button>
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
						{canUseFileDrop && (
							<>
								<Link
									href={`/my/stories/${storyId}/edit?mode=file`}
									className={components.button0}
									data-size="small"
								>
									<AiOutlineUpload />
									YAMLファイルをアップロードして編集する
								</Link>
							</>
						)}
					</>
				}

				{isError ? (
					<p className={styles.error}>エラーが発生しました。</p>
				) : null}
			</div>
		</div>
	);
};
