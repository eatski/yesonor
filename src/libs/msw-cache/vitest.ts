import { afterAll, beforeAll } from "vitest";
import { initMswCacheServer } from ".";
import path from "path";
import filenamify from "filenamify";

export const applyTestHooks = () => {
	let server: ReturnType<typeof initMswCacheServer> | null = null;
	beforeAll(({ name, file }) => {
		if (!file?.name) {
			throw new Error("suite.file.name is not defined");
		}
		const parserdPath = path.parse(file.name);
		const filename = filenamify(name, { replacement: "_" });
		server = initMswCacheServer(
			path.resolve(
				process.cwd(),
				parserdPath.dir,
				"__data__",
				parserdPath.name + parserdPath.ext,
				filename,
			),
		);
		server.listen();
	});
	afterAll(async ({ tasks }) => {
		if (tasks.every((t) => t.result?.state === "pass")) {
			await server?.close();
		}
	});
};
