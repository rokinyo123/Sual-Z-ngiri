import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = "/opt/pw-browsers/chromium";
const composition = await selectComposition({ serveUrl, id: "Final2", browserExecutable });
for (const t of times) {
  await renderStill({ composition, serveUrl, output: `${process.env.OUTDIR}/t${t.toFixed(2).padStart(6, "0")}.png`, frame: Math.round(t * 60), browserExecutable, scale: 0.4 });
}
console.log("done");
