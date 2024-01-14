export type AtLeastOne<T> = [T, ...T[]];
export declare function isInteger(n: unknown): n is number;
export declare function escapeUnicode(str: string): string;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export {};
//# sourceMappingURL=utils.d.ts.map