"use client";
import styles from "./styles.module.scss";
import components from "@/styles/components.module.scss";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/navigation";
import { StoryInit } from "@/server/model/types";
import { YamlFileDrop } from "../storyYamlFileDrop";
import Link from "next/link";
import { TrpcContextProvider } from "@/context/TrpcContext";

export type Props = {
	storyId: string;
	published: boolean;
	canUseFileDrop: boolean;
};

export const MyStoryMenu: React.FC<Props> = (props) => {
	return (
		<TrpcContextProvider>
			<MyStoryMenuInner {...props} />
		</TrpcContextProvider>
	);
};

const MyStoryMenuInner: React.FC<Props> = ({
	storyId,
	published,
	canUseFileDrop,
}) => {
	const del = trpc.delete.useMutation();
	const put = trpc.put.useMutation();
	const publish = trpc.publish.useMutation();
	const success = del.isSuccess || put.isSuccess || publish.isSuccess;
	const isLoading = del.isLoading || put.isLoading || publish.isLoading;
	const isError = del.error || put.error || publish.error;
	const handleFileRead = (story: StoryInit) => {
		put.mutate(
			{
				id: storyId,
				story,
			},
			{
				onSuccess: () => {
					router.refresh();
				},
			},
		);
	};
	const router = useRouter();
	return (
		<div className={styles.container} data-loading={isLoading}>
			{isLoading ? <div className={styles.loader} /> : null}
			<div className={styles.content}>
				{success || (
					<p className={styles.important}>
						{published
							? "このストーリーは公開中です。"
							: "このストーリーは未公開です。"}
					</p>
				)}
				{success ? (
					<p>完了しました。画面をリロードします。</p>
				) : (
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
								onClick={() => {
									if (!confirm("本当に削除しますか？")) {
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
							{published || (
								<button
									className={components.button}
									onClick={() => {
										publish.mutate(
											{
												id: storyId,
											},
											{
												onSuccess: () => {
													router.refresh();
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
								<p>YAMLファイルでストーリーを修正</p>
								<div className={styles.fileDropContainer}>
									<YamlFileDrop onFileRead={handleFileRead} />
								</div>
							</>
						)}
					</>
				)}

				{isError ? (
					<p className={styles.error}>エラーが発生しました。</p>
				) : null}
			</div>
		</div>
	);
};
