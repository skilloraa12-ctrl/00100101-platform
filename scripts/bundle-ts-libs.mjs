// Bundles TypeScript's own lib.*.d.ts files (from node_modules/typescript/lib)
// into a single JSON map served at /typescript/lib-files.json, so the
// in-browser CompilerHost (see runTypeScriptCheck in src/App.jsx) can do real
// semantic type-checking without 90+ separate network requests. Re-run this
// whenever the `typescript` devDependency version changes.
import fs from "fs";
import path from "path";

const libDir = "node_modules/typescript/lib";
const outFile = "public/typescript/lib-files.json";

const entries = fs.readdirSync(libDir).filter((f) => f.endsWith(".d.ts"));
const map = {};
for (const f of entries) {
  map[f] = fs.readFileSync(path.join(libDir, f), "utf8");
}
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(map));
console.log(`Bundled ${entries.length} lib files into ${outFile} (${(fs.statSync(outFile).size / 1024 / 1024).toFixed(2)} MB)`);
