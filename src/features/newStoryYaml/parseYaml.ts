import { parse } from 'yaml'
import { storyInitYaml } from "./type";

export const parseYaml = (yaml: string) => {
    const parsed = parse(yaml);
    const typed = storyInitYaml.safeParse(parsed);
    return typed;
}