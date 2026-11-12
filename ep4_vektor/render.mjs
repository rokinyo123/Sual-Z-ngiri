// usage: node render.mjs stills <dir> t1 t2 ... | node render.mjs video <out.mp4>
import { createRequire } from 'module'; import { spawn } from 'child_process'; import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [mode, out, ...rest] = process.argv.slice(2);
const FPS = 30, DUR = 30;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.log('pageerror:', e.message));
await page.goto('http://127.0.0.1:8797/index.html?capture');
await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
const grab = async t => Buffer.from((await page.evaluate(t => window.frameData(t), t)).split(',')[1], 'base64');
if (mode === 'stills') { fs.mkdirSync(out, { recursive: true }); for (const t of rest.map(Number)) fs.writeFileSync(`${out}/f_${t.toFixed(2).padStart(5, '0')}.jpg`, await grab(t)); }
else {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = DUR * FPS;
  for (let i = 0; i < n; i++) { const b = await grab(i / FPS); if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r)); if (i % 150 === 0) console.log('frame', i, '/', n); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
await browser.close();
