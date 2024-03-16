import { FileSystemCache } from "file-system-cache";
import { unlink } from "fs/promises";
import {
	DefaultBodyType,
	HttpResponse,
	StrictRequest,
	bypass,
	http,
} from "msw";
import { setupServer } from "msw/node";
import path from "path";

class ResponseCache {
	private readonly usedCachePath = new Set<string>();
	constructor(private readonly cache: FileSystemCache) {}
	private static async configToKey(
		config: StrictRequest<DefaultBodyType>,
	): Promise<string> {
		return JSON.stringify({
			url: config.url,
			body: await config.text(),
			method: config.method,
		});
	}
	public async get(
		configForKey: StrictRequest<DefaultBodyType>,
	): Promise<unknown> {
		const key = await ResponseCache.configToKey(configForKey);
		this.usedCachePath.add(this.cache.path(key));
		return this.cache.get(key);
	}
	public async set(
		configForKey: StrictRequest<DefaultBodyType>,
		value: unknown,
	) {
		const key = await ResponseCache.configToKey(configForKey);
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

export const initMswCacheServer = () => {
	const cache = new ResponseCache(
		new FileSystemCache({
			basePath: path.resolve(process.cwd(), ".msw-cache"),
		}),
	);
	return setupServer(
		http.all("*", async (req) => {
			const cached = await cache.get(req.request.clone());
			if (cached) {
				return HttpResponse.text(cached as string);
			} else {
				const response = await fetch(bypass(req.request));
				const text = await response.text();
				await cache.set(req.request, text);
				return HttpResponse.text(text);
			}
		}),
	);
};
