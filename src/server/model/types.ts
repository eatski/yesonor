import { z } from "zod";
import {
	answer,
	questionExample,
	storyInit,
	truthCoincidence,
} from "./schemas";
import { Story as DbStory, User as DbUser } from "@prisma/client";

type Public<T, Private extends keyof T> = {
	[K in keyof T as K extends Private ? never : K]: DateToNumber<T[K]>;
} & {
	[K in Private]?: never;
};
type Override<
	T extends Record<keyof U, unknown>,
	U extends Partial<Record<keyof T, unknown>>,
> = Omit<T, keyof U> & U;

type DateToNumber<T> = T extends Date ? number : T;

export type User = Public<DbUser, "createdAt" | "oauthId">;

export type Story = Public<
	Override<
		DbStory,
		{
			questionExamples: z.infer<typeof questionExample>[];
		}
	> & {
		author: User;
	},
	"createdAt" | "authorId"
>;
export type StoryHead = Omit<
	Story,
	"questionExamples" | "truth" | "simpleTruth" | "createdAt"
>;
export type Answer = z.infer<typeof answer>;
export type TruthCoincidence = z.infer<typeof truthCoincidence>;
export type StoryInit = z.infer<typeof storyInit>;
export type QuestionExample = z.infer<typeof questionExample>;
