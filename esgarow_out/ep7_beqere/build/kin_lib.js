// ================= Ayənin sirri 6 — Fatihə 1:7 · KINETIC TYPOGRAPHY sample =================
// New format: words fly in (scatter / rise / track / pop), highlighter pills, code-drawn 3D props,
// white ↔ black ↔ grey scene switches with mask transitions. All visuals drawn in code, no photos.

const POP = { latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212',
  ext: 'U+0100-0130, U+0132-0151, U+0154-02BA, U+0300-036F, U+1E00-1EFF' };
[500, 700, 800, 900].forEach(w => [['', POP.latin], ['x', POP.ext]].forEach(([s, r]) => {
  pending++; new FontFace('P', `url(fonts/P${w}${s}.woff2)`, { weight: String(w), unicodeRange: r }).load().then(f => { document.fonts.add(f); pending--; }).catch(e => { console.log('font', e); pending--; });
}));
const INKD = '#111214', MINT = '#9ff3d4', BLUE = '#1f4fbf', REDK = '#e23a3a', GREY = '#5c636b';
const pf = (w, s) => `${w} ${s}px "P"`;

// ---------- kinetic text ----------
function measure(s, font, ls = 0) { ctx.save(); ctx.font = font; ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(s).width; ctx.restore(); return w; }
// style: rise | scatter | track | pop | drop
function kw(s, x, y, size, weight, col, t, t0, style = 'rise', opt = {}) {
  const u = (t - t0) / (opt.d || 0.45); if (u <= 0) return;
  const font = pf(weight, size), a = opt.alpha ?? 1;
  if (style === 'rise') {
    const e = eOut(u); ctx.save(); ctx.beginPath(); ctx.rect(0, y - size * 0.75, W, size * 1.5); ctx.clip();
    tx(s, x, y + size * 1.1 * (1 - e), font, col, a, { align: opt.align }); ctx.restore(); return;
  }
  if (style === 'pop') { const k = pop(t, t0, opt.d || 0.4); tx(s, x, y, font, col, clamp(k * 2) * a, { sc: k, align: opt.align, glow: opt.glow, blur: 30 }); return; }
  if (style === 'track') { const e = eOut(u); tx(s, x, y, font, col, clamp(u * 1.6) * a, { ls: `${lerp(opt.from ?? 34, 0, e)}px`, align: opt.align }); return; }
  // scatter / drop: per-letter
  const chars = [...s], w = measure(s, font); let cx = x - w / 2;
  chars.forEach((ch, i) => {
    const cw = measure(ch, font), d = opt.step ?? 0.035, v = clamp((t - t0 - i * d) / 0.42); const e = eOut(v);
    if (v > 0) {
      const ox = style === 'drop' ? 0 : (srand(i * 3 + s.length) - 0.5) * 180, oy = style === 'drop' ? -size * 1.2 : (srand(i * 7 + 1) - 0.5) * 160, r = style === 'drop' ? 0 : (srand(i + 5) - 0.5) * 1.2;
      ctx.save(); ctx.globalAlpha = clamp(v * 2) * a; ctx.translate(cx + cw / 2 + ox * (1 - e), y + oy * (1 - e)); ctx.rotate(r * (1 - e)); const sc = lerp(style === 'drop' ? 1 : 1.8, 1, e); ctx.scale(sc, sc);
      ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; if (v < 1) { ctx.filter = `blur(${(1 - e) * 6}px)`; } ctx.fillText(ch, 0, 0); ctx.restore();
    }
    cx += cw;
  });
}
// highlighter pill: box wipes in from the left, then the word drops in
function pill(s, x, y, size, bg, fg, t, t0, opt = {}) {
  const u = clamp((t - t0) / 0.3); if (u <= 0) return; const font = pf(opt.w || 800, size), w = measure(s, font) + size * 0.7, h = size * 1.35;
  ctx.save(); if (opt.rot) { ctx.translate(x, y); ctx.rotate(opt.rot); ctx.translate(-x, -y); }
  ctx.fillStyle = bg; if (opt.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; }
  rrect(x - w / 2, y - h / 2, w * eOut(u), h, opt.r ?? 10); ctx.fill(); ctx.restore();
  const v = clamp((t - t0 - 0.1) / 0.3); if (v <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.clip(); if (opt.rot) { ctx.translate(x, y); ctx.rotate(opt.rot); ctx.translate(-x, -y); }
  tx(s, x, y + 3 + h * (1 - eOut(v)), font, fg, 1); ctx.restore();
}

// ---------- backgrounds ----------
const ASTER = [[930, 170, 70, 0], [120, 980, 46, 1], [980, 1330, 30, 2], [160, 1560, 26, 3]];
function asterisk(x, y, r, rot, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, r * 0.12); ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke(); } ctx.restore(); }
function dotGrid(t, cx, cy, col, rad = 520) {
  ctx.save(); const sp = 36, off = (t * 6) % sp;
  for (let y = -sp; y < H + sp; y += sp) for (let x = -sp; x < W + sp; x += sp) {
    const xx = x + off, yy = y, d = Math.hypot(xx - cx, yy - cy) / rad; const a = clamp(1 - d) * 0.5; if (a <= 0.02) continue;
    ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(xx, yy, 2.4, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function bgW(t, cx = 540, cy = 900) {
  ctx.fillStyle = '#f6f6f3'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rg(540, 900, 100, 1200, [[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(220,222,226,0.6)']]); ctx.fillRect(0, 0, W, H);
  dotGrid(t, cx, cy, '#9aa0a8');
  ASTER.forEach(([x, y, r, i]) => asterisk(x, y + Math.sin(t * 1.3 + i) * 8, r, t * 0.4 + i, 'rgba(150,155,162,0.65)'));
}
function bgK(t, glowCol = '255,190,70') {
  ctx.fillStyle = '#060606'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg(540, 180, 0, 700, [[0, `rgba(${glowCol},0.22)`], [1, `rgba(${glowCol},0)`]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, 0); ctx.lineTo(60, H); ctx.stroke(); ctx.restore();
  drawDust(t, 0.35);
}
function bgG(t) {
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#5d646c'], [1, '#3e444b']]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { const x = ((i * 380 + t * 40) % 1600) - 300; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 140, 0); ctx.lineTo(x - 260, H); ctx.lineTo(x - 400, H); ctx.fill(); } ctx.restore();
  dotGrid(t, 540, 1080, 'rgba(255,255,255,0.8)', 600);
}
// Islamic 8-point star lattice, faint gold, for the ayah scene
function starLattice(t, a = 0.12) {
  ctx.save(); ctx.strokeStyle = `rgba(246,199,104,${a})`; ctx.lineWidth = 1.6; const s = 150, off = (t * 8) % s;
  for (let y = -s; y < H + s; y += s) for (let x = -s; x < W + s; x += s) {
    const cx = x + s / 2, cy = y + s / 2 + off; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const r = i % 2 ? 26 : 52, an = i * Math.PI / 8; const px = cx + Math.cos(an) * r, py = cy + Math.sin(an) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
}

// ---------- misc FX (from ep5, adapted) ----------
function stampK(s, t, t0, x, y, size, col, rot = -0.08, fill = 'rgba(255,255,255,0.0)') {
  const u = clamp((t - t0) / 0.28); if (u <= 0) return; const sc = lerp(2.6, 1, eOut(u));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(u * 1.6);
  ctx.font = pf(900, size); ctx.letterSpacing = '6px'; const w = ctx.measureText(s).width + 70;
  ctx.fillStyle = fill; rrect(-w / 2, -size * 0.8, w, size * 1.6, 16); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 3, 6); ctx.restore();
}
function arabicK(s, x, y, size, t, t0, d = 0.7, col = G1) {
  const u = clamp((t - t0) / d); if (u <= 0) return;
  ctx.save(); ctx.font = `bold ${size}px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(s).width + 40;
  ctx.beginPath(); ctx.rect(x + w / 2 - w * eOut(u), y - size * 1.2, w * eOut(u), size * 2.4); ctx.clip();
  ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 30; ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore();
  if (u < 1) { const sx = x + w / 2 - w * eOut(u); glow(sx, y, size * 1.1, 'rgba(255,230,160,A)', 0.8); }
}
function badge(n, x, y, t, t0, bg = G1, fg = '#111', r = 26) {
  const k = pop(t, t0, 0.35); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = bg; ctx.shadowColor = bg; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
  tx(String(n), x, y + 2, pf(800, r * 1.15), fg, clamp(k), { sc: k });
}
function chipK(s, x, y, t, t0, col = G1, size = 40, dark = true) {
  const k = pop(t, t0); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.font = pf(800, size); ctx.letterSpacing = '4px';
  const w = ctx.measureText(s).width + 64; ctx.fillStyle = dark ? 'rgba(10,8,4,0.6)' : 'rgba(255,255,255,0.7)'; rrect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  tx(s, x, y + 2, pf(800, size), col, clamp(k), { sc: k, ls: '4px' });
}

// --- helpers ported from ep5 ---
function glitchTx(s, x, y, font, col, t, t0, a = 1) {
  if (t < t0 || a <= 0) return;
  const burst = clamp(1 - (t - t0) / 0.45), flick = (Math.floor(t * 12) % 9 === 0) ? 0.6 : 0, g = Math.max(burst, flick);
  const j = n => (srand(Math.floor(t * 30) + n) - 0.5) * 40 * g;
  ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter';
  if (g > 0) { tx(s, x + j(1) - 8 * g, y + j(2), font, 'rgba(255,40,60,0.8)', 1); tx(s, x + j(3) + 8 * g, y + j(4), font, 'rgba(40,220,255,0.8)', 1); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= a * clamp((t - t0) / 0.15); tx(s, x + j(5) * 0.3, y, font, col, 1, { glow: '#000', blur: 20 }); ctx.restore();
}
function curvePts(x0, y0, x1, y1, cx, cy, n = 40) { const p = []; for (let i = 0; i <= n; i++) { const s = i / n; p.push([(1 - s) * (1 - s) * x0 + 2 * (1 - s) * s * cx + s * s * x1, (1 - s) * (1 - s) * y0 + 2 * (1 - s) * s * cy + s * s * y1]); } return p; }
function drawStroke(pts, u, width, col, glowCol = null, groove = true) {
  if (u <= 0) return; const m = Math.max(1, Math.floor((pts.length - 1) * clamp(u)));
  const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i <= m; i++) ctx.lineTo(pts[i][0], pts[i][1]); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (groove) { path(); ctx.strokeStyle = 'rgba(40,22,6,0.55)'; ctx.lineWidth = width + 6; ctx.stroke(); }
  path(); ctx.strokeStyle = col; ctx.lineWidth = width; if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 30; } ctx.stroke();
  ctx.restore();
  return pts[m];
}

const snapC = document.createElement('canvas'); snapC.width = W; snapC.height = H; const snapX = snapC.getContext('2d');
function lens(x, y, r, zoom, a = 1) {
  if (a <= 0) return; snapX.setTransform(1, 0, 0, 1, 0, 0); snapX.clearRect(0, 0, W, H); snapX.drawImage(cv, 0, 0);
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
  const sw = 2 * r / zoom; ctx.drawImage(snapC, x - sw / 2, y - sw / 2, sw, sw, x - r, y - r, 2 * r, 2 * r);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, r * 0.05, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.35, 'rgba(255,255,255,0.04)'); g.addColorStop(0.92, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,230,170,0.5)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,236,190,0.9)'; ctx.lineWidth = 5; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.restore();
}

