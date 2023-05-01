"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node12 = exports.Node18 = exports.NodeNext = void 0;
// If this line of code didn't exist,
// setup would be a single file rather than a folder
const node_crypto_1 = require("node:crypto");
/**
 * A Node\@^19 quick setup for the WhatsAppAPI
 *
 * @remarks This method will return the same object as the one passed in
 *
 * @param settings - The WhatsAppAPI arguments
 * @returns A WhatsAppAPI arguments object for Node\@^19
 */
function NodeNext(settings) {
    return settings;
}
exports.NodeNext = NodeNext;
/**
 * A Node\@18 quick setup for the WhatsAppAPI
 *
 * @remarks Assumes that the fetch function is available globally
 *
 * @param settings - The WhatsAppAPI arguments
 * @returns A WhatsAppAPI arguments object for Node\@^18
 */
function Node18(settings) {
    return {
        ...settings,
        ponyfill: {
            subtle: node_crypto_1.subtle,
            ...settings.ponyfill
        }
    };
}
exports.Node18 = Node18;
/**
 * A Node 12 to 17 quick setup for the WhatsAppAPI
 *
 * @param settings - The WhatsAppAPI arguments
 * @param fetch - The fetch ponyfill function to use (e.g. node-fetch or undici)
 * @returns A WhatsAppAPI arguments object for Node 12 to 17
 */
function Node12(settings, fetch) {
    return {
        ...settings,
        ponyfill: {
            fetch,
            subtle: node_crypto_1.subtle,
            ...settings.ponyfill
        }
    };
}
exports.Node12 = Node12;
//# sourceMappingURL=node.js.map