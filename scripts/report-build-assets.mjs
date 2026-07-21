import { readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const staticRoot = resolve(process.cwd(), ".next/static");

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

const browserAssets = collectFiles(staticRoot)
  .filter((path) => /\.(?:css|js)$/.test(path))
  .map((path) => ({
    bytes: statSync(path).size,
    path: relative(process.cwd(), path).replaceAll("\\", "/"),
  }))
  .sort((left, right) => right.bytes - left.bytes);

const totals = browserAssets.reduce(
  (result, asset) => {
    const kind = asset.path.endsWith(".css") ? "css" : "js";
    result[kind] += asset.bytes;
    return result;
  },
  { css: 0, js: 0 },
);

console.log(`Static JavaScript total: ${formatBytes(totals.js)}`);
console.log(`Static CSS total: ${formatBytes(totals.css)}`);
console.log("Largest browser assets:");
for (const asset of browserAssets.slice(0, 12)) {
  console.log(`${formatBytes(asset.bytes).padStart(10)}  ${asset.path}`);
}
