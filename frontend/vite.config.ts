import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_BASE_URL =
  process.env.VITE_API_URL || "http://localhost:4000";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
