/* eslint-disable tsdoc/syntax */

import { build } from "esbuild";
import { glob } from "glob";
import { writeFile } from "fs/promises";

/**
 * @type {import("esbuild").BuildOptions}
 */
const sharedConfig = {
    entryPoints: await glob("src/**/*.ts", { ignore: ["src/standalone.ts"] }),
    sourcemap: true,
    platform: "node"
};

await Promise.all([
    // ESM
    build({
        ...sharedConfig,
        format: "esm",
        outdir: "lib/esm"
    }),

    // CJS
    build({
        ...sharedConfig,
        format: "cjs",
        outdir: "lib/cjs"
    })
]);

await writeFile("./lib/cjs/package.json", '{"type":"commonjs"}');
