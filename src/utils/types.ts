export type NonEmptyArray<T> = [T, ...T[]];

export type SameArraySizes<T extends any[][]> = {
    [K in keyof T]: T[K] extends { length: T[0]["length"] } ? T[K] : never;
};
