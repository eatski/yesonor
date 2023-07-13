export const prepareProura = (): Proura<{}> => {
	return prepareInner({});
};

type FunctionMap<P> = {
	[K in keyof P]: (dependsOn: DependsOn<P>) => Promise<P[K]>;
};

const prepareInner = <P>(map: FunctionMap<P>): Proura<P> => {
	return {
		add: <K extends string, T>(
			name: K,
			fn: (dependsOn: DependsOn<P>) => Promise<T> | T,
		) => {
			return prepareInner<P & Record<K, T>>(
				//@ts-expect-error
				{
					...map,
					[name]: fn,
				},
			);
		},
		exec: async () => {
			const promises = {} as {
				[K in keyof P]?: Promise<P[K]>;
			};
			const results = {} as {
				[K in keyof P]?: P[K];
			};
			const dependsOn = <K extends keyof P>(key: K): Promise<P[K]> => {
				const promise = promises[key];
				if (!promise) {
					throw new Error(`dependsOn: ${key.toString()} is not defined`);
				}
				return promise;
			};

			await Promise.all(
				Object.entries(map).map(async ([key, fn]) => {
					const promise = (fn as (dependsOn: any) => Promise<any>)(dependsOn);
					promises[key as keyof P] = promise;
					const result = await promise;
					results[key as keyof P] = result;
				}),
			);
			return results as P;
		},
	};
};

type DependsOn<P> = {
	<K extends keyof P>(key: K): Promise<P[K]>;
};

type Proura<P> = {
	add: <K extends string, T>(
		name: K,
		fn: (dependsOn: DependsOn<P>) => Promise<T> | T,
	) => Proura<P & Record<K, T>>;
	exec: () => Promise<P>;
};
