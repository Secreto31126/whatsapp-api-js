import type { WhatsAppAPIConstructorArguments } from "../types.d.ts";

// If this line of code didn't exist,
// setup would be a single file rather than a folder
import { webcrypto } from "node:crypto";

/**
 * A Node\@^19 quick setup for the WhatsAppAPI
 *
 * @remarks This method will return the same object as the one passed in
 *
 * @param settings - The WhatsAppAPI arguments
 * @returns A WhatsAppAPI arguments object for Node\@^19
 */
export function NodeNext(
    settings: WhatsAppAPIConstructorArguments
): WhatsAppAPIConstructorArguments {
    return settings;
}

/**
 * A Node\@18 quick setup for the WhatsAppAPI
 *
 * @remarks Assumes that the fetch function is available globally
 *
 * @deprecated Node 18 reached EoL and is no longer supported by the library
 * @param settings - The WhatsAppAPI arguments
 * @returns A WhatsAppAPI arguments object for Node\@^18
 */
export function Node18(
    settings: WhatsAppAPIConstructorArguments
): WhatsAppAPIConstructorArguments {
    return {
        ...settings,
        ponyfill: {
            subtle: webcrypto.subtle,
            ...settings.ponyfill
        }
    };
}

/**
 * A Node 15 to 17 quick setup for the WhatsAppAPI
 *
 * @deprecated Node 15 to 17 reached EoL and are no longer supported by the library
 * @param settings - The WhatsAppAPI arguments
 * @param fetch_ponyfill - The fetch ponyfill function to use (e.g. node-fetch or undici)
 * @returns A WhatsAppAPI arguments object for Node 15 to 17
 */
export function Node15(
    settings: WhatsAppAPIConstructorArguments,
    fetch_ponyfill: typeof fetch
): WhatsAppAPIConstructorArguments {
    return {
        ...settings,
        ponyfill: {
            fetch: fetch_ponyfill,
            subtle: webcrypto.subtle,
            ...settings.ponyfill
        }
    };
}
