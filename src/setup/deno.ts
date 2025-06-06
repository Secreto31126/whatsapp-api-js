import type { WhatsAppAPIConstructorArguments } from "../types.d.ts";

/**
 * A Deno quick setup for the WhatsAppAPI
 *
 * @remarks This method will return the same object as the one passed in
 *
 * @param settings - The WhatsAppAPI arguments
 * @returns A WhatsAppAPI arguments object for Deno
 */
export function Deno(
    settings: WhatsAppAPIConstructorArguments
): WhatsAppAPIConstructorArguments {
    return settings;
}
