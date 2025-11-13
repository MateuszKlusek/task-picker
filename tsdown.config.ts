import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs"],
  target: "node20",
  dts: true,
  sourcemap: false,
  minify: false,
  clean: true,
  unbundle: false,
  external: ["node_modules"],
  platform: "node",
});
