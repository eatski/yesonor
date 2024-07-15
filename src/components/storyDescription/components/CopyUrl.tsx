"use client";
import { Button, ButtonIconWrapper } from "@/designSystem/components/button";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";
import { useToast } from "../../toast";
export const CopyUrl: React.FC<{ url: string }> = ({ url }) => {
	const toast = useToast();

	return (
		<CopyToClipboard
			text={url}
			onCopy={() => {
				toast("URLをコピーしました。");
			}}
		>
			<Button color="none" size="small">
				<ButtonIconWrapper>
					<AiOutlineCopy role="presentation" />
				</ButtonIconWrapper>
				URLをコピー
			</Button>
		</CopyToClipboard>
	);
};
