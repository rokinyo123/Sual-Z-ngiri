// Ayənin sirri 4 — "yalnız Səndən" / söz sırası. Deterministic: everything derives from seek(t).
'use strict';
const DUR = 30, W = 1080, H = 1920;
const C = { ink: '#172235', ivory: '#F6F5EE', cobalt: '#4667FF', teal: '#16B99A', coral: '#FF765E', amber: '#FFC65C', peri: '#A3A5F4', slate: '#73819A',
  cobaltD: '#3350D6', tealD: '#0F9A80', tealL: '#3FD3B4', inkL: '#24324B' };
const cv = document.getElementById('c');
let ctx = cv.getContext('2d');

// ---------- math / easing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const eio = u => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const eout = u => { u = clamp(u); return 1 - Math.pow(1 - u, 3); };
const ein = u => { u = clamp(u); return u * u * u; };
const eback = u => { u = clamp(u); const c = 1.4; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const P = (t, a, b, e = eio) => e((t - a) / (b - a));
const win = (t, a, b, f = .3) => P(t, a, a + f) * (1 - P(t, b - f, b));
const hash = n => { const x = Math.sin(n * 127.1 + 31.7) * 43758.5453; return x - Math.floor(x); };

// ---------- point-shape system for morphs ----------
const N = 180;
function resample(pts, n = N) { // uniform arc-length resampling of a closed polyline
  const L = [0]; for (let i = 1; i <= pts.length; i++) { const a = pts[i - 1], b = pts[i % pts.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const tot = L[L.length - 1], out = []; let j = 0;
  for (let k = 0; k < n; k++) { const s = tot * k / n; while (L[j + 1] < s) j++; const a = pts[j], b = pts[(j + 1) % pts.length], u = (s - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u)]); }
  return out;
}
function rrPts(w, h, r) { // centered rounded rect, starts top-center, clockwise
  r = Math.min(r, w / 2, h / 2); const p = [], seg = 10;
  p.push([0, -h / 2]);
  const corner = (cx, cy, a0) => { for (let i = 0; i <= seg; i++) { const a = a0 + i / seg * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  corner(w / 2 - r, -h / 2 + r, -Math.PI / 2); corner(w / 2 - r, h / 2 - r, 0); corner(-w / 2 + r, h / 2 - r, Math.PI / 2); corner(-w / 2 + r, -h / 2 + r, Math.PI);
  return resample(p);
}
function circPts(r) { const p = []; for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i / N * Math.PI * 2; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; }
function stripPts(center, wd) { // closed outline of a strip along a centerline
  const L = [], R = [];
  for (let i = 0; i < center.length; i++) {
    const a = center[Math.max(0, i - 1)], b = center[Math.min(center.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const d = Math.hypot(nx, ny) || 1; nx /= d; ny /= d;
    const w = wd * (i === 0 || i === center.length - 1 ? .9 : 1) / 2;
    L.push([center[i][0] + nx * w, center[i][1] + ny * w]); R.push([center[i][0] - nx * w, center[i][1] - ny * w]);
  }
  return resample(L.concat(R.reverse()));
}
const alignCache = new Map();
function aligned(key, A, B) { // rotate B's start index to best match A (prevents twisting)
  if (alignCache.has(key)) return alignCache.get(key);
  let best = 0, bd = Infinity;
  const ca = centroid(A), cb = centroid(B);
  for (let s = 0; s < N; s += 2) { let d = 0; for (let i = 0; i < N; i += 6) { const a = A[i], b = B[(i + s) % N]; d += (a[0] - ca[0] - b[0] + cb[0]) ** 2 + (a[1] - ca[1] - b[1] + cb[1]) ** 2; } if (d < bd) { bd = d; best = s; } }
  const out = B.map((_, i) => B[(i + best) % N]); alignCache.set(key, out); return out;
}
function centroid(A) { let x = 0, y = 0; for (const p of A) { x += p[0]; y += p[1]; } return [x / A.length, y / A.length]; }
function morph(A, B, u) { return A.map((a, i) => [lerp(a[0], B[i][0], u), lerp(a[1], B[i][1], u)]); }
function pathPts(pts, x = 0, y = 0, s = 1) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(x + p[0] * s, y + p[1] * s) : ctx.moveTo(x + p[0] * s, y + p[1] * s)); ctx.closePath(); }
function fillPts(pts, col, x = 0, y = 0, s = 1) { pathPts(pts, x, y, s); ctx.fillStyle = col; ctx.fill(); }

// ---------- drawing primitives ----------
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r); }
function txt(s, x, y, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const fam = o.ar ? 'Amiri' : 'Montserrat';
  ctx.font = `${o.w || 700} ${o.size || 40}px ${fam}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  ctx.letterSpacing = o.ls || '0px'; if (o.ar) ctx.direction = 'rtl';
  ctx.translate(x, y); if (o.sc) ctx.scale(o.sc, o.sc); if (o.rot) ctx.rotate(o.rot);
  ctx.fillStyle = o.col || C.ink; ctx.fillText(s, 0, o.ar ? (o.size || 40) * .06 : 0); ctx.restore();
}
function tw(s, size, w = 700, ar = false, ls = '0px') { ctx.save(); ctx.font = `${w} ${size}px ${ar ? 'Amiri' : 'Montserrat'}`; ctx.letterSpacing = ls; const m = ctx.measureText(s).width; ctx.restore(); return m; }
// masked word-by-word rise
function riseLine(words, x, y, size, t, t0, o = {}) {
  const gap = size * .28, ws = words.map(w => tw(w.s, size, o.w || 900, false, o.ls || '0px'));
  const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let cx = (o.align === 'left' ? x : x - total / 2);
  words.forEach((w, i) => {
    const u = P(t, t0 + i * (o.step ?? .09), t0 + i * (o.step ?? .09) + .45, eout);
    if (u > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(cx - 10, y - size * .75, ws[i] + 20, size * 1.5); ctx.clip();
      if (w.bg) { const k = P(t, w.bgt ?? t0, (w.bgt ?? t0) + .35, eout); if (k > 0) { ctx.fillStyle = w.bg; rr(cx + ws[i] / 2, y + 3, (ws[i] + 30) * k, size * 1.12, 14); ctx.fill(); } }
      txt(w.s, cx, y + (1 - u) * size * 1.1, { size, w: o.w || 900, col: w.col || o.col || C.ink, align: 'left', ls: o.ls || '0px', a: o.a ?? 1 });
      ctx.restore();
    }
    cx += ws[i] + gap;
  });
  return total;
}
function chip(s, x, y, t, t0, bg, fg, size = 30) {
  const k = P(t, t0, t0 + .4, eback); if (k <= 0) return;
  const w = tw(s, size, 800, false, '3px') + 52;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = bg; rr(0, 0, w, size * 1.9, size * .95); ctx.fill(); ctx.restore();
  txt(s, x, y + 1, { size, w: 800, col: fg, ls: '3px', sc: k, a: clamp(k * 2) });
}
function dashedPath(fn, t0, t1, t, col, wdt = 6, dash = [18, 14]) {
  const u = clamp((t - t0) / (t1 - t0)); if (u <= 0) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.lineCap = 'round'; ctx.setLineDash(dash);
  ctx.beginPath(); const n = 40; for (let i = 0; i <= n * u; i++) { const p = fn(i / n); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
}
const qb = (a, c, b) => s => [(1 - s) * (1 - s) * a[0] + 2 * (1 - s) * s * c[0] + s * s * b[0], (1 - s) * (1 - s) * a[1] + 2 * (1 - s) * s * c[1] + s * s * b[1]];

// ---------- illustrated objects ----------
// praying figure, back view, standing (qiyam). origin = feet centre.
function worshipper(x, y, s, t, t0) {
  const part = i => P(t, t0 + i * .12, t0 + i * .12 + .5, eback);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // rug
  const ru = P(t, t0 - .4, t0 + .3, eout);
  if (ru > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(-400, 160 - 260 * ru, 800, 260 * ru + 10); ctx.clip();
    ctx.fillStyle = C.teal; ctx.beginPath(); ctx.moveTo(-170, -70); ctx.lineTo(170, -70); ctx.lineTo(235, 150); ctx.lineTo(-235, 150); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.amber; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-150, -52); ctx.lineTo(150, -52); ctx.lineTo(205, 132); ctx.lineTo(-205, 132); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = C.tealD; for (let i = -3; i <= 3; i++) { ctx.save(); ctx.translate(i * 52, 96); ctx.rotate(Math.PI / 4); ctx.fillRect(-11, -11, 22, 22); ctx.restore(); }
    ctx.fillStyle = C.amber; for (let i = -4; i <= 4; i++) { ctx.fillRect(-212 + (i + 4) * 53, 150, 6, 20); }
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(23,34,53,0.16)'; ctx.beginPath(); ctx.ellipse(0, 8, 150 * part(0), 22, 0, 0, 7); ctx.fill();
  // thobe (body)
  const b = part(1);
  if (b > 0) {
    ctx.save(); ctx.translate(0, 0); ctx.scale(1, b);
    ctx.fillStyle = C.cobalt; ctx.beginPath();
    ctx.moveTo(-98, -420); ctx.bezierCurveTo(-130, -415, -150, -395, -152, -360); ctx.lineTo(-160, -250); ctx.bezierCurveTo(-140, -150, -135, -60, -128, 0);
    ctx.lineTo(128, 0); ctx.bezierCurveTo(135, -60, 140, -150, 160, -250); ctx.lineTo(152, -360); ctx.bezierCurveTo(150, -395, 130, -415, 98, -420); ctx.closePath(); ctx.fill();
    // elbows of folded arms + back seam
    ctx.fillStyle = C.cobaltD;
    ctx.beginPath(); ctx.moveTo(-152, -360); ctx.bezierCurveTo(-190, -310, -188, -255, -160, -235); ctx.lineTo(-138, -300); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(152, -360); ctx.bezierCurveTo(190, -310, 188, -255, 160, -235); ctx.lineTo(138, -300); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.cobaltD; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -405); ctx.lineTo(0, -10); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(-52, 4, 34, 13, 0, 0, 7); ctx.ellipse(52, 4, 34, 13, 0, 0, 7); ctx.fill();
  }
  // head + kufi
  const h = part(2);
  if (h > 0) {
    ctx.save(); ctx.translate(0, -478); ctx.scale(h, h);
    ctx.fillStyle = '#C98E6B'; ctx.fillRect(-26, 20, 52, 48);
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 66, 0, 7); ctx.fill();
    ctx.fillStyle = '#C98E6B'; ctx.beginPath(); ctx.ellipse(-64, 8, 10, 17, 0, 0, 7); ctx.ellipse(64, 8, 10, 17, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 67, 0, 7); ctx.clip(); ctx.fillStyle = C.ivory; ctx.fillRect(-70, -70, 140, 50);
    ctx.fillStyle = C.amber; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i * 18, -32, 3.5, 0, 7); ctx.fill(); } ctx.restore();
    ctx.restore();
  }
  ctx.restore();
}
// stylised tree; origin = trunk base. g = growth 0..1
const CANOPY = [[0, -640, 175], [-150, -560, 140], [150, -560, 145], [-235, -450, 105], [235, -455, 110], [-80, -470, 150], [90, -470, 150], [0, -760, 115]];
const ANCH = [[-205, -385], [-120, -360], [-35, -350], [55, -352], [140, -365], [225, -392], [-265, -420], [280, -425], [10, -345]];
function tree(x, y, s, t, g, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const tg = clamp(g * 1.6);
  if (tg > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(-300, -520 * tg, 600, 540 * tg); ctx.clip();
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.moveTo(-46, 0); ctx.bezierCurveTo(-36, -150, -40, -300, -26, -420); ctx.lineTo(26, -420); ctx.bezierCurveTo(40, -300, 36, -150, 46, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
    [[-10, -300, -200, -390, 22], [10, -280, 190, -380, 22], [-5, -360, -110, -470, 16], [5, -360, 120, -470, 16]].forEach(([x0, y0, x1, y1, w]) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y1 + 30, x1, y1); ctx.stroke(); });
    ctx.fillStyle = C.inkL; ctx.fillRect(-8, -260, 6, 120); ctx.fillRect(12, -170, 5, 80);
    ctx.restore();
  }
  CANOPY.forEach(([cx, cy, r], i) => {
    const k = eback(clamp((g - .45 - i * .045) / .35)); if (k <= 0) return;
    ctx.fillStyle = [C.teal, C.tealD, C.teal, C.tealD, C.teal, C.tealL, C.teal, C.tealL][i];
    ctx.beginPath(); ctx.arc(cx, cy, r * k, 0, 7); ctx.fill();
  });
  if (g > .8) { ctx.fillStyle = 'rgba(255,255,255,0.18)'; [[-60, -700, 30], [60, -600, 22], [-170, -600, 18]].forEach(([cx, cy, r]) => { ctx.beginPath(); ctx.arc(cx, cy, r * P(g, .8, 1), 0, 7); ctx.fill(); }); }
  ctx.restore();
}
// hanging ribbon (tied cloth), origin = knot
function hangRibbon(x, y, s, t, col, ph, len = 150, fall = 0) {
  const cl = []; for (let i = 0; i <= 16; i++) { const u = i / 16; cl.push([Math.sin(t * 3.2 + ph + u * 4) * 14 * u + u * u * 10 * Math.sin(ph), u * len]); }
  const pts = stripPts(cl, 26);
  ctx.save(); ctx.translate(x, y + fall * fall * 900); ctx.rotate(fall * (hash(ph) - .5) * 3); ctx.scale(s, s); ctx.globalAlpha *= 1 - clamp(fall * 1.4);
  fillPts(pts, col);
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(-12, 0, 16, 9, -.5, 0, 7); ctx.ellipse(12, 0, 16, 9, .5, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(23,34,53,0.25)'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill();
  ctx.restore();
}
function stones(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  [[0, 0, 78, 46, C.slate], [-58, -46, 52, 34, '#8F9BB1'], [44, -50, 56, 36, '#5F6C85'], [-6, -92, 44, 30, C.slate]].forEach(([cx, cy, rx, ry, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill(); });
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(-20, -12, 26, 9, -.2, 0, 7); ctx.fill(); ctx.restore();
}
function tomb(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.slate; ctx.beginPath(); ctx.moveTo(-62, 40); ctx.lineTo(-62, -80); ctx.quadraticCurveTo(0, -150, 62, -80); ctx.lineTo(62, 40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5F6C85'; ctx.fillRect(-90, 32, 180, 22);
  ctx.fillStyle = C.amber; ctx.fillRect(-82, 8, 10, 24); ctx.fillRect(72, 8, 10, 24);
  ctx.beginPath(); ctx.ellipse(-77, 2, 5, 9, 0, 0, 7); ctx.ellipse(77, 2, 5, 9, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30, -60); ctx.lineTo(30, -60); ctx.moveTo(-30, -30); ctx.lineTo(30, -30); ctx.stroke(); ctx.restore();
}
function miniTree(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.slate; ctx.fillRect(-14, -120, 28, 130);
  ctx.fillStyle = '#8F9BB1'; [[0, -170, 70], [-55, -130, 50], [55, -130, 52]].forEach(([cx, cy, r]) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); });
  [C.coral, C.amber].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-48 + i * 80, -100, 10, 48); }); ctx.restore();
}
// word tile: arabic + transliteration + gloss
function tile(x, y, w, h, fill, ar, lat, gloss, fg, a = 1, sc = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; rr(0, 10, w, h, 30); ctx.fill();
  ctx.fillStyle = fill; rr(0, 0, w, h, 30); ctx.fill();
  if (ar) txt(ar, 0, -h * .2, { ar: 1, size: 70, w: 700, col: fg });
  if (lat) txt(lat, 0, h * .14, { size: 44, w: 900, col: fg, ls: '2px' });
  if (gloss) txt(gloss, 0, h * .34, { size: 27, w: 500, col: fg, a: .85 });
  ctx.restore();
}

// ---------- precomputed shapes ----------
const BUB = rrPts(940, 430, 64);
const RIB_H = (() => { const c = []; for (let i = 0; i <= 30; i++) { const u = i / 30; c.push([lerp(-430, 430, u), Math.sin(u * Math.PI * 3) * 40]); } return stripPts(c, 34); })();
const RIB_V = (() => { const c = []; for (let i = 0; i <= 30; i++) { const u = i / 30; c.push([Math.sin(u * 4) * 10 * u, u * 150]); } return stripPts(c, 26); })();
const T_PRON = rrPts(240, 250, 30), T_IYK = rrPts(400, 250, 30), T_VERB = rrPts(440, 250, 30);
const NODE_C = circPts(160), NODE_S = circPts(110);

// ---------- timeline ----------
const S = { s2: 4.4, s3: 9.2, s4: 12.2, s5: 19.6, s6: 26.4 };
function bgAt(t) {
  ctx.fillStyle = C.ivory; ctx.fillRect(0, 0, W, H);
  // ink wipe grows from the tree canopy (S3) and stays until the ivory wipe (S6)
  const r1 = P(t, 9.55, 10.35, ein) * 2300;
  if (t >= 9.55) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(700, 1700 - 600 * .78, Math.max(1, 260 + r1), 0, 7); ctx.fill(); }
  if (t >= 26.3) { ctx.fillStyle = C.ivory; ctx.beginPath(); ctx.arc(540, 780, 160 + P(t, 26.3, 27.0, ein) * 2300, 0, 7); ctx.fill(); }
  // faint grid on dark sections
  if (t > 10 && t < 27) { ctx.save(); ctx.globalAlpha = .06 * win(t, 10.1, 26.5, .5); ctx.strokeStyle = C.peri; ctx.lineWidth = 2; for (let x = 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore(); }
}
function cam(t) { // gentle 2D camera: push-in on S1, slight drift elsewhere
  const z = 1 + .04 * P(t, 0, 4.4) - .04 * P(t, 4.4, 5.4) + .03 * P(t, 12.2, 19.4) - .03 * P(t, 19.4, 20.4) + .025 * P(t, 20.4, 26.2) - .025 * P(t, 26.2, 26.9) + .02 * P(t, 27, 30);
  const dy = -20 * P(t, 0, 4.4) + 20 * P(t, 4.4, 5.4);
  ctx.translate(W / 2, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
}

function scene1and2(t) {
  if (t > 10.5) return;
  // headline S1
  const out1 = 1 - P(t, 4.3, 4.6);
  if (out1 > 0) {
    ctx.save(); ctx.globalAlpha = out1; riseLine([{ s: 'Namazda', col: C.ink }, { s: 'deyirik:', col: C.slate }], W / 2, 270, 84, t, .25); ctx.restore();
  }
  // worshipper: full size in S1, shrinks into the promise card in S2
  const m = P(t, 4.5, 5.4), fx = lerp(540, 250, m), fy = lerp(1640, 905, m), fs = lerp(1.32, .5, m);
  const cardA = P(t, 4.8, 5.4, eout) * (1 - P(t, 9.2, 9.6));
  const cardX = -380 * P(t, 9.2, 9.7, ein);
  ctx.save(); ctx.translate(cardX, 0);
  if (cardA > 0) {
    ctx.save(); ctx.globalAlpha = cardA; ctx.fillStyle = '#FFFFFF'; rr(250, 760, 400, 520, 36); ctx.fill(); ctx.strokeStyle = C.cobalt; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
  }
  worshipper(fx, fy, fs, t, .5);
  if (cardA > 0) {
    ctx.save(); ctx.globalAlpha = cardA;
    ctx.fillStyle = C.cobalt; rr(250, 975, 330, 64, 32); ctx.fill();
    txt('YALNIZ SƏNDƏN', 250, 977, { size: 30, w: 900, col: C.ivory, ls: '2px' });
    // the promise breaks
    const cr = P(t, 8.1, 8.45, eout);
    if (cr > 0) {
      ctx.strokeStyle = C.coral; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.beginPath();
      const zz = [[60, 930], [130, 990], [190, 950], [250, 1010], [310, 945], [370, 1000], [440, 950]];
      zz.forEach((p, i) => { if (i / (zz.length - 1) <= cr) i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();

  // speech bubble (S1) -> horizontal ribbon -> flies to the tree and hangs (S2)
  if (t >= 1.15 && t < 6.6) {
    let pts, x, y, col = C.ivory;
    const grow = P(t, 1.15, 1.75, eback);
    if (t < 4.4) { pts = BUB.map(p => [p[0] * grow, p[1] * grow]); x = 540; y = lerp(1000, 660, P(t, 1.15, 1.75, eout)); col = '#FFFFFF'; }
    else if (t < 5.1) { const u = P(t, 4.4, 5.1); pts = morph(BUB, aligned('bub-rib', BUB, RIB_H), u); x = 540; y = 640; }
    else { const u = P(t, 5.1, 6.4); const B = aligned('rib-v', RIB_H, RIB_V); pts = morph(RIB_H.map(p => [p[0], p[1]]), B, u); const p = qb([540, 640], [980, 700], [700 + ANCH[1][0] * .78, 1700 + ANCH[1][1] * .78])(u); x = p[0]; y = p[1]; }
    if (t >= 4.4) col = t < 4.75 ? '#FFFFFF' : C.coral;
    ctx.save();
    if (t < 4.75) { ctx.shadowColor = 'rgba(23,34,53,0.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; }
    fillPts(pts, col, x, y); ctx.restore();
    if (t >= 4.4 && t < 4.75) { ctx.save(); ctx.globalAlpha = P(t, 4.4, 4.75); fillPts(pts, C.coral, x, y); ctx.restore(); }
    if (t < 4.6) {
      const a = 1 - P(t, 4.35, 4.55);
      // tail
      ctx.save(); ctx.globalAlpha = grow * a; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(500, y + 210); ctx.lineTo(570, y + 210); ctx.lineTo(535, y + 290); ctx.closePath(); ctx.fill(); ctx.restore();
      // arabic written right-to-left with a mask
      const wr = P(t, 1.7, 2.6, eio);
      if (wr > 0) { ctx.save(); ctx.globalAlpha = a; const ww = tw('وَإِيَّاكَ نَسْتَعِينُ', 112, 700, true) + 40; ctx.beginPath(); ctx.rect(540 + ww / 2 - ww * wr, y - 190, ww * wr, 170); ctx.clip(); txt('وَإِيَّاكَ نَسْتَعِينُ', 540, y - 95, { ar: 1, size: 112, col: C.ink }); ctx.restore(); }
      const k = P(t, 2.55, 3.0, eout);
      if (k > 0) {
        const s1 = '«Yalnız Səndən', s2 = ' kömək istəyirik»'; const w1 = tw(s1, 52, 800), w2 = tw(s2, 52, 800), x0 = 540 - (w1 + w2) / 2;
        const ul = P(t, 3.25, 3.7, eout);
        if (ul > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.amber; rr(x0 + w1 * ul / 2 + 6, y + 78, w1 * ul, 24, 12); ctx.fill(); ctx.restore(); }
        txt(s1, x0, y + 58 + (1 - k) * 20, { size: 52, w: 800, col: C.ink, align: 'left', a: k * a });
        txt(s2, x0 + w1, y + 58 + (1 - k) * 20, { size: 52, w: 800, col: C.slate, align: 'left', a: k * a });
      }
      txt('Fatihə, 5-ci ayə', 540, y + 150, { size: 28, w: 500, col: C.slate, a: P(t, 3.0, 3.4) * a });
    }
  }
  // S2 tree + ribbons
  const g = P(t, 4.9, 6.2, eio);
  const treeS = .78, TX = 700, TY = 1700;
  if (g > 0) {
    ctx.save();
    tree(TX, TY, treeS, t, g);
    const fall = P(t, 9.2, 9.75, ein);
    const cols = [C.amber, C.coral, C.peri, C.cobalt, C.amber, C.coral, C.teal, C.peri, C.cobalt];
    ANCH.forEach((a, i) => {
      if (i === 1) { if (t >= 6.4) hangRibbon(TX + a[0] * treeS, TY + a[1] * treeS, 1, t, C.coral, 1.3, 150, fall); return; }
      const k = P(t, 6.5 + i * .09, 6.85 + i * .09, eback); if (k <= 0) return;
      ctx.save(); ctx.translate(TX + a[0] * treeS, TY + a[1] * treeS); ctx.scale(1, k); hangRibbon(0, 0, .85, t, cols[i], i * 1.7, 120 + 30 * hash(i), fall); ctx.restore();
    });
    // stones and candle stubs at the foot
    const sk = P(t, 6.0, 6.5, eback); if (sk > 0) { ctx.save(); ctx.globalAlpha = 1 - P(t, 9.2, 9.6); stones(TX - 150, TY + 10, .55 * sk); ctx.restore(); }
    ctx.restore();
  }
  // S2 headline
  if (t >= 5.2 && t < 9.7) {
    const a = 1 - P(t, 9.2, 9.5);
    riseLine([{ s: '…sonra', col: C.slate }, { s: 'ağaca' }], W / 2, 250, 76, t, 5.25, { a });
    riseLine([{ s: 'LENT', col: C.ivory, bg: C.coral, bgt: 5.9 }, { s: 'bağlayırıq' }], W / 2, 345, 76, t, 5.5, { a });
  }
  // contradiction sign
  if (t >= 7.5 && t < 9.7) {
    const k = P(t, 7.5, 7.9, eback), a = 1 - P(t, 9.2, 9.5);
    txt('≠', 545, 1150, { size: 220, w: 900, col: C.coral, sc: k, a: a * clamp(k) });
    txt('söz verildi…', 250, 1110, { size: 40, w: 700, col: C.ink, a: P(t, 7.9, 8.2) * a });
    txt('…söz pozuldu', 250, 1165, { size: 40, w: 800, col: C.coral, a: P(t, 8.4, 8.7) * a });
  }
}

function scene3(t) {
  if (t < 10.2 || t > 12.6) return;
  const out = 1 - P(t, 11.45, 11.8);
  txt('KEÇƏN VİDEODA DEDİK:', W / 2, 760, { size: 36, w: 800, col: C.peri, ls: '4px', a: P(t, 10.25, 10.6) * out });
  const sozW = tw('SÖZ', 82, 900), l1 = ['BU', 'AYƏDƏ', 'BİR', 'SÖZ'];
  // locate SÖZ for the hand-off
  const gap = 82 * .28, widths = l1.map(s => tw(s, 82, 900)), tot = widths.reduce((a, b) => a + b) + gap * 3;
  const sozX = W / 2 - tot / 2 + widths[0] + widths[1] + widths[2] + gap * 3 + sozW / 2;
  // amber pill behind SÖZ, which later becomes the "-KƏ" tile
  const pk = P(t, 10.95, 11.3, eback);
  const hand = P(t, 11.6, 12.45, eio);
  if (pk > 0) {
    const w = lerp((sozW + 40) * pk, 240, hand), h = lerp(104 * pk, 250, hand), x = lerp(sozX, 770, hand), y = lerp(900, 720, hand);
    ctx.fillStyle = C.amber; rr(x, y, w, h, lerp(22, 30, hand)); ctx.fill();
  }
  ctx.save(); ctx.globalAlpha = out;
  riseLine(l1.map(s => ({ s, col: s === 'SÖZ' && t > 11.0 ? C.ink : C.ivory })), W / 2, 900, 82, t, 10.45);
  riseLine([{ s: 'YERİNİ', col: C.amber }, { s: 'DƏYİŞİB.', col: C.amber }], W / 2, 1005, 82, t, 10.8);
  ctx.restore();
  if (t < 11.45) txt('SÖZ', sozX, 900, { size: 82, w: 900, col: C.ink, a: P(t, 11.0, 11.2) });
}

function scene4and5(t) {
  if (t < 12.2 || t > 27.1) return;
  const fadeA = 1 - P(t, 19.6, 20.0); // elements that leave at S5
  // headings
  if (t < 20.1) {
    chip('BİRİNCİ SİR', W / 2, 250, t, 12.3, C.coral, C.ivory, 30);
    ctx.save(); ctx.globalAlpha = fadeA; riseLine([{ s: 'SÖZ', col: C.ivory }, { s: 'SIRASI', col: C.ivory }], W / 2, 365, 100, t, 12.45); ctx.restore();
    txt('ADİ SIRA OLSAYDI:', W / 2, 560, { size: 32, w: 800, col: C.peri, ls: '3px', a: P(t, 12.8, 13.1) * fadeA });
  }
  // ROW A (reference)
  const dimA = (1 - .6 * P(t, 14.7, 15.1)) * fadeA;
  if (t < 20.1) {
    const vk = P(t, 12.65, 13.15, eout);
    if (vk > 0) { ctx.save(); ctx.beginPath(); ctx.rect(140, 560, 440 * vk, 340); ctx.clip(); tile(360, 720, 440, 250, C.cobalt, 'نَعْبُدُ', 'NƏBUDU', 'ibadət edirik', C.ivory, dimA); ctx.restore(); }
    if (t >= 12.45) tile(770, 720, 240, 250, C.amber, 'كَ', '-KƏ', 'Sənə', C.ink, dimA);
    const br = P(t, 13.3, 13.8, eout);
    if (br > 0) { ctx.save(); ctx.globalAlpha = dimA; ctx.strokeStyle = C.peri; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(140, 870); ctx.lineTo(140, 885); ctx.lineTo(140 + 750 * br, 885); ctx.lineTo(140 + 750 * br, 870); ctx.stroke(); ctx.restore(); }
    txt('= «Sənə ibadət edirik»', W / 2, 940, { size: 40, w: 700, col: C.ivory, a: P(t, 13.6, 14.0) * dimA });
    txt('AMMA AYƏDƏ:', W / 2, 1115, { size: 32, w: 800, col: C.amber, ls: '3px', a: P(t, 14.6, 14.9) * fadeA });
  }
  // ROW B construction — pronoun flies to the front, verb slides behind it
  const fly = P(t, 15.0, 16.0, eio), vs = P(t, 15.2, 16.1, eio);
  const IY = { x: 305, y: 1290 }, VB = { x: 755, y: 1290 };
  const toNode = P(t, 19.7, 20.5, eio);
  if (t >= 15.0) {
    // verb clone
    const vp = qb([360, 720], [330, 1290], [VB.x, VB.y])(vs);
    if (toNode <= 0) tile(vp[0], vp[1], 440, 250, C.cobalt, 'نَعْبُدُ', 'NƏBUDU', 'ibadət edirik', C.ivory, 1);
    // pronoun clone along an arc, then the "iyya" support clicks in
    const arc = qb([770, 720], [1000, 1000], [IY.x + 100, IY.y]);
    const kp = arc(fly), wob = t > 16.0 && t < 16.55 ? Math.sin((t - 16) * 40) * 6 * (1 - P(t, 16, 16.55)) : 0;
    const join = P(t, 16.25, 16.6, eout);
    const merged = P(t, 16.6, 16.9);
    if (toNode <= 0) {
      if (merged < 1) {
        // iyya support piece slides from the left edge
        if (join > 0) tile(lerp(-150, IY.x - 100, join), IY.y, 200, 250, C.peri, 'إِيَّا', 'İYYA', 'dayaq', C.ink, 1 - merged);
        tile(kp[0] + wob, kp[1], lerp(240, 200, fly), 250, C.amber, 'كَ', '-KƏ', 'Sənə', C.ink, 1 - merged, 1 + .06 * Math.sin(fly * Math.PI));
      }
      if (merged > 0) {
        ctx.save(); ctx.globalAlpha = merged;
        ctx.fillStyle = 'rgba(0,0,0,0.22)'; rr(IY.x, IY.y + 10, 400, 250, 30); ctx.fill();
        ctx.fillStyle = C.peri; ctx.beginPath(); ctx.roundRect(IY.x - 200, IY.y - 125, 200, 250, [30, 0, 0, 30]); ctx.fill();
        ctx.fillStyle = C.amber; ctx.beginPath(); ctx.roundRect(IY.x, IY.y - 125, 200, 250, [0, 30, 30, 0]); ctx.fill();
        txt('إِيَّاكَ', IY.x, IY.y - 50, { ar: 1, size: 74, col: C.ink }); txt('İYYAKƏ', IY.x, IY.y + 35, { size: 46, w: 900, col: C.ink, ls: '2px' }); txt('Sənə', IY.x, IY.y + 85, { size: 27, w: 500, col: C.ink, a: .85 });
        ctx.restore();
      }
      // click flash
      const fl = win(t, 16.55, 16.85, .12); if (fl > 0) { ctx.save(); ctx.globalAlpha = fl * .8; ctx.strokeStyle = C.ivory; ctx.lineWidth = 6; rr(IY.x, IY.y, 420 + 30 * fl, 270 + 30 * fl, 36); ctx.stroke(); ctx.restore(); }
    }
    txt('«-kə» tək dura bilmir → «iyya» ona dayaq olur', W / 2, 1460, { size: 30, w: 600, col: C.peri, a: win(t, 16.15, 17.25, .3) });
    // meaning: Sənə -> YALNIZ Sənə
    if (t >= 17.3 && t < 20.1) {
      const a = P(t, 17.3, 17.6) * fadeA, y = 1490;
      const yk = P(t, 17.7, 18.05, eback), wY = tw('YALNIZ ', 50, 900), rest = 'Sənə ibadət edirik', wr = tw(rest, 50, 700);
      const x0 = W / 2 - (wr + wY * clamp(yk)) / 2;
      txt(rest, x0 + wY * clamp(yk), y, { size: 50, w: 700, col: C.ivory, align: 'left', a });
      if (yk > 0) txt('YALNIZ', x0 + 2, y - (1 - clamp(yk)) * 80, { size: 50, w: 900, col: C.amber, align: 'left', a: clamp(yk) * fadeA });
      txt('Söz önə keçdi → məna daraldı: başqasına yox.', W / 2, 1600, { size: 31, w: 600, col: C.peri, a: P(t, 18.35, 18.7) * fadeA });
    }
    // amber frame around İYYAKƏ draws itself
    const fr = P(t, 18.0, 18.5, eio);
    if (fr > 0 && toNode <= 0) { ctx.save(); ctx.strokeStyle = C.amber; ctx.lineWidth = 8; ctx.setLineDash([1600 * fr, 1600]); rr(IY.x, IY.y, 440, 290, 42); ctx.stroke(); ctx.restore(); }
  }

  // ===== S5: tiles morph into a relationship diagram =====
  if (t < 19.7) return;
  const CN = [540, 780], LN = [270, 1270], RN = [810, 1270];
  const ib = P(t, 26.1, 26.4); // fade out of S5 extras before wipe
  // connectors with flowing dots
  const conn = (from, t0, col) => {
    const f = qb(from, [from[0] * .5 + CN[0] * .5 + (from[0] < 540 ? -60 : 60), (from[1] + CN[1]) / 2], [CN[0] + (from[0] < 540 ? -110 : 110), CN[1] + 115]);
    const u = P(t, t0, t0 + .6, eout); if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha = .55; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 40 * u; i++) { const p = f(i / 40); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    if (u >= 1) { const boost = 1 + P(t, 25.2, 25.5); for (let k = 0; k < 6; k++) { const s = ((t - t0) * .45 * boost + k / 6) % 1, p = f(s); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p[0], p[1], 10 + 4 * Math.sin(s * Math.PI), 0, 7); ctx.fill(); } }
  };
  conn(LN, 20.6, C.cobalt); conn(RN, 22.0, C.teal);
  // centre node from the İYYAKƏ tile
  {
    const A = T_IYK, B = aligned('iyk-node', T_IYK, NODE_C), u = toNode;
    const x = lerp(IY.x, CN[0], u), y = lerp(IY.y, CN[1], u);
    const pulse = 1 + .05 * Math.sin(Math.max(0, t - 25.2) * 8) * win(t, 25.2, 26.2, .2);
    ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
    if (t > 25.2) { const rp = P(t, 25.2, 26.0, eout); ctx.strokeStyle = C.amber; ctx.globalAlpha = 1 - rp; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 170 + 160 * rp, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
    fillPts(morph(A, B, u), C.amber);
    if (u < .5) { ctx.fillStyle = C.peri; ctx.globalAlpha = 1 - u * 2; ctx.beginPath(); ctx.roundRect(-200, -125, 200, 250, [30, 0, 0, 30]); ctx.fill(); ctx.globalAlpha = 1; }
    txt('إِيَّاكَ', 0, -38, { ar: 1, size: 78, col: C.ink, a: P(t, 20.2, 20.5) });
    txt('YALNIZ SƏN', 0, 52, { size: 38, w: 900, col: C.ink, ls: '2px', a: P(t, 20.3, 20.6) });
    ctx.restore();
  }
  // İBADƏT node from the verb tile
  {
    const u = toNode, B = aligned('verb-node', T_VERB, NODE_S);
    const x = lerp(VB.x, LN[0], u), y = lerp(VB.y, LN[1], u);
    fillPts(morph(T_VERB, B, u), C.cobalt, x, y);
    txt('نَعْبُدُ', x, y - 28, { ar: 1, size: 58, col: C.ivory, a: P(t, 20.3, 20.6) });
    txt('İBADƏT', x, y + 42, { size: 30, w: 900, col: C.ivory, ls: '2px', a: P(t, 20.35, 20.65) });
  }
  // second "iyyakə" leaves the centre and becomes the KÖMƏK node
  {
    const go = P(t, 20.9, 21.7, eio); if (go > 0) {
      const p = qb(CN, [960, 900], RN)(go), r = lerp(70, 110, go);
      ctx.fillStyle = go < .6 ? C.amber : C.teal; ctx.beginPath(); ctx.arc(p[0], p[1], r * P(t, 20.9, 21.1, eback), 0, 7); ctx.fill();
      if (go < .6) txt('وَإِيَّاكَ', p[0], p[1] + 4, { ar: 1, size: 40, col: C.ink, a: 1 - P(go, .4, .6) });
      txt('نَسْتَعِينُ', p[0], p[1] - 28, { ar: 1, size: 54, col: C.ivory, a: P(t, 21.5, 21.8) });
      txt('KÖMƏK', p[0], p[1] + 42, { size: 30, w: 900, col: C.ivory, ls: '2px', a: P(t, 21.55, 21.85) });
      txt('«iyyakə» — 2-ci dəfə', 820, 1050, { size: 30, w: 700, col: C.amber, a: win(t, 21.0, 22.7, .3) });
    }
  }
  // headline + subline
  if (t < 26.5) {
    ctx.save(); ctx.globalAlpha = 1 - ib;
    riseLine([{ s: 'İKİ', col: C.ivory }, { s: 'İŞ', col: C.ivory }, { s: '—', col: C.peri }, { s: 'BİR', col: C.amber }, { s: 'ÜNVAN', col: C.amber }], W / 2, 290, 84, t, 20.3);
    txt('ibadət də, kömək də — yalnız Ona', W / 2, 400, { size: 40, w: 600, col: C.peri, a: P(t, 22.4, 22.8) });
    ctx.restore();
  }
  // temptations: tree, stones, grave — the lines get cut
  if (t >= 22.9 && t < 26.5) {
    const items = [[200, 1680, 'AĞAC', miniTree, .9], [540, 1700, 'DAŞ', stones, .7], [880, 1690, 'QƏBİR', tomb, .85]];
    const cut = P(t, 24.15, 24.4, eout), drop = P(t, 24.45, 25.2, ein);
    items.forEach(([x, y, lab, fn, s], i) => {
      const k = P(t, 22.95 + i * .12, 23.35 + i * .12, eback); if (k <= 0) return;
      const src = i === 0 ? LN : i === 2 ? RN : (i % 2 ? LN : RN);
      const f = s2 => [lerp(src[0], x, s2), lerp(src[1] + 110, y - 170, s2)];
      // dashed temptation line, split at the middle when cut
      ctx.save(); ctx.globalAlpha = (1 - ib) * (1 - drop);
      if (cut <= 0) dashedPath(f, 23.25 + i * .1, 23.8 + i * .1, t, C.slate, 5);
      else { const g = .5 - .5 * cut; dashedPath(s2 => f(s2 * g), 0, 1, 1, C.slate, 5); dashedPath(s2 => f(1 - s2 * g), 0, 1, 1, C.slate, 5);
        const m = f(.5); ctx.strokeStyle = C.coral; ctx.lineWidth = 8; ctx.lineCap = 'round'; const z = 20 * clamp(cut * 1.5); ctx.beginPath(); ctx.moveTo(m[0] - z, m[1] - z); ctx.lineTo(m[0] + z, m[1] + z); ctx.moveTo(m[0] + z, m[1] - z); ctx.lineTo(m[0] - z, m[1] + z); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = (1 - ib) * (1 - drop * .85); ctx.translate(x, y + drop * 60); ctx.rotate(drop * (i - 1 || .6) * .35); ctx.scale(k, k); fn(0, 0, s); ctx.restore();
      txt(lab, x, y + 120, { size: 28, w: 800, col: C.slate, ls: '3px', a: (1 - ib) * clamp(k) * (1 - drop) });
    });
  }
}

function scene6(t) {
  if (t < 26.85) return;
  const A1 = 'إِيَّاكَ', A2 = 'نَعْبُدُ', B1 = 'وَإِيَّاكَ', B2 = 'نَسْتَعِينُ', sz = 112, gap = 34;
  const line = (r, l, y, t0) => {
    const wr = tw(r, sz, 700, true), wl = tw(l, sz, 700, true), tot = wr + wl + gap, xr = W / 2 + tot / 2 - wr / 2, xl = W / 2 - tot / 2 + wl / 2;
    const k = P(t, t0 + .35, t0 + .7, eout); if (k > 0) { ctx.fillStyle = C.amber; rr(xr, y + 10, (wr + 36) * k, 136, 24); ctx.fill(); }
    const a = P(t, t0, t0 + .4); txt(r, xr, y + (1 - a) * 30, { ar: 1, size: sz, col: C.ink, a }); txt(l, xl, y + (1 - a) * 30, { ar: 1, size: sz, col: C.ink, a: P(t, t0 + .1, t0 + .5) });
  };
  line(A1, A2, 640, 26.9); line(B1, B2, 820, 27.05);
  const tr = (s1, s2, y, t0) => { const w1 = tw(s1, 46, 900), w2 = tw(s2, 46, 700), x0 = W / 2 - (w1 + w2) / 2, k = P(t, t0, t0 + .4, eout);
    const b = P(t, t0 + .3, t0 + .65, eout); if (b > 0) { ctx.fillStyle = 'rgba(255,198,92,0.45)'; rr(x0 + w1 / 2, y + 4, (w1 + 20) * b, 62, 12); ctx.fill(); }
    txt(s1, x0, y + (1 - k) * 20, { size: 46, w: 900, col: C.ink, align: 'left', a: k }); txt(s2, x0 + w1, y + (1 - k) * 20, { size: 46, w: 700, col: C.ink, align: 'left', a: k }); };
  tr('Yalnız', ' Sənə ibadət edirik,', 1020, 27.4); tr('yalnız', ' Səndən kömək istəyirik.', 1100, 27.6);
  // callback: the ribbon unties from the little tree and flies away
  const tk = P(t, 27.7, 28.1, eback);
  if (tk > 0) {
    ctx.save(); ctx.translate(540, 1430); ctx.scale(tk, tk); miniTree(0, 0, 1); ctx.restore();
    const fl = P(t, 28.15, 29.0, ein);
    ctx.save(); ctx.globalAlpha = 1 - P(t, 28.7, 29.0); hangRibbon(540 - 48 + fl * 420, 1430 - 100 - fl * 520, 1, t, C.coral, 2, 110, 0); ctx.restore();
  }
  riseLine([{ s: 'Namazdakı', col: C.ink }, { s: 'sözünü', col: C.ink }], W / 2, 1610, 66, t, 28.2);
  riseLine([{ s: 'ağaca', col: C.coral }, { s: 'bağlama.', col: C.ink }], W / 2, 1700, 66, t, 28.4);
  chip('BİRİNCİ SİR ✓', W / 2, 450, t, 28.9, C.teal, C.ivory, 30);
}

function watermark(t) {
  const dark = t > 10.1 && t < 26.8;
  txt('@esgarow', 60, 80, { size: 30, w: 800, col: dark ? C.ivory : C.ink, align: 'left', a: .75 });
  txt('AYƏNİN SİRRİ · 4', W - 60, 80, { size: 26, w: 800, col: dark ? C.amber : C.coral, align: 'right', ls: '3px', a: .85 });
}

function render(t) {
  t = clamp(t, 0, DUR);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.setLineDash([]);
  bgAt(t);
  ctx.save(); cam(t);
  scene1and2(t); scene3(t); scene4and5(t); scene6(t);
  ctx.restore();
  watermark(t);
}
window.seek = t => { render(t); return true; };
window.frameData = (t, q = .93) => { render(t); return cv.toDataURL('image/jpeg', q); };

// ---------- preview controls ----------
const fontsReady = Promise.all(['500', '700', '800', '900'].map(w => document.fonts.load(`${w} 40px Montserrat`, 'Əə ÖÜÇŞĞİ')).concat([document.fonts.load('700 60px Amiri', 'إِيَّاكَ')]));
fontsReady.then(() => { window.ready = true; render(0); });
let playing = false, t0 = 0, base = 0;
const sk = document.getElementById('sk'), tm = document.getElementById('tm'), pp = document.getElementById('pp');
if (new URLSearchParams(location.search).has('capture')) document.body.classList.add('capture');
function loop(now) { if (!playing) return; const t = base + (now - t0) / 1000; if (t >= DUR) { playing = false; pp.textContent = '▶'; render(DUR); return; } render(t); sk.value = t; tm.textContent = `${t.toFixed(1)} / ${DUR.toFixed(1)}`; requestAnimationFrame(loop); }
pp.onclick = () => { playing = !playing; pp.textContent = playing ? '❚❚' : '▶'; if (playing) { base = +sk.value >= DUR ? 0 : +sk.value; t0 = performance.now(); requestAnimationFrame(loop); } };
document.getElementById('rs').onclick = () => { sk.value = 0; base = 0; t0 = performance.now(); render(0); };
sk.oninput = () => { playing = false; pp.textContent = '▶'; render(+sk.value); tm.textContent = `${(+sk.value).toFixed(1)} / ${DUR.toFixed(1)}`; };
