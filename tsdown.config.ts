import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  external: ["react", "copy-to-clipboard"],
  format: ["cjs", "esm"],
  sourcemap: true,
});
