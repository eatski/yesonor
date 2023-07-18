export type Public<T, F extends keyof T> = {
	[K in F]: DateToNumber<T[K]>;
} & {
	[K in Exclude<keyof T, F>]?: never;
};

export type Override<
	T extends Record<keyof U, unknown>,
	U extends Partial<Record<keyof T, unknown>>,
> = Omit<T, keyof U> & U;

type DateToNumber<T> = T extends Date ? number : T;
