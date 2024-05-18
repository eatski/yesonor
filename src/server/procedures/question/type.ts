import type { QuestionExample } from "@/server/model/story";

export type QuestionExampleWithCustomMessage = QuestionExample & {
	customMessage: string;
};
