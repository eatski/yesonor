import type { Meta, StoryObj } from "@storybook/react";

import { ReactQueryContextProvider } from "@/common/context/ReactQueryContextProvider";
import { Toast } from "@/components/toast";
import { fn } from "@storybook/test";
import { ComponentProps } from "react";
import { AnswerResult } from ".";

const ConfiguredAnswerResult = (props: ComponentProps<typeof AnswerResult>) => {
	return (
		<ReactQueryContextProvider>
			<Toast>
				<AnswerResult {...props} />
			</Toast>
		</ReactQueryContextProvider>
	);
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AnswerResult> = {
	title: "AnswerResult",
	component: ConfiguredAnswerResult,
};

export default meta;
type Story = StoryObj<typeof AnswerResult>;
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const NotCorrect: Story = {
	args: {
		solution: "solution",
		distance: 0.3,
		isCorrect: false,
		onBackButtonClicked: fn(),
		onSeeTruthButtonClicked: fn(),
		postStoryEvalution: fn(),
	},
};

export const Correct: Story = {
	args: {
		solution: "solution",
		isCorrect: true,
		truth: "truth",
		onBackButtonClicked: fn(),
		onSeeTruthButtonClicked: fn(),
		postStoryEvalution: fn(),
	},
};
