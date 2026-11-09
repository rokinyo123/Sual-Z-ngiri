// heart, ECG and lungs drawing (shared with "Qəbz")
function heartPath(s) {
  const p = new Path2D();
  p.moveTo(0, 0.35 * s);
  p.bezierCurveTo(-0.55 * s, -0.05 * s, -0.5 * s, -0.55 * s, -0.25 * s, -0.55 * s);
  p.bezierCurveTo(-0.08 * s, -0.55 * s, 0, -0.42 * s, 0, -0.32 * s);
  p.bezierCurveTo(0, -0.42 * s, 0.08 * s, -0.55 * s, 0.25 * s, -0.55 * s);
  p.bezierCurveTo(0.5 * s, -0.55 * s, 0.55 * s, -0.05 * s, 0, 0.35 * s);
  return p;
}
function beat(t, bpm = 72) { // lub-dub envelope 0..1
  const ph = (t * bpm / 60) % 1;
  return Math.exp(-Math.pow((ph - 0.05) / 0.045, 2)) + 0.6 * Math.exp(-Math.pow((ph - 0.25) / 0.045, 2));
}
function drawHeart(x, y, s, t, gold = false) {
  const b = beat(t);
  const sc = 1 + 0.09 * b;
  glow(x, y, s * 1.3, gold ? 'rgba(255,200,110,A)' : 'rgba(255,60,80,A)', 0.35 + 0.35 * b);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const p = heartPath(s);
  const g = ctx.createRadialGradient(-0.15 * s, -0.25 * s, 0, 0, 0, 0.7 * s);
  if (gold) { g.addColorStop(0, '#fff1c4'); g.addColorStop(0.5, '#f6c768'); g.addColorStop(1, '#b8792a'); }
  else { g.addColorStop(0, '#ff8a92'); g.addColorStop(0.45, '#e8283d'); g.addColorStop(1, '#8a0f22'); }
  ctx.shadowColor = gold ? '#ffcf70' : '#ff2a48'; ctx.shadowBlur = 40 + 30 * b;
  ctx.fillStyle = g; ctx.fill(p);
  ctx.shadowBlur = 0; ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-0.24 * s, -0.33 * s, 0.09 * s, 0.05 * s, -0.6, 0, 7); ctx.fill();
  ctx.restore();
}
function ecg(x0, y0, w, h, t, col = '#ff5a6e', speed = 1) {
  // scrolling ECG trace with glowing head
  const N = 220, period = 0.8333;
  const f = u => { // u in beats
    const p = ((u % 1) + 1) % 1;
    if (p < 0.06) return 0.12 * Math.sin(p / 0.06 * Math.PI);
    if (p > 0.12 && p < 0.14) return -0.15 * ((p - 0.12) / 0.02);
    if (p >= 0.14 && p < 0.17) return lerp(-0.15, 1, (p - 0.14) / 0.03);
    if (p >= 0.17 && p < 0.2) return lerp(1, -0.35, (p - 0.17) / 0.03);
    if (p >= 0.2 && p < 0.23) return lerp(-0.35, 0, (p - 0.2) / 0.03);
    if (p > 0.36 && p < 0.52) return 0.22 * Math.sin((p - 0.36) / 0.16 * Math.PI);
    return 0;
  };
  const head = (t * speed / period) % 1; // sweep position
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const u = i / N; const beatU = t * speed / period - (head - u) * 1.6;
      const yy = y0 - f(beatU) * h;
      i ? ctx.lineTo(x0 + u * w, yy) : ctx.moveTo(x0 + u * w, yy);
    }
    ctx.strokeStyle = col; ctx.lineWidth = pass ? 4 : 10; ctx.globalAlpha = pass ? 1 : 0.25;
    ctx.shadowColor = col; ctx.shadowBlur = pass ? 18 : 30; ctx.stroke();
  }
  // fade trail mask
  const g = ctx.createLinearGradient(x0, 0, x0 + w, 0);
  const hx = head; g.addColorStop(0, 'rgba(0,0,0,0)');
  ctx.restore();
  const hy = y0 - f(t * speed / period) * h;
  glow(x0 + head * w, hy, 40, 'rgba(255,255,255,A)', 0.9);
}
function lungs(x, y, s, t) {
  const br = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI / 3.6 - 1.2); // breathe cycle
  const sc = 0.9 + 0.12 * br;
  glow(x, y, s * 1.2, 'rgba(110,200,255,A)', 0.2 + 0.25 * br);
  ctx.save(); ctx.translate(x, y);
  // trachea
  ctx.strokeStyle = '#bfe8ff'; ctx.lineWidth = 0.07 * s; ctx.lineCap = 'round'; ctx.shadowColor = '#7fd4ff'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(0, -0.62 * s); ctx.lineTo(0, -0.18 * s); ctx.stroke();
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.scale(sx * sc, sc);
    const p = new Path2D();
    p.moveTo(0.08 * s, -0.3 * s);
    p.bezierCurveTo(0.35 * s, -0.55 * s, 0.6 * s, -0.2 * s, 0.6 * s, 0.25 * s);
    p.bezierCurveTo(0.6 * s, 0.55 * s, 0.35 * s, 0.6 * s, 0.15 * s, 0.45 * s);
    p.bezierCurveTo(0.07 * s, 0.35 * s, 0.08 * s, 0.0, 0.08 * s, -0.3 * s);
    const g = ctx.createLinearGradient(0, -0.5 * s, 0.6 * s, 0.6 * s);
    g.addColorStop(0, '#9fe0ff'); g.addColorStop(1, '#2f7fd6');
    ctx.globalAlpha = 0.85; ctx.fillStyle = g; ctx.shadowColor = '#5fc0ff'; ctx.shadowBlur = 30; ctx.fill(p);
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(230,248,255,0.9)'; ctx.lineWidth = 0.025 * s;
    // bronchi tree
    ctx.beginPath(); ctx.moveTo(0, -0.18 * s); ctx.quadraticCurveTo(0.15 * s, -0.1 * s, 0.28 * s, 0.05 * s);
    ctx.moveTo(0.2 * s, -0.03 * s); ctx.quadraticCurveTo(0.35 * s, -0.15 * s, 0.42 * s, -0.12 * s);
    ctx.moveTo(0.28 * s, 0.05 * s); ctx.lineTo(0.42 * s, 0.25 * s); ctx.moveTo(0.28 * s, 0.05 * s); ctx.lineTo(0.25 * s, 0.32 * s);
    ctx.moveTo(0.36 * s, 0.15 * s); ctx.lineTo(0.5 * s, 0.12 * s); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  // air particles flowing in/out
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const inhale = Math.cos(t * 2 * Math.PI / 3.6 - 1.2) > 0 ? 1 : -1;
  for (let i = 0; i < 26; i++) {
    const ph = ((t * 0.5 * inhale + i / 26) % 1 + 1) % 1;
    const px = x + Math.sin(i * 2.3) * 0.12 * s * (1 - ph), py = y - 1.15 * s + ph * 0.6 * s;
    ctx.globalAlpha = 0.6 * Math.sin(ph * Math.PI); ctx.fillStyle = '#d8f3ff';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill();
  }
  ctx.restore();
}
