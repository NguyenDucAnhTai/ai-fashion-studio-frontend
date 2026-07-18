import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  cacheDir: `.vite-cache/dev-${process.pid}`,
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://3ab7-118-69-70-166.ngrok-free.app",
        changeOrigin: true,
        secure: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
