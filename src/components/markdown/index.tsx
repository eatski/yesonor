"use client";
import components from "@/designSystem/components.module.scss";
import type React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as highlightStyles } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useToast } from "../toast";
import styles from "./styles.module.scss";

export type Props = {
	source: string;
};

const CopyButton = ({ text }: { text: string }) => {
	const toast = useToast();
	return (
		<CopyToClipboard
			text={text}
			onCopy={() => {
				toast("クリップボードにコピーしました");
			}}
		>
			<button className={components.buttonLink}>copy</button>
		</CopyToClipboard>
	);
};

export const Markdown: React.FC<Props> = ({ source }) => {
	return (
		<ReactMarkdown
			className={styles.container}
			components={{
				code: (props) => {
					const language = "yaml";
					return (
						<div className={styles.syntaxHighlight}>
							<div className={styles.copyButtonContainer}>
								<CopyButton text={props.children as string} />
							</div>
							<SyntaxHighlighter
								style={highlightStyles}
								language={language}
								customStyle={{
									fontSize: "14px",
								}}
							>
								{props.children as string}
							</SyntaxHighlighter>
						</div>
					);
				},
				// HACK: SyntaxHighlighterがpreを出力してくるので、1つ削除する
				pre: (props) => {
					return <>{props.children}</>;
				},
			}}
		>
			{source}
		</ReactMarkdown>
	);
};
