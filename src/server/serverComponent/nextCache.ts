import { unstable_cache } from "next/cache";

type StringifyObject<T> = T extends Date
	? string
	: T extends (infer U)[]
		? StringifyObject<U>[]
		: T extends object
			? { [K in keyof T]: StringifyObject<T[K]> }
			: T;

type CacheFnParameters = Parameters<typeof unstable_cache>;
type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

export const nextCache = <T>(
	fn: () => Promise<T>,
	...tailParameters: Tail<CacheFnParameters>
): (() => Promise<StringifyObject<T>>) => {
	// @ts-ignore
	return unstable_cache(fn, ...tailParameters);
};
