import { Configuration, OpenAIApi } from "openai";
import Axios,{ AxiosRequestConfig} from "axios";
import Cache from "file-system-cache";
import { resolve } from "path";

const cache = Cache({
    basePath: resolve(process.cwd(), ".resultSnapshots"),
});

class MyError extends Error {
    constructor(public readonly key: string) {
        super("MyError");
    }
}

const configToKey = (config: AxiosRequestConfig): string => {
    return JSON.stringify({
        url: config.url,
        body: config.data,
    });
}

const axios = Axios.create();
if(process.env.CI){
    axios.interceptors.request.use((config) => {
        const key = configToKey(config)
        return Promise.reject(new MyError(key));
    })
    axios.interceptors.response.use(() => {},async (rejected) => {
        if(rejected instanceof MyError){
            return Promise.resolve({
                data: await cache.get(rejected.key)
            })
        }
        return Promise.reject(rejected)
    })
} else {
    axios.interceptors.response.use((res) => {
        const key = configToKey(res.config);
        res.data.id = "test";
        res.data.created = new Date("2021-01-01");
        cache.set(key, res.data);
        return res
    })
}


export const openaiForTest = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    }),
    undefined,
    axios
)