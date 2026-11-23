import { defineConfig } from "vite";

export default defineConfig({
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
