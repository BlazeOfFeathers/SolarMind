import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const manifest = JSON.parse(readFileSync("../custom_components/solarmind/manifest.json", "utf8"));

export default defineConfig({
  define: { __PANEL_VERSION__: JSON.stringify(manifest.version) },
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "solarmind-panel.js",
    },
    outDir: "../custom_components/solarmind/frontend",
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
  },
});
