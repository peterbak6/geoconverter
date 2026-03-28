import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use VITE_BASE_PATH env variable if set, otherwise default to "/"
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig(() => ({
  plugins: [react()],
  base,
}));
