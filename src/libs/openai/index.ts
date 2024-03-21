import { OpenAI } from "openai";
export const openai = new OpenAI({
	// fetchを直接使うとmswの上書きが間に合わないので、fetchのwrapperにする。
	fetch: (...args) => fetch(...args),
	timeout: 20000,
	apiKey: process.env.OPENAI_API_KEY || "dummy",
});
