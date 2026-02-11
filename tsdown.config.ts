import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  external: ["react"],
  format: ["cjs", "esm"],
  sourcemap: true,
});
