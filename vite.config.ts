import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@config": path.resolve(__dirname, "./Secret"),
      },
    },
    define: {
      __CLIENT_ID__: JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
      __SCOPES__: JSON.stringify(env.VITE_GOOGLE_SCOPES),
    },
  };
});
