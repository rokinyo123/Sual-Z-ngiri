// ================= Qurandakı 7 sirr — YouTube 16:9 (1920x1080), 9:24 =================
// Built on the ep5 house standard: photo shots with slow camera, key words only (no subtitles),
// fly3d + shake on impacts, fracture hook, glass lens, glitch, stamps, green-screen props,
// counters, schematic diagrams drawn in code, frame-break, 7-secret tracker for retention.
const K = KT;
const IM = {};
const BG = ['bg01_kitab_isiq', 'bg02_kitab_acilir', 'bg03_sehra_gece', 'bg04_okean_derinlik', 'bg05_ulduz_nuve', 'bg06_kitabxana', 'bg07_terazi', 'bg08_qum_saati',
  'bg09_sumukler', 'bg10_ovuc', 'bg11_kabinet_1880', 'bg12_polis_arxiv', 'bg13_biometrik', 'bg14_tefsir', 'bg15_cebelluttariq', 'bg16_iki_su', 'bg18_gemi', 'bg19_sehra_deniz',
  'bg20_ari_makro', 'bg21_qaya_petek', 'bg22_petek_ici', 'bg23_bal_hucre', 'bg24_kohne_xerite', 'bg25_quds_alov', 'bg26_bayraq', 'bg27_qilinc', 'bg28_el_sixma', 'bg29_suvari',
  'bg30_qafqaz', 'bg31_zefer', 'bg32_muzey', 'bg33_firon_dalga', 'bg34_mezar', 'bg35_arxeoloq', 'bg36_mumiya', 'bg37_heykel', 'bg38_demirci', 'bg39_meteor', 'bg40_nehang_ulduz',
  'bg41_supernova', 'bg42_toz_bulud', 'bg43_qan_damci', 'bg44_zencir_mohur', 'bg45_mushaf', 'bg46_isiq_divari', 'bg47_isiqa_qalxis', 'bg48_sehra_sefeq'];
BG.forEach(k => load(k, `img/${k}.jpg`));
const EL = { el01: 5, el02: 5, el03: 5, el04: 2, el05: 3, el06: 5, el07: 5, el08: 5 };
Object.entries(EL).forEach(([k, n]) => { for (let i = 1; i <= n; i++) load(`${k}_${i}`, `img/${k}_${i}.png`); });
function load(k, src) { pending++; const im = new Image(); im.onload = () => { IM[k] = im; pending--; }; im.onerror = () => { console.log('missing ' + src); pending--; }; im.src = src; }
const SIRR_ICON = ['el02_1', 'el02_2', 'el02_3', 'el02_4', 'el02_5', 'el03_1', 'el03_2'];
const SIRR_NAME = ['BARMAQ UCLARI', 'İKİ DƏNİZ', 'BAL ARISI', 'İMPERİYANIN QAYIDIŞI', 'FİRONUN BƏDƏNİ', 'GÖYDƏN ENƏN DƏMİR', 'SİRLİ HƏRFLƏR'];
const SIRR_T = [K.s1, K.s2, K.s3, K.s4, K.s5, K.s6, K.s7_gel];

// ---------- generic helpers ----------
const gl = document.createElement('canvas'); gl.width = W; gl.height = H; const gctx = gl.getContext('2d');
function grp(a, fn) {
  if (a <= 0) return; if (a >= 1) { fn(); return; }
  gctx.setTransform(1, 0, 0, 1, 0, 0); gctx.globalAlpha = 1; gctx.clearRect(0, 0, W, H);
  const real = ctx; ctx = gctx; ctx.save(); fn(); ctx.restore(); ctx = real;
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(gl, 0, 0); ctx.restore();
}
const fadeOut = (t, t0, d = 0.4) => 1 - R(t, t0, t0 + d);
const inW = (t, a, b) => t >= a && t < b;
const span = (t, a, b, f = 0.3) => (t < a - 0.01 || t > b + f) ? 0 : R(t, a, a + f) * fadeOut(t, b, f);
function big(s, t, t0, x, y, size = 120, col = G1, alpha = 1) { if (t >= t0) fly3d(s, t, t0, x, y, size, col, AN, { alpha }); }
function chipAt(s, t, t0, x, y, col = G1, size = 40) { chip(s, x, y, t, t0, col, 'rgba(10,8,4,0.74)', size); }
function darken(a) { if (a > 0) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); } }
function src(s, t, t0, x = W / 2, y = H - 52) { tx(s, x, y, `26px ${MO}`, 'rgba(255,240,210,0.85)', R(t, t0, t0 + 0.4), { glow: '#000', blur: 10 }); }
function cv1(s, t, t0, x, y, size = 56, col = '#fff') { tx(s, x, y, `${size}px ${CV}`, col, R(t, t0, t0 + 0.45), { glow: '#000', blur: 22 }); }
function stamp(s, t, t0, x, y, size = 64, col = '#7be3a2', rot = -0.08) {
  const u = clamp((t - t0) / 0.3); if (u <= 0) return; const sc = lerp(2.4, 1, eOut(u));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(u * 1.5);
  ctx.font = `${size}px ${AN}`; ctx.letterSpacing = '4px'; const w = ctx.measureText(s).width + 60;
  ctx.fillStyle = 'rgba(10,8,4,0.6)'; rrect(-w / 2, -size * 0.85, w, size * 1.7, 18); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillText(s, 0, 4); ctx.restore();
}
function sprite(k, x, y, h, a = 1, rot = 0, sc = 1, glowCol = null) {
  const im = IM[k]; if (!im || a <= 0) return; const w = im.width * h / im.height;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 40; }
  ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
}
function popSprite(k, t, t0, x, y, h, glowCol = null, rot = 0) { const k2 = pop(t, t0, 0.45); if (k2 > 0) sprite(k, x, y + Math.sin(t * 1.6 + x) * 6, h, clamp(k2 * 2), rot, k2, glowCol); }
function glitchTx(s, x, y, font, col, t, t0, a = 1) {
  if (t < t0 || a <= 0) return;
  const burst = clamp(1 - (t - t0) / 0.45), flick = (Math.floor(t * 12) % 9 === 0) ? 0.6 : 0, g = Math.max(burst, flick);
  const j = n => (srand(Math.floor(t * 30) + n) - 0.5) * 40 * g;
  ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter';
  if (g > 0) { tx(s, x + j(1) - 8 * g, y + j(2), font, 'rgba(255,40,60,0.8)', 1); tx(s, x + j(3) + 8 * g, y + j(4), font, 'rgba(40,220,255,0.8)', 1); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= a * clamp((t - t0) / 0.15); tx(s, x + j(5) * 0.3, y, font, col, 1, { glow: '#000', blur: 20 }); ctx.restore();
}
function cross(x, y, s, t, t0, col = RED) { // animated red X
  const u = R(t, t0, t0 + 0.25), v = R(t, t0 + 0.15, t0 + 0.4); if (u <= 0) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x - s / 2 + s * u, y - s / 2 + s * u); ctx.stroke();
  if (v > 0) { ctx.beginPath(); ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + s / 2 - s * v, y - s / 2 + s * v); ctx.stroke(); }
  ctx.restore();
}
function check(x, y, s, t, t0, col = '#7be3a2') {
  const u = R(t, t0, t0 + 0.35); if (u <= 0) return;
  const pts = [[x - s * 0.45, y], [x - s * 0.1, y + s * 0.35], [x + s * 0.5, y - s * 0.4]];
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.moveTo(...pts[0]); const a = clamp(u * 2), b = clamp(u * 2 - 1);
  ctx.lineTo(lerp(pts[0][0], pts[1][0], a), lerp(pts[0][1], pts[1][1], a)); if (b > 0) ctx.lineTo(lerp(pts[1][0], pts[2][0], b), lerp(pts[1][1], pts[2][1], b)); ctx.stroke(); ctx.restore();
}
function counter(t, t0, d, from, to, x, y, size, col = G1, suffix = '', fmtFn = null) {
  if (t < t0) return; const u = clamp((t - t0) / d), v = Math.round(lerp(from, to, eOut(u)));
  const k = pop(t, t0, 0.4), done = u >= 1 ? 1 + 0.08 * clamp(1 - (t - t0 - d) * 4) : 1;
  tx((fmtFn ? fmtFn(v) : String(v)) + suffix, x, y, `${size}px ${AN}`, col, clamp(k), { sc: k * done, glow: '#ffb030', blur: 45 });
}
function panel(x, y, w, h, a = 1, r = 26) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(14,10,5,0.8)'; rrect(x - w / 2, y - h / 2, w, h, r); ctx.fill(); ctx.strokeStyle = 'rgba(246,199,104,0.8)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
// Arabic ayah: right-to-left reveal + optional translation line under it
function ayah(ar, tr, t, t0, x, y, size = 76, trT = null, srcTxt = null, srcT = null) {
  if (t < t0 - 0.05) return;
  const w = (() => { ctx.save(); ctx.font = `bold ${size}px ${AR}`; const m = ctx.measureText(ar).width; ctx.restore(); return m; })();
  ctx.save(); ctx.globalAlpha *= R(t, t0 - 0.05, t0 + 0.3); ctx.fillStyle = 'rgba(8,6,3,0.55)'; rrect(x - w / 2 - 50, y - size * 0.95, w + 100, size * 1.9 + (tr ? 70 : 0), 24); ctx.fill(); ctx.restore();
  arabic(ar, x, y, size, t, t0, Math.min(1.6, 0.4 + ar.length * 0.03));
  if (tr) tx(tr, x, y + size * 0.95 + 18, `44px ${CV}`, '#fff', R(t, trT ?? t0 + 0.6, (trT ?? t0 + 0.6) + 0.4), { glow: '#000', blur: 16 });
  if (srcTxt) src(srcTxt, t, srcT ?? t0 + 1);
}
// liquid-glass lens (magnifies what's on canvas)
const snapC = document.createElement('canvas'); snapC.width = W; snapC.height = H; const snapX = snapC.getContext('2d');
function lens(x, y, r, zoom, a = 1) {
  if (a <= 0) return; snapX.setTransform(1, 0, 0, 1, 0, 0); snapX.clearRect(0, 0, W, H); snapX.drawImage(layer, 0, 0);
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
  const sw = 2 * r / zoom; ctx.drawImage(snapC, x - sw / 2, y - sw / 2, sw, sw, x - r, y - r, 2 * r, 2 * r);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, r * 0.05, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.35, 'rgba(255,255,255,0.04)'); g.addColorStop(0.92, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,230,170,0.5)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,236,190,0.9)'; ctx.lineWidth = 5; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.restore();
}
function drawStroke(pts, u, width, col, glowCol = null) {
  if (u <= 0 || pts.length < 2) return null; const m = Math.max(1, Math.floor((pts.length - 1) * clamp(u)));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i <= m; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = col; ctx.lineWidth = width; if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 30; } ctx.stroke(); ctx.restore();
  return pts[m];
}
function curve(x0, y0, x1, y1, cx, cy, n = 50) { const p = []; for (let i = 0; i <= n; i++) { const s = i / n; p.push([(1 - s) * (1 - s) * x0 + 2 * (1 - s) * s * cx + s * s * x1, (1 - s) * (1 - s) * y0 + 2 * (1 - s) * s * cy + s * s * y1]); } return p; }
function poly(list, n = 30) { const p = []; for (let i = 0; i < list.length - 1; i++) { const [a, b] = [list[i], list[i + 1]]; for (let j = 0; j < n; j++) p.push([lerp(a[0], b[0], j / n), lerp(a[1], b[1], j / n)]); } p.push(list[list.length - 1]); return p; }
function arrowHead(p, q, s, col) { const a = Math.atan2(q[1] - p[1], q[0] - p[0]); ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(a); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.7, s * 0.7); ctx.lineTo(-s * 0.7, -s * 0.7); ctx.closePath(); ctx.fill(); ctx.restore(); }
// dust / embers / bubbles
function particles(t, kind, a = 1, area = [0, 0, W, H]) {
  if (a <= 0) return; const [x0, y0, w, h] = area; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const n = kind === 'bubble' ? 40 : 70;
  for (let i = 0; i < n; i++) {
    const sp = 0.05 + 0.12 * srand(i + 3), ph = (t * sp + srand(i)) % 1;
    let x, y, r, col;
    if (kind === 'ember') { x = x0 + srand(i + 1) * w + Math.sin(t * 2 + i) * 20; y = y0 + h - ph * h; r = 1.5 + 3 * srand(i + 5); col = `rgba(255,${140 + 80 * srand(i)},60,${a * (1 - ph)})`; }
    else if (kind === 'bubble') { x = x0 + srand(i + 1) * w + Math.sin(t * 3 + i) * 10; y = y0 + h - ph * h; r = 2 + 7 * srand(i + 5); col = `rgba(200,240,255,${a * 0.5 * (1 - ph)})`; }
    else if (kind === 'wind') { x = x0 + ((srand(i + 1) + t * (0.2 + 0.3 * srand(i))) % 1) * w; y = y0 + srand(i + 2) * h + Math.sin(t + i) * 15; r = 1 + 2.5 * srand(i + 5); col = `rgba(255,220,170,${a * 0.6})`; }
    else { x = x0 + srand(i + 1) * w + Math.sin(t * 0.5 + i) * 30; y = y0 + h - ph * h; r = 1 + 3 * srand(i + 5); col = `rgba(255,214,140,${a * 0.7 * Math.sin(ph * 3.14)})`; }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    if (kind === 'bubble') { ctx.strokeStyle = `rgba(220,250,255,${a * 0.6 * (1 - ph)})`; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  ctx.restore();
}

// ================= BACKGROUND TRACK =================
// [start, image, z0, z1, side, opt]  side: L/R/C/T = where the text lives (that side gets darker)
const SH = [
  [0, 'bg01_kitab_isiq', 1.0, 1.12, 'L', { frac: 1 }], [K.h_onu, 'bg03_sehra_gece', 1.12, 1.0, 'T'], [K.h_okean, 'bg04_okean_derinlik', 1.0, 1.35, 'R', { dy: 120 }],
  [K.h_ulduz, 'bg05_ulduz_nuve', 1.1, 1.45, 'L'], [K.h_amma, 'bg02_kitab_acilir', 1.05, 1.18, 'L'], [K.h_29, 'bg06_kitabxana', 1.0, 1.15, 'T', { dark: 0.25 }],
  [K.h_7, 'bg47_isiqa_qalxis', 1.1, 1.0, 'C', { dark: 0.55 }], [K.h_zorla, 'bg07_terazi', 1.05, 1.15, 'T'], [K.h_sert, 'bg08_qum_saati', 1.0, 1.04, 'C', { freeze: true }],
  [K.h_sonuncu, 'bg44_zencir_mohur', 1.0, 1.1, 'C'], [K.s1, 'bg10_ovuc', 1.0, 1.08, 'L'],
  // SIRR 1
  [K.s1_mushrik, 'bg09_sumukler', 1.0, 1.12, 'R'], [K.s1_aye, 'bg09_sumukler', 1.15, 1.02, 'R', { mirror: true, filter: 'brightness(0.8)' }], [K.s1_barmaq, 'bg10_ovuc', 1.0, 1.25, 'L', { ax: 1350, ay: 380 }],
  [K.s1_diqqet, null], [K.s1_1880, 'bg11_kabinet_1880', 1.0, 1.12, 'L'], [K.s1_1892, null], [K.s1_1905, 'bg12_polis_arxiv', 1.0, 1.15, 'T'],
  [K.s1_yeni, 'bg10_ovuc', 1.2, 1.05, 'L', { filter: 'brightness(0.75)' }], [K.s1_tefsir, 'bg14_tefsir', 1.0, 1.12, 'R'], [K.s1_bugun, 'bg13_biometrik', 1.0, 1.15, 'L'],
  [K.s1_tesaduf, 'bg13_biometrik', 1.15, 1.3, 'C', { dark: 0.45 }],
  // SIRR 2
  [K.s2, 'bg04_okean_derinlik', 1.1, 1.0, 'C'], [K.s2_rehman, 'bg16_iki_su', 1.0, 1.12, 'T'], [K.s2_ceb, 'bg15_cebelluttariq', 1.0, 1.45, 'C', { ax: 980, ay: 560 }],
  [K.s2_duzlu, null], [K.s2_durust, 'bg16_iki_su', 1.2, 1.05, 'T', { mirror: true, filter: 'hue-rotate(-12deg)' }], [K.s2_aye2, 'bg16_iki_su', 1.0, 1.1, 'T'],
  [K.s2_20esr, 'bg18_gemi', 1.0, 1.12, 'L'], [K.s2_sehra, 'bg19_sehra_deniz', 1.0, 1.15, 'T'],
  // SIRR 3
  [K.s3, 'bg20_ari_makro', 1.1, 1.0, 'L'], [K.s3_nehl, 'bg20_ari_makro', 1.0, 1.15, 'L'], [K.s3_vehy, 'bg21_qaya_petek', 1.0, 1.12, 'R'], [K.s3_kisi, null],
  [K.s3_bio, 'bg22_petek_ici', 1.0, 1.1, 'T'], [K.s3_durust, 'bg23_bal_hucre', 1.0, 1.15, 'C', { dark: 0.5 }], [K.s3_tesaduf, 'bg23_bal_hucre', 1.15, 1.3, 'C', { dark: 0.55 }],
  // SIRR 4
  [K.s4, 'bg24_kohne_xerite', 1.1, 1.0, 'C'], [K.s4_614, 'bg25_quds_alov', 1.0, 1.12, 'T'], [K.s4_misir, null], [K.s4_cokus, 'bg26_bayraq', 1.0, 1.1, 'R'],
  [K.s4_musrik, 'bg25_quds_alov', 1.15, 1.05, 'T', { mirror: true, filter: 'brightness(0.65) saturate(0.8)' }], [K.s4_nazil, 'bg27_qilinc', 1.0, 1.12, 'T'], [K.s4_bid, null],
  [K.s4_ebubekr, 'bg28_el_sixma', 1.0, 1.1, 'L'], [K.s4_622, 'bg29_suvari', 1.0, 1.12, 'T'], [K.s4_qafqaz, 'bg30_qafqaz', 1.0, 1.1, 'R'], [K.s4_atro + 0.6, null],
  [K.s4_qelebe, 'bg31_zefer', 1.0, 1.12, 'L'],
  // SIRR 5
  [K.s5, 'bg32_muzey', 1.1, 1.0, 'C'], [K.s5_firon, 'bg33_firon_dalga', 1.0, 1.15, 'R', { dy: 60 }], [K.s5_diqqet, null], [K.s5_nazil + 1.4, 'bg34_mezar', 1.0, 1.15, 'T'],
  [K.s5_tapildi, 'bg35_arxeoloq', 1.0, 1.12, 'T'], [K.s5_muzey, 'bg36_mumiya', 1.0, 1.1, 'T'], [K.s5_durust, 'bg32_muzey', 1.0, 1.1, 'C', { dark: 0.3 }],
  [K.s5_insanlar, 'bg37_heykel', 1.0, 1.1, 'L'],
  // SIRR 6
  [K.s6, 'bg39_meteor', 1.1, 1.0, 'C'], [K.s6_hedid, 'bg38_demirci', 1.0, 1.12, 'L'], [K.s6_endir2, 'bg39_meteor', 1.0, 1.15, 'L'], [K.s6_astro, 'bg40_nehang_ulduz', 1.0, 1.1, 'L'],
  [K.s6_partla, 'bg41_supernova', 1.0, 1.25, 'C'], [K.s6_yer, 'bg42_toz_bulud', 1.0, 1.12, 'T'], [K.s6_durust, 'bg38_demirci', 1.1, 1.0, 'C', { dark: 0.55, mirror: true }],
  [K.s6_dusun, 'bg43_qan_damci', 1.0, 1.2, 'L', { ax: 1100, ay: 600 }],
  // SIRR 7
  [K.s7_gel, 'bg44_zencir_mohur', 1.0, 1.12, 'C'], [K.s7_ac, 'bg45_mushaf', 1.0, 1.12, 'R'], [K.s7_elif, null], [K.s7_yasin, 'bg46_isiq_divari', 1.0, 1.15, 'C', { dark: 0.35 }],
  [K.s7_29, null], [K.s7_alim, 'bg06_kitabxana', 1.12, 1.0, 'T', { mirror: true }], [K.s7_herf, 'bg46_isiq_divari', 1.15, 1.0, 'C', { dark: 0.3, mirror: true }],
  [K.s7_amma, 'bg47_isiqa_qalxis', 1.0, 1.15, 'C', { dark: 0.3 }],
  // NƏTİCƏ
  [K.n_1, 'bg10_ovuc', 1.05, 1.1, 'C', { fast: 1 }], [K.n_2, 'bg16_iki_su', 1.05, 1.1, 'C', { fast: 1 }], [K.n_3, 'bg20_ari_makro', 1.05, 1.1, 'C', { fast: 1 }], [K.n_4, 'bg27_qilinc', 1.05, 1.1, 'C', { fast: 1 }],
  [K.n_5, 'bg36_mumiya', 1.05, 1.1, 'C', { fast: 1 }], [K.n_6, 'bg39_meteor', 1.05, 1.1, 'C', { fast: 1 }], [K.n_7, 'bg44_zencir_mohur', 1.05, 1.1, 'C', { fast: 1 }],
  [K.n_tesaduf, null], [K.n_cagir, 'bg02_kitab_acilir', 1.0, 1.15, 'L'], [K.n_video, 'bg47_isiqa_qalxis', 1.0, 1.1, 'C', { dark: 0.4 }], [K.n_serh, null],
  [K.n_abune, null], [K.n_salam - 0.3, 'bg48_sehra_sefeq', 1.0, 1.08, 'T'],
];
for (let i = 1; i < SH.length; i++) if (SH[i][0] < SH[i - 1][0]) console.log('SH order ' + i + ' ' + SH[i][1]);
function shotAt(i) { const s = SH[i]; return { t0: s[0], t1: i + 1 < SH.length ? SH[i + 1][0] : TOTAL2 + 2, k: s[1], z0: s[2], z1: s[3], side: s[4], o: s[5] || {} }; }
function drawShot(s, t) {
  if (!s.k) { brandBg16(t); return; }
  const im = IM[s.k]; if (!im) { brandBg16(t); return; }
  const u = ease((t - s.t0) / Math.max(1, s.t1 - s.t0 + 0.5)), z = lerp(s.z0, s.z1, s.o.freeze ? 0 : u);
  const ax = s.o.ax ?? W / 2, ay = s.o.ay ?? H / 2;
  ctx.save(); ctx.translate(ax, ay + (s.o.dy || 0) * u); ctx.scale(z, z); if (s.o.mirror) ctx.scale(-1, 1); ctx.translate(-ax, -ay);
  if (s.o.filter) ctx.filter = s.o.filter;
  const ar = im.width / im.height, dw = Math.max(W, H * ar), dh = dw / ar; ctx.drawImage(im, (W - dw) / 2, (H - dh) / 2, dw, dh); ctx.restore(); ctx.filter = 'none';
  shade(s.side, s.o.dark || 0);
}
function shade(side, extra = 0) {
  let g;
  if (side === 'L') { g = ctx.createLinearGradient(0, 0, W * 0.6, 0); g.addColorStop(0, 'rgba(5,4,8,0.85)'); g.addColorStop(1, 'rgba(5,4,8,0)'); }
  else if (side === 'R') { g = ctx.createLinearGradient(W, 0, W * 0.4, 0); g.addColorStop(0, 'rgba(5,4,8,0.85)'); g.addColorStop(1, 'rgba(5,4,8,0)'); }
  else if (side === 'T') { g = ctx.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, 'rgba(5,4,8,0.85)'); g.addColorStop(1, 'rgba(5,4,8,0)'); }
  if (g) { ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const b = ctx.createLinearGradient(0, H * 0.75, 0, H); b.addColorStop(0, 'rgba(5,4,8,0)'); b.addColorStop(1, 'rgba(5,4,8,0.6)'); ctx.fillStyle = b; ctx.fillRect(0, 0, W, H);
  darken(extra + (side === 'C' ? 0.25 : 0));
}
function brandBg16(t) {
  const g = ctx.createRadialGradient(W / 2, H * 0.55, 50, W / 2, H * 0.6, W * 0.75); g.addColorStop(0, '#2a1c0c'); g.addColorStop(1, '#060406');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.strokeStyle = 'rgba(246,199,104,0.06)'; ctx.lineWidth = 1.5; const off = (t * 12) % 60;
  for (let x = -60 + off; x < W + 60; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = -60 + off; y < H + 60; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore(); particles(t, 'dust', 0.6);
}
const bgLayer = document.createElement('canvas'); bgLayer.width = W; bgLayer.height = H; const bgx = bgLayer.getContext('2d');
function drawBackground(t) {
  let i = 0; while (i + 1 < SH.length && SH[i + 1][0] <= t) i++;
  const cur = shotAt(i);
  // fracture hook for the very first shot
  if (i === 0 && t < 1.6) { fracture(cur.k, t, 0, 1.55); return; }
  drawShot(cur, t);
  const fd = cur.o.fast ? 0.15 : 0.35, u = (t - cur.t0) / fd;
  if (i > 0 && u < 1) { // short zoom-dissolve from previous shot
    const prev = shotAt(i - 1); ctx.save(); ctx.globalAlpha = 1 - ease(u); const z = 1 + 0.06 * ease(u); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); drawShot(prev, t); ctx.restore();
  }
}
// FRACTURE: tiles fly in and settle into the photo
function fracture(k, t, t0, d = 1.5) {
  const im = IM[k]; if (!im) return; const nx = 8, ny = 5, tw = W / nx, th = H / ny, sw = im.width / nx, sh = im.height / ny;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < ny; r++) for (let c = 0; c < nx; c++) {
    const i = r * nx + c, delay = (Math.abs(r - 2) + Math.abs(c - 3.5)) * 0.05, u = clamp((t - t0 - delay) / (d - 0.5));
    if (u <= 0) continue; const e = 1 - Math.pow(1 - u, 4);
    const dx = (srand(i + 1) - 0.5) * 1400, dy = (srand(i + 7) - 0.5) * 800, rot = (srand(i + 13) - 0.5) * 3.2, s0 = 0.3 + srand(i + 19) * 1.5;
    ctx.save(); ctx.globalAlpha = clamp(u * 2.5); ctx.translate(c * tw + tw / 2 + dx * (1 - e), r * th + th / 2 + dy * (1 - e)); ctx.rotate(rot * (1 - e)); ctx.scale(lerp(s0, 1, e), lerp(s0, 1, e));
    ctx.drawImage(im, c * sw, r * sh, sw, sh, -tw / 2 - 0.5, -th / 2 - 0.5, tw + 1, th + 1);
    ctx.fillStyle = `rgba(0,0,0,${0.55 * (1 - e)})`; ctx.fillRect(-tw / 2, -th / 2, tw, th);
    if (e > 0.9 && e < 1) { ctx.strokeStyle = `rgba(255,214,140,${(1 - e) * 8})`; ctx.lineWidth = 3; ctx.strokeRect(-tw / 2, -th / 2, tw, th); }
    ctx.restore();
  }
  shade('L');
}
// FRAME BREAK: frozen frame shatters
const breakC = document.createElement('canvas'); breakC.width = W; breakC.height = H; let breakAt = -1;
const SHARDS = (() => { const pts = [], n = 10, m = 6, out = []; for (let r = 0; r <= m; r++) for (let c = 0; c <= n; c++) { const j = (r && c && r < m && c < n) ? 1 : 0; pts.push([c * W / n + (srand(r * 31 + c) - 0.5) * 120 * j, r * H / m + (srand(r * 17 + c + 5) - 0.5) * 110 * j]); }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { const p = (rr, cc) => pts[rr * (n + 1) + cc], a = p(r, c), b = p(r, c + 1), d = p(r + 1, c), e = p(r + 1, c + 1); out.push([a, b, e], [a, e, d]); } return out; })();
function frameBreak(t, t0) {
  const u = t - t0; if (u < 0 || u > 1.6 || breakAt !== t0) return;
  SHARDS.forEach((tri, i) => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const dist = Math.hypot(cx - W / 2, cy - H / 2) / 1100, v = Math.max(0, u - dist * 0.25);
    const ang = Math.atan2(cy - H / 2, cx - W / 2), sp = 400 + 600 * srand(i);
    const ox = Math.cos(ang) * sp * v, oy = Math.sin(ang) * sp * v * 0.6 + 1300 * v * v, rot = (srand(i + 3) - 0.5) * 4 * v, a = 1 - clamp(v / 1.1);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(cx + ox, cy + oy); ctx.rotate(rot); ctx.translate(-cx, -cy);
    ctx.beginPath(); ctx.moveTo(...tri[0]); ctx.lineTo(...tri[1]); ctx.lineTo(...tri[2]); ctx.closePath(); ctx.save(); ctx.clip(); ctx.drawImage(breakC, 0, 0); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  });
  if (u < 0.12) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - u / 0.12)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ================= reusable widgets =================
function sirrCard(t, t0, n, dur = 2.4) {
  const a = span(t, t0, t0 + dur, 0.35); if (a <= 0) return;
  grp(a, () => {
    darken(0.55);
    const k = pop(t, t0 + 0.05, 0.5);
    sprite(SIRR_ICON[n - 1], W / 2 - 430, H / 2, 300, clamp(k), Math.sin(t * 1.2) * 0.05, k, '#ffb030');
    glow(W / 2 - 430, H / 2, 300, 'rgba(255,190,90,A)', 0.4 * clamp(k));
    drawTitle('SİRR', W / 2 + 40, H / 2 - 70, 170, t, t0 + 0.1);
    const k2 = pop(t, t0 + 0.4, 0.4); tx('#' + n, W / 2 + 330, H / 2 - 70, `170px ${AN}`, G1, clamp(k2), { sc: k2, glow: '#ffb030', blur: 40 });
    tx(SIRR_NAME[n - 1], W / 2 + 170, H / 2 + 80, `64px ${AN}`, '#fff', R(t, t0 + 0.6, t0 + 0.9), { ls: '5px', glow: '#000' });
  });
}
// 7-secret tracker (top right), from the first secret to the summary
function tracker(t) {
  if (t < K.s1 + 2.6 || t > K.n_1 - 0.3) return;
  const a = R(t, K.s1 + 2.6, K.s1 + 3.2) * fadeOut(t, K.n_1 - 0.8, 0.5);
  let cur = 0; for (let i = 0; i < 7; i++) if (t >= SIRR_T[i]) cur = i;
  ctx.save(); ctx.globalAlpha = a * 0.95;
  for (let i = 0; i < 7; i++) {
    const x = W - 60 - (6 - i) * 62, y = 70, on = i === cur, done = i < cur;
    ctx.fillStyle = on ? 'rgba(246,199,104,0.25)' : 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.arc(x, y, on ? 28 : 24, 0, 7); ctx.fill();
    ctx.strokeStyle = on ? G1 : done ? 'rgba(246,199,104,0.7)' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = on ? 3 : 2; ctx.stroke();
    if (done || on) sprite(SIRR_ICON[i], x, y, on ? 40 + 3 * Math.sin(t * 4) : 34, done ? 0.75 : 1);
    else tx(String(i + 1), x, y + 2, `26px ${AN}`, 'rgba(255,255,255,0.45)', 1);
  }
  ctx.restore();
}
function iconRing(t, t0, cx, cy, r, sz = 120, step = 0.25, rot = 0) {
  for (let i = 0; i < 7; i++) {
    const tt = t0 + i * step; if (t < tt) continue; const k = pop(t, tt, 0.45), ang = -Math.PI / 2 + i * 2 * Math.PI / 7 + rot;
    const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
    ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = 'rgba(10,8,4,0.7)'; ctx.beginPath(); ctx.arc(x, y, sz * 0.62 * k, 0, 7); ctx.fill(); ctx.strokeStyle = G1; ctx.lineWidth = 3; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 20; ctx.stroke(); ctx.restore();
    sprite(SIRR_ICON[i], x, y, sz * 0.78, clamp(k), 0, k);
    tx(String(i + 1), x + sz * 0.5, y - sz * 0.5, `30px ${AN}`, G2, clamp(k));
  }
}
function timeline(t, years, xs, y, a = 1) { // horizontal year line with dots
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xs[0] - 80, y); ctx.lineTo(xs[xs.length - 1] + 80, y); ctx.stroke();
  years.forEach(([lbl, t0, sub], i) => {
    const x = xs[i], k = pop(t, t0, 0.4), on = t >= t0;
    ctx.fillStyle = on ? G1 : 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(x, y, on ? 14 * k + 4 : 8, 0, 7); ctx.fill();
    if (on) { glow(x, y, 60, 'rgba(255,200,110,A)', 0.5); tx(lbl, x, y - 52, `56px ${AN}`, G1, clamp(k), { sc: k, glow: '#ffb030' }); if (sub) tx(sub, x, y + 48, `30px ${MO}`, '#fff', R(t, t0 + 0.2, t0 + 0.5), { glow: '#000', blur: 10 }); }
    if (i > 0 && on) { const p = R(t, t0 - 0.4, t0); ctx.strokeStyle = G1; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(xs[i - 1], y); ctx.lineTo(lerp(xs[i - 1], x, p), y); ctx.stroke(); }
  });
  ctx.restore();
}

// ================= SECTIONS =================
const SEC = [];
function sec(a, b, fn) { SEC.push([a, b, fn]); }

// ---------- HOOK ----------
sec(0, K.h_onu, t => {
  const a = fadeOut(t, K.h_onu - 0.3, 0.3);
  grp(a, () => {
    particles(t, 'dust', 0.8, [0, 0, W, H]);
    counter(t, K.h_14esr - 0.1, 0.9, 0, 14, 420, 450, 220, G1);
    tx('ƏSR ƏVVƏL', 420, 600, `64px ${AN}`, '#fff', R(t, K.h_14esr + 0.5, K.h_14esr + 0.9), { ls: '8px', glow: '#000' });
  });
});
sec(K.h_onu, K.h_okean, t => {
  const a = fadeOut(t, K.h_okean - 0.25, 0.25);
  grp(a, () => {
    popSprite('el01_1', t, K.h_mikro - 0.15, 700, 330, 300, '#ffb030'); cross(700, 330, 230, t, K.h_mikro + 0.5);
    popSprite('el01_2', t, K.h_tele - 0.15, 1220, 330, 300, '#ffb030'); cross(1220, 330, 230, t, K.h_tele + 0.45);
  });
});
sec(K.h_okean, K.h_ulduz, t => {
  particles(t, 'bubble', 1, [1150, 0, 700, H]);
  const d = clamp((t - K.h_okean) / (K.h_ulduz - K.h_okean));
  tx(fmt(Math.round(11000 * eOut(d) / 100) * 100) + ' m', 1500, 520, `120px ${AN}`, '#bfefff', R(t, K.h_okean + 0.1, K.h_okean + 0.4), { glow: '#0af', blur: 30 });
  tx('ZÜLMƏT', 1500, 640, `44px ${MO}`, 'rgba(220,245,255,0.8)', R(t, K.h_okean + 0.8, K.h_okean + 1.2), { ls: '10px' });
});
sec(K.h_ulduz, K.h_amma, t => {
  shock(t, K.h_ulduz + 0.1, 1300, 540, '255,170,80');
  popSprite('el01_4', t, K.h_ulduz + 0.2, 430, 500, 260, '#ffb030', t * 0.3);
  tx('15 000 000 °C', 430, 720, `70px ${AN}`, '#ffd28a', R(t, K.h_ulduz + 0.5, K.h_ulduz + 0.9), { glow: '#f60', blur: 30 });
});
sec(K.h_amma, K.h_29, t => {
  const a = fadeOut(t, K.h_29 - 0.3, 0.3);
  grp(a, () => {
    // seven secret icons fly out of the glowing book
    for (let i = 0; i < 7; i++) {
      const t0 = K.w_movzu + i * 0.28; if (t < t0) continue;
      const u = eOut(clamp((t - t0) / 0.9)), ang = Math.PI * (0.95 - i * 0.15);
      const x = lerp(1240, 960 + Math.cos(ang) * 720, u), y = lerp(560, 600 - Math.sin(ang) * 420, u);
      sprite(SIRR_ICON[i], x, y, lerp(30, 130, u), clamp(u * 2), 0, 1, '#ffb030');
    }
    if (t < K.h_ayeler) { cv1('amma bu kitabın səhifələrində...', t, K.h_amma + 0.1, 480, 300, 60, G2); }
  });
});
sec(K.h_29, K.h_7, t => {
  const a = fadeOut(t, K.h_7 - 0.3, 0.3);
  grp(a, () => {
    const L = ['الم', 'يس', 'طه', 'ق', 'ن', 'حم', 'الر', 'ص'];
    L.forEach((s, i) => { const t0 = K.h_29 + 0.3 + i * 0.25; if (t < t0) return; const x = 160 + i * 230 + Math.sin(t * 0.7 + i) * 20, y = 760 + Math.sin(t * 0.9 + i * 2) * 40;
      tx(s, x, y, `bold ${70 + 20 * srand(i)}px ${AR}`, G1, R(t, t0, t0 + 0.5) * (0.55 + 0.45 * Math.sin(t * 2 + i)), { glow: '#ffb030', blur: 30, rot: Math.sin(t * 0.5 + i) * 0.15 }); });
    counter(t, K.h_29n - 0.1, 1.1, 0, 29, 960, 260, 210, G1);
    tx('SURƏ', 960, 400, `60px ${AN}`, '#fff', R(t, K.h_29n + 0.6, K.h_29n + 0.9), { ls: '12px', glow: '#000' });
    if (t >= K.h_14) { popSprite('el03_5', t, K.w_alim, 960, 560, 200, '#ffb030'); chipAt('14 ƏSRDİR SİRR', t, K.w_alim + 0.3, 960, 700, G2, 40); }
  });
});
sec(K.h_7, K.h_zorla, t => {
  iconRing(t, K.h_7 + 0.2, W / 2, H / 2 + 20, 360, 140, 0.33, Math.sin(t * 0.3) * 0.05);
  drawTitle('QURANDAKI', W / 2, H / 2 - 50, 90, t, K.h_7n - 0.3);
  const k = pop(t, K.h_7n + 0.1, 0.5); tx('7 SİRR', W / 2, H / 2 + 70, `150px ${AN}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 50, ls: '8px' });
});
sec(K.h_zorla, K.h_sert, t => {
  chipAt('AYƏ', t, K.h_aye, 640, 270, G1, 50); chipAt('ELM', t, K.w_bilgi, 1290, 270, '#9fe7ff', 50);
  if (t > K.w_netice) { const u = R(t, K.w_netice, K.h_sert - 0.2); popSprite('el03_4', t, K.w_netice, lerp(500, 1400, u), 560 + Math.sin(u * 6) * 40, 260, null, -0.3); }
  stamp('ŞİŞİRTMƏ YOX', t, K.h_zorla + 0.4, 960, 160, 54, G1, -0.04);
});
sec(K.h_sert, K.h_sonuncu, t => {
  ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = `rgba(0,0,0,${R(t, K.h_sert, K.h_sert + 0.2)})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  glitchTx('AMMA BİR ŞƏRTLƏ', W / 2, 180, `110px ${AN}`, '#fff', t, K.h_sert + 0.05);
});
sec(K.h_sonuncu, K.s1, t => {
  const sh = (t < K.h_sual) ? Math.sin(t * 60) * 6 * (0.5 + 0.5 * Math.sin(t * 3)) : 0;
  ctx.save(); ctx.translate(sh, 0);
  chipAt('SİRR #7', t, K.h_sonuncu + 0.2, 960, 120, RED, 46);
  ctx.restore();
  if (t >= K.h_sual) { darken(0.4 * R(t, K.h_sual, K.h_sual + 0.4)); glitchTx('?', W / 2, H / 2, `520px ${AN}`, G1, t, K.h_sual + 0.3); tx('HEÇ KİM CAVAB TAPA BİLMƏYİB', W / 2, 950, `50px ${AN}`, '#fff', R(t, K.w_cavab, K.w_cavab + 0.4), { ls: '5px', glow: '#000' }); }
});

// ---------- SIRR 1: fingertips ----------
sec(K.s1, K.s1_mushrik, t => {
  sirrCard(t, K.s1, 1, K.s1_herfi - K.s1 - 0.1);
  if (t >= K.s1_herfi - 0.1) {
    // fingertip lights up: gold fingerprint over the index finger
    const k = pop(t, K.s1_herfi, 0.5); sprite('el02_1', 1395, 330, 150, clamp(k) * 0.9, -0.3, k, '#ffb030'); shock(t, K.s1_herfi + 0.05, 1395, 330);
    big('HƏRFİ MƏNADA', t, K.s1_herfi + 0.2, 480, 540, 96, G1);
  }
});
sec(K.s1_mushrik, K.s1_barmaq, t => {
  particles(t, 'wind', R(t, K.s1_mushrik, K.s1_mushrik + 1) * (t < K.s1_aye ? 1 : 0.3), [0, 0, W, H]);
  if (t < K.s1_aye) {
    grp(fadeOut(t, K.s1_aye - 0.3, 0.3), () => {
      cv1('Məkkə müşrikləri soruşurdu:', t, K.s1_mushrik + 0.1, 1450, 260, 56, G2);
      ayah('مَن يُحْيِي الْعِظَامَ وَهِيَ رَمِيمٌ', '«Çürümüş sümükləri kim diriltəcək?»', t, K.s1_sumuk, 1450, 430, 70, K.s1_sumuk + 1.0, 'Yasin 36:78', K.s1_sumuk + 1.5);
    });
  } else {
    chipAt('QİYAMƏ SURƏSİ', t, K.s1_qiyame, 1450, 160, G1, 40);
    ayah('أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُ', null, t, K.s1_aye, 1430, 330, 66);
    if (t > K.s1_beli - 0.1) { ayah('بَلَىٰ قَادِرِينَ عَلَىٰ أَن نُّسَوِّيَ بَنَانَهُ', null, t, K.s1_beli, 1430, 520, 66); stamp('BƏLİ!', t, K.s1_beli + 0.05, 1430, 720, 80, G1, -0.06); }
    src('Qiyamə 75:3–4', t, K.s1_aye + 1, 1430, H - 52);
  }
});
sec(K.s1_barmaq, K.s1_diqqet, t => {
  ayah('بَلَىٰ قَادِرِينَ عَلَىٰ أَن نُّسَوِّيَ بَنَانَهُ', '«...barmaqlarının ucunu belə düzəltməyə qadirik»', t, K.s1_barmaq - 0.05, 560, 250, 64, K.s1_barmaq + 0.6);
  src('Qiyamə 75:4', t, K.s1_barmaq + 1, 560);
  if (t > K.w_ucunu) { const k = pop(t, K.w_ucunu, 0.5); sprite('el02_1', 1395, 330, 150, clamp(k) * 0.85, -0.3, k, '#ffb030'); }
});
sec(K.s1_diqqet, K.s1_1880, t => {
  const y = 520, xs = [560, 960, 1360];
  chipAt('DİQQƏT', t, K.s1_diqqet, 960, 160, G1, 44);
  if (t >= K.w_ureyi - 0.2) { drawHeart(xs[0], y, 230, t); cross(xs[0], y, 260, t, K.w_ureyi + 0.35); tx('ÜRƏK', xs[0], y + 200, `50px ${AN}`, '#fff', R(t, K.w_ureyi, K.w_ureyi + 0.3), { ls: '4px' }); }
  if (t >= K.s1_beyni - 0.2) { const k = pop(t, K.s1_beyni - 0.2, 0.4); drawIcon('🧠', xs[1], y, 210, clamp(k), '#ff9fb2', k); cross(xs[1], y, 260, t, K.s1_beyni + 0.35); tx('BEYİN', xs[1], y + 200, `50px ${AN}`, '#fff', R(t, K.s1_beyni, K.s1_beyni + 0.3), { ls: '4px' }); }
  if (t >= K.s1_barm2 - 0.1) { popSprite('el02_1', t, K.s1_barm2, xs[2], y, 260, '#ffb030'); shock(t, K.s1_barm2 + 0.1, xs[2], y); check(xs[2] + 130, y - 130, 120, t, K.s1_barm2 + 0.4); tx('BARMAQ UCU', xs[2], y + 200, `50px ${AN}`, G1, R(t, K.s1_barm2, K.s1_barm2 + 0.3), { ls: '4px', glow: '#ffb030' }); }
});
sec(K.s1_1880, K.s1_yeni, t => {
  const yrs = [['1880', K.s1_1880 + 0.2, 'Henri Folds'], ['1892', K.s1_1892, 'Frensis Qalton'], ['1905', K.s1_1905 + 0.2, 'polis arxivi']];
  timeline(t, yrs, [520, 960, 1400], 985, 1);
  if (t < K.s1_1892) {
    popSprite('el04_1', t, K.s1_shubhe, 380, 470, 380); popSprite('el04_2', t, K.s1_shubhe + 0.25, 800, 470, 380);
    tx('?', 600, 230, `120px ${AN}`, G1, pop(t, K.w_shubhe, 0.4), { glow: '#ffb030' });
  } else if (t < K.s1_1905) {
    sprite('el04_1', 640, 450, 520, 1, -0.04); sprite('el04_2', 1280, 450, 520, 1, 0.04);
    if (t > K.s1_eyni) stamp('2 EYNİ İZ YOXDUR', t, K.w_eyni, 960, 800, 62, G1, -0.03);
  } else { chipAt('1905 · POLİS', t, K.s1_1905 + 0.4, 960, 140, G1, 44); popSprite('el04_1', t, K.s1_1905 + 0.7, 1500, 470, 300, null, 0.1); }
});
sec(K.s1_yeni, K.s1_tefsir, t => {
  const k = pop(t, K.s1_yeni + 0.1, 0.5); sprite('el02_1', 520, 500, 330, clamp(k), 0, k, '#ffb030');
  if (t > K.s1_imza) { stamp('KİMLİYİNİN İMZASI', t, K.w_imza, 520, 800, 54, G1, -0.05); shock(t, K.w_imza + 0.05, 520, 500); }
});
sec(K.s1_tefsir, K.s1_tesaduf, t => {
  if (t < K.s1_bugun) { chipAt('ƏVVƏLKİ TƏFSİRÇİLƏR', t, K.s1_tefsir + 0.2, 1450, 200, G2, 40);
    tx('ən kiçik sümük belə...', 1450, 330, `56px ${CV}`, '#fff', R(t, K.w_sumuyu, K.w_sumuyu + 0.4), { glow: '#000', blur: 16 }); }
  else { chipAt('BU GÜN', t, K.s1_bugun + 0.1, 470, 200, '#9fe7ff', 44); big('BARMAQ İZİ = KİMLİK', t, K.w_diqqeti, 520, 360, 70, '#fff'); }
});
sec(K.s1_tesaduf, K.s2, t => { glitchTx('TƏSADÜF?', W / 2, H / 2, `200px ${AN}`, G1, t, K.s1_tesaduf + 0.1); });

// ---------- SIRR 2: two seas ----------
sec(K.s2, K.s2_rehman, t => { sirrCard(t, K.s2, 2, K.s2_rehman - K.s2 - 0.1); });
sec(K.s2_rehman, K.s2_ceb, t => {
  particles(t, 'bubble', 0.6);
  chipAt('RƏHMAN SURƏSİ', t, K.s2_rehman + 0.1, 960, 110, G1, 40);
  ayah('مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ', '«İki dənizi qovuşmaq üçün buraxdı»', t, K.s2_aye, 960, 250, 70, K.s2_aye + 0.5);
  if (t > K.s2_sedd - 0.1) ayah('بَيْنَهُمَا بَرْزَخٌ لَّا يَبْغِيَانِ', '«Aralarında sədd var, bir-birinin həddini aşmazlar»', t, K.s2_sedd, 960, 500, 70, K.s2_sedd + 0.9);
  src('Rəhman 55:19–20', t, K.s2_aye + 1);
});
sec(K.s2_ceb, K.s2_duzlu, t => {
  const k = R(t, K.w_araliq, K.w_araliq + 0.5);
  tx('ATLANTİK OKEANI', 470, 640, `46px ${AN}`, '#9fe7ff', k, { ls: '5px', glow: '#000', blur: 20 });
  tx('ARALIQ DƏNİZİ', 1480, 560, `46px ${AN}`, '#7fb2ff', k, { ls: '5px', glow: '#000', blur: 20 });
  const p = pop(t, K.w_qarsi, 0.4); if (p > 0) { ctx.save(); ctx.strokeStyle = G1; ctx.lineWidth = 5; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(960, 560, 60 + 10 * Math.sin(t * 5), 0, 7); ctx.stroke(); ctx.restore(); }
  chipAt('CƏBƏLLÜTARİQ BOĞAZI', t, K.w_qarsi + 0.2, 960, 140, G1, 44);
});
// cross-section diagram (drawn in code)
function seaSection(t, t0, mixing = 0) {
  const top = 330, mid = 640, bot = 960, a = R(t, t0, t0 + 0.5);
  ctx.save(); ctx.globalAlpha = a;
  const g1 = ctx.createLinearGradient(0, top, 0, mid); g1.addColorStop(0, '#2fb7c8'); g1.addColorStop(1, '#1b8aa6'); ctx.fillStyle = g1;
  ctx.beginPath(); ctx.moveTo(0, top); ctx.lineTo(W, top); for (let x = W; x >= 0; x -= 20) ctx.lineTo(x, mid + Math.sin(x * 0.012 + t * 1.5) * 12); ctx.closePath(); ctx.fill();
  const g2 = ctx.createLinearGradient(0, mid, 0, bot); g2.addColorStop(0, '#173b8c'); g2.addColorStop(1, '#0a1a45'); ctx.fillStyle = g2;
  ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, mid + Math.sin(x * 0.012 + t * 1.5) * 12); ctx.lineTo(W, bot); ctx.lineTo(0, bot); ctx.closePath(); ctx.fill();
  // seabed sill
  ctx.fillStyle = '#2a1d10'; ctx.beginPath(); ctx.moveTo(0, bot); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, bot - 90 * Math.exp(-Math.pow((x - 900) / 260, 2)) - 10 * srand(x)); ctx.lineTo(W, bot + 20); ctx.lineTo(0, bot + 20); ctx.fill();
  // boundary glow
  ctx.strokeStyle = `rgba(200,255,255,${0.5 + 0.4 * Math.sin(t * 4)})`; ctx.lineWidth = 5; ctx.shadowColor = '#bff'; ctx.shadowBlur = 25;
  ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, mid + Math.sin(x * 0.012 + t * 1.5) * 12); ctx.stroke(); ctx.shadowBlur = 0;
  // flow arrows: Atlantic on top flows right (into Med), Med water below flows left (out)
  for (let i = 0; i < 6; i++) {
    const ph = ((t * 0.18 + i / 6) % 1), x1 = ph * W, x2 = W - ph * W;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x1 - 90, 470); ctx.lineTo(x1, 470); ctx.stroke(); arrowHead([x1 - 90, 470], [x1, 470], 18, 'rgba(255,255,255,0.85)');
    ctx.strokeStyle = 'rgba(255,215,140,0.8)'; ctx.beginPath(); ctx.moveTo(x2 + 90, 800); ctx.lineTo(x2, 800); ctx.stroke(); arrowHead([x2 + 90, 800], [x2, 800], 18, 'rgba(255,215,140,0.9)');
  }
  if (mixing > 0) for (let i = 0; i < 14; i++) { const x = (i * 140 + t * 30) % W; ctx.strokeStyle = `rgba(150,230,255,${0.35 * mixing})`; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k < 30; k++) { const ang = k * 0.4 + t + i; ctx.lineTo(x + Math.cos(ang) * k * 1.4, mid + Math.sin(ang) * k * 1.0); } ctx.stroke(); }
  ctx.restore();
}
sec(K.s2_duzlu, K.s2_durust, t => {
  seaSection(t, K.s2_duzlu - 0.1);
  tx('ATLANTİK', 140, 380, `44px ${AN}`, '#fff', R(t, K.s2_duzlu, K.s2_duzlu + 0.4), { align: 'left', ls: '4px', glow: '#000' });
  tx('ARALIQ DƏNİZİ', W - 140, 900, `44px ${AN}`, '#ffe2a0', R(t, K.s2_duzlu + 0.3, K.s2_duzlu + 0.7), { align: 'right', ls: '4px', glow: '#000' });
  chipAt('DAHA DUZLU · DAHA AĞIR', t, K.w_duzlu, 1300, 720, G1, 38);
  if (t > K.s2_asagi) { chipAt('YUXARIDAN ↓ İÇƏRİ', t, K.w_yuxari, 520, 410, '#fff', 34); chipAt('AŞAĞIDAN → OKEANA', t, K.w_asagi, 560, 870, G2, 34); }
  if (t > K.s2_kecid - 0.2) { stamp('KEÇİD TƏBƏQƏSİ', t, K.s2_kecid + 0.2, 960, 640, 56, '#bff', -0.02); }
  big('İKİ SU KÜTLƏSİ', t, K.s2_iki, 960, 190, 80, '#fff');
});
sec(K.s2_durust, K.s2_20esr, t => {
  if (t < K.s2_aye2) {
    stamp('DÜRÜST OLAQ', t, K.s2_durust + 0.05, 960, 170, 62, G1, -0.04);
    if (t > K.s2_qarisir) cv1('sərhəddə yavaş-yavaş qarışırlar...', t, K.w_yavas, 960, 320, 58, '#fff');
    if (t > K.s2_hereri) { chipAt('AMMA HƏR BİRİ', t, K.s2_hereri + 0.1, 960, 440, G1, 40); chipAt('ÖZ DUZLULUĞU', t, K.w_duzlulug, 760, 540, '#fff', 34); chipAt('ÖZ TEMPERATURU', t, K.w_temp, 1180, 540, '#fff', 34); }
  } else {
    ayah('بَيْنَهُمَا بَرْزَخٌ لَّا يَبْغِيَانِ', null, t, K.s2_aye2 - 0.1, 960, 200, 76);
    const y = 420;
    panel(960, y + 80, 1100, 290, R(t, K.s2_aye2 + 0.6, K.s2_aye2 + 1));
    tx('«QARIŞMAZLAR»', 760, y + 20, `58px ${AN}`, 'rgba(255,255,255,0.7)', R(t, K.w_qarisma, K.w_qarisma + 0.3)); cross(1030, y + 20, 70, t, K.w_yox49);
    tx('«HƏDDİ AŞMAZLAR»', 760, y + 140, `58px ${AN}`, G1, R(t, K.w_hedd49, K.w_hedd49 + 0.3), { glow: '#ffb030' }); check(1120, y + 140, 80, t, K.w_deyilir);
  }
});
sec(K.s2_20esr, K.s3, t => {
  if (t < K.s2_sehra) { chipAt('XX ƏSR', t, K.s2_20esr + 0.2, 470, 300, G1, 60); cv1('xüsusi cihazlarla ölçüldü', t, K.w_cihaz, 470, 430, 56, '#fff'); }
  else { glitchTx('HARADAN BİLƏYDİ?', W / 2, 200, `120px ${AN}`, '#fff', t, K.w_haradan); }
});

// ---------- SIRR 3: the bee ----------
sec(K.s3, K.s3_nehl, t => { sirrCard(t, K.s3, 3, K.s3_nehl - K.s3 - 0.1); });
sec(K.s3_nehl, K.s3_vehy, t => {
  tx('النَّحْل', 480, 420, `bold 190px ${AR}`, G1, pop(t, K.s3_nehl, 0.5), { glow: '#ffb030', blur: 40, sc: pop(t, K.s3_nehl, 0.5) });
  tx('NƏHL = BAL ARISI', 480, 620, `60px ${AN}`, '#fff', R(t, K.w_bal, K.w_bal + 0.4), { ls: '4px', glow: '#000' });
  src('16-cı surə', t, K.s3_nehl + 0.8, 480, 700);
});
function beeFly(t, t0, i, path) { if (t < t0) return; const u = clamp((t - t0) / 3.5), p = path[Math.floor(u * (path.length - 1))], q = path[Math.min(path.length - 1, Math.floor(u * (path.length - 1)) + 1)]; sprite(i % 2 ? 'el05_1' : 'el05_2', p[0], p[1] + Math.sin(t * 25) * 3, 110, clamp(u * 5) * clamp((1 - u) * 5), Math.atan2(q[1] - p[1], q[0] - p[0]) * 0.3 + (i % 2 ? 0 : Math.PI / 2 - 1.57)); }
sec(K.s3_vehy, K.s3_kisi, t => {
  for (let i = 0; i < 5; i++) beeFly(t, K.s3_vehy + 0.4 + i * 1.6, i, curve(-100, 300 + i * 120, W + 100, 200 + i * 90, 900, 900 - i * 120, 60));
  ayah('أَنِ اتَّخِذِي مِنَ الْجِبَالِ بُيُوتًا', '«Dağlarda, ağaclarda özünə evlər düzəlt»', t, K.s3_evler - 0.2, 560, 230, 64, K.s3_evler + 0.4);
  if (t > K.s3_ye - 0.1) ayah('ثُمَّ كُلِي ... فَاسْلُكِي سُبُلَ رَبِّكِ', '«...ye, Rəbbinin yollarına get»', t, K.s3_ye, 560, 560, 64, K.s3_ye + 0.6);
  src('Nəhl 16:68–69', t, K.s3_evler + 1, 560);
});
sec(K.s3_kisi, K.s3_bio, t => {
  const W3 = [['اتَّخِذِي', 'DÜZƏLT'], ['كُلِي', 'YE'], ['فَاسْلُكِي', 'GET']];
  tx('Ərəbcədə əmrin kişi və qadın forması var', W / 2, 140, `52px ${CV}`, G2, R(t, K.s3_kisi + 0.2, K.s3_kisi + 0.6), { glow: '#000' });
  W3.forEach(([ar, az], i) => {
    const x = 1440 - i * 480, y = 470, t0 = [K.w_duzelt, K.w_ye, K.w_get][i], k = pop(t, t0, 0.45); if (k <= 0) return;
    panel(x, y, 400, 300, clamp(k));
    tx(ar, x, y - 30, `bold 96px ${AR}`, G1, clamp(k), { sc: k, glow: '#ffb030' });
    tx(az, x, y + 100, `48px ${AN}`, '#fff', clamp(k), { ls: '4px' });
    // the feminine ending lights up
    if (t > K.w_qadin) { const f = 0.6 + 0.4 * Math.sin(t * 6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(x - (i === 1 ? 45 : 95), y - 30, 70, 'rgba(255,90,170,A)', 0.8 * f); ctx.restore(); }
  });
  if (t > K.w_qadin + 0.2) { chipAt('ي = QADIN FORMASI', t, K.w_qadin + 0.2, W / 2, 790, '#ff9ad0', 44); }
  if (t > K.w_formasi) lens(1440 - 95, 440, 120, 1.6, R(t, K.w_formasi, K.w_formasi + 0.4) * fadeOut(t, K.s3_bio - 0.4, 0.4));
});
sec(K.s3_bio, K.s3_durust, t => {
  chipAt('BİOLOGİYA', t, K.s3_bio + 0.1, 960, 110, '#9fe7ff', 40);
  if (t > K.s3_disi) { popSprite('el05_2', t, K.w_isci, 560, 330, 260); tx('İŞÇİ ARILAR = DİŞİ ♀', 560, 520, `52px ${AN}`, '#ff9ad0', R(t, K.w_disi, K.w_disi + 0.4), { glow: '#000', ls: '3px' }); check(780, 250, 90, t, K.w_disi + 0.3); }
  if (t > K.s3_erkek) { popSprite('el05_3', t, K.s3_erkek + 0.1, 1360, 330, 240); tx('ERKƏK ARI ♂', 1360, 520, `52px ${AN}`, '#9fc8ff', R(t, K.s3_erkek + 0.4, K.s3_erkek + 0.8), { glow: '#000', ls: '3px' });
    tx('pətək qurmur · bal toplamır', 1360, 590, `44px ${CV}`, '#fff', R(t, K.w_petek61, K.w_petek61 + 0.4), { glow: '#000' }); cross(1560, 250, 90, t, K.w_topla61); }
});
sec(K.s3_durust, K.s3_tesaduf, t => {
  stamp('DÜRÜST OLAQ', t, K.s3_durust + 0.05, 960, 170, 62, G1, -0.04);
  if (t > K.s3_dilci) cv1('«nəhl» sözü onsuz da qadın cinsindədir', t, K.s3_dilci + 0.3, 960, 330, 58, '#fff');
  if (t > K.s3_dogru) chipAt('DOĞRUDUR', t, K.s3_dogru + 0.1, 960, 450, '#7be3a2', 44);
  if (t > K.s3_secib) { chipAt('AMMA AYƏ MƏHZ BU FORMANI SEÇİB', t, K.w_secib, 960, 620, G1, 44); popSprite('el05_2', t, K.w_arini, 960, 820, 160); }
});
sec(K.s3_tesaduf, K.s4, t => { glitchTx('TƏSADÜF?', W / 2, H / 2, `200px ${AN}`, G1, t, K.s3_tesaduf + 0.1); });

// ---------- SIRR 4: the empire ----------
const MAP = { kon: [640, 330], quds: [860, 760], misir: [620, 880], kte: [1440, 690], atro: [1300, 360], ney: [1270, 560] };
function empireMap(t, a, opt = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(15,10,4,0.55)'; ctx.fillRect(0, 0, W, H);
  // persian spread
  const pr = opt.persia || 0; if (pr > 0) { [[MAP.kte, 420], [MAP.quds, 260 * clamp(pr * 2)], [MAP.misir, 240 * clamp(pr * 2 - 1)], [MAP.atro, 250]].forEach(([p, r]) => { if (r <= 0) return; const g = ctx.createRadialGradient(p[0], p[1], 10, p[0], p[1], r); g.addColorStop(0, 'rgba(226,67,63,0.55)'); g.addColorStop(1, 'rgba(226,67,63,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); }); }
  const by = opt.byz ?? 1; if (by > 0) { const g = ctx.createRadialGradient(MAP.kon[0], MAP.kon[1], 10, MAP.kon[0], MAP.kon[1], 380 * by); g.addColorStop(0, 'rgba(150,90,220,0.5)'); g.addColorStop(1, 'rgba(150,90,220,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const L = [['kon', 'KONSTANTİNOPOL'], ['quds', 'QÜDS'], ['misir', 'MİSİR'], ['kte', 'KTESİFON'], ['atro', 'ATROPATENA'], ['ney', 'NEYNƏVA']];
  L.forEach(([k, n]) => { if (opt.hide && opt.hide.includes(k)) return; const [x, y] = MAP[k]; ctx.fillStyle = k === 'atro' && opt.atro ? G1 : '#fff'; ctx.beginPath(); ctx.arc(x, y, k === 'atro' && opt.atro ? 14 : 9, 0, 7); ctx.fill(); tx(n, x, y - 34, `30px ${MO}`, k === 'atro' && opt.atro ? G1 : '#fff', 1, { glow: '#000', blur: 10 }); });
  ctx.restore();
}
sec(K.s4, K.s4_614, t => { sirrCard(t, K.s4, 4, K.s4_sened - K.s4 + 0.6); if (t > K.w_sened) { chipAt('TARİX · SƏNƏDLƏR', t, K.w_sened, 960, 200, G1, 46); } });
sec(K.s4_614, K.s4_cokus, t => {
  if (t < K.s4_misir) { counter(t, K.w_614, 0.9, 600, 614, 960, 230, 190, G1); tx('MİLADİ', 960, 110, `44px ${AN}`, '#fff', R(t, K.s4_614, K.s4_614 + 0.3), { ls: '8px' });
    if (t > K.s4_fars) { chipAt('FARSLAR QÜDSÜ ALIR', t, K.w_quds, 960, 380, RED, 44); popSprite('el06_5', t, K.s4_fars + 0.3, 1640, 830, 230); popSprite('el06_1', t, K.s4_fars + 0.6, 300, 830, 230); } }
  else { empireMap(t, R(t, K.s4_misir - 0.1, K.s4_misir + 0.3), { persia: R(t, K.w_misir - 0.6, K.w_misir + 0.6) }); counter(t, K.w_619, 0.6, 614, 619, 960, 150, 120, RED); }
});
sec(K.s4_cokus, K.s4_nazil, t => {
  if (t < K.s4_musrik) { stamp('BİZANS ÇÖKÜŞ ƏRƏFƏSİNDƏ', t, K.s4_cokus + 0.2, 1400, 300, 50, RED, -0.04); }
  else {
    popSprite('el06_1', t, K.s4_musrik + 0.2, 640, 520, 330); popSprite('el06_2', t, K.s4_musrik + 0.4, 1280, 520, 300);
    tx('FARSLAR', 640, 760, `52px ${AN}`, RED, R(t, K.s4_odp, K.s4_odp + 0.3), { ls: '4px', glow: '#000' }); tx('BİZANS', 1280, 760, `52px ${AN}`, '#c8a8ff', R(t, K.s4_odp, K.s4_odp + 0.3), { ls: '4px', glow: '#000' });
    if (t > K.w_meglub74 - 0.1) { check(640, 300, 90, t, K.w_meglub74, RED); cross(1280, 300, 110, t, K.w_meglub74 + 0.2); }
    if (t > K.s4_biz) cv1('«Biz də sizi belə məğlub edəcəyik!»', t, K.s4_biz + 0.1, 960, 150, 60, '#ff8a70');
  }
});
sec(K.s4_nazil, K.s4_ebubekr, t => {
  if (t < K.s4_bid) {
    chipAt('MƏHZ BU VAXT · RUM SURƏSİ', t, K.s4_nazil + 0.2, 960, 110, G1, 40);
    ayah('غُلِبَتِ الرُّومُ', '«Rumlar məğlub oldu»', t, K.s4_rum - 0.05, 960, 260, 80, K.s4_rum + 0.4);
    if (t > K.s4_amma - 0.1) ayah('وَهُم مِّن بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ ۝ فِي بِضْعِ سِنِينَ', '«...bir neçə il içində qalib gələcəklər»', t, K.s4_amma, 960, 520, 66, K.s4_amma + 1.6);
    if (t > K.w_neceil) lens(640, 520, 105, 1.6, R(t, K.w_neceil, K.w_neceil + 0.4));
    src('Rum 30:2–4', t, K.s4_rum + 0.6);
  } else {
    panel(960, 480, 1000, 520, R(t, K.s4_bid, K.s4_bid + 0.3));
    tx('بِضْع', 960, 340, `bold 170px ${AR}`, G1, pop(t, K.s4_bid + 0.1, 0.5), { sc: pop(t, K.s4_bid + 0.1, 0.5), glow: '#ffb030', blur: 40 });
    tx('BİD\'', 960, 470, `50px ${AN}`, '#fff', R(t, K.w_bid, K.w_bid + 0.3), { ls: '6px' });
    for (let i = 3; i <= 9; i++) { const t0 = K.w_ucden + (i - 3) * 0.22, k = pop(t, t0, 0.35); const x = 960 + (i - 6) * 120; ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(x, 600, 34 * k, 0, 7); ctx.fill(); ctx.restore(); tx(String(i), x, 602, `40px ${AN}`, INK, clamp(k)); }
    tx('= 3 İLDƏN 9 İLƏ QƏDƏR', 960, 690, `54px ${AN}`, G2, R(t, K.w_doqquza, K.w_doqquza + 0.4), { ls: '3px' });
  }
});
sec(K.s4_ebubekr, K.s4_622, t => { popSprite('el06_3', t, K.s4_ebubekr + 0.3, 420, 470, 380, '#ffb030'); chipAt('ƏBU BƏKR ƏMİNDİR', t, K.w_emin, 440, 780, G1, 40); });
sec(K.s4_622, K.s4_qafqaz, t => {
  timeline(t, [['614', K.w_622 - 0.6, 'məğlubiyyət'], ['622', K.w_622, 'Herakl hücuma keçir'], ['627', K.w_627, 'Neynəva']], [560, 960, 1360], 300, 1);
  if (t > K.w_meglub82) { const k = pop(t, K.w_meglub82, 0.5); sprite('el02_4', 1360, 580, 230, clamp(k), 0, k, '#ffb030'); }
  if (t > K.w_herakl) chipAt('614 → 622 = 8 İL ✓', t, K.w_herakl, 560, 520, '#7be3a2', 40);
});
sec(K.s4_qafqaz, K.s4_qelebe, t => {
  if (t < K.s4_atro + 0.6) { chipAt('QAFQAZ', t, K.w_qafqaz, 470, 240, '#fff', 46); chipAt('AZƏRBAYCAN', t, K.w_azerb, 470, 340, G1, 52); }
  else {
    empireMap(t, R(t, K.s4_atro + 0.6, K.s4_atro + 1.0), { persia: 1, atro: true });
    const path = poly([MAP.kon, [900, 300], [1100, 290], MAP.atro, [1330, 450], MAP.ney], 25), u = R(t, K.s4_atro + 0.9, K.s4_qelebe - 0.2);
    const tip = drawStroke(path, u, 10, G1, '#ffb030'); if (tip && u < 1) glow(tip[0], tip[1], 70, 'rgba(255,220,150,A)', 0.9); if (u >= 1) arrowHead(path[path.length - 2], path[path.length - 1], 30, G1);
    tx('Heraklın yürüşü', 960, 130, `56px ${CV}`, G2, R(t, K.s4_atro + 0.8, K.s4_atro + 1.2), { glow: '#000' });
  }
});
sec(K.s4_qelebe, K.s5, t => {
  popSprite('el02_4', t, K.s4_qelebe + 0.2, 470, 420, 300, '#ffb030');
  big('ƏVVƏLCƏDƏN XƏBƏR VERİLDİ', t, K.w_evvelce, 520, 720, 64, '#fff');
});

// ---------- SIRR 5: Pharaoh's body ----------
sec(K.s5, K.s5_firon, t => { sirrCard(t, K.s5, 5, K.s5_firon - K.s5 - 0.1); if (t > K.w_qahire) chipAt('QAHİRƏ · MUZEY', t, K.w_qahire, 960, 880, G1, 44); });
sec(K.s5_firon, K.s5_diqqet, t => {
  particles(t, 'bubble', 0.8, [0, 0, 900, H]);
  cv1('Firon dənizdə boğularkən...', t, K.s5_firon + 0.2, 1450, 170, 58, G2);
  ayah('فَالْيَوْمَ نُنَجِّيكَ بِبَدَنِكَ', '«Bu gün sənin bədənini xilas edəcəyik...»', t, K.s5_aye, 1430, 360, 76, K.s5_aye + 0.8);
  if (t > K.w_sonra88) ayah('لِتَكُونَ لِمَنْ خَلْفَكَ آيَةً', '«...səndən sonrakılara ibrət olsun deyə»', t, K.w_sonra88, 1430, 620, 70, K.w_sonra88 + 1.4);
  if (t > K.w_bedeni88) lens(1290, 360, 105, 1.6, R(t, K.w_bedeni88, K.w_bedeni88 + 0.4) * fadeOut(t, K.w_sonra88 + 1.0, 0.4));
  src('Yunus 10:92', t, K.s5_aye + 1, 1430);
});
sec(K.s5_diqqet, K.s5_nazil + 1.4, t => {
  chipAt('DİQQƏT', t, K.s5_diqqet, 960, 170, G1, 44);
  const k1 = pop(t, K.s5_ruh, 0.45), k2 = pop(t, K.w_bedeni90, 0.45);
  panel(560, 520, 560, 300, clamp(k1)); tx('RUH', 560, 520, `130px ${AN}`, 'rgba(255,255,255,0.75)', clamp(k1), { sc: k1, ls: '8px' }); cross(560, 520, 240, t, K.s5_ruh + 0.35);
  panel(1360, 520, 560, 300, clamp(k2)); tx('BƏDƏN', 1360, 520, `130px ${AN}`, G1, clamp(k2), { sc: k2, ls: '8px', glow: '#ffb030' }); check(1600, 400, 100, t, K.w_bedeni90 + 0.3);
});
sec(K.s5_nazil + 1.4, K.s5_tapildi, t => {
  particles(t, 'dust', 0.8);
  popSprite('el07_1', t, K.w_qumlar, 1480, 480, 170); popSprite('el07_2', t, K.w_gizli, 1700, 470, 230); popSprite('el07_3', t, K.w_mezar, 260, 470, 330);
  if (t > K.s5_hec) stamp('GİZLİ', t, K.s5_hec + 0.2, 960, 300, 80, G1, -0.06);
  cv1('Quran nazil olanda — qumun altında', t, K.w_qumlar - 0.4, 960, 130, 56, G2);
});
sec(K.s5_tapildi, K.s5_durust, t => {
  if (t < K.s5_muzey) { chipAt('XIX ƏSRİN SONU', t, K.w_19esr, 960, 200, G1, 56); chipAt('1881 · 1898', t, K.w_tapil, 960, 300, '#fff', 36); }
  else { counter(t, K.w_milyon, 1.6, 0, 1000000, 960, 210, 120, G1, '+', fmt); tx('ZİYARƏTÇİ', 960, 320, `46px ${AN}`, '#fff', R(t, K.w_milyon + 0.8, K.w_milyon + 1.2), { ls: '8px', glow: '#000' }); }
});
sec(K.s5_durust, K.s5_insanlar, t => {
  stamp('DÜRÜST OLAQ', t, K.s5_durust + 0.05, 960, 150, 62, G1, -0.04);
  if (t > K.s5_hansi) cv1('Musa peyğəmbərin dövründəki firon hansıdır?', t, K.s5_hansi + 0.3, 960, 290, 56, '#fff');
  if (t > K.s5_adlar) { chipAt('II RAMSES?', t, K.s5_adlar + 0.1, 640, 430, '#fff', 40); chipAt('MERNEPTAH?', t, K.s5_adlar + 0.5, 1280, 430, '#fff', 40); }
  if (t > K.s5_amma) { big('İBRƏT', t, K.w_ibret, 960, 640, 170, G1); }
});
sec(K.s5_insanlar, K.s6, t => {
  ayah('أَنَا رَبُّكُمُ الْأَعْلَىٰ', '«Mən sizin ən uca rəbbinizəm»', t, K.w_men, 520, 260, 90, K.s5_rebb + 0.3, 'Naziat 79:24', K.s5_rebb + 0.6);
  if (t > K.w_quru) { popSprite('el07_4', t, K.w_quru, 520, 640, 200); }
});

// ---------- SIRR 6: iron ----------
sec(K.s6, K.s6_hedid, t => { sirrCard(t, K.s6, 6, K.s6_hedid - K.s6 - 0.1); });
function feCard(t, t0, x, y) {
  const k = pop(t, t0, 0.5); if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = 'rgba(30,20,12,0.85)'; rrect(-150, -170, 300, 340, 22); ctx.fill(); ctx.strokeStyle = '#ffb27a'; ctx.lineWidth = 5; ctx.shadowColor = '#ff7a30'; ctx.shadowBlur = 30; ctx.stroke(); ctx.restore();
  tx('26', x - 105, y - 125, `44px ${AN}`, '#ffd2a8', clamp(k), { align: 'left' }); tx('Fe', x, y + 5, `170px ${AN}`, '#ffd2a8', clamp(k), { sc: k, glow: '#ff7a30', blur: 40 }); tx('DƏMİR', x, y + 130, `40px ${AN}`, '#fff', clamp(k), { ls: '6px' });
}
sec(K.s6_hedid, K.s6_endir2, t => {
  particles(t, 'ember', 0.9, [0, 300, 1100, 780]);
  if (t < K.s6_orada) { tx('الْحَدِيد', 470, 330, `bold 170px ${AR}`, '#ffd2a8', pop(t, K.w_hedid, 0.5), { glow: '#ff7a30', blur: 40, sc: pop(t, K.w_hedid, 0.5) }); src('57-ci surə', t, K.w_hedid + 0.6, 470, 480); feCard(t, K.w_demir104, 470, 720); }
  else {
    ayah('وَأَنزَلْنَا الْحَدِيدَ', '«Və dəmiri endirdik»', t, K.s6_endirdik - 0.15, 520, 250, 90, K.s6_endirdik + 0.4);
    if (t > K.s6_quvvet - 0.1) ayah('فِيهِ بَأْسٌ شَدِيدٌ وَمَنَافِعُ لِلنَّاسِ', '«Onda böyük qüvvət və insanlar üçün faydalar var»', t, K.s6_quvvet, 520, 540, 64, K.s6_quvvet + 0.8);
    src('Hədid 57:25', t, K.s6_endirdik + 1, 520);
  }
});
sec(K.s6_endir2, K.s6_astro, t => {
  tx('أَنزَلْنَا', 470, 280, `bold 140px ${AR}`, G1, pop(t, K.s6_endir2, 0.5), { glow: '#ffb030', blur: 40, sc: pop(t, K.s6_endir2, 0.5) });
  tx('ENDİRDİK', 470, 420, `66px ${AN}`, '#fff', R(t, K.s6_endir2 + 0.3, K.s6_endir2 + 0.6), { ls: '8px', glow: '#000' });
  if (t > K.s6_cixar) { tx('YERDƏN ÇIXARDIQ', 470, 560, `50px ${AN}`, 'rgba(255,255,255,0.65)', R(t, K.s6_cixar, K.s6_cixar + 0.3), { ls: '3px' }); cross(470, 560, 90, t, K.w_yox109); check(720, 420, 80, t, K.w_endir109); }
});
sec(K.s6_astro, K.s6_partla, t => {
  chipAt('ASTRONOMİYA', t, K.s6_astro + 0.1, 470, 200, '#9fe7ff', 44);
  if (t > K.s6_yaranmir) { tx('DƏMİR YERDƏ YARANMIR', 470, 330, `60px ${AN}`, '#fff', R(t, K.s6_yaranmir, K.s6_yaranmir + 0.4), { glow: '#000', ls: '3px' }); }
  if (t > K.s6_8x) { glow(605, 535, 60, 'rgba(255,220,120,A)', 0.8); counter(t, K.w_sekkiz, 1.0, 1, 8, 470, 560, 200, '#bfe3ff', '×'); tx('GÜNƏŞDƏN BÖYÜK ULDUZLAR', 470, 720, `46px ${AN}`, '#bfe3ff', R(t, K.w_boyuk112, K.w_boyuk112 + 0.4), { ls: '3px', glow: '#000' }); }
});
sec(K.s6_partla, K.s6_durust, t => {
  shock(t, K.w_partla, 960, 540, '255,200,150');
  if (t < K.s6_yer) {
    for (let i = 0; i < 10; i++) { const t0 = K.w_sepel - 0.3 + i * 0.12; if (t < t0) continue; const u = (t - t0) / 3, ang = i * 0.63 + 0.3; const x = 960 + Math.cos(ang) * 900 * u, y = 540 + Math.sin(ang) * 600 * u; sprite(i % 2 ? 'el08_5' : 'el08_1', x, y, 90 * (1 + u), clamp(1 - u), t * (i % 3 - 1)); }
    big('DƏMİR SƏPƏLƏNİR', t, K.w_sepel, 960, 160, 80, '#ffd2a8');
  } else {
    popSprite('el08_3', t, K.w_yerin, 1500, 640, 300); feCard(t, K.w_terkib, 1500, 300 - 40);
    if (t > K.s6_esa) chipAt('ESA · AVROPA KOSMİK AGENTLİYİ', t, K.s6_esa + 0.4, 960, 980, '#9fe7ff', 34);
  }
});
sec(K.s6_durust, K.s6_dusun, t => {
  stamp('DÜRÜST OLAQ', t, K.s6_durust + 0.05, 960, 160, 62, G1, -0.04);
  tx('أَنزَلْنَا', 960, 350, `bold 130px ${AR}`, G1, R(t, K.w_enzelna - 0.2, K.w_enzelna + 0.2), { glow: '#ffb030', blur: 40 });
  if (t > K.w_heyvan) { ayah('وَأَنزَلَ لَكُم مِّنَ الْأَنْعَامِ', '«...sizin üçün heyvanlardan endirdi»', t, K.w_heyvan, 960, 560, 62, K.w_heyvan + 0.6, 'Zumər 39:6', K.w_heyvan + 0.8); }
  if (t > K.s6_bexs) { chipAt('ENDİRDİK', t, K.w_bexs, 700, 800, '#fff', 44); chipAt('BƏXŞ ETDİK', t, K.w_bexs + 0.4, 1220, 800, G1, 44); }
  if (t > K.s6_yegane) tx('yeganə oxunuş deyil', 960, 900, `48px ${CV}`, G2, R(t, K.w_yegane, K.w_yegane + 0.4), { glow: '#000' });
});
sec(K.s6_dusun, K.s7_gel, t => {
  cv1('Amma bir düşünün...', t, K.s6_dusun + 0.1, 470, 230, 60, G2);
  if (t > K.s6_qan) { big('QANINDAKI DƏMİR', t, K.w_qanin, 500, 380, 76, '#ff8a8a'); tx('bir vaxtlar bir ulduzun ürəyində idi', 500, 500, `50px ${CV}`, '#fff', R(t, K.w_ulduzun, K.w_ulduzun + 0.5), { glow: '#000' }); feCard(t, K.w_ureyinde, 500, 760); }
});

// ---------- SIRR 7: the letters ----------
sec(K.s7_gel, K.s7_ac, t => {
  if (t < K.s7_boyuk + 0.6) { const sh = Math.sin(t * 50) * 8 * R(t, K.s7_gel, K.s7_boyuk); ctx.save(); ctx.translate(sh, 0); chipAt('SONUNCU SİRR', t, K.s7_gel + 0.2, 960, 130, RED, 48); ctx.restore(); }
  else sirrCard(t, K.s7_boyuk + 0.6, 7, K.s7_ac - K.s7_boyuk - 0.7);
  if (t > K.s7_boyuk) stamp('ƏN BÖYÜK SİRR', t, K.s7_boyuk, 960, 950, 58, G1, -0.03);
});
sec(K.s7_ac, K.s7_elif, t => {
  chipAt('QURANI AÇIN', t, K.s7_ac + 0.1, 470, 260, '#fff', 44);
  if (t > K.s7_beqere) { tx('البقرة', 470, 430, `bold 130px ${AR}`, G1, pop(t, K.w_beqere, 0.5), { glow: '#ffb030', sc: pop(t, K.w_beqere, 0.5) }); tx('BƏQƏRƏ · 2-ci SURƏ', 470, 560, `46px ${AN}`, '#fff', R(t, K.w_beqere + 0.4, K.w_beqere + 0.7), { ls: '4px' }); }
  if (t > K.s7_ilk) chipAt('İLK AYƏ', t, K.s7_ilk + 0.1, 470, 680, G1, 44);
});
const LETTERS = [['ا', 'ƏLİF'], ['ل', 'LAM'], ['م', 'MİM']];
sec(K.s7_elif, K.s7_yasin, t => {
  const ks = [K.s7_elif, K.s7_lam, K.s7_mim];
  LETTERS.forEach(([l, n], i) => {
    const t0 = ks[i]; if (t < t0 - 0.1) return; const k = pop(t, t0 - 0.05, 0.45), x = 1360 - i * 400, spin = t > K.s7_soz ? Math.sin(t * 1.4 + i) * 0.12 : 0;
    tx(l, x, 470, `bold 300px ${AR}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 60, rot: spin }); shock(t, t0, x, 470);
    tx(n, x, 760, `50px ${AN}`, '#fff', R(t, t0 + 0.2, t0 + 0.5), { ls: '8px' });
  });
  if (t > K.s7_soz) { chipAt('SÖZ DEYİL', t, K.s7_soz + 0.1, 560, 920, '#fff', 38); }
  if (t > K.s7_cumle) { chipAt('CÜMLƏ DEYİL', t, K.s7_cumle + 0.1, 1360, 920, '#fff', 38); }
  if (t > K.s7_3) { big('3 HƏRF', t, K.w_uc132, 960, 140, 100, G1); }
});
sec(K.s7_yasin, K.s7_29, t => {
  const L = [[K.s7_yasin, 'يس', 'YA SİN'], [K.s7_taha, 'طه', 'TA HA'], [K.s7_qaf, 'ق', 'QAF'], [K.s7_nun, 'ن', 'NUN'], [K.s7_kaf, 'كهيعص', 'KAF HA YA EYN SAD']];
  let cur = 0; L.forEach((l, i) => { if (t >= l[0] - 0.1) cur = i; });
  const [t0, s, n] = L[cur], k = pop(t, t0 - 0.08, 0.4);
  tx(s, 960, 470, `bold ${cur === 4 ? 230 : 320}px ${AR}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 60 }); shock(t, t0, 960, 470);
  tx(n, 960, 800, `60px ${AN}`, '#fff', R(t, t0 + 0.1, t0 + 0.4), { ls: '10px', glow: '#000' });
  L.slice(0, cur).forEach((l, i) => tx(l[1], 160 + i * 150, 140, `bold 70px ${AR}`, 'rgba(246,199,104,0.6)', 1));
});
const ABC = 'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split(' ');
const MQ = new Set('ا ح ر س ص ط ع ق ك ل م ن ه ي'.split(' '));
sec(K.s7_29, K.s7_alim, t => {
  if (t < K.s7_14) {
    counter(t, K.w_114, 1.0, 0, 114, 640, 450, 230, '#fff'); tx('SURƏ', 640, 620, `56px ${AN}`, '#fff', R(t, K.w_114 + 0.3, K.w_114 + 0.7), { ls: '10px' });
    counter(t, K.w_29, 1.0, 0, 29, 1280, 450, 230, G1); tx('SİRLİ HƏRFLƏRLƏ BAŞLAYIR', 1280, 620, `44px ${AN}`, G1, R(t, K.w_sirli, K.w_sirli + 0.4), { ls: '3px' });
  } else {
    // 28-letter alphabet, the 14 used letters light up
    tx('ƏRƏB ƏLİFBASI · 28 HƏRF', 960, 120, `48px ${AN}`, '#fff', R(t, K.s7_14, K.s7_14 + 0.4), { ls: '5px' });
    ABC.forEach((l, i) => {
      const c = i % 14, r = Math.floor(i / 14), x = 1780 - c * 125, y = 380 + r * 230, k = pop(t, K.s7_14 + 0.1 + i * 0.03, 0.35), on = MQ.has(l) && t > K.w_14 + i * 0.04;
      ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = on ? 'rgba(246,199,104,0.22)' : 'rgba(0,0,0,0.45)'; rrect(x - 55, y - 80, 110, 160, 16); ctx.fill(); ctx.strokeStyle = on ? G1 : 'rgba(255,255,255,0.2)'; ctx.lineWidth = on ? 4 : 2; ctx.stroke(); ctx.restore();
      tx(l, x, y - 5, `bold 90px ${AR}`, on ? G1 : 'rgba(255,255,255,0.35)', clamp(k), { glow: on ? '#ffb030' : null, blur: 30 });
    });
    if (t > K.w_yarisi) { tx('14 HƏRF = DÜZ YARISI', 960, 800, `70px ${AN}`, G1, R(t, K.w_yarisi, K.w_yarisi + 0.4), { glow: '#ffb030', ls: '4px' }); }
    if (t > K.s7_14b) chipAt('14 FƏRQLİ BİRLƏŞMƏ', t, K.s7_14b + 0.3, 960, 920, '#fff', 42);
  }
});
sec(K.s7_alim, K.s7_herf, t => {
  chipAt('14 ƏSRDİR ALİMLƏR DÜŞÜNÜR', t, K.s7_alim + 0.2, 960, 120, G1, 42);
  [[K.s7_biri1, 'ALLAHIN ADLARININ BAŞ HƏRFLƏRİ?', 380], [K.s7_biri2, 'SURƏLƏRİN ADLARI?', 520], [K.s7_biri3, 'MEYDAN OXUMA?', 660]].forEach(([t0, s, y]) => { if (t > t0 - 0.1) chipAt(s, t, t0, 960, y, t0 === K.s7_biri3 ? G1 : '#fff', 44); });
});
sec(K.s7_herf, K.s7_amma, t => {
  cv1('Quran hər gün işlətdiyiniz bu hərflərdəndir...', t, K.s7_herf + 0.3, 960, 180, 56, '#fff');
  if (t > K.s7_gucunuz - 0.2) { ayah('فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ', null, t, K.s7_gucunuz - 0.2, 960, 420, 96); big('BƏNZƏRİNİ GƏTİRİN!', t, K.w_benzer, 960, 680, 110, G1); src('Bəqərə 2:23', t, K.s7_gucunuz + 0.6); }
});
sec(K.s7_amma, K.n_1, t => {
  particles(t, 'dust', 0.8);
  if (t < K.s7_belke) {
    cv1('əksər alimlərin son sözü:', t, K.s7_amma + 0.1, 960, 200, 56, G2);
    ayah('وَمَا يَعْلَمُ تَأْوِيلَهُ إِلَّا اللَّهُ', '«Onun həqiqi mənasını yalnız Allah bilir»', t, K.s7_allah - 0.2, 960, 430, 90, K.s7_allah + 0.6, 'Ali-İmran 3:7', K.s7_allah + 1);
  } else {
    chipAt('BƏLKƏ DƏ ƏN BÖYÜK SİRR', t, K.s7_belke + 0.1, 960, 200, G1, 46);
    if (t > K.s7_bilmediyin) big('BİLMƏDİYİN ŞEYLƏR DƏ VAR', t, K.s7_bilmediyin + 0.4, 960, 480, 96, '#fff');
  }
});

// ---------- SUMMARY + END ----------
sec(K.n_1, K.n_tesaduf, t => {
  const ks = [K.n_1, K.n_2, K.n_3, K.n_4, K.n_5, K.n_6, K.n_7];
  let cur = 0; ks.forEach((k, i) => { if (t >= k - 0.05) cur = i; });
  const k = pop(t, ks[cur] - 0.05, 0.4);
  sprite(SIRR_ICON[cur], 960, 470, 330, clamp(k), 0, k, '#ffb030');
  tx(SIRR_NAME[cur], 960, 760, `70px ${AN}`, '#fff', clamp(k), { ls: '6px', glow: '#000' });
  tx(String(cur + 1), 960, 180, `90px ${AN}`, G1, clamp(k), { glow: '#ffb030' });
});
sec(K.n_tesaduf, K.n_cagir, t => {
  iconRing(t, K.n_tesaduf - 0.6, W / 2, H / 2, 360, 140, 0.08, t * 0.2);
  glitchTx('TƏSADÜF?', W / 2, H / 2, `130px ${AN}`, '#fff', t, K.w_tesaduf162);
  if (t > K.n_belke) chipAt('BƏLKƏ...', t, K.n_belke, W / 2, H / 2 + 120, G2, 40);
});
sec(K.n_cagir, K.n_video, t => {
  cv1('Quran özü oxucusunu çağırır:', t, K.n_cagir + 0.3, 480, 230, 58, G2);
  ayah('أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ', '«Onlar Quranı düşünüb daşınmırlarmı?»', t, K.n_aye - 0.1, 500, 430, 90, K.n_aye + 0.6, 'Nisa 4:82', K.n_aye + 1);
  if (t > K.n_kor) { chipAt('KOR-KORANƏ İMAN', t, K.w_kor, 340, 700, 'rgba(255,255,255,0.7)', 38); cross(340, 700, 70, t, K.w_yox166); chipAt('DÜŞÜNMƏK', t, K.w_dusun166, 700, 700, G1, 44); check(870, 700, 60, t, K.w_dusun166 + 0.4); }
});
sec(K.n_video, K.n_serh, t => { big('BU VİDEO DA BUNUN ÜÇÜN İDİ', t, K.n_video + 0.2, 960, 540, 84, '#fff'); });
sec(K.n_serh, K.n_abune, t => {
  big('SİZİ ƏN ÇOX HANSI DÜŞÜNDÜRDÜ?', t, K.n_serh + 0.1, 960, 190, 78, '#fff');
  for (let i = 0; i < 7; i++) { const x = 960 + (i - 3) * 230, y = 480, t0 = K.n_serh + 0.6 + i * 0.12, k = pop(t, t0, 0.4); if (k <= 0) continue;
    ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = 'rgba(10,8,4,0.7)'; ctx.beginPath(); ctx.arc(x, y, 92 * k, 0, 7); ctx.fill(); ctx.strokeStyle = G1; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    sprite(SIRR_ICON[i], x, y, 110, clamp(k), 0, k); tx(String(i + 1), x, y + 145, `64px ${AN}`, G1, clamp(k), { glow: '#ffb030' }); }
  if (t > K.n_reqem) { typeText('Rəqəmi şərhlərdə yaz', 960, 800, `58px ${MO}`, '#fff', t, K.n_reqem, 22); drawIcon('💬', 1400, 800, 80, R(t, K.n_reqem + 1, K.n_reqem + 1.3)); }
  if (t > K.n_bilir) chipAt('BAŞQA SİRR BİLİRSƏN? YAZ', t, K.w_sirr170, 960, 930, G2, 38);
  if (t > K.n_yeni) chipAt('YENİ VİDEO GƏLİR', t, K.n_yeni + 0.1, 960, 1010, G1, 32);
});
function endCard16(t) {
  const a0 = K.n_abune - 0.3, k = R(t, a0, a0 + 0.5) * fadeOut(t, K.n_salam - 0.3, 0.5); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; brandBg16(t); ctx.restore();
  const s = lerp(0.85, 1, eOut((t - a0) / 0.8));
  ctx.save(); ctx.globalAlpha = k; ctx.translate(560, 540); ctx.scale(s, s);
  glow(0, 0, 380, 'rgba(255,200,110,A)', 0.35);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 200, 0, 7); ctx.clip(); ctx.drawImage(logo, -200, -200, 400, 400); ctx.restore();
  ctx.strokeStyle = G1; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 204, 0, 7); ctx.stroke(); ctx.restore();
  tx('@esgarow', 1250, 400, `120px ${AN}`, G2, k, { glow: '#ffb030', blur: 35, ls: '4px' });
  tx('YouTube • TikTok • Instagram', 1250, 500, `38px ${MO}`, 'rgba(230,235,255,0.85)', k);
  const b = R(t, a0 + 0.4, a0 + 0.8), p = 1 + 0.04 * Math.sin(t * 6);
  ctx.save(); ctx.globalAlpha = k * b; ctx.translate(1250, 660); ctx.scale(p, p); ctx.fillStyle = '#e8343a'; rrect(-280, -66, 560, 132, 66); ctx.fill(); ctx.restore();
  tx('🔔', 1060, 662, `58px "Noto Color Emoji"`, '#fff', k * b);
  tx('ABUNƏ OL', 1290, 664, `70px ${AN}`, '#fff', k * b, { ls: '4px' });
  tx('👍 BƏYƏN', 1250, 820, `52px ${AN}`, G1, k * R(t, a0 + 1.0, a0 + 1.4), { ls: '4px' });
}
sec(K.n_salam - 0.3, TOTAL2, t => { cv1('Allahın salamı üzərinizə olsun', t, K.n_salam + 0.1, 960, 220, 70, '#fff'); });

// ================= GLOBAL =================
const IMPACTS = [K.h_14esr, K.h_mikro + 0.5, K.h_tele + 0.45, K.h_ulduz + 0.1, K.h_29n + 1.1, K.h_7n + 0.1, K.h_sert + 0.05, K.h_sual + 0.3, K.s1_herfi, K.s1_beli + 0.05, K.s1_barm2,
  K.w_eyni, K.w_imza, K.s1_tesaduf + 0.1, K.s2_kecid + 0.2, K.w_haradan, K.s3_nehl, K.s3_tesaduf + 0.1, K.w_614 + 0.9, K.s4_bid + 0.1, K.w_evvelce, K.w_bedeni90,
  K.s5_hec + 0.2, K.w_ibret, K.s6_endir2, K.w_partla, K.w_qanin, K.s7_boyuk, K.s7_elif, K.s7_lam, K.s7_mim, K.s7_yasin, K.s7_taha, K.s7_qaf, K.s7_nun, K.s7_kaf,
  K.w_benzer, K.s7_bilmediyin + 0.4, K.w_tesaduf162, ...SIRR_T.map(x => x + 0.45)];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - i; if (d >= 0 && d < 0.5) s += Math.exp(-d * 9) * 14; } const d = t - K.s6_partla; if (d >= 0 && d < 1.0) s += Math.exp(-d * 4) * 26; return s; }
const CUTS = SIRR_T.map(x => x - 0.15);
function watermark(t) {
  const a = 0.7 * fadeOut(t, K.n_abune - 0.6, 0.4); if (a <= 0 || t < 2) return;
  ctx.save(); ctx.globalAlpha = a * R(t, 2, 2.6); ctx.save(); ctx.beginPath(); ctx.arc(70, 70, 26, 0, 7); ctx.clip(); ctx.drawImage(logo, 44, 44, 52, 52); ctx.restore();
  ctx.font = `bold 30px ${MO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.fillText('@esgarow', 108, 71); ctx.restore();
}
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawAll(t) {
  drawBackground(t);
  for (const [a, b, fn] of SEC) if (t >= a - 0.02 && t < b) { ctx.save(); fn(t, a, b); ctx.restore(); }
}
window.renderAt = async function (t) {
  // freeze the frame just before the 7th secret for the frame-break transition
  if (breakAt < 0 && t >= K.s7_gel - 0.05) { const real = ctx; ctx = breakC.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); drawAll(K.s7_gel - 0.06); ctx = real; breakAt = K.s7_gel; }
  ctx = lctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  drawAll(t);
  frameBreak(t, K.s7_gel);
  for (const c of CUTS) wipe(t, c, 0.45);
  tracker(t); watermark(t); endCard16(t);
  vignette(0.45); filmGrain(t);
  const f = R(t, TOTAL2 - 1.2, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  // shake: draw layer to main canvas with offset
  const real = cv.getContext('2d'); const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  real.setTransform(1, 0, 0, 1, 0, 0); real.fillStyle = '#000'; real.fillRect(0, 0, W, H);
  const z = sh > 0 ? 1.02 : 1; real.save(); real.translate(W / 2 + sx, H / 2 + sy); real.scale(z, z); real.drawImage(layer, -W / 2, -H / 2); real.restore();
  return cv.toDataURL('image/jpeg', 0.9);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
