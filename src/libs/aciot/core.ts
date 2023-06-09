import { AxiosInstance, AxiosRequestConfig } from "axios";
import FsCache, { FileSystemCache } from "file-system-cache";
import { unlink } from "fs/promises";

class AxiosResponseCache {
	private readonly usedCachePath = new Set<string>();
	constructor(private readonly cache: FileSystemCache) {}
	private static configToKey(config: AxiosRequestConfig): string {
		return JSON.stringify({
			url: config.url,
			body: config.data,
		});
	}
	public get(configForKey: AxiosRequestConfig): Promise<unknown> {
		const key = AxiosResponseCache.configToKey(configForKey);
		this.usedCachePath.add(this.cache.path(key));
		return this.cache.get(key);
	}
	public async set(configForKey: AxiosRequestConfig, value: unknown) {
		const key = AxiosResponseCache.configToKey(configForKey);
		this.usedCachePath.add(this.cache.path(key));
		await this.cache.set(key, value);
	}
	public async clearUnusedCache() {
		const caches = await this.cache.load();
		const pathes = caches.files
			.map((file) => file.path)
			.filter((path) => !this.usedCachePath.has(path));
		await Promise.all(pathes.map(unlink));
	}
}

class ShouldUseCacheError extends Error {
	constructor(public readonly cache: unknown) {
		super("ShouldUseCacheError");
	}
}

export type CacheMode = "cacheOnly" | "requestIfNoCacheHit";

export class AciotCore {
	private readonly cache: AxiosResponseCache;
	constructor(config: {
		cacheBasePath: string;
	}) {
		this.cache = new AxiosResponseCache(
			FsCache({
				basePath: config.cacheBasePath,
			}),
		);
	}
	public applyInterceptors(axios: AxiosInstance, cacheMode: CacheMode) {
		const useCache = async (rejected: unknown) => {
			if (rejected instanceof ShouldUseCacheError) {
				return {
					data: rejected.cache,
				};
			}
			throw rejected;
		};
		switch (cacheMode) {
			case "cacheOnly":
				axios.interceptors.request.use(async (config) => {
					const cache = await this.cache.get(config);
					if (cache) {
						throw new ShouldUseCacheError(cache);
					}
					throw new Error("Cache not found");
				});
				axios.interceptors.response.use(() => {}, useCache);
				break;

			case "requestIfNoCacheHit":
				axios.interceptors.request.use(async (config) => {
					const cache = await this.cache.get(config);
					if (cache) {
						throw new ShouldUseCacheError(cache);
					}
					console.info("Cache not found. Requesting...");
					return config;
				});
				axios.interceptors.response.use(async (res) => {
					if (res.status === 200 && res.data) {
						await this.cache.set(res.config, res.data);
					}
					return res;
				}, useCache);
		}
	}
	public async clearUnusedCache() {
		await this.cache.clearUnusedCache();
	}
}
