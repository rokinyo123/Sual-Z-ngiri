// shared helpers for the story videos
const cv = document.getElementById('c');
let ctx = cv.getContext('2d');
const W = 1920, H = 1080;
const T = TL; // timeline from timeline.js: name -> [start, end]
const TOTAL = T._total;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const eOut = t => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
const eBack = t => { t = clamp(t); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const R = (t, a, b) => ease((t - a) / (b - a));
const win = (t, a, b, f = 0.4) => R(t, a, a + f) * (1 - R(t, b - f, b));

const SERIF = '"DejaVu Serif", serif', SANS = '"DejaVu Sans", sans-serif', MONO = '"DejaVu Sans Mono", monospace';
const GOLD = '#f6c768', GOLD2 = '#ffe2a0', NAVY = '#070b1f', CREAM = '#f7f2e6', GREEN = '#1f9d5c', RED = '#e2433f';

// deterministic random
let _s = 7; const rnd = () => (_s = (_s * 16807) % 2147483647) / 2147483647;
function srand(n) { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }

// ---------- pre-made layers ----------
const stars = Array.from({ length: 260 }, () => ({ x: rnd() * W, y: rnd() * H, r: 0.6 + rnd() * 2.0, p: rnd() * 6.28, s: 0.5 + rnd() * 2 }));
const dust = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: rnd() * H, r: 3 + rnd() * 14, v: 8 + rnd() * 26, p: rnd() * 6.28, a: 0.15 + rnd() * 0.4 }));
const grain = document.createElement('canvas'); grain.width = 540; grain.height = 960;
{ const g = grain.getContext('2d'); const im = g.createImageData(540, 960); for (let i = 0; i < im.data.length; i += 4) { const v = rnd() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); }

function bgNight(t, k = 1) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#04061a'); g.addColorStop(0.55, '#0b1336'); g.addColorStop(1, '#141b45');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  drawStars(t, 0.9 * k);
}
function drawStars(t, a) {
  if (a <= 0) return;
  ctx.save();
  for (const s of stars) {
    const tw = 0.45 + 0.55 * Math.sin(t * s.s + s.p);
    ctx.globalAlpha = a * tw; ctx.fillStyle = '#dfe6ff';
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function drawDust(t, a, col = '255,214,140') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const d of dust) {
    const y = ((d.y - t * d.v) % H + H) % H, x = d.x + Math.sin(t * 0.4 + d.p) * 30;
    const gr = ctx.createRadialGradient(x, y, 0, x, y, d.r);
    gr.addColorStop(0, `rgba(${col},${d.a * a})`); gr.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, d.r, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function glow(x, y, r, col, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0));
  ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
function vignette(a = 0.75) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function filmGrain(t) {
  ctx.save(); ctx.globalAlpha = 0.045; ctx.globalCompositeOperation = 'overlay';
  const ox = Math.floor(srand(Math.floor(t * 30)) * 200), oy = Math.floor(srand(Math.floor(t * 30) + 9) * 200);
  ctx.drawImage(grain, -ox, -oy, W * 1.4, H * 1.4); ctx.restore();
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function text(s, x, y, font, color, align = 'center', alpha = 1, glowCol = null, blur = 0, ls = '0px') {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.letterSpacing = ls;
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = blur; }
  ctx.fillStyle = color; ctx.fillText(s, x, y); ctx.restore();
}
function wrap(s, font, maxW) {
  ctx.save(); ctx.font = font; const words = s.split(' '), lines = []; let cur = '';
  for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (ctx.measureText(tt).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tt; }
  if (cur) lines.push(cur); ctx.restore(); return lines;
}
// karaoke caption: words light up as narrated
function caption(t, s, a, b, y = 1640) {
  const show = win(t, a - 0.15, b + 0.6, 0.25);
  if (show <= 0) return;
  const font = `bold 50px ${SANS}`;
  const lines = wrap(s, font, 900);
  const total = s.length; let idx = 0;
  const prog = clamp((t - a) / Math.max(0.3, b - a)) * total;
  ctx.save(); ctx.globalAlpha = show; ctx.font = font; ctx.textBaseline = 'middle';
  const lh = 72, h = lines.length * lh + 44;
  let maxw = 0; for (const l of lines) maxw = Math.max(maxw, ctx.measureText(l).width);
  ctx.fillStyle = 'rgba(5,8,25,0.55)'; rrect(W / 2 - maxw / 2 - 40, y - h / 2, maxw + 80, h, 34); ctx.fill();
  lines.forEach((l, li) => {
    const ly = y - (lines.length - 1) * lh / 2 + li * lh;
    let x = W / 2 - ctx.measureText(l).width / 2;
    for (const w of l.split(' ')) {
      const said = idx + w.length * 0.5 < prog;
      ctx.fillStyle = said ? '#ffffff' : 'rgba(255,255,255,0.42)';
      if (said && idx + w.length >= prog - 4) { ctx.fillStyle = GOLD2; }
      ctx.textAlign = 'left'; ctx.fillText(w, x, ly);
      x += ctx.measureText(w + ' ').width; idx += w.length + 1;
    }
  });
  ctx.restore();
}
function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

