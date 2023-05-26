/* eslint-disable tsdoc/syntax */

import { build } from "esbuild";
import { glob } from "glob";
import { writeFile } from "fs/promises";

const production = process.env.NODE_ENV !== "development";

/**
 * @type {import("esbuild").BuildOptions}
 */
const sharedConfig = {
    entryPoints: await glob("src/**/*.ts", { ignore: ["src/**/*.d.ts"] }),
    bundle: production,
    minify: production,
    platform: "node",
};

// ESM
await build({
    ...sharedConfig,
    format: "esm",
    outdir: "lib/esm"
});

// CJS
await build({
    ...sharedConfig,
    format: "cjs",
    outdir: "lib/cjs"
});

await writeFile("./lib/cjs/package.json", '{"type":"commonjs"}');
