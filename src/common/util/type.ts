export type ToUnionWithField<T, F extends keyof T> = _ToUnionWithField<
	T,
	F,
	T[F]
>;

type _ToUnionWithField<T, F extends keyof T, FV extends T[F]> = FV extends never
	? never
	: T & Record<F, FV>;

type ObjectWithNullableField = {
	name: string;
	message: string | null;
};
type Unionized = ToUnionWithField<ObjectWithNullableField, "message">;

const expectNonError: (
	x: Unionized,
) => x is { message: string } & ObjectWithNullableField = (hoge: Unionized) => {
	return typeof hoge.message === "string";
};

// @ts-expect-error
const expectError: (
	x: ObjectWithNullableField,
) => x is { message: string } & ObjectWithNullableField = (
	hoge: ObjectWithNullableField,
) => {
	return typeof hoge.message === "string";
};

expectNonError({
	message: "hoge",
	name: "",
});
expectError({
	message: "hoge",
	name: "",
});
