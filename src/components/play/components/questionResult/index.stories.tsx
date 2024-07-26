import type { Meta, StoryObj } from "@storybook/react";

import { ReactQueryContextProvider } from "@/common/context/ReactQueryContextProvider";
import { Toast } from "@/components/toast";
import { fn } from "@storybook/test";
import { ComponentProps } from "react";
import { QuestionResult } from ".";

const ConfiguredQuestionResult = (
	props: ComponentProps<typeof QuestionResult>,
) => {
	return (
		<ReactQueryContextProvider>
			<Toast>
				<QuestionResult {...props} />
			</Toast>
		</ReactQueryContextProvider>
	);
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof QuestionResult> = {
	title: "QuestionResult",
	component: ConfiguredQuestionResult,
};

export default meta;
type Story = StoryObj<typeof QuestionResult>;
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WithAnswer: Story = {
	args: {
		question: "あなたは人間ですか？",
		answer: "はい",
		onAnswerButtonClicked: fn(),
	},
};

export const NoAnswer: Story = {
	args: {
		question: "あなたは人間ですか？",
		answer: null,
		onAnswerButtonClicked: fn(),
	},
};
