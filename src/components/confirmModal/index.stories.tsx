import type { Meta, StoryObj } from "@storybook/react";

import { useConfirmModal } from ".";

const Component = () => {
	const { confirm, view } = useConfirmModal();
	return (
		<>
			{view}
			<button
				style={{
					width: "800px",
					height: "400px",
				}}
				onClick={async () => {
					alert(await confirm("confirm"));
				}}
			>
				confirm
			</button>
		</>
	);
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Component> = {
	title: "ConfirmModal",
	component: Component,
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
type Story = StoryObj<typeof Component>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {};
