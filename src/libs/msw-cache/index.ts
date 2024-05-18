import { unlink } from "node:fs/promises";
import { FileSystemCache } from "file-system-cache";
import {
	http,
	type DefaultBodyType,
	HttpResponse,
	type StrictRequest,
	bypass,
} from "msw";
import { setupServer } from "msw/node";
class ResponseCache {
	private readonly usedCachePath = new Set<string>();
	constructor(private readonly cache: FileSystemCache) {}

	private static async configToRequestRecord(
		config: StrictRequest<DefaultBodyType>,
	): Promise<Record<string, unknown>> {
		return {
			url: config.url,
			body: await config.text(),
			method: config.method,
		};
	}
	public async get(
		configForKey: StrictRequest<DefaultBodyType>,
	): Promise<unknown> {
		const record = await ResponseCache.configToRequestRecord(configForKey);
		const key = await JSON.stringify(record);
		this.usedCachePath.add(this.cache.path(key));
		const cached = await this.cache.get(key);
		return cached.response;
	}
	public async set(
		configForKey: StrictRequest<DefaultBodyType>,
		value: unknown,
	) {
		const record = await ResponseCache.configToRequestRecord(configForKey);
		const key = await JSON.stringify(record);
		this.usedCachePath.add(this.cache.path(key));
		await this.cache.set(key, {
			request: record,
			response: value,
		});
	}
	public async clearUnusedCache() {
		const caches = await this.cache.load();
		const pathes = caches.files
			.map((file) => file.path)
			.filter((path) => !this.usedCachePath.has(path));
		await Promise.all(pathes.map(unlink));
	}
}

export const initMswCacheServer = (basePath: string) => {
	const cache = new ResponseCache(
		new FileSystemCache({
			basePath: basePath,
		}),
	);
	const server = setupServer(
		http.all("*", async (req) => {
			const cached = await cache.get(req.request.clone());
			if (typeof cached === "object") {
				return HttpResponse.json(cached);
			}
			const response = await fetch(bypass(req.request));
			if (response.status === 200) {
				const text = await response.clone().json();
				await cache.set(req.request, text);
			}
			return response;
		}),
	);
	return {
		listen: () => server.listen(),
		close: () => {
			server.close();
			return cache.clearUnusedCache();
		},
	};
};
