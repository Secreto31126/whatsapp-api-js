import { defineConfig } from "tsup";
import { glob } from "glob";

export default defineConfig({
    entry: await glob("src/**/*.ts", {
        ignore: ["src/standalone.ts"],
        posix: true
    }),
    format: ["cjs", "esm"],
    platform: "node",
    target: "esnext",
    outDir: "lib",
    sourcemap: false,
    splitting: false,
    clean: true
});
