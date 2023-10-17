export type AtLeastOne<T> = [T, ...T[]] | [T];

export function isInteger(n: unknown): n is number {
    return Number.isInteger(n);
}
