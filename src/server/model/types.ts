import { z } from "zod";
import {
	answer,
	questionExample,
	story,
	storyInit,
	truthCoincidence,
} from "./schemas";

type Public<T, Private extends keyof T> = {
	[K in keyof T as K extends Private ? never : K]: DateToNumber<T[K]>;
} & {
	[K in Private]?: never;
};

type DateToNumber<T> = T extends Date ? number : T;

export type Story = Public<z.infer<typeof story>, "authorEmail" | "createdAt">;
export type StoryHead = Public<
	Story,
	"questionExamples" | "truth" | "simpleTruth" | "authorEmail" | "createdAt"
>;
export type Answer = z.infer<typeof answer>;
export type TruthCoincidence = z.infer<typeof truthCoincidence>;
export type StoryInit = z.infer<typeof storyInit>;
export type QuestionExample = z.infer<typeof questionExample>;
