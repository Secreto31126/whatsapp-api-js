// This file is a stud for the documentation.
// You shouldn't import it as it might execute code for different platforms.
/**
 * @module setup
 *
 * @description
 * Simplify the setup proccess of the WhatsAppAPI for different platforms
 *
 * @example
 * ```ts
 * import WhatsAppAPI from "whatsapp-api-js";
 * import { NodeNext } from "whatsapp-api-js/setup/node";
 *
 * const api = new WhatsAppAPI(NodeNext({
 *     token: "YOUR_TOKEN",
 *     appSecret: "YOUR_APP_SECRET"
 * }));
 * ```
 */
import Bun from "./bun.js";
import Deno from "./deno.js";
import Web from "./web.js";
export { Bun, Deno, Web };
export * from "./node.js";
//# sourceMappingURL=index.js.map