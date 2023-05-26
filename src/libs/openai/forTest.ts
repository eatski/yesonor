import { Configuration, OpenAIApi } from "openai";
import Axios,{ AxiosRequestConfig} from "axios";
import Cache from "file-system-cache";
import { resolve } from "path";
import { unlink } from "fs/promises";

class SholdUseCacheError extends Error {
    constructor(public readonly key: string) {
        super("SholdUseCacheError");
    }
}

const configToKey = (config: AxiosRequestConfig): string => {
    return JSON.stringify({
        url: config.url,
        body: config.data,
    });
}


export const createOpenaiForTest = (config: {
    apiKey: string | undefined,
    mode: "cache" | "real",
    namespace: string,
    cachePath: string,
}) => {
    const cache = Cache({
        basePath: config.cachePath,
        ns: config.namespace,
    });
    const axios = Axios.create();
    const usedCachePathToKey = new Map<string,string>();
    if(config.mode === "cache"){
        axios.interceptors.request.use((config) => {
            const key = configToKey(config)
            return Promise.reject(new SholdUseCacheError(key));
        })
        axios.interceptors.response.use(() => {},async (rejected) => {
            if(rejected instanceof SholdUseCacheError){
                return Promise.resolve({
                    data: await cache.get(rejected.key)
                })
            }
            return Promise.reject(rejected)
        })
    } else {
        axios.interceptors.response.use((res) => {
            const key = configToKey(res.config);
            usedCachePathToKey.set(cache.path(key), key);
            res.data.id = "test";
            res.data.created = new Date("2021-01-01");
            cache.set(key, res.data);
            return res
        })
    }
    return {
        openai: new OpenAIApi(
            new Configuration({
                apiKey: config.apiKey,
            }),
            undefined,
            axios
        ),
        clearUnusedCache: async () => {
            const caches = await cache.load();
            const pathes = caches.files.map((file) => file.path).filter((path) => !usedCachePathToKey.has(path));
            await Promise.all(pathes.map(unlink))
        }
    }
}

export const setupOpenaiForTest = (namespace: string) => {
    const cachePath = resolve(process.cwd(), ".resultSnapshots");
    const config = {
        apiKey: process.env.OPENAI_API_KEY,
        mode: process.env.CI ? "cache" : "real",
        namespace,
        cachePath,
    } as const
    return createOpenaiForTest(config);
}