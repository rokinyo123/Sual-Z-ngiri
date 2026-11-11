// ================= Ayənin sirri 6 — Fatihə 1:7 · KINETIC TYPOGRAPHY sample =================
// New format: words fly in (scatter / rise / track / pop), highlighter pills, code-drawn 3D props,
// white ↔ black ↔ grey scene switches with mask transitions. All visuals drawn in code, no photos.
const K = KT;
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

// ---------- scenes ----------
const AYAH = ['صِرَاطَ', 'الَّذِينَ', 'أَنْعَمْتَ', 'عَلَيْهِمْ', 'غَيْرِ', 'الْمَغْضُوبِ', 'عَلَيْهِمْ', 'وَلَا', 'الضَّالِّينَ'];
const AT = [K.a1, K.a2, K.a3, K.a4, K.a5, K.a6, K.a7, K.a8, K.a9];
const SC = {
  hook(t) {
    bgW(t);
    kw('Fatihənin', W / 2, 330, 72, 800, INKD, t, 0.05, 'scatter');
    kw('son ayəsi', W / 2, 455, 136, 900, INKD, t, K.son, 'rise');
    prop(icBook, t, 0.2, 540, 880, 360);
    // nine word-coins fly out of the book
    for (let i = 0; i < 9; i++) {
      const t0 = K.doqquz + i * 0.06, u = clamp((t - t0) / 0.5); if (u <= 0) continue; const e = eBack(u), an = Math.PI * (1.08 + i * 0.105);
      const x = lerp(540, 540 + Math.cos(an) * 390, e), y = lerp(880, 900 + Math.sin(an) * 300, e) + Math.sin(t * 2 + i) * 6;
      badge(i + 1, x, y, t, t0, G1, '#2a1a00', 34);
    }
    kw('cəmi', W / 2, 1235, 62, 700, GREY, t, K.cemi, 'track');
    kw('9', 400, 1410, 300, 900, INKD, t, K.doqquz, 'pop');
    pill('SÖZ', 650, 1418, 100, MINT, INKD, t, K.soz);
  },
  s17(t) {
    bgK(t);
    kw('Amma sən onu', W / 2, 320, 60, 700, '#fff', t, K.amma, 'rise');
    kw('gündə', W / 2, 425, 92, 800, G1, t, K.gunde, 'track');
    const n = Math.floor(clamp((t - K.on_yeddi) / 0.72) * 17 + 0.0001);
    for (let i = 0; i < 17; i++) {
      const an = -Math.PI / 2 + i / 17 * Math.PI * 2, x = 540 + Math.cos(an) * 270, y = 900 + Math.sin(an) * 270, on = i < n;
      const pin = pop(t, K.amma + 0.1 + i * 0.03, 0.35); if (pin <= 0) continue; ctx.save(); ctx.globalAlpha = clamp(pin); ctx.fillStyle = on ? G1 : 'rgba(255,255,255,0.28)'; if (on) { ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; } ctx.beginPath(); ctx.arc(x, y, (on ? 22 : 16) * pin, 0, 7); ctx.fill(); ctx.restore();
    }
    if (t > K.on_yeddi) { const k = 1 + 0.18 * Math.exp(-((t - K.on_yeddi - 0.72) ** 2) * 60); tx(String(Math.max(1, n)), 540, 880, pf(900, 230), G1, 1, { sc: k, glow: '#ffb030', blur: 40 }); }
    kw('DƏFƏ', 540, 1030, 64, 800, '#fff', t, K.defe, 'track', { from: 50 });
    pill('oxuyursan', 540, 1280, 76, G1, '#1a1000', t, K.oxu);
    kw('fərz namazlarında', 540, 1385, 40, 500, 'rgba(255,255,255,0.7)', t, K.oxu + 0.5, 'track');
  },
  q(t) {
    bgG(t);
    kw('Mənasını', W / 2, 400, 86, 800, '#fff', t, K.menasini, 'scatter');
    glitchTx('bilirsənmi?', W / 2, 530, pf(900, 112), '#fff', t, K.bilir);
    prop((u) => icQ(u), t, 6.62, 540, 1090, 560, { float: 1.4 });
  },
  ayah(t) {
    ctx.fillStyle = lg(0, 0, 0, H, [[0, '#071a14'], [1, '#020806']]); ctx.fillRect(0, 0, W, H); starLattice(t, 0.1); drawDust(t, 0.5);
    chipK('FATİHƏ · 1:7', 540, 300, t, K.a1 - 0.1, G1, 42);
    const X = [800, 540, 280], Y = [580, 830, 1080];
    AYAH.forEach((w, i) => { const x = X[i % 3], y = Y[Math.floor(i / 3)]; badge(i + 1, x, y - 92, t, AT[i] - 0.05, G1, '#2a1a00', 24); arabicK(w, x, y, 88, t, AT[i], 0.55); });
    stampK('9 SÖZ', t, K.a9 + 0.45, 540, 1320, 84, MINT, -0.06, 'rgba(0,0,0,0.35)');
  },
  road(t) {
    bgW(t, 540, 1100);
    kw('Nemət verdiklərinin', W / 2, 320, 64, 800, INKD, t, K.nemet, 'rise');
    pill('YOLUNA', W / 2, 455, 120, MINT, INKD, t, K.yoluna);
    // perspective golden road
    const p = eOut(clamp((t - K.nemet - 0.1) / 1.7)), top = lerp(1660, 720, p);
    if (p > 0) {
      const xl = y => lerp(330, 520, (1660 - y) / 940), xr = y => lerp(750, 560, (1660 - y) / 940);
      ctx.save(); ctx.fillStyle = lg(0, 720, 0, 1660, [[0, '#ffe7a3'], [1, '#e2a83a']]); ctx.shadowColor = 'rgba(200,140,30,0.5)'; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.moveTo(xl(1660), 1660); ctx.lineTo(xl(top), top); ctx.lineTo(xr(top), top); ctx.lineTo(xr(1660), 1660); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 8; ctx.setLineDash([40, 34]); ctx.lineDashOffset = -t * 120; ctx.beginPath(); ctx.moveTo(540, 1660); ctx.lineTo(540, top); ctx.stroke(); ctx.restore();
      const g = clamp((t - K.verdik - 1.0) / 0.6); if (g > 0) { glow(540, 700, 260, 'rgba(255,214,120,A)', 0.9 * g); prop((u) => icMark(true, u), t, K.verdik + 1.1, 540, 690, 120, { shadow: false }); }
    }
    // the two wrong turns
    const L = curvePts(470, 1420, 150, 1110, 260, 1400, 40), Rr = Array.from({ length: 41 }, (_, i) => { const s = i / 40; return [lerp(610, 940, s) + Math.sin(s * 14) * 36 * s, lerp(1240, 960, s)]; });
    drawStroke(L, clamp((t - K.qezeb) / 0.6), 34, 'rgba(226,58,58,0.85)', null, false);
    pill('qəzəbə uğrayanların', 300, 1010, 40, REDK, '#fff', t, K.qezeb + 0.15, { rot: -0.04 });
    prop((u) => icMark(false, u), t, K.qezeb + 1.1, 150, 1110, 120, { shadow: false });
    drawStroke(Rr, clamp((t - K.azan) / 0.6), 30, 'rgba(120,126,134,0.8)', null, false);
    pill('azanların', 800, 860, 44, GREY, '#fff', t, K.azan + 0.15, { rot: 0.04 });
    prop((u) => icMark(false, u), t, K.azan + 0.7, 950, 975, 110, { shadow: false });
    stampK('YOX', t, K.yox, 540, 1500, 110, REDK, -0.1, 'rgba(255,255,255,0.85)');
  },
  sirr(t) {
    bgK(t);
    kw('BİRİNCİ', 540, 720, 72, 800, G1, t, K.sirr1, 'track', { from: 60 });
    kw('SİRR', 540, 900, 270, 900, '#fff', t, K.sirr1 + 0.15, 'pop');
    badge(1, 860, 760, t, K.sirr1 + 0.45, G1, '#1a1000', 70);
  },
  prev(t) {
    bgW(t);
    kw('Əvvəlki ayədə', W / 2, 330, 64, 700, INKD, t, K.evvelki, 'rise');
    const k = pop(t, K.evvelki + 0.35, 0.45);
    if (k > 0) { ctx.save(); ctx.translate(540, 650); ctx.scale(k, k); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = lg(0, -150, 0, 150, [[0, '#0d2a20'], [1, '#04120c']]); rrect(-440, -150, 880, 300, 34); ctx.fill(); ctx.restore(); }
    chipK('1 : 6', 540, 525, t, K.evvelki + 0.55, G1, 34);
    arabicK('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', 540, 680, 72, t, K.evvelki + 0.6, 1.1);
    kw('«bizi doğru yola', W / 2, 960, 74, 800, INKD, t, K.bizi, 'rise');
    pill('yönəlt»', W / 2, 1090, 80, MINT, INKD, t, K.bizi + 1.0);
    kw('deyirik', W / 2, 1220, 52, 500, GREY, t, K.deyirik, 'track');
    prop((u) => { ctx.scale(0.9, 0.9); icBook(u); }, t, K.bizi + 0.3, 540, 1440, 220, { float: 0.6 });
  },
  kimin(t) {
    bgW(t, 540, 1100);
    kw('Bu ayə o yolun', W / 2, 320, 62, 700, INKD, t, K.bu_aye, 'rise');
    kw('KİMİN', W / 2, 470, 190, 900, INKD, t, K.kimin, 'pop');
    kw('yolu olduğunu', W / 2, 610, 54, 600, GREY, t, K.kimin + 0.55, 'track');
    const lit = clamp((t - K.aciq) / 0.4);
    prop((u) => icSign(u, lit), t, K.bu_aye + 0.2, 540, 1060, 470);
    pill('açıqlayır', W / 2, 1440, 84, MINT, INKD, t, K.aciq);
  },
  dort(t) {
    bgW(t, 540, 1000);
    kw('Nemət verilənlər', W / 2, 290, 70, 800, INKD, t, K.nemet2, 'rise');
    kw('başqa bir ayədə sayılır', W / 2, 385, 44, 500, GREY, t, K.basqa, 'track');
    pill('NİSA 4:69', W / 2, 475, 44, BLUE, '#fff', t, K.sayilir, { w: 800 });
    const S = [[300, 810, icLantern, 'Peyğəmbərlər', K.peyg], [780, 810, icGem, 'Siddiqlər', K.sidd], [300, 1250, icTulip, 'Şəhidlər', K.sehid], [780, 1250, icTasbeh, 'Salehlər', K.saleh]];
    S.forEach(([x, y, fn, lab, t0], i) => {
      const ph = pop(t, K.basqa + 0.3 + i * 0.12, 0.4), gone = 1 - R(t, t0 - 0.1, t0 + 0.2);
      if (ph > 0 && gone > 0) { ctx.save(); ctx.globalAlpha = clamp(ph) * gone; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = '#9aa0a8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 120 * ph, 0, 7); ctx.stroke(); ctx.restore(); tx('?', x, y + 4, pf(800, 90), '#b7bcc3', clamp(ph) * gone); }
      prop(fn, t, t0, x, y, 250, { ph: i });
      pill(lab, x, y + 180, 42, MINT, INKD, t, t0 + 0.12);
    });
  },
};
// [key, cut time, transition into this scene]
const SCN6 = [['hook', 0, null], ['s17', 3.4, 'circle'], ['q', 6.42, 'bar'], ['ayah', 7.85, 'slide'], ['road', 13.45, 'circle'], ['sirr', 19.8, 'break'], ['prev', 20.9, 'circle'], ['kimin', 24.35, 'push'], ['dort', 27.7, 'bar']];
const IMPACTS = [K.son, K.doqquz, K.soz, K.on_yeddi + 0.72, K.oxu, K.bilir, K.a9 + 0.45, K.yoluna, K.qezeb + 1.1, K.azan + 0.7, K.yox, K.sirr1 + 0.15, K.kimin, K.aciq, K.peyg, K.sidd, K.sehid, K.saleh];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - i; if (d >= 0 && d < 0.5) s += Math.exp(-d * 9) * 14; } return s; }

const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
const breakC = document.createElement('canvas'); breakC.width = W; breakC.height = H; let breakReady = false;
const SHARDS = (() => { const pts = [], n = 6, m = 10, out = []; for (let r = 0; r <= m; r++) for (let c = 0; c <= n; c++) { const j = (r && c && r < m && c < n) ? 1 : 0; pts.push([c * W / n + (srand(r * 31 + c) - 0.5) * 110 * j, r * H / m + (srand(r * 17 + c + 5) - 0.5) * 110 * j]); }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { const p = (rr, cc) => pts[rr * (n + 1) + cc], a = p(r, c), b = p(r, c + 1), d = p(r + 1, c), e = p(r + 1, c + 1); out.push([a, b, e], [a, e, d]); } return out; })();
function frameBreak(t, t0) {
  const u = t - t0; if (u < 0 || u > 1.6 || !breakReady) return;
  SHARDS.forEach((tri, i) => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const dist = Math.hypot(cx - W / 2, cy - 1500) / 1100, v = Math.max(0, u - dist * 0.25);
    const ang = Math.atan2(cy - 1500, cx - W / 2), sp = 300 + 500 * srand(i);
    const ox = Math.cos(ang) * sp * v * 0.8, oy = Math.sin(ang) * sp * v * 0.5 + 1600 * v * v, rot = (srand(i + 3) - 0.5) * 4 * v, a = 1 - clamp(v / 1.1);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(cx + ox, cy + oy); ctx.rotate(rot); ctx.translate(-cx, -cy);
    ctx.beginPath(); ctx.moveTo(...tri[0]); ctx.lineTo(...tri[1]); ctx.lineTo(...tri[2]); ctx.closePath(); ctx.save(); ctx.clip(); ctx.drawImage(breakC, 0, 0); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  });
  if (u < 0.12) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - u / 0.12)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
function drawScene(key, t, a) {
  lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H);
  const real = ctx; ctx = lctx; ctx.save();
  const z = 1 + 0.035 * clamp((t - a) / 6); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  SC[key](t); ctx.restore(); ctx = real;
}
// composite the layer with a transition mask; u: 0..1
function blit(kind, u) {
  const e = eOut(u);
  ctx.save();
  if (kind === 'circle') { ctx.beginPath(); ctx.arc(540, 960, 1150 * e, 0, 7); ctx.clip(); ctx.drawImage(layer, 0, 0); ctx.restore();
    if (u < 1) { ctx.save(); ctx.strokeStyle = G1; ctx.lineWidth = 14 * (1 - u); ctx.beginPath(); ctx.arc(540, 960, 1150 * e, 0, 7); ctx.stroke(); ctx.restore(); } return; }
  if (kind === 'bar') { const x = lerp(-80, W + 80, e); ctx.beginPath(); ctx.rect(0, 0, x, H); ctx.clip(); ctx.drawImage(layer, 0, 0); ctx.restore();
    if (u < 1) { ctx.fillStyle = '#4c535a'; ctx.fillRect(x - 40, 0, 80, H); } return; }
  if (kind === 'slide') { ctx.translate(0, H * (1 - e)); ctx.drawImage(layer, 0, 0); ctx.restore(); return; }
  if (kind === 'push') { ctx.translate(W * (1 - e), 0); ctx.drawImage(layer, 0, 0); ctx.restore(); return; }
  ctx.drawImage(layer, 0, 0); ctx.restore();
}
function watermark(t) {
  ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = 'rgba(10,10,12,0.55)'; rrect(36, 44, 300, 70, 35); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(79, 79, 26, 0, 7); ctx.clip(); ctx.drawImage(logo, 53, 53, 52, 52); ctx.restore();
  ctx.font = pf(700, 30); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('@esgarow', 118, 81); ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = 'rgba(10,10,12,0.55)'; rrect(W - 356, 44, 320, 70, 35); ctx.fill(); ctx.restore();
  tx('AYƏNİN SİRRİ · 6', W - 196, 81, pf(800, 28), G1, 0.95, { ls: '2px' });
}
const TR_PRE = 0.22, TR_LEN = 0.42;
window.renderAt = async function (t) {
  if (!breakReady && t >= 19.8 - 0.05) { drawScene('road', 19.75, 13.45); const bx = breakC.getContext('2d'); bx.clearRect(0, 0, W, H); bx.drawImage(layer, 0, 0); breakReady = true; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  ctx.save(); ctx.translate(sx, sy);
  for (let i = 0; i < SCN6.length; i++) {
    const [key, a, kind] = SCN6[i], b = i + 1 < SCN6.length ? SCN6[i + 1][1] : TOTAL2 + 1;
    const nextKind = i + 1 < SCN6.length ? SCN6[i + 1][2] : null;
    const pre = kind && kind !== 'break' ? TR_PRE : 0;
    const endPad = nextKind && nextKind !== 'break' ? TR_LEN - TR_PRE : 0; // keep drawing under the incoming scene
    if (t < a - pre || t >= b + endPad) continue;
    drawScene(key, t, a);
    blit(kind && kind !== 'break' ? kind : 'none', pre ? clamp((t - (a - pre)) / TR_LEN) : 1);
  }
  ctx.restore();
  if (t > K.kimin + 0.45 && t < 27.5) { const a = R(t, K.kimin + 0.45, K.kimin + 0.9) * (1 - R(t, 27.0, 27.4)); const lx = 540 + Math.sin((t - K.kimin) * 1.6) * 170, ly = 470 + Math.sin(t * 2.3) * 8; lens(lx, ly, 135, 1.45, a);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(lx, ly); ctx.rotate(0.75); ctx.fillStyle = lg(0, -16, 0, 16, [[0, '#3a3f45'], [0.5, '#8a929b'], [1, '#202428']]); rrect(140, -16, 170, 32, 14); ctx.fill();
    ctx.restore(); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#25292e'; ctx.lineWidth = 12; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.beginPath(); ctx.arc(lx, ly, 139, 0, 7); ctx.stroke(); ctx.restore(); }
  frameBreak(t, 19.8);
  watermark(t);
  vignette(0.18); filmGrain(t);
  const f = R(t, TOTAL2 - 0.6, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
