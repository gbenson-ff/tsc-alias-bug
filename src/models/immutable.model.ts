/**
 * Describes a deeply-readonly array type
 *
 * @public
 */
export type ImmutableArray<T> = readonly Immutable<T>[];

/**
 * Describes a deeply-readonly object type
 *
 * @public
 */
export type ImmutableObject<T> = {
	readonly [P in keyof T]: Immutable<T[P]>;
};

/**
 * Describes a deeply-readonly type
 *
 * @public
 */
export type Immutable<T> =
	T extends (infer R)[] ? ImmutableArray<R> :
		// eslint-disable-next-line @typescript-eslint/ban-types
		T extends Function ? T :
			T extends object ? ImmutableObject<T> :
				T;
