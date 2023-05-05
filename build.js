import { build } from "esbuild";
import { glob } from "glob";
// import { writeFile } from "fs/promises";

const production = process.env.NODE_ENV !== "development";

const sharedConfig = {
    entryPoints: await glob("src/**/*.ts", { ignore: ["src/**/*.d.ts"] }),
    bundle: production,
    minify: production
};

// CJS
build({
    ...sharedConfig,
    format: "cjs",
    outdir: "lib/cjs",
    platform: "node"
});

// writeFile("./lib/cjs", '{"type":"common"}');

// ESM
build({
    ...sharedConfig,
    outdir: "lib",
    platform: "node"
});
