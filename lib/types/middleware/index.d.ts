/**
 * @module middleware
 *
 * @description
 * Simplify the setup proccess of WhatsAppAPI for different frameworks.
 *
 * @example
 * ```ts
 * import WhatsAppAPI from "whatsapp-api-js/middleware/deno";
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
export { default as ExpressMiddleware } from "./express.js";
export { default as AdonisMiddleware } from "./adonis.js";
export { default as VercelMiddleware } from "./vercel.js";
export { default as DenoMiddleware } from "./deno.js";
export { default as BunMiddleware } from "./bun.js";
export { default as SvelteKitMiddleware } from "./sveltekit.js";
export { default as WebStandardMiddleware } from "./web-standard.js";
export { default as NodeHTTPMiddleware } from "./node-http.js";
//# sourceMappingURL=index.d.ts.map