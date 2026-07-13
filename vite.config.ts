import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://8de8-2001-ee0-4f82-de40-8018-8d1-a826-81bd.ngrok-free.app",
        changeOrigin: true,
        secure: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});