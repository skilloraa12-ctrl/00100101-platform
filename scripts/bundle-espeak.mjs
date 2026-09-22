// Copies eSpeak-NG's WASM build into public/espeak/, so the "Прослухати
// урок" button can synthesize real speech entirely client-side — no OS
// voice required (unlike the Web Speech API, which silently fails when the
// learner's system has no Ukrainian voice installed), no network call at
// runtime, no cost. Re-run this whenever the `espeak-ng` dependency changes.
import fs from "fs";

const outDir = "public/espeak";
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ["node_modules/espeak-ng/dist/espeak-ng.js", "espeak-ng.js"],
  ["node_modules/espeak-ng/dist/espeak-ng.wasm", "espeak-ng.wasm"],
];

for (const [src, name] of files) {
  fs.copyFileSync(src, `${outDir}/${name}`);
  const size = (fs.statSync(`${outDir}/${name}`).size / 1024 / 1024).toFixed(2);
  console.log(`Copied ${src} -> ${outDir}/${name} (${size} MB)`);
}
