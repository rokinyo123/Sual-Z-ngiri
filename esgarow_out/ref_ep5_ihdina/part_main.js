// ================= Ayənin sirri 5 — İhdinəs-sıratəl-mustəqim =================
// New in this episode: fracture-assemble hook, line drawn in sand (stroke build), liquid-glass lens,
// glitch type, rakat counter, frame-break transition, cut-out props (lantern, signpost, icons).
const K = KT;
const IM = {};
['yol', 'qum', 'ayrici', 'mushaf', 'ucyol'].forEach(k => load(k, `img/${k}.jpg`));
['fener', 'lovhe', 'vaxt_1', 'vaxt_2', 'vaxt_3', 'vaxt_4', 'vaxt_5', 'ikon_1', 'ikon_2', 'ikon_3', 'ikon_4', 'ikon_5'].forEach(k => load(k, `img/${k}.png`));
function load(k, src) { pending++; const im = new Image(); im.onload = () => { IM[k] = im; pending--; }; im.onerror = () => pending--; im.src = src; }

// ---------- generic helpers ----------
const gl = document.createElement('canvas'); gl.width = W; gl.height = H; const gctx = gl.getContext('2d');
function grp(a, fn) {
  if (a <= 0) return; if (a >= 1) { fn(); return; }
  gctx.setTransform(1, 0, 0, 1, 0, 0); gctx.globalAlpha = 1; gctx.clearRect(0, 0, W, H);
  const real = ctx; ctx = gctx; ctx.save(); fn(); ctx.restore(); ctx = real;
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(gl, 0, 0); ctx.restore();
}
const fadeOut = (t, t0, d = 0.4) => 1 - R(t, t0, t0 + d);
function bigText(s, t, t0, y, size = 150, col = G1, x = W / 2, alpha = 1) { if (t >= t0) fly3d(s, t, t0, x, y, size, col, AN, { alpha }); }
function sideChip(s, t, t0, x, y, col = G1, size = 44) { chip(s, x, y, t, t0, col, 'rgba(10,8,4,0.72)', size); }
function darken(a) { if (a > 0) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); } }
function sourceTag(s, t, t0, y) { tx(s, W / 2, y, `30px ${MO}`, 'rgba(255,240,210,0.8)', R(t, t0, t0 + 0.4), { glow: '#000', blur: 10 }); }
function cv1(s, t, t0, y, size = 64, col = '#fff') { tx(s, W / 2, y, `${size}px ${CV}`, col, R(t, t0, t0 + 0.45), { glow: '#000', blur: 22 }); }
function stamp(s, t, t0, x, y, size = 64, col = '#7be3a2', rot = -0.1) {
  const u = clamp((t - t0) / 0.3); if (u <= 0) return; const sc = lerp(2.4, 1, eOut(u));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(u * 1.5);
  ctx.font = `${size}px ${AN}`; ctx.letterSpacing = '4px'; const w = ctx.measureText(s).width + 60;
  ctx.fillStyle = 'rgba(10,8,4,0.55)'; rrect(-w / 2, -size * 0.85, w, size * 1.7, 18); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillText(s, 0, 4); ctx.restore();
}
function sprite(k, x, y, h, a = 1, rot = 0, sc = 1, glowCol = null) {
  const im = IM[k]; if (!im || a <= 0) return; const w = im.width * h / im.height;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 40; }
  ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
}
function popSprite(k, t, t0, x, y, h, glowCol = null) { const k2 = pop(t, t0, 0.45); if (k2 > 0) sprite(k, x, y, h, clamp(k2 * 2), 0, k2, glowCol); }
// RGB-split glitch text
function glitchTx(s, x, y, font, col, t, t0, a = 1) {
  if (t < t0 || a <= 0) return;
  const burst = clamp(1 - (t - t0) / 0.45), flick = (Math.floor(t * 12) % 9 === 0) ? 0.6 : 0, g = Math.max(burst, flick);
  const j = n => (srand(Math.floor(t * 30) + n) - 0.5) * 40 * g;
  ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter';
  if (g > 0) { tx(s, x + j(1) - 8 * g, y + j(2), font, 'rgba(255,40,60,0.8)', 1); tx(s, x + j(3) + 8 * g, y + j(4), font, 'rgba(40,220,255,0.8)', 1); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= a * clamp((t - t0) / 0.15); tx(s, x + j(5) * 0.3, y, font, col, 1, { glow: '#000', blur: 20 }); ctx.restore();
}
// full-frame photo with slow camera + readability gradients
function bgImage(k, t, t0, z0 = 1.0, z1 = 1.1, opt = {}) {
  const im = IM[k]; if (!im) { brandBg(t); return; }
  const u = ease((t - t0) / (opt.dur || 12)), z = lerp(z0, z1, u);
  ctx.save(); ctx.translate(W / 2, H / 2 + (opt.dy || 0) * u); if (opt.mirror) ctx.scale(-1, 1); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  if (opt.filter) ctx.filter = opt.filter; ctx.drawImage(im, 0, 0, W, H); ctx.restore();
  const g2 = ctx.createLinearGradient(0, 0, 0, 800); g2.addColorStop(0, 'rgba(7,6,11,0.8)'); g2.addColorStop(1, 'rgba(7,6,11,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, 800);
  const g = ctx.createLinearGradient(0, H * 0.6, 0, H); g.addColorStop(0, 'rgba(7,6,11,0)'); g.addColorStop(1, 'rgba(7,6,11,0.85)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------- signature effects ----------
// FRACTURE: 5x5 tiles fly in from scattered 3D-ish poses, ripple from the centre, settle into the photo
function fracture(k, t, t0, d = 1.5) {
  const im = IM[k]; if (!im) return; const n = 5, tw = W / n, th = H / n, sw = im.width / n, sh = im.height / n;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const i = r * n + c, delay = (Math.abs(r - 2) + Math.abs(c - 2)) * 0.07, u = clamp((t - t0 - delay) / (d - 0.56));
    if (u <= 0) continue; const e = 1 - Math.pow(1 - u, 4);
    const dx = (srand(i + 1) - 0.5) * 900, dy = (srand(i + 7) - 0.5) * 700, rot = (srand(i + 13) - 0.5) * 3.2, s0 = 0.3 + srand(i + 19) * 1.5;
    const cx = c * tw + tw / 2, cy = r * th + th / 2;
    ctx.save(); ctx.globalAlpha = clamp(u * 2.5); ctx.translate(cx + dx * (1 - e), cy + dy * (1 - e)); ctx.rotate(rot * (1 - e)); ctx.scale(lerp(s0, 1, e), lerp(s0, 1, e) * (0.6 + 0.4 * Math.abs(Math.cos(rot * (1 - e)))));
    ctx.drawImage(im, c * sw, r * sh, sw, sh, -tw / 2 - 0.5, -th / 2 - 0.5, tw + 1, th + 1);
    ctx.fillStyle = `rgba(0,0,0,${0.55 * (1 - e)})`; ctx.fillRect(-tw / 2, -th / 2, tw, th);
    if (e > 0.9 && e < 1) { ctx.strokeStyle = `rgba(255,214,140,${(1 - e) * 8})`; ctx.lineWidth = 3; ctx.strokeRect(-tw / 2, -th / 2, tw, th); }
    ctx.restore();
  }
}
// polyline helpers for the sand drawing
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
const MAIN = curvePts(540, 1760, 540, 560, 540, 1160, 60);
const SIDES = [[1640, -1], [1520, 1], [1400, -1], [1280, 1], [1150, -1], [1020, 1], [900, -1], [780, 1]].map(([y, d], i) => {
  const L = 300 + 110 * srand(i + 3), up = 120 + 90 * srand(i + 5);
  return curvePts(540, y, 540 + d * L, y - up, 540 + d * L * 0.35, y + 60 * (srand(i + 9) - 0.3), 36);
});
// LIQUID GLASS lens: magnify what is already on the canvas
const snapC = document.createElement('canvas'); snapC.width = W; snapC.height = H; const snapX = snapC.getContext('2d');
function lens(x, y, r, zoom, a = 1) {
  if (a <= 0) return; snapX.setTransform(1, 0, 0, 1, 0, 0); snapX.clearRect(0, 0, W, H); snapX.drawImage(cv, 0, 0);
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
  const sw = 2 * r / zoom; ctx.drawImage(snapC, x - sw / 2, y - sw / 2, sw, sw, x - r, y - r, 2 * r, 2 * r);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, r * 0.05, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.35, 'rgba(255,255,255,0.04)'); g.addColorStop(0.92, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,230,170,0.5)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,236,190,0.9)'; ctx.lineWidth = 5; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.restore();
}
// FRAME BREAK: a frozen frame shatters into shards that fall away
const breakC = document.createElement('canvas'); breakC.width = W; breakC.height = H; let breakReady = false;
const SHARDS = (() => { const pts = [], n = 6, m = 10, out = []; for (let r = 0; r <= m; r++) for (let c = 0; c <= n; c++) { const j = (r && c && r < m && c < n) ? 1 : 0; pts.push([c * W / n + (srand(r * 31 + c) - 0.5) * 110 * j, r * H / m + (srand(r * 17 + c + 5) - 0.5) * 110 * j]); }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { const p = (rr, cc) => pts[rr * (n + 1) + cc], a = p(r, c), b = p(r, c + 1), d = p(r + 1, c), e = p(r + 1, c + 1); out.push([a, b, e], [a, e, d]); } return out; })();
function frameBreak(t, t0) {
  const u = t - t0; if (u < 0 || u > 1.6 || !breakReady) return;
  SHARDS.forEach((tri, i) => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const dist = Math.hypot(cx - W / 2, cy - 820) / 1100, start = dist * 0.25, v = Math.max(0, u - start);
    const ang = Math.atan2(cy - 820, cx - W / 2), sp = 300 + 500 * srand(i);
    const ox = Math.cos(ang) * sp * v * 0.8, oy = Math.sin(ang) * sp * v * 0.5 + 1600 * v * v, rot = (srand(i + 3) - 0.5) * 4 * v, a = 1 - clamp(v / 1.1);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(cx + ox, cy + oy); ctx.rotate(rot); ctx.translate(-cx, -cy);
    ctx.beginPath(); ctx.moveTo(...tri[0]); ctx.lineTo(...tri[1]); ctx.lineTo(...tri[2]); ctx.closePath(); ctx.save(); ctx.clip(); ctx.drawImage(breakC, 0, 0); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  });
  if (u < 0.12) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - u / 0.12)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

const IMPACTS = [K.altinci, K.ucsoz, K.defe, K.menasini, K.allahin, K.seytan, K.basqa, K.tek, K.bir_yol, K.subul, K.niye, K.artirar, K.qulum, K.yoldan, K.hansinda];
function shakeAt(t) {
  let s = 0; for (const i of IMPACTS) { const d = t - i; if (d >= 0 && d < 0.5) s += Math.exp(-d * 9) * 16; }
  const d = t - K.novbeti; if (d >= 0 && d < 0.8) s += Math.exp(-d * 6) * 30;
  return s;
}

// ================= scenes =================
const AY = ['اهْدِنَا', 'الصِّرَاطَ', 'الْمُسْتَقِيمَ'];
const SCENES = {
  hook(t) {
    if (t < 1.55) fracture('yol', t, 0, 1.5); else bgImage('yol', t, 1.55, 1.0, 1.12, { dur: 13 });
    lightLeak(t, 0.12);
    // "QURAN 1:6"
    grp(fadeOut(t, K.bu_uc - 0.1, 0.4), () => {
      sideChip('QURAN', t, K.ilk - 0.1, W / 2, 300, G1, 46);
      bigText('1 : 6', t, K.altinci, 470, 190, '#fff');
      tx('Fatihə surəsi, 6-cı ayə', W / 2, 600, `56px ${CV}`, G2, R(t, K.altinci + 0.4, K.altinci + 0.8), { glow: '#000', blur: 20 });
      AY.forEach((w, i) => { const t0 = K.cemi + 0.05 + i * 0.2, k = pop(t, t0, 0.35); if (k <= 0) return; const x = 820 - i * 280, y = lerp(560, 860, eOut(clamp((t - t0) / 0.3)));
        ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = 'rgba(12,9,4,0.8)'; rrect(-130, -95, 260, 190, 26); ctx.fill(); ctx.strokeStyle = G1; ctx.lineWidth = 4; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.stroke(); ctx.restore();
        tx(w, x, y - 5, `bold ${i === 2 ? 58 : 66}px ${AR}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 25 }); tx(String(i + 1), x, y + 120, `40px ${AN}`, G2, clamp(k)); });
      stamp('3 SÖZ', t, K.ucsoz + 0.35, W / 2, 1110, 92, G1, -0.06);
    });
    // "gündə 17 dəfə": prayer-time icons + counts collapse into 17
    if (t >= K.gunde - 0.2 && t < K.amma + 0.3) {
      const out = fadeOut(t, K.amma - 0.1, 0.4);
      grp(out, () => {
        tx('GÜNDƏ', W / 2, 520, `90px ${AN}`, '#fff', R(t, K.gunde - 0.2, K.gunde + 0.2), { glow: '#000', ls: '8px' });
        const nums = [2, 4, 4, 3, 4], col = R(t, K.defe, K.defe + 0.45, ) ;
        nums.forEach((n, i) => {
          const t0 = K.gunde + 0.1 + i * 0.2, x0 = 150 + i * 195, y0 = 900;
          const x = lerp(x0, W / 2, ease(col)), y = lerp(y0, 1000, ease(col)), s = 1 - 0.9 * ease(col);
          if (t < t0) return; const k = pop(t, t0, 0.35);
          sprite(`vaxt_${i + 1}`, x, y - 40, 140 * s, clamp(k) * (1 - col), 0, k);
          tx(String(n), x, y + 90 * s, `${110 * s}px ${AN}`, G1, clamp(k) * (1 - col), { sc: k, glow: '#ffb030' });
          if (i < 4 && col < 0.5) tx('+', x0 + 97, y0 + 90, `70px ${AN}`, 'rgba(255,255,255,0.8)', R(t, t0 + 0.15, t0 + 0.3) * (1 - col * 2));
        });
        if (t >= K.defe) { const k = pop(t, K.defe + 0.15, 0.45); tx('17', W / 2, 1000, `420px ${AN}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 70 }); shock(t, K.defe + 0.2, W / 2, 1000);
          tx('DƏFƏ', W / 2, 1270, `96px ${AN}`, '#fff', R(t, K.defe + 0.4, K.defe + 0.7), { ls: '10px', glow: '#000' }); }
      });
    }
    if (t >= K.amma - 0.1) {
      darken(0.45 * R(t, K.amma - 0.1, K.amma + 0.3) * fadeOut(t, K.ihdina - 0.2, 0.5));
      grp(fadeOut(t, K.ihdina - 0.2, 0.4), () => {
        tx('amma...', W / 2, 560, `80px ${CV}`, '#fff', R(t, K.amma, K.amma + 0.3), { glow: '#000' });
        glitchTx('MƏNASINI BİLİRSƏNMİ?', W / 2, 760, `92px ${AN}`, '#fff', t, K.menasini);
        if (t >= K.menasini + 0.2) { const p = 1 + 0.06 * Math.sin(t * 7); glitchTx('?', W / 2, 1150, `440px ${AN}`, G1, t, K.menasini + 0.2); }
      });
    }
    // the ayah, then a golden line rises from the bottom and carries us into the sand
    if (t >= K.ihdina - 0.2) {
      arabic('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', W / 2, 520, 104, t, K.ihdina - 0.2, 1.4);
      tx('İHDİNƏS-SIRATƏL-MUSTƏQİM', W / 2, 680, `52px ${AN}`, G2, R(t, K.ihdina + 0.8, K.ihdina + 1.2), { ls: '4px', glow: '#000' });
      cv1('«Bizi doğru yola yönəlt»', t, K.bizi, 800, 74, '#fff');
      const lu = R(t, K.bizi + 0.6, K.sirr1 + 0.2, ease);
      if (lu > 0) { ctx.save(); ctx.strokeStyle = G1; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 35; ctx.beginPath(); ctx.moveTo(W / 2, H + 20); ctx.lineTo(W / 2, H + 20 - (H - 900) * lu); ctx.stroke(); ctx.restore(); glow(W / 2, H + 20 - (H - 900) * lu, 120, 'rgba(255,220,150,A)', 0.8); }
    }
  },

  sirr1(t, a) {
    bgImage('qum', t, a, 1.12, 1.0, { dur: 25 }); darken(0.25);
    grp(fadeOut(t, K.birgun - 0.2, 0.4), () => { bigText('BİRİNCİ SİR', t, a + 0.05, 820, 120, G1); });
    grp(fadeOut(t, K.ayeni - 0.3, 0.4), () => {
      cv1('Peyğəmbərimiz ﷺ yerə', t, K.birgun, 290, 64, G2); cv1('düz bir xətt çəkdi...', t, K.birgun + 0.5, 370, 64, G2);
    });
    // main line (God's path)
    const mu = R(t, K.xett, K.xett + 1.8, ease), fade = R(t, K.basqa, K.basqa + 1.0);
    const tip = drawStroke(MAIN, mu, 16, `rgba(255,${lerp(206, 230, fade)},120,1)`, '#ffb030');
    if (mu > 0 && mu < 1 && tip) { glow(tip[0], tip[1], 90, 'rgba(255,230,160,A)', 0.9); }
    if (t > K.basqa) glow(540, 1160, 600, 'rgba(255,200,110,A)', 0.25 * fade);
    sideChip('ALLAHIN YOLU', t, K.allahin, 540, 480, G1, 46);
    // side paths
    SIDES.forEach((pts, i) => {
      const t0 = K.sagina + i * 0.32, u = R(t, t0, t0 + 0.7, eOut); if (u <= 0) return;
      const red = R(t, K.basqa, K.basqa + 0.5), gone = R(t, K.basqa + 0.5, K.basqa + 1.4);
      ctx.save(); ctx.globalAlpha = 1 - gone;
      const end = drawStroke(pts, u, 8, red > 0 ? `rgba(${lerp(235, 226, red)},${lerp(225, 67, red)},${lerp(205, 63, red)},0.9)` : 'rgba(240,228,205,0.85)');
      // an ember at the head of each path ("a devil calling to it")
      if (t > K.seytan + i * 0.12 && end && u >= 1) { const f = 0.6 + 0.4 * Math.sin(t * 6 + i); glow(end[0], end[1], 70, 'rgba(255,60,40,A)', 0.8 * f * pop(t, K.seytan + i * 0.12)); ctx.fillStyle = '#ff5a3c'; ctx.beginPath(); ctx.arc(end[0], end[1], 9, 0, 7); ctx.fill(); }
      ctx.restore();
    });
    sideChip('YOLLAR', t, K.bunlar, 190, 1180, 'rgba(255,255,255,0.8)', 40);
    sideChip('YOLLAR', t, K.bunlar + 0.2, 890, 960, 'rgba(255,255,255,0.8)', 40);
    grp(fadeOut(t, K.ayeni - 0.3, 0.4), () => { if (t >= K.seytan) tx('hər birinin başında bir şeytan', W / 2, 1820, `58px ${CV}`, '#ff8a70', R(t, K.seytan, K.seytan + 0.4), { glow: '#000', blur: 20 }); });
    // Ənam 6:153
    if (t >= K.ayeni - 0.1) {
      arabic('وَأَنَّ هَٰذَا صِرَاطِي مُسْتَقِيمًا فَاتَّبِعُوهُ', W / 2, 300, 66, t, K.ayeni - 0.1, 1.3);
      cv1('«Bu, Mənim düz yolumdur, ona tabe olun»', t, K.menim, 400, 54, '#fff');
      sourceTag('Ənam 6:153  ·  Əhməd 4142, Nəsai (Kubra) 11174', t, K.menim + 0.6, 1840);
    }
    if (t >= K.basqa) stamp('BAŞQA YOLLARA UYMAYIN', t, K.basqa + 0.1, W / 2, 1700, 58, RED, -0.04);
  },

  sirr2(t, a) {
    brandBg(t);
    if (t < K.ihd - 0.1) { sirrCard(t, a, 2, 'sözlərin özü'); return; }
    const rows = [[K.ihd, K.ihd_m, 'YÖNƏLT, APAR', 'təkcə göstər yox — apar'], [K.sirat, K.sirat_m, 'AYDIN, GENİŞ YOL', 'hamının görə biləcəyi'], [K.mustaqim, K.mus_m, 'ƏYRİSİZ, DÜZ', 'heç bir əyrisi olmayan']];
    tx('İHDİNƏS-SIRATƏL-MUSTƏQİM', W / 2, 300, `50px ${AN}`, G2, R(t, K.ihd - 0.1, K.ihd + 0.3), { ls: '4px' });
    rows.forEach(([t0, tm, m1, m2], i) => {
      const y = 620 + i * 390; if (t < t0 - 0.15) return;
      const k = pop(t, t0 - 0.15, 0.45);
      ctx.save(); ctx.translate(W / 2, y); ctx.scale(k, k); ctx.fillStyle = 'rgba(20,14,6,0.85)'; rrect(-470, -160, 940, 320, 30); ctx.fill(); ctx.strokeStyle = 'rgba(246,199,104,0.85)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      tx(AY[i], 770, y, `bold ${i === 2 ? 92 : 104}px ${AR}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 30 });
      tx(String(i + 1), 120, y - 115, `40px ${AN}`, 'rgba(255,226,160,0.6)', clamp(k));
      if (t >= tm) { const u = R(t, tm, tm + 0.35); ctx.save(); ctx.beginPath(); ctx.rect(100, y - 160, 520 * eOut(u), 320); ctx.clip();
        tx(m1, 340, y - 25, `60px ${AN}`, '#fff', 1, { ls: '2px' }); tx(m2, 340, y + 60, `44px ${CV}`, G2, 1); ctx.restore(); }
    });
  },

  ayrici(t, a) {
    bgImage('ayrici', t, a, 1.05, 1.15, { dur: 11 });
    sideChip('DİQQƏT', t, a + 0.05, W / 2, 280, G1, 44);
    if (t >= K.tek - 0.1) arabic('الصِّرَاطَ', W / 2, 460, 130, t, K.tek - 0.1, 0.7);
    stamp('TƏK', t, K.tek + 0.4, 830, 520, 64, G1, 0.12);
    bigText('DOĞRU YOL BİRDİR', t, K.bir_yol, 680, 92, '#fff');
    if (t >= K.cox) {
      const k = pop(t, K.cox, 0.5); sprite('lovhe', W / 2, 1220, 640, clamp(k * 2), Math.sin(t * 2.2) * 0.04 * k, k);
      stamp('YANLIŞ YOLLAR ÇOXDUR', t, K.cox + 0.25, W / 2, 830, 62, RED, -0.03);
    }
    if (t >= K.subul) { glitchTx('سُبُل', W / 2 - 170, 1630, `bold 120px ${AR}`, G1, t, K.subul); }
    if (t >= K.yollar) { tx('= YOLLAR', W / 2 + 170, 1640, `76px ${AN}`, '#fff', R(t, K.yollar, K.yollar + 0.3), { glow: '#000', ls: '3px' }); tx('(cəm)', W / 2 + 170, 1720, `44px ${CV}`, G2, R(t, K.yollar + 0.3, K.yollar + 0.6)); }
    sourceTag('Ənam 6:153', t, K.subul + 0.6, 1810);
  },

  sirr3(t, a) {
    if (t < K.bes_biz - 0.05) { brandBg(t); sirrCard(t, a, 3, 'hər rükətdə'); return; }
    bgImage('yol', t, K.bes_biz, 1.25, 1.1, { mirror: true, filter: 'brightness(0.7) saturate(0.9)', dur: 13 });
    grp(fadeOut(t, K.yolda - 0.3, 0.4), () => {
      cv1('Bəs biz artıq yoldayıqsa...', t, K.bes_biz, 300, 66, G2);
      bigText('NİYƏ HƏR RÜKƏTDƏ?', t, K.niye, 460, 92, '#fff');
      if (t >= K.rukat) { const n = Math.min(17, 1 + Math.floor(R(t, K.rukat, K.rukat + 1.1, x => x) * 16)); const k = pop(t, K.rukat, 0.4);
        tx(String(n), W / 2, 760, `260px ${AN}`, G1, clamp(k), { sc: k * (n === 17 ? 1 + 0.08 * clamp(1 - (t - K.rukat - 1.1) * 4) : 1), glow: '#ffb030', blur: 50 });
        tx('RÜKƏT', W / 2, 940, `64px ${AN}`, '#fff', R(t, K.rukat + 0.2, K.rukat + 0.5), { ls: '10px' }); }
      stamp('BİR DƏFƏLİK DEYİL', t, K.cunki + 0.6, W / 2, 1150, 70, G1, -0.05);
    });
    if (t >= K.yolda - 0.1) {
      const k = pop(t, K.yolda, 0.6), f = 0.75 + 0.25 * Math.sin(t * 3);
      glow(W / 2, 1180, 520, 'rgba(255,190,90,A)', 0.55 * clamp(k) * f);
      sprite('fener', W / 2, 1150, 620, clamp(k * 2), Math.sin(t * 1.3) * 0.05, k);
      cv1('yolda qalmaq da, irəliləmək də...', t, K.yolda + 0.2, 360, 60, '#fff');
      bigText('ALLAHIN KÖMƏYİ İLƏ', t, K.allahin_k, 520, 96, G1);
    }
  },

  hadis(t, a) {
    bgImage('mushaf', t, a, 1.05, 1.18, { dur: 11 });
    grp(fadeOut(t, K.buyurur - 0.3, 0.4), () => {
      cv1('Quran deyir:', t, a + 0.1, 300, 66, G2);
      if (t >= a + 0.9) arabic('وَالَّذِينَ اهْتَدَوْا زَادَهُمْ هُدًى', W / 2, 450, 80, t, a + 0.9, 1.2);
      bigText('HİDAYƏT TAPANLARIN', t, K.artirar - 0.5, 620, 76, '#fff');
      bigText('HİDAYƏTİNİ ARTIRAR', t, K.artirar, 730, 88, G1);
      if (t >= K.artirar) { const k = pop(t, K.artirar + 0.2, 0.5); sprite('fener', 860, 1350, 360 * (1 + 0.15 * clamp(t - K.artirar)), clamp(k * 2), 0, k); glow(860, 1360, 260 + 120 * clamp(t - K.artirar), 'rgba(255,190,90,A)', 0.6 * clamp(k)); }
      sourceTag('Muhəmməd 47:17', t, K.artirar + 0.6, 830);
    });
    if (t >= K.buyurur - 0.1) {
      cv1('Bu duanı deyəndə Allah buyurur:', t, K.buyurur, 300, 58, G2);
      cardFlip(t, K.qulum - 0.45, W / 2, 680, 960, 420, () => {
        if (t >= K.qulum) { const k = pop(t, K.qulum, 0.45); tx('«BU, QULUMUNDUR.', 0, -95, `86px ${AN}`, G1, clamp(k), { sc: k, glow: '#ffb030', ls: '3px' }); }
        if (t >= K.verilecek) { const k = pop(t, K.verilecek, 0.45); tx('QULUM NƏ İSTƏSƏ,', 0, 15, `66px ${AN}`, '#fff', clamp(k), { sc: k, ls: '2px' }); tx('ONA VERİLƏCƏK»', 0, 100, `76px ${AN}`, G2, clamp(pop(t, K.verilecek + 0.3, 0.45)), { sc: pop(t, K.verilecek + 0.3, 0.45), glow: '#ffb030', ls: '3px' }); }
      });
      if (t >= K.verilecek + 0.7) tx('✓', 910, 520, `110px ${AN}`, '#7be3a2', pop(t, K.verilecek + 0.7, 0.4), { glow: '#7be3a2' });
      sourceTag('Səhih Müslim, 395 (hədisi-qüdsi)', t, K.verilecek + 0.5, 935);
      if (t >= K.qulum) particlesUp(t, W / 2, 1500, 800, 40, '255,214,140', R(t, K.qulum, K.qulum + 1));
    }
  },

  serh(t, a) {
    brandBg(t);
    const k = pop(t, a + 0.05, 0.45); if (k > 0) drawIcon('💬', W / 2, 400, 190, clamp(k), G1, k * (1 + 0.04 * Math.sin(t * 4)));
    bigText('SƏNİ YOLDAN', t, K.yoldan, 640, 110, '#fff');
    bigText('ÇIXARAN NƏDİR?', t, K.yoldan + 0.4, 790, 118, G1);
    for (let i = 0; i < 5; i++) {
      const t0 = K.yoldan + 0.7 + i * 0.16; if (t < t0) continue;
      const ang = -Math.PI / 2 + (i - 2) * 0.62, R0 = 330, cx = W / 2 + Math.cos(ang + Math.PI) * 0 + (i - 2) * 200, cy = 1180 + Math.abs(i - 2) * 60 + Math.sin(t * 2 + i) * 14;
      popSprite(`ikon_${i + 1}`, t, t0, cx, cy, 170);
    }
    typeText('Şərhdə bir sözlə yaz', W / 2, 1480, `60px ${MO}`, '#fff', t, K.bir_sozle, 20);
    if (t >= K.bir_sozle + 1.0) { const p = 0.7 + 0.3 * Math.sin(t * 6); tx('👇', W / 2, 1620 + 12 * Math.sin(t * 5), `110px "Noto Color Emoji"`, '#fff', p); }
  },

  novbeti(t, a) {
    bgImage('ucyol', t, a, 1.12, 1.0, { dur: 8 });
    sideChip('NÖVBƏTİ BÖLÜM', t, a + 0.4, W / 2, 290, G1, 44);
    bigText('FATİHƏ · 1:7', t, K.son_aye, 440, 110, '#fff');
    if (t >= K.uc_qrup) {
      bigText('3 QRUP İNSAN', t, K.uc_qrup, 600, 96, G1);
      [[220, 1080, RED], [540, 1250, G1], [860, 1060, '#c8d0dc']].forEach(([x, y, c], i) => { const t0 = K.uc_qrup + 0.4 + i * 0.2; if (t < t0) return; const p = 1 + 0.08 * Math.sin(t * 5 + i);
        ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.shadowColor = c; ctx.shadowBlur = 25; ctx.globalAlpha = pop(t, t0, 0.4); ctx.beginPath(); ctx.arc(x, y, 70 * p, 0, 7); ctx.stroke(); ctx.restore();
        tx('?', x, y + 4, `80px ${AN}`, c, pop(t, t0, 0.4)); });
    }
    bigText('SƏN HANSINDASAN?', t, K.hansinda, 1500, 104, '#fff');
  },
};

function watermark(t) {
  const a = 0.7 * (1 - R(t, K.abune - 0.8, K.abune - 0.4)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.save(); ctx.beginPath(); ctx.arc(78, 78, 28, 0, 7); ctx.clip(); ctx.drawImage(logo, 50, 50, 56, 56); ctx.restore();
  ctx.font = `bold 32px ${MO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.fillText('@esgarow', 118, 79);
  ctx.restore();
  tx('AYƏNİN SİRRİ · 5', W - 50, 79, `30px ${AN}`, G1, a * 0.9, { align: 'right', ls: '3px' });
}

const CUTS = SCN.map(s => s[1]).slice(1).filter(c => c !== K.novbeti);
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) {
  lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H);
  const real = ctx; ctx = lctx; ctx.save(); SCENES[key](t, a, b); ctx.restore(); ctx = real;
}
window.renderAt = async function (t) {
  // freeze the comment scene once, for the frame-break transition
  if (!breakReady && t >= K.novbeti - 0.05) { drawScene('serh', K.novbeti - 0.05, K.serh, K.novbeti); const bx = breakC.getContext('2d'); bx.clearRect(0, 0, W, H); bx.drawImage(layer, 0, 0); breakReady = true; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1;
    const pre = key === 'novbeti' ? 0 : 0.35;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = 1 + (i === 0 || !pre ? 0 : 0.08) * (1 - eOut(u));
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = i === 0 || !pre ? 1 : ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  // liquid-glass lens over the three word cards
  if (t > K.ihd + 0.1 && t < K.diqqet - 0.3) {
    const ys = [620, 1010, 1400], seg = t < K.sirat - 0.2 ? 0 : t < K.mustaqim - 0.2 ? 1 : 2;
    const prevY = ys[Math.max(0, seg - 1)], tt = [K.ihd, K.sirat - 0.2, K.mustaqim - 0.2][seg], mv = R(t, tt, tt + 0.6);
    const y = seg === 0 ? lerp(H + 200, ys[0], R(t, K.ihd + 0.1, K.ihd + 0.8, eOut)) : lerp(prevY, ys[seg], mv);
    const leave = R(t, K.diqqet - 1.2, K.diqqet - 0.4), x = 770 + 260 * leave + Math.sin(t * 1.5) * 8, yy = y - 400 * leave * leave;
    lens(x, yy, 170, 1.45, 1 - leave);
  }
  frameBreak(t, K.novbeti);
  for (const c of CUTS) wipe(t, c - 0.2, 0.45);
  watermark(t); endCard(t);
  vignette(0.4); filmGrain(t);
  const f = R(t, TOTAL2 - 0.8, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
