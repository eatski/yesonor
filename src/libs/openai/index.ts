import { OpenAI } from "openai";
export const openai = new OpenAI({
	// fetchを直接使うとmswの上書きが間に合わないので、fetchのwrapperにする。
	fetch: (...args) => fetch(...args),
	timeout: 20000,
});
