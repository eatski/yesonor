import type { Meta, StoryObj } from "@storybook/react";

import { Toast, useToast } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Toast> = {
	title: "Toast",
	component: Toast,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Toast>;

const Child = () => {
	const toast = useToast();

	return (
		<button
			onClick={() => {
				toast("こんにちは今日もいい天気");
			}}
		>
			toast
		</button>
	);
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
	args: {
		children: <Child />,
	},
};
