import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/gsap/ScrollTrigger")) {
            return "gsap-scroll";
          }
          if (id.includes("node_modules/gsap")) {
            return "gsap-core";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "framer-motion";
          }
          if (id.includes("node_modules/jspdf") || id.includes("node_modules/html2canvas")) {
            return "pdf-tools";
          }
          if (id.includes("node_modules/recharts")) {
            return "charts";
          }
          if (id.includes("node_modules/@supabase")) {
            return "supabase";
          }
        },
      },
    },
  },
}));
