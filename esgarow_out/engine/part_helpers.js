// "Ayənin sirri" — 2: Əlhəmdulillah (explainer / kinetic, 30 photos, graphic transitions)
const AN = '"Anton"', CV = '"Caveat"', MO = '"Montserrat"', AR = '"Amiri"';
const E = i => TL['s' + i];
const G1 = '#f6c768', G2 = '#ffe2a0', INK = '#07060b';

// ---------- assets ----------
const IMG = {}; let pending = 0;

['Anton', 'Caveat', 'Montserrat', 'Amiri'].forEach(n => {
  pending++; new FontFace(n, `url(fonts/${n}.ttf)`).load().then(f => { document.fonts.add(f); pending--; }).catch(() => pending--);
});
const logo = new Image(); pending++; logo.onload = () => pending--; logo.src = 'logo.png';

// ---------- emoji icons, tinted gold ----------
const ICON = {};
function icon(e, size, col = G1) {
  const key = e + size + col; if (ICON[key]) return ICON[key];
  const c = document.createElement('canvas'); c.width = c.height = size * 1.4; const g = c.getContext('2d');
  g.font = `${size}px "Noto Color Emoji"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, c.width / 2, c.height / 2 + size * 0.05);
  const m = document.createElement('canvas'); m.width = m.height = c.width; m.getContext('2d').drawImage(c, 0, 0);
  g.filter = 'grayscale(1) contrast(1.4) brightness(1.25)'; g.clearRect(0, 0, c.width, c.height); g.drawImage(m, 0, 0); g.filter = 'none';
  g.globalCompositeOperation = 'multiply'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0);
  return (ICON[key] = c);
}
function drawIcon(e, x, y, size, a = 1, col = G1, sc = 1) {
  if (a <= 0) return; const c = icon(e, size, col);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.shadowColor = col; ctx.shadowBlur = 25; ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore();
}

// ---------- motion helpers ----------
const pop = (t, t0, d = 0.35) => { const u = clamp((t - t0) / d); return u <= 0 ? 0 : eBack(u); };
function tx(s, x, y, font, col, a = 1, opt = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  if (opt.sc) ctx.scale(opt.sc, opt.sc); if (opt.rot) ctx.rotate(opt.rot);
  ctx.font = font; ctx.textAlign = opt.align || 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = opt.ls || '0px';
  if (opt.glow) { ctx.shadowColor = opt.glow; ctx.shadowBlur = opt.blur || 25; }
  if (opt.stroke) { ctx.lineWidth = opt.sw || 6; ctx.strokeStyle = opt.stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = col; ctx.fillText(s, 0, 0); ctx.restore();
}
function drawTitle(s, x, y, size, t, t0, col = G2) {
  const u = clamp((t - t0) / 0.6); if (u <= 0) return;
  ctx.save(); ctx.font = `${size}px ${AN}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '6px';
  const w = ctx.measureText(s).width;
  ctx.setLineDash([w * 3, w * 3]); ctx.lineDashOffset = w * 3 * (1 - u); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.strokeText(s, x, y);
  ctx.setLineDash([]); const f = clamp((t - t0 - 0.45) / 0.3);
  ctx.globalAlpha = f; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = col; ctx.fillText(s, x, y);
  ctx.restore();
}
function riseText(s, x, y, font, col, t, t0, step = 0.04, opt = {}) {
  ctx.save(); ctx.font = font; ctx.letterSpacing = opt.ls || '0px';
  const w = ctx.measureText(s).width; let cx = x - w / 2; ctx.restore();
  [...s].forEach((ch, i) => {
    ctx.save(); ctx.font = font; ctx.letterSpacing = opt.ls || '0px'; const cw = ctx.measureText(ch).width; ctx.restore();
    const u = clamp((t - t0 - i * step) / 0.3);
    if (u > 0) tx(ch, cx + cw / 2, y + 40 * (1 - eOut(u)), font, col, u, { glow: opt.glow, blur: 20 });
    cx += cw;
  });
}
function typeText(s, x, y, font, col, t, t0, cps = 28, opt = {}) {
  const n = Math.floor(clamp((t - t0) * cps, 0, s.length)); if (n <= 0) return;
  tx(s.slice(0, n) + (n < s.length && Math.sin(t * 20) > 0 ? '|' : ''), x, y, font, col, 1, opt);
}
function glitch(t, t0, d = 0.5) { const u = (t - t0) / d; return u > 0 && u < 1 ? (srand(Math.floor(t * 40)) - 0.5) * 30 * (1 - u) : 0; }
function chip(s, x, y, t, t0, col = G1, fill = 'rgba(246,199,104,0.12)', size = 40) {
  const k = pop(t, t0); if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.font = `${size}px ${AN}`; ctx.letterSpacing = '3px';
  const w = ctx.measureText(s).width + 70; ctx.fillStyle = fill; rrect(-w / 2, -size * 0.9, w, size * 1.8, size * 0.9); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  tx(s, x, y + 2, `${size}px ${AN}`, col, clamp(k), { sc: k, ls: '3px' });
}
function card(x, y, w, h, t, t0, title) {
  const k = pop(t, t0, 0.45); if (k <= 0) return 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = 'rgba(20,14,6,0.78)'; rrect(-w / 2, -h / 2, w, h, 26); ctx.fill();
  ctx.strokeStyle = 'rgba(246,199,104,0.8)'; ctx.lineWidth = 3; ctx.stroke();
  if (title) { ctx.font = `34px ${CV}`; ctx.fillStyle = G2; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(title, -w / 2 + 30, -h / 2 + 40);
    ctx.strokeStyle = 'rgba(246,199,104,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2 + 30, -h / 2 + 70); ctx.lineTo(w / 2 - 30, -h / 2 + 70); ctx.stroke(); }
  ctx.restore(); return k;
}
function brandBg(t) {
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, H * 0.35, 0, H); g.addColorStop(0, 'rgba(160,100,20,0)'); g.addColorStop(1, 'rgba(200,130,30,0.55)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.strokeStyle = 'rgba(246,199,104,0.07)'; ctx.lineWidth = 1.5;
  const off = (t * 12) % 60;
  for (let x = -60 + off; x < W + 60; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = -60 + off; y < H + 60; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  drawDust(t, 0.5);
}
// Ken-Burns photo with a gradient so text stays readable
function photo(k, t, a, b, z0, z1, ax = W / 2, ay = H / 2, dark = 0.3, rot = 0) {
  const u = ease((t - a) / Math.max(0.01, b - a)), z = lerp(z0, z1, u);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rot * (u - 0.5)); ctx.scale(z, z); ctx.translate(-ax, -ay);
  ctx.drawImage(IMG[k], 0, 0, W, H); ctx.restore();
  ctx.fillStyle = `rgba(0,0,0,${dark})`; ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, H * 0.55, 0, H); g.addColorStop(0, 'rgba(7,6,11,0)'); g.addColorStop(1, 'rgba(7,6,11,0.9)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createLinearGradient(0, 0, 0, 500); g2.addColorStop(0, 'rgba(7,6,11,0.7)'); g2.addColorStop(1, 'rgba(7,6,11,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, 500);
}
function lightLeak(t, a = 0.25) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glow(W * (0.5 + 0.45 * Math.sin(t * 0.4)), H * 0.2, 700, 'rgba(255,170,80,A)', a); ctx.restore();
}
function arabic(s, x, y, size, t, t0, d = 1.4, col = G1) {
  const u = clamp((t - t0) / d); if (u <= 0) return;
  ctx.save(); ctx.font = `bold ${size}px ${AR}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(s).width + 40;
  ctx.beginPath(); ctx.rect(x + w / 2 - w * eOut(u), y - size, w * eOut(u), size * 2); ctx.clip();
  ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 35; ctx.fillStyle = col; ctx.fillText(s, x, y);
  ctx.restore();
  if (u < 1) { const sx = x + w / 2 - w * eOut(u); ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(sx, y, size * 1.2, 'rgba(255,230,160,A)', 0.8); ctx.restore(); }
}
// graphic wipe: a gold bar sweeps across at a cut
function wipe(t, t0, d = 0.4) {
  const u = (t - t0) / d; if (u <= 0 || u >= 1) return;
  const x = lerp(-200, W + 200, eOut(u));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(x - 220, 0, x + 40, 0);
  g.addColorStop(0, 'rgba(255,200,110,0)'); g.addColorStop(0.8, 'rgba(255,200,110,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0.9)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// full chapter card: sirr number + word
function sirrCard(t, t0, n, word, bgKey) {
  if (bgKey) photo(bgKey, t, t0 - 0.5, t0 + 3, 1.15, 1.05, 540, 960, 0.6); else brandBg(t);
  tx(word, W / 2, 760, `78px ${CV}`, G2, R(t, t0, t0 + 0.4), { rot: -0.06, glow: '#ffb030' });
  drawTitle('SİRR', W / 2 - 70, 930, 230, t, t0 + 0.05);
  const k = pop(t, t0 + 0.35, 0.4);
  tx('#' + n, W / 2 + 250, 930, `230px ${AN}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 40 });
}

