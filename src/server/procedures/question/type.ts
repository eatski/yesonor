import { QuestionExample } from "@/server/model/types";

export type QuestionExampleWithCustomMessage = QuestionExample & {
	customMessage: string;
};
