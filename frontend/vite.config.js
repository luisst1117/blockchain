import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
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
