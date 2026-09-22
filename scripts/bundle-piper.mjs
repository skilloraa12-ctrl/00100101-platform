// Copies the ONNX Runtime WASM backend and the Piper phonemizer WASM into
// public/piper/, so "Прослухати урок" can run a real neural voice (Piper,
// uk_UA-lada-x_low) entirely client-side — same reasoning as every other
// self-hosted engine on this platform. Re-run when the onnxruntime-web or
// @diffusionstudio/piper-wasm dependency changes.
//
// The voice model itself (models/uk_UA-lada-x_low.onnx + .onnx.json) is
// NOT reproduced by this script — it was obtained once from
// https://huggingface.co/diffusionstudio/piper-voices (MIT-licensed Piper
// voices) and checked into public/piper/models/ directly, since this
// sandbox's network policy blocks huggingface.co.
import fs from "fs";

const files = [
  ["node_modules/onnxruntime-web/dist/ort.wasm.min.js", "public/piper/ort/ort.wasm.min.js"],
  ["node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm", "public/piper/ort/ort-wasm-simd-threaded.wasm"],
  ["node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs", "public/piper/ort/ort-wasm-simd-threaded.mjs"],
  ["node_modules/@diffusionstudio/piper-wasm/build/piper_phonemize.js", "public/piper/phonemize/piper_phonemize.js"],
  ["node_modules/@diffusionstudio/piper-wasm/build/piper_phonemize.wasm", "public/piper/phonemize/piper_phonemize.wasm"],
  ["node_modules/@diffusionstudio/piper-wasm/build/piper_phonemize.data", "public/piper/phonemize/piper_phonemize.data"],
];

for (const [src, dest] of files) {
  fs.mkdirSync(dest.substring(0, dest.lastIndexOf("/")), { recursive: true });
  fs.copyFileSync(src, dest);
  const size = (fs.statSync(dest).size / 1024 / 1024).toFixed(2);
  console.log(`Copied ${src} -> ${dest} (${size} MB)`);
}
