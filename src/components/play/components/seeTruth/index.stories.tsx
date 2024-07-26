import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SeeTrurh } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SeeTrurh> = {
	title: "SeeTrurh",
	component: SeeTrurh,
};

export default meta;
type Story = StoryObj<typeof SeeTrurh>;
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
	args: {
		truth: "AIです。ホゲホゲホゲホゲ",
		onBackButtonClicked: fn(),
	},
};
