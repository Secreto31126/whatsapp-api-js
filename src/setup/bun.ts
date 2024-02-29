import type { WhatsAppAPIConstructorArguments } from "../types";

/**
 * A Bun quick setup for the WhatsAppAPI
 *
 * @remarks This method will return the same object as the one passed in
 *
 * @param settings - The WhatsAppAPI arguments
 * @returns A WhatsAppAPI arguments object for Bun
 */
export function Bun(
    settings: WhatsAppAPIConstructorArguments
): WhatsAppAPIConstructorArguments {
    return settings;
}
