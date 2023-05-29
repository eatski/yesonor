import { AxiosInstance } from "axios";
import { AciotCore, CacheMode } from "./core";
import { afterAll, beforeAll } from "vitest";

export const applyTestHooks = (
	axios: AxiosInstance,
	config: {
		cacheBasePath: string;
		mode: CacheMode;
	},
) => {
	let aciot: AciotCore | null;
	beforeAll(({ suite }) => {
		if (!suite?.file) {
			throw new Error("suite is undefined");
		}
		aciot = new AciotCore({
			namespace: suite.name,
			cacheBasePath: config.cacheBasePath,
		});
		aciot.applyInterceptors(axios, config.mode);
	});
	afterAll(async ({ tasks }) => {
		if (tasks.every((t) => t.result?.state === "pass")) {
			await aciot?.clearUnusedCache();
		}
	});
};
