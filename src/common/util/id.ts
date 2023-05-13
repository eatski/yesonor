import { generate } from "randomstring"

export const generateId = () => {
    return generate(15);
}