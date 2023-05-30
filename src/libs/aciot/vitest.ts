import { AxiosInstance } from "axios";
import { AciotCore, CacheMode } from "./core";
import { afterAll, beforeAll } from "vitest";
import path from "path";
import filenamify from 'filenamify';

export const applyTestHooks = (
	axios: AxiosInstance,
	config: {
		mode: CacheMode;
	},
) => {
	let aciot: AciotCore | null;
	beforeAll(({ name, file }) => {
		if (!file?.name) {
			throw new Error("suite.file.name is not defined");
		}
		const parsedPath = path.parse(file.name);
		const filename = filenamify(name, { replacement: "_" });
		aciot = new AciotCore({
			cacheBasePath: path.resolve(
				process.cwd(),
				parsedPath.dir,
				"__data__",
				parsedPath.name + parsedPath.ext,
				filename
			),
		});
		aciot.applyInterceptors(axios, config.mode);
	});
	afterAll(async ({ name, tasks }) => {
		if (tasks.every((t) => t.result?.state === "pass")) {
			console.info(name, "Clearing unused cache...");
			await aciot?.clearUnusedCache();
		}
	});
};
