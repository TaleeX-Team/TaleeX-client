import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_', 'VAPI_'],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://taleex-development.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true, // Add this for SPA routing in dev
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // Add this to explicitly set the base path
});
