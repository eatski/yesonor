import Axios, { AxiosError } from "axios";
import { Configuration, OpenAIApi } from "openai";

const axiosInstance = Axios.create();

axiosInstance.interceptors.response.use(
	(response) => response, // 成功時のresponseはそのまま返す
	(error) => {
		try {
			const axiosError = error as AxiosError;
			const { response } = axiosError;
			response && console.error("OpenAI Error", JSON.stringify(response.data));
		} catch (e) {}
		return Promise.reject(error);
	},
);

export const openai = new OpenAIApi(
	new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	}),
	undefined,
	axiosInstance,
);
