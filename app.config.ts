import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    // experimental: {
    //   enableNativePlugin: true,
    // },
    plugins: [tailwindcss()],
  },
});
