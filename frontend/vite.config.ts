import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const manifestIcons = [
  {
    src: "./public/icon192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "./public/icon512.png",
    sizes: "512x512",
    type: "image/png",
  },
];

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "My Awesome App",
        short_name: "PWA App",
        icons: manifestIcons,
      },
    }),
  ],
  server: {
    host: true,
  },
});
