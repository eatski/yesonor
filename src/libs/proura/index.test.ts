import { setTimeout } from "timers/promises";
import { prepareProura } from ".";
import { describe, test, expect, vi } from "vitest";

describe("proura", () => {
	test("proura", async () => {
		const fn = vi.fn();
		const procs = prepareProura()
			.add("a", async () => {
				fn("a");
				await setTimeout(100);
				return 1;
			})
			.add("b", async (dependsOn) => {
				const a: number = await dependsOn("a");
				fn("b");
				return a + 1;
			})
			.add("c", async (dependsOn) => {
				const b: number = await dependsOn("b");
				fn("c");
				return b + 1;
			})
			.add("d", async () => {
				fn("d");
			});
		await expect(procs.exec()).resolves.toEqual({ a: 1, b: 2, c: 3 });
		expect(fn.mock.calls).toMatchInlineSnapshot(`
          [
            [
              "a",
            ],
            [
              "d",
            ],
            [
              "b",
            ],
            [
              "c",
            ],
          ]
        `);
	});
});
