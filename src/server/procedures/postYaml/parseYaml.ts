import { parse } from 'yaml'
import { storyInput } from "./type";

export const parseYaml = (yaml: string) => {
    const parsed = parse(yaml);
    const typed = storyInput.safeParse(parsed);
    return typed;
}