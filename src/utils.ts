export type AtLeastOne<T> = [T, ...T[]];

export type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

export function isInteger(n: unknown): n is number {
    return Number.isInteger(n);
}

export function escapeUnicode(str: string) {
    // https://stackoverflow.com/a/40558081
    return str.replace(/[^\0-~]/g, (ch) => {
        return "\\u" + ("000" + ch.charCodeAt(0).toString(16)).slice(-4);
    });
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;
