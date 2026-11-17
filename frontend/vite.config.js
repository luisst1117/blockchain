import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  envDir: root,
  plugins: [react()],
  server: {
    proxy: {
      "/pinata": {
        target: "https://api.pinata.cloud",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/pinata/, ""),
      },
    },
  },
});
