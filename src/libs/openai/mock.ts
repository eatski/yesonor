import { Configuration, OpenAIApi } from "openai";

export const openaiMock = new OpenAIApi(
    new Configuration(),
    "https://example.com"
)