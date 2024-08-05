import type { Meta, StoryObj } from "@storybook/react";
import { StoryDescription } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof StoryDescription> = {
	title: "StoryDescription",
	component: StoryDescription,
};

export default meta;
type Story = StoryObj<typeof StoryDescription>;
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
	args: {
		story: {
			id: "1",
			title: "タイトル",
			quiz: "水平思考クイズの問題文",
			publishedAt: new Date().getDate(),
			published: true,
			author: {
				id: "1",
				name: "名前",
			},
		},
	},
};

export const LongName: Story = {
	args: {
		story: {
			id: "1",
			title: "タイトル",
			quiz: "水平思考クイズの問題文",
			publishedAt: new Date().getDate(),
			published: true,
			author: {
				id: "1",
				name: "長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い",
			},
		},
	},
};
