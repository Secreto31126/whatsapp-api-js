import { build } from "esbuild";
import { glob } from "glob";

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
    outExtension: { ".js": ".cjs" },
    outdir: "lib",
    platform: "node"
});

// ESM
build({
    ...sharedConfig,
    outdir: "lib/esm",
    platform: "node"
});
