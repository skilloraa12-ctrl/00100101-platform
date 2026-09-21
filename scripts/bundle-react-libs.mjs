// Copies React, ReactDOM and Babel Standalone's browser-ready UMD builds
// into public/react/, so the React course can load a real React runtime and
// a real JSX transpiler from a same-origin static file (see loadReactOnce/
// loadBabelOnce in src/App.jsx) without any CDN/npm access at runtime.
// Re-run this whenever the react/react-dom/@babel/standalone versions change.
import fs from "fs";

const outDir = "public/react";
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ["node_modules/react/umd/react.development.js", "react.development.js"],
  ["node_modules/react-dom/umd/react-dom.development.js", "react-dom.development.js"],
  ["node_modules/@babel/standalone/babel.min.js", "babel.min.js"],
];

for (const [src, name] of files) {
  fs.copyFileSync(src, `${outDir}/${name}`);
  const size = (fs.statSync(`${outDir}/${name}`).size / 1024 / 1024).toFixed(2);
  console.log(`Copied ${src} -> ${outDir}/${name} (${size} MB)`);
}
