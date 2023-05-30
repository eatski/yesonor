import { Configuration, OpenAIApi } from "openai";
import Axios from "axios";
import { applyTestHooks } from "../aciot/vitest";

export const setupOpenaiForTest = () => {
	const axios = Axios.create();
	applyTestHooks(axios, {
		mode: process.env.CI ? "cacheOnly" : "requestIfNoCacheHit",
	});
	return new OpenAIApi(
		new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		}),
		undefined,
		axios,
	);
};
