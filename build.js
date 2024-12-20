import { build } from "esbuild";
import { glob } from "glob";

await build({
    entryPoints: await glob("src/**/*.ts", { ignore: ["src/standalone.ts"] }),
    sourcemap: true,
    platform: "node",
    format: "esm",
    outdir: "lib"
});
