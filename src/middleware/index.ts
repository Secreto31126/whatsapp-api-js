// This file is a stud for the documentation.
// You shouldn't import it as it might execute code for different frameworks.

/**
 * @module middleware
 *
 * @description
 * Simplify the setup proccess of WhatsAppAPI for different frameworks.
 *
 * @example
 * ```ts
 * import { WhatsAppAPI } from "whatsapp-api-js/middleware/deno";
 *
 * const Whatsapp = new WhatsAppAPI({
 *     token: "YOUR_TOKEN",
 *     appSecret: "YOUR_APP_SECRET"
 * });
 *
 * Deno.serve(async (req) => {
 *     if (req.method === "POST") {
 *         const status = await Whatsapp.handle_post(req);
 *         return new Response(null, { status });
 *     } else if (req.method === "GET") {
 *         const challenge = Whatsapp.handle_get(req);
 *         return new Response(challenge);
 *     }
 * });
 * ```
 *
 * @see {@link WhatsAppAPIMiddleware.handle_post}
 * @see {@link WhatsAppAPIMiddleware.handle_get}
 */

export { WhatsAppAPIMiddleware } from "./globals.js";
export { WhatsAppAPI as ExpressMiddleware } from "./express.js";
export { WhatsAppAPI as AdonisMiddleware } from "./adonis.js";
export { WhatsAppAPI as VercelMiddleware } from "./vercel.js";
export { WhatsAppAPI as DenoMiddleware } from "./deno.js";
export { WhatsAppAPI as BunMiddleware } from "./bun.js";
export { WhatsAppAPI as SvelteKitMiddleware } from "./sveltekit.js";
export { WhatsAppAPI as NextAppMiddleware } from "./next.js";
export { WhatsAppAPI as WebStandardMiddleware } from "./web-standard.js";
export { WhatsAppAPI as NodeHTTPMiddleware } from "./node-http.js";
