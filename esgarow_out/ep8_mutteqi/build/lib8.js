// ================= ep8 shared library (Short 9:16 + Long 16:9) =================
// Effects ported to our Canvas engine from: video-shotcraft (text-as-mask, crash-zoom-punch, spotlight-sweep,
// glow-flyline, grain-dissolve), video-effects-skill (ChecklistTally, PaperCutout, LiquidGlass) and ep6 kinetic type.
// LAYOUT RULE (no overlaps): subtitles own a reserved bottom band; nothing else is drawn inside it.
const K = KT, LEAD = 0.4, L = x => x - LEAD;
const PORT = H > W;                                   // 9:16 Short vs 16:9 long
const SUB_Y = PORT ? 1468 : 984;                      // subtitle band centre
const SAFE_B = PORT ? 1355 : 875;                     // content must stay above this
const IM = {};
function load(k, src) { pending++; const im = new Image(); im.onload = () => { IM[k] = im; pending--; }; im.onerror = () => { console.log('img fail', src); pending--; }; im.src = src; }
['k_elamet_1', 'k_elamet_2', 'k_elamet_3', 'k_elamet_4', 'k_elamet_5', 'k_heyvan_1', 'k_heyvan_2', 'k_heyvan_3', 'k_heyvan_4', 'k_heyvan_5', 'k_kilid',
 'k_su_1', 'k_su_2', 'k_su_3', 'k_su_4', 'k_su_5', 'k_tebiet_1', 'k_tebiet_2', 'k_tebiet_3', 'k_tebiet_4', 'k_tebiet_5', 'k_yol_2', 'k_yol_3', 'k_yol_4',
 'tebiet_4', 'qelb_3', 'tebiet_3', 'tebiet_5'].forEach(k => load(k, `img/${k}.png`));
function loadBgs(list) { list.forEach(k => load(k, `img/${k}.jpg`)); }

// ---------- offscreen groups ----------
const _g = [0, 1, 2].map(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }); let _gd = 0;
function grp(a, fn) {
  if (a <= 0) return; if (a >= 1 || _gd > 2) { fn(); return; }
  const c = _g[_gd++], x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.clearRect(0, 0, W, H);
  const real = ctx; ctx = x; ctx.save(); fn(); ctx.restore(); ctx = real; _gd--;
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(c, 0, 0); ctx.restore();
}
const life = (t, t0, t1 = 1e9, fi = 0.5, fo = 0.45) => R(t, t0, t0 + fi) * (1 - R(t, t1 - fo, t1));

// ---------- backgrounds ----------
function cover(k, t, t0, z0 = 1.0, z1 = 1.1, opt = {}) {
  const im = IM[k]; if (!im) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); return; }
  const u = ease((t - t0) / (opt.dur || 14)), z = lerp(z0, z1, u), s = Math.max(W / im.width, H / im.height) * z;
  const iw = im.width * s, ih = im.height * s;
  ctx.save(); if (opt.filter) ctx.filter = opt.filter;
  if (opt.panel) { // portrait image as a right-hand panel on a 16:9 frame (bg16 fallback)
    const ph = H, pw = im.width * H / im.height * z; ctx.drawImage(im, W - pw + (opt.dx || 0) * u, (H - ph * z) / 2, pw, ph * z);
  } else ctx.drawImage(im, (W - iw) / 2 + (opt.dx || 0) * u, (H - ih) / 2 + (opt.dy || 0) * u, iw, ih);
  ctx.restore();
  if (opt.dark) { ctx.fillStyle = `rgba(0,0,0,${opt.dark})`; ctx.fillRect(0, 0, W, H); }
  if (PORT) {
    let g = ctx.createLinearGradient(0, 0, 0, 820); g.addColorStop(0, 'rgba(5,5,8,0.86)'); g.addColorStop(1, 'rgba(5,5,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 820);
    g = ctx.createLinearGradient(0, 1250, 0, H); g.addColorStop(0, 'rgba(5,5,8,0)'); g.addColorStop(1, 'rgba(5,5,8,0.9)'); ctx.fillStyle = g; ctx.fillRect(0, 1250, W, H - 1250);
  } else {
    let g = ctx.createLinearGradient(0, 0, W * 0.55, 0); g.addColorStop(0, 'rgba(5,5,8,0.88)'); g.addColorStop(1, 'rgba(5,5,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W * 0.55, H);
    g = ctx.createLinearGradient(0, 800, 0, H); g.addColorStop(0, 'rgba(5,5,8,0)'); g.addColorStop(1, 'rgba(5,5,8,0.85)'); ctx.fillStyle = g; ctx.fillRect(0, 800, W, H - 800);
    g = ctx.createLinearGradient(0, 0, 0, 160); g.addColorStop(0, 'rgba(5,5,8,0.6)'); g.addColorStop(1, 'rgba(5,5,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 160);
  }
}

// ---------- text ----------
function ct(s, x, y, size, weight, col, t, t0, t1 = 1e9, opt = {}) {
  const a = life(t, t0, t1, opt.fi ?? 0.5); if (a <= 0) return;
  const dy = 28 * (1 - eOut(clamp((t - t0) / 0.5)));
  tx(s, x, y + dy, pf(weight, size), col, a, { glow: opt.glow || 'rgba(0,0,0,0.85)', blur: opt.blur ?? 22, ls: opt.ls, align: opt.align || (PORT ? 'center' : 'left') });
}
// kinetic word-by-word build (ep6/hawking): each word pops on its own measured time
function kwLine(words, x, y, size, weight, col, t, t1 = 1e9, opt = {}) {
  const font = pf(weight, size), sp = measure(' ', font);
  const ws = words.map(([w]) => measure(w, font)), tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = (opt.align === 'left' || (!opt.align && !PORT)) ? x : x - tot / 2; const out = 1 - R(t, t1 - 0.45, t1);
  words.forEach(([w, t0, c], i) => {
    const k = pop(t, t0, 0.38); if (k > 0) tx(w, cx + ws[i] / 2, y + 18 * (1 - clamp(k)), font, c || col, clamp(k * 1.6) * out, { glow: 'rgba(0,0,0,0.85)', blur: 20 });
    cx += ws[i] + sp;
  });
}
function pillT(s, x, y, size, bg, fg, t, t0, t1 = 1e9, opt = {}) { grp(1 - R(t, t1 - 0.45, t1), () => pill(s, x, y, size, bg, fg, t, t0, opt)); }
function chipT(s, x, y, t, t0, t1 = 1e9, col = G1, size = 34) { grp(1 - R(t, t1 - 0.45, t1), () => chipK(s, x, y, t, t0, col, size)); }
function arT(s, x, y, size, t, t0, t1 = 1e9, d = 0.9, col = G1) { grp(1 - R(t, t1 - 0.45, t1), () => arabicK(s, x, y, size, t, t0, d, col)); }
function stampT(s, t, t0, x, y, size, col, t1 = 1e9) { grp(1 - R(t, t1 - 0.45, t1), () => stampK(s, t, t0, x, y, size, col, -0.05, 'rgba(10,8,4,0.6)')); }
function sourceTag(s, t, t0, t1 = 1e9) { const y = PORT ? 1330 : 862; tx(s, PORT ? W / 2 : 110, y, pf(600, PORT ? 28 : 24), 'rgba(255,240,210,0.88)', life(t, t0, t1) * 0.95, { glow: '#000', blur: 12, align: PORT ? 'center' : 'left' }); }
// strike-replace: old word crossed out in red, the right word rises in gold (namaz / yəqin)
function strikeReplace(a, b, x, y, size, t, ta, tb, t1 = 1e9) {
  const o = life(t, ta, t1); if (o <= 0) return;
  grp(o, () => {
    const fa = pf(800, size * 0.8), wa = measure(a, fa);
    tx(a, x, y, fa, 'rgba(255,255,255,0.85)', 1, { glow: '#000', blur: 15, align: 'center' });
    const u = clamp((t - tb) / 0.35); if (u > 0) { ctx.save(); ctx.strokeStyle = '#ff5a4f'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - wa / 2 - 10, y + 4); ctx.lineTo(x - wa / 2 - 10 + (wa + 20) * eOut(u), y - 2); ctx.stroke(); ctx.restore(); }
    const k = pop(t, tb + 0.15, 0.45); if (k > 0) tx(b, x, y + size * 1.15, pf(900, size), G1, clamp(k * 1.5), { sc: k, glow: '#000', blur: 25 });
  });
}

// ---------- subtitles (karaoke, reserved band) ----------
function subs(t) {
  let cur = null, nxt = null;
  for (let i = 0; i < SUBS.length; i++) if (t >= SUBS[i].t0 - 0.12) { cur = SUBS[i]; nxt = SUBS[i + 1]; }
  if (!cur) return; const end = Math.min(nxt ? nxt.t0 - 0.12 : 1e9, cur.t1 + 0.6); if (t > end) return;
  const a = R(t, cur.t0 - 0.12, cur.t0 + 0.05) * (1 - R(t, end - 0.12, end));
  const size = PORT ? 50 : 40, font = pf(800, size), maxW = PORT ? 900 : 1400, sp = measure(' ', font);
  const lines = []; let line = [], lw = 0;
  cur.w.forEach(([w, tw]) => { const ww = measure(w, font); if (line.length && lw + sp + ww > maxW) { lines.push([line, lw]); line = []; lw = 0; } line.push([w, tw, ww]); lw += (line.length > 1 ? sp : 0) + ww; });
  if (line.length) lines.push([line, lw]);
  const lh = size * 1.32, bh = lines.length * lh + 26, bw = Math.max(...lines.map(l => l[1])) + 60, by = SUB_Y + (PORT ? 0 : 0) - bh / 2;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(8,8,12,0.62)'; rrect(W / 2 - bw / 2, by, bw, bh, 22); ctx.fill(); ctx.restore();
  let curW = -1; cur.w.forEach(([, tw], i) => { if (t >= tw - 0.05) curW = i; });
  let idx = 0;
  lines.forEach(([ln, lw], li) => {
    let x = W / 2 - lw / 2; const y = by + 13 + lh * (li + 0.5);
    ln.forEach(([w, tw, ww]) => {
      const said = t >= tw - 0.05, col = idx === curW ? G2 : said ? '#ffffff' : 'rgba(255,255,255,0.5)';
      tx(w, x + ww / 2, y, font, col, a, { glow: 'rgba(0,0,0,0.9)', blur: 10, sc: idx === curW ? 1.04 : 1 });
      x += ww + sp; idx++;
    });
  });
}

// ---------- 5-sign tracker (ChecklistTally) ----------
function tracker(t, tIn, starts, dones, tOut = 1e9) {
  const a = life(t, tIn, tOut, 0.5); if (a <= 0) return;
  const n = 5, gap = PORT ? 132 : 96, r = PORT ? 34 : 26, cx = W / 2, cy = PORT ? 196 : 66;
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - gap * 2, cy); ctx.lineTo(cx + gap * 2, cy); ctx.stroke();
  const pd = dones.filter(d => t > d).length;
  if (pd > 1) { ctx.strokeStyle = MINT; ctx.beginPath(); ctx.moveTo(cx - gap * 2, cy); ctx.lineTo(cx - gap * 2 + gap * (pd - 1), cy); ctx.stroke(); }
  for (let i = 0; i < n; i++) {
    const x = cx + (i - 2) * gap, on = t >= starts[i] - LEAD, done = t >= dones[i], p = done ? pop(t, dones[i], 0.4) : 0;
    ctx.fillStyle = done ? MINT : on ? G1 : 'rgba(20,20,26,0.85)'; ctx.beginPath(); ctx.arc(x, cy, r * (on && !done ? 1 + 0.08 * Math.sin(t * 6) : 1), 0, 7); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = on ? G1 : 'rgba(255,255,255,0.4)'; ctx.stroke();
    if (done) { ctx.save(); ctx.strokeStyle = '#0d3b2a'; ctx.lineWidth = r * 0.22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const k = clamp(p); ctx.beginPath(); ctx.moveTo(x - r * 0.45, cy + 2); ctx.lineTo(x - r * 0.1, cy + r * 0.32); ctx.lineTo(x + r * 0.5, cy - r * 0.38); ctx.globalAlpha = k; ctx.stroke(); ctx.restore(); }
    else tx(String(i + 1), x, cy + 2, pf(900, r), on ? '#1a1000' : 'rgba(255,255,255,0.8)', 1);
  }
  ctx.restore();
}

// ---------- PaperCutout stickers ----------
const STK = {};
function stickerCanvas(k, h, border) {
  const key = k + '|' + h + '|' + border; if (STK[key]) return STK[key]; const im = IM[k]; if (!im) return null;
  const w = Math.round(im.width * h / im.height), c = document.createElement('canvas'); c.width = w + border * 2 + 4; c.height = h + border * 2 + 4; const x = c.getContext('2d');
  for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2; x.drawImage(im, border + 2 + Math.cos(an) * border, border + 2 + Math.sin(an) * border, w, h); }
  x.globalCompositeOperation = 'source-in'; x.fillStyle = '#fbf8f0'; x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'source-over'; x.drawImage(im, border + 2, border + 2, w, h);
  return (STK[key] = c);
}
// slap-in (small overshoot), stop-motion sway on a 7.5 fps clock, cast shadow
function stick(k, x, y, h, t, t0, t1 = 1e9, opt = {}) {
  const a = life(t, t0, t1, 0.25, 0.4); if (a <= 0) return; const c = stickerCanvas(k, h, opt.border ?? Math.round(h * 0.045 + 4)); if (!c) return;
  const k2 = pop(t, t0, 0.42), step = Math.floor(t * 7.5), jit = (Math.sin(step * 12.99 + h) * 0.5 + Math.sin(step * 4.1 + x) * 0.5);
  const rot = (opt.rot || 0) + (opt.still ? 0 : jit * 0.025), bob = opt.bob ? Math.sin((t - t0) * 2) * opt.bob : 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + bob); ctx.rotate(rot); ctx.scale(k2 * (opt.flip ? -1 : 1), k2);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 14;
  ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore();
}
function sprite(k, x, y, h, a = 1, rot = 0, sc = 1, glowCol = null) {
  const im = IM[k]; if (!im || a <= 0) return; const w = im.width * h / im.height;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.shadowColor = glowCol || 'rgba(0,0,0,0.55)'; ctx.shadowBlur = glowCol ? 50 : 26; ctx.shadowOffsetY = glowCol ? 0 : 12;
  ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
}
function propS(k, t, t0, x, y, h, t1 = 1e9, glowCol = null) {
  const a = life(t, t0, t1, 0.5); if (a <= 0) return; const s = lerp(0.82, 1, eOut(clamp((t - t0) / 0.7))), bob = Math.sin((t - t0) * 1.4) * 7;
  sprite(k, x, y + bob, h, a, Math.sin((t - t0) * 0.9) * 0.025, s, glowCol);
}

// ---------- shotcraft: text-as-mask (image seen through a giant glyph, then the glyph rushes in) ----------
const tmC = document.createElement('canvas'); tmC.width = W; tmC.height = H; const tmX = tmC.getContext('2d');
function textMask(glyph, imgKey, t, t0, tPush, cx, cy, size, ox, oy) {
  const im = IM[imgKey]; if (!im || t < t0) return 0;
  const intro = eOut(clamp((t - t0) / 0.5)), u = clamp((t - tPush) / 0.75), S = u > 0 ? Math.pow(46, Math.pow(u, 1.8)) * lerp(1, 0.965, 0) : lerp(1.04, 1, intro) * (t > tPush - 0.25 ? lerp(1, 0.965, clamp((t - tPush + 0.25) / 0.25)) : 1);
  tmX.setTransform(1, 0, 0, 1, 0, 0); tmX.globalCompositeOperation = 'source-over'; tmX.clearRect(0, 0, W, H);
  const s = Math.max(W / im.width, H / im.height) * 1.25, drift = (t - t0) * 30;
  tmX.drawImage(im, (W - im.width * s) / 2 - drift, (H - im.height * s) / 2, im.width * s, im.height * s);
  tmX.globalCompositeOperation = 'destination-in';
  tmX.save(); tmX.translate(ox, oy); tmX.scale(S, S); tmX.translate(-ox, -oy);
  tmX.font = pf(900, size); tmX.textAlign = 'center'; tmX.textBaseline = 'middle'; tmX.fillStyle = '#fff';
  tmX.globalAlpha = intro; tmX.fillText(glyph, cx, cy + (1 - intro) * 120); tmX.restore();
  ctx.save(); ctx.shadowColor = 'rgba(255,190,80,0.55)'; ctx.shadowBlur = 70 * (1 - u); ctx.drawImage(tmC, 0, 0); ctx.restore();
  if (u < 0.15) { ctx.save(); ctx.globalAlpha = intro * (1 - u / 0.15); ctx.translate(ox, oy); ctx.scale(S, S); ctx.translate(-ox, -oy); ctx.font = pf(900, size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 5; ctx.strokeStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.strokeText(glyph, cx, cy + (1 - intro) * 120); ctx.restore(); }
  return u;
}
// crash-zoom-punch camera: returns zoom/centre for the scene layer
function crash(t, t0, z1 = 1.5, recoil = 0.05) { const d = t - t0; if (d < -0.25) return 1; if (d < 0) return 1 - 0.035 * eOut((d + 0.25) / 0.25); if (d < 0.2) return lerp(0.965, z1 + recoil, Math.pow(d / 0.2, 2)); return lerp(z1 + recoil, z1, eOut(clamp((d - 0.2) / 0.25))); }
// spotlight sweep: darkness, a linear radial reveal around (x,y)
function spotlight(t, t0, d, x, y, rMax, hold = 1) {
  const u = clamp((t - t0) / d); if (u >= 1 && hold) return; const r = rMax * u;
  ctx.save(); const g = ctx.createRadialGradient(x, y, Math.max(1, r * 0.55), x, y, Math.max(2, r)); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.96)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// glow flyline from p0 to p1 with a bright head and fading tail
function flyline(p0, p1, bend, t, t0, d = 0.7, col = '255,214,140') {
  const u = eOut(clamp((t - t0) / d)); if (u <= 0) return; const N = 60, cx = (p0[0] + p1[0]) / 2 + bend[0], cy = (p0[1] + p1[1]) / 2 + bend[1];
  const P = s => [(1 - s) * (1 - s) * p0[0] + 2 * (1 - s) * s * cx + s * s * p1[0], (1 - s) * (1 - s) * p0[1] + 2 * (1 - s) * s * cy + s * s * p1[1]];
  ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
  for (let i = 1; i <= N * u; i++) { const [x0, y0] = P((i - 1) / N), [x1, y1] = P(i / N), f = 0.25 + 0.75 * (i / (N * u)); ctx.strokeStyle = `rgba(${col},${0.85 * f})`; ctx.lineWidth = 5; ctx.shadowColor = `rgba(${col},1)`; ctx.shadowBlur = 18; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  const [hx, hy] = P(u); glow(hx, hy, 46, `rgba(${col.replace(/ /g, '')},A)`, u < 1 ? 1 : 0.5 + 0.5 * Math.sin(t * 5)); ctx.restore();
}
// grain-dissolve: text A boils into particles that condense into text B
const GD = {};
function grainSet(key, s, font, x, y) {
  if (GD[key]) return GD[key]; const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.direction = /[؀-ۿ]/.test(s) ? 'rtl' : 'ltr'; g.fillText(s, x, y);
  const d = g.getImageData(0, 0, W, H).data, pts = [];
  for (let yy = 0; yy < H; yy += 5) for (let xx = 0; xx < W; xx += 5) if (d[(yy * W + xx) * 4 + 3] > 120) pts.push([xx, yy]);
  return (GD[key] = pts);
}
function grainDissolve(A, B, t, t0, d, col = G1) {
  const u = clamp((t - t0) / d); if (u <= 0 || u >= 1) return u;
  const n = Math.max(A.length, B.length), boil = Math.sin(Math.PI * clamp(u / 0.75)), mv = ease(clamp((u - 0.35) / 0.55));
  ctx.save(); ctx.fillStyle = col; ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i += 1) {
    const a = A[i % A.length], b = B[Math.floor(i * B.length / n)], j = (srand(i * 7 + Math.floor(t * 40)) - 0.5) * 70 * boil, j2 = (srand(i * 3 + 1 + Math.floor(t * 40)) - 0.5) * 70 * boil;
    const x = lerp(a[0], b[0], mv) + j, y = lerp(a[1], b[1], mv) + j2; ctx.globalAlpha = 0.55; ctx.fillRect(x, y, 4, 4);
  }
  ctx.restore(); return u;
}
// ---------- props drawn in code ----------
function lanternRow(t, xs, y, h, igniteTimes, tIn, t1 = 1e9) {
  xs.forEach((x, i) => {
    const a = life(t, tIn + i * 0.08, t1, 0.4); if (a <= 0 || !IM.tebiet_4) return; const on = R(t, igniteTimes[i], igniteTimes[i] + 0.3), sw = Math.sin(t * 1.3 + i) * 0.04;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(200,170,110,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + Math.sin(sw) * (y - h / 2), y - h / 2); ctx.stroke(); ctx.restore();
    if (on > 0) glow(x, y + 10, h * 1.2, 'rgba(255,180,70,A)', 0.55 * on * a * (0.85 + 0.15 * Math.sin(t * 9 + i)));
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(sw); ctx.filter = `brightness(${lerp(0.35, 1.05, on)})`;
    const im = IM.tebiet_4, w = im.width * h / im.height; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
  });
}
function grains(t, t0, x, y, n = 40, a = 1) { if (t < t0) return; ctx.save(); ctx.fillStyle = `rgba(235,205,140,${a})`; for (let i = 0; i < n; i++) { const d = t - t0 - srand(i) * 0.6; if (d < 0) continue; const px = x + (srand(i + 3) - 0.5) * 260 + d * (srand(i + 9) - 0.5) * 120, py = Math.min(y + 120 + srand(i + 5) * 40, y + d * 380 + 0.5 * 900 * d * d); ctx.beginPath(); ctx.ellipse(px, py, 4, 2.5, srand(i) * 3, 0, 7); ctx.fill(); } ctx.restore(); }
function drops(t, t0, x, y, d = 1.2, n = 18) { if (t < t0 || t > t0 + d + 0.6) return; ctx.save(); for (let i = 0; i < n; i++) { const u = (t - t0 - i * d / n); if (u < 0 || u > 0.6) continue; ctx.fillStyle = `rgba(190,225,255,${0.9 * (1 - u / 0.6)})`; ctx.beginPath(); ctx.ellipse(x + (srand(i) - 0.5) * 30, y + u * 260, 5, 9, 0, 0, 7); ctx.fill(); } ctx.restore(); }
function quoteCard(lines, x, y, w, t, t0, t1 = 1e9, opt = {}) {
  const a = life(t, t0, t1, 0.5); if (a <= 0) return; const size = opt.size || (PORT ? 48 : 40), lh = size * 1.35, h = lines.length * lh + 70;
  grp(a, () => {
    ctx.save(); ctx.fillStyle = 'rgba(12,9,5,0.74)'; rrect(x - w / 2, y - h / 2, w, h, 28); ctx.fill(); ctx.strokeStyle = 'rgba(246,199,104,0.85)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    tx('“', x - w / 2 + 44, y - h / 2 + 30, pf(900, 90), G1, 1);
    lines.forEach(([s, tl, c], i) => { const k = R(t, tl, tl + 0.45); tx(s, x, y - h / 2 + 35 + lh * (i + 0.5) + 16 * (1 - k), pf(opt.w || 700, size), c || '#fff', k, { glow: '#000', blur: 10 }); });
  });
}
function watermark8(t, ep, tOff = 1e9) {
  const a = 0.85 * (1 - R(t, tOff, tOff + 0.5)); if (a <= 0) return; const y = PORT ? 81 : 54, sc = PORT ? 1 : 0.8;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(PORT ? 0 : 20, 0); ctx.scale(sc, sc); ctx.fillStyle = 'rgba(10,10,12,0.5)'; rrect(36, y - 37, 300, 70, 35); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(79, y, 26, 0, 7); ctx.clip(); ctx.drawImage(logo, 53, y - 26, 52, 52); ctx.restore();
  ctx.font = pf(700, 30); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('@esgarow', 118, y + 2); ctx.restore();
  const bx = PORT ? W - 196 : W - 170; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(10,10,12,0.5)'; rrect(bx - 160 * sc, y * sc + (PORT ? -37 : -6) , 320 * sc, 70 * sc, 35 * sc); ctx.fill(); ctx.restore();
  tx(`AYƏNİN SİRRİ · ${ep}`, bx, PORT ? y : y * sc + 22, pf(800, PORT ? 28 : 22), G1, a, { ls: '2px' });
}
