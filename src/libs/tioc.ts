import { resolve } from "node:path";
import Cache from "file-system-cache";

export const initTioc = <T>(fetcher: (key: string) => Promise<T>) => {
	const cache = Cache({
		basePath: resolve(process.cwd(), ".cache"),
	});
	const getCached = async (key: string): Promise<T> => {
		const cached = await cache.get(key);
		if (cached) {
			return cached;
		}
		const value = await fetcher(key);
		await cache.set(key, value);
		return value;
	};
	return {
		getCached,
	};
};
