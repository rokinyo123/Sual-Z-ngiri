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

