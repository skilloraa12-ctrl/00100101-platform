import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// not from the domain root — every asset path Vite emits must be prefixed
// with the repo name, or the browser requests them from the wrong URL and
// gets a 404 (which is what a blank white page usually means here).
export default defineConfig({
  base: "/00100101-platform/",
  plugins: [react()],
});
