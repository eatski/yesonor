import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";
import { ToastMessage } from "./ToastMessage";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ToastMessage> = {
	title: "ToastMessage",
	component: ToastMessage,
};

export default meta;
type Story = StoryObj<typeof ToastMessage>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
	args: {
		text: "こんにちは今日もいい天気",
		onDeleteClick: fn(),
	},
};
