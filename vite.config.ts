import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // processes src/styles/index.css
    dts({
      insertTypesEntry: true,
      exclude: ["playground/**", "vite.config.ts"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/datepicker/index.ts"),
      name: "nepali-datepicker-react",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "classnames"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" },
        assetFileNames: "index.css",
      },
    },
  },
});
