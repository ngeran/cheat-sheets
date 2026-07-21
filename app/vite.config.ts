import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local dev: `uv run uvicorn main:app --port 8080` in api/, then
      // `npm run dev` here. In prod, nginx does the equivalent proxy_pass
      // (see manifests/ + nginx.conf notes at the bottom of this response).
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
