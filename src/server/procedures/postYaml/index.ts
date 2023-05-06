import { procedure } from "@/server/trpc";
import { z } from "zod";
import { parseYaml } from "./parseYaml";

export const postYaml = procedure.input(z.object({
    yaml: z.string()
})).mutation(async ({input}) => {
    const parsed = parseYaml(input.yaml);
    if (!parsed.success) {
        return {
            success: false,
            errors: "入力が正しくありません。"
        }
    }
    return {
        success: true,
    }
})