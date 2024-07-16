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

export const nextCache = <F extends (...args: any) => any>(
	fn: F,
	...tailParameters: Tail<CacheFnParameters>
): ((
	...args: Parameters<F>
) => Promise<StringifyObject<Awaited<ReturnType<F>>>>) => {
	// @ts-ignore
	return unstable_cache(fn, ...tailParameters);
};
