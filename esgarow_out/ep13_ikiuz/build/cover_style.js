// "Hz. Adəmin inanılmaz həyatı" cover style: red tick + small label, huge condensed white title,
// red bar + white boxes with black text, dramatic hero object with gold light and embers below.
function coverStyle(o) {
  const t = 40, A = (s, x, y, size, col, al = 'left') => { ctx.save(); ctx.font = `${size}px ${AN}`; ctx.textAlign = al; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '2px'; ctx.fillStyle = col; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 18; ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w; };
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = '#050403'; ctx.fillRect(0, 0, W, H);
  if (o.bg) { ctx.save(); ctx.globalAlpha = 0.45; ctx.filter = 'blur(6px) brightness(0.55)'; cover(o.bg, t, 0, 1.1, 1.1, { dur: 1 }); ctx.restore(); }
  const g0 = ctx.createLinearGradient(0, 0, 0, H); g0.addColorStop(0, 'rgba(5,4,3,0.95)'); g0.addColorStop(0.42, 'rgba(5,4,3,0.55)'); g0.addColorStop(1, 'rgba(5,4,3,0.9)'); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
  // hero light + rays + embers
  const hx = o.hx ?? 560, hy = o.hy ?? 1250;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) { const an = -Math.PI / 2 + (i - 4) * 0.2; ctx.strokeStyle = 'rgba(255,170,60,0.07)'; ctx.lineWidth = 110; ctx.beginPath(); ctx.moveTo(hx, hy + 120); ctx.lineTo(hx + Math.cos(an) * 1300, hy + 120 + Math.sin(an) * 1300); ctx.stroke(); }
  glow(hx, hy, 620, 'rgba(255,150,40,A)', 0.55); glow(hx, hy - 40, 260, 'rgba(255,230,170,A)', 0.55);
  for (let i = 0; i < 90; i++) { const x = srand(i * 3) * W, y = 860 + srand(i * 7 + 1) * 980, r = 1.2 + srand(i + 4) * 2.8, a = 0.45 + srand(i + 9) * 0.55; glow(x, y, r * 7, 'rgba(255,120,30,A)', a * 0.5); ctx.fillStyle = `rgba(255,${190 + Math.round(srand(i) * 60)},120,${a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  ctx.restore();
  if (o.hero) o.hero(hx, hy);
  // label
  ctx.fillStyle = '#e1251b'; ctx.fillRect(70, 268, 130, 16); A(o.label, 222, 290, 64, '#fff');
  // title (auto-fit to width)
  let ts = o.titleSize || 220; ctx.save(); ctx.font = `${ts}px ${AN}`; ctx.letterSpacing = '2px'; while (ctx.measureText(o.title).width > W - 140 && ts > 120) { ts -= 6; ctx.font = `${ts}px ${AN}`; } ctx.restore();
  const tb = 340 + ts * 0.9; A(o.title, 70, tb, ts, '#fff');
  // red bar + white boxes
  let y = tb + 40; const bs = o.boxSize || 120;
  ctx.fillStyle = '#e1251b'; ctx.fillRect(70, y, 16, (bs * 1.18 + 22) * o.boxes.length - 22);
  o.boxes.forEach(s => { ctx.save(); ctx.font = `${bs}px ${AN}`; ctx.letterSpacing = '2px'; const w = ctx.measureText(s).width; ctx.restore(); ctx.fillStyle = '#fff'; ctx.fillRect(108, y, w + 44, bs * 1.18); A(s, 130, y + bs * 1.0, bs, '#0b0b0b'); y += bs * 1.18 + 22; });
  vignette(0.35);
  return cv.toDataURL('image/jpeg', 0.95);
}
