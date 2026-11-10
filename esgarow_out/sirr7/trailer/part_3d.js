// ---- 3D helpers
// a word flies from deep space to the camera, overshoots and lands
function fly3d(s, t, t0, x, y, size, col = G1, font = AN, opt = {}) {
  const u = (t - t0) / 0.45; if (u <= 0) return 0;
  const z = u >= 1 ? 1 : lerp(0.05, 1, eBack(u));
  const a = clamp(u * 2.5);
  const ry = u >= 1 ? 0 : (1 - eOut(u)) * (opt.spin || 1.2); // rotate around Y while flying in
  ctx.save(); ctx.translate(x, y); ctx.scale(z * Math.max(0.15, Math.cos(ry)), z); ctx.globalAlpha = a * (opt.alpha ?? 1);
  ctx.font = `${size}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = opt.ls || '4px';
  // extruded 3D depth: stacked dark copies, then the face
  for (let d = 8; d > 0; d--) { ctx.fillStyle = `rgba(90,55,10,${0.12 + 0.05 * d})`; ctx.fillText(s, d * 1.6, d * 2.2); }
  ctx.shadowColor = opt.glow || '#ffb030'; ctx.shadowBlur = 40; ctx.fillStyle = col; ctx.fillText(s, 0, 0);
  ctx.restore();
  return a;
}
function starfield3d(t, speed = 1, a = 1, col = '255,236,200') {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 260; i++) {
    const ang = srand(i) * 6.283, r0 = 0.05 + srand(i + 7) * 0.95;
    const z = ((srand(i + 3) - t * 0.12 * speed) % 1 + 1) % 1; // 0 = near, 1 = far
    const k = 1 / (0.08 + z), rr = r0 * 160 * k;
    const x = W / 2 + Math.cos(ang) * rr, y = H / 2 + Math.sin(ang) * rr;
    if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
    const sz = clamp(1.6 * k * 0.3, 0.6, 7);
    ctx.fillStyle = `rgba(${col},${a * clamp((1 - z) * 1.3)})`; ctx.beginPath(); ctx.arc(x, y, sz, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function cardFlip(t, t0, x, y, w, h, drawFront) {
  const u = clamp((t - t0) / 0.55); if (u <= 0) return;
  const ang = (1 - eOut(u)) * Math.PI * 0.5, sx = Math.cos(ang);
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1 - 0.08 * (1 - sx));
  ctx.fillStyle = 'rgba(20,14,6,0.86)'; rrect(-w / 2, -h / 2, w, h, 28); ctx.fill();
  ctx.strokeStyle = G1; ctx.lineWidth = 4; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.stroke(); ctx.shadowBlur = 0;
  drawFront(); ctx.restore();
}
function lightBeam(x, a = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(x - 160, 0, x + 160, 0);
  g.addColorStop(0, 'rgba(255,214,150,0)'); g.addColorStop(0.5, `rgba(255,214,150,${0.35 * a})`); g.addColorStop(1, 'rgba(255,214,150,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 60, 0); ctx.lineTo(x + 60, 0); ctx.lineTo(x + 220, H); ctx.lineTo(x - 220, H); ctx.fill(); ctx.restore();
}
function leaf(x, y, s, rot, col = '#6fcf5a') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -120); ctx.quadraticCurveTo(90, -30, 0, 120); ctx.quadraticCurveTo(-90, -30, 0, -120); ctx.fill();
  ctx.strokeStyle = 'rgba(20,70,20,0.7)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(0, 115); ctx.stroke();
  for (let i = -3; i <= 3; i++) { ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, i * 28); ctx.lineTo(Math.sign(i || 1) * 45, i * 28 - 28); ctx.stroke(); }
  ctx.restore();
}
function drop(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const g = ctx.createRadialGradient(-20, 10, 5, 0, 20, 90); g.addColorStop(0, '#e9f7ff'); g.addColorStop(0.5, '#6fc3ff'); g.addColorStop(1, '#1b5fa8');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -110); ctx.bezierCurveTo(60, -20, 80, 40, 0, 80); ctx.bezierCurveTo(-80, 40, -60, -20, 0, -110); ctx.fill(); ctx.restore();
}
function wateringCan(x, y, s, tilt) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s); ctx.fillStyle = '#9aa7b3';
  rrect(-90, -60, 180, 130, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(80, -30); ctx.lineTo(220, -110); ctx.lineTo(230, -95); ctx.lineTo(90, 0); ctx.fill();
  ctx.strokeStyle = '#9aa7b3'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(-40, -60, 55, Math.PI, 0); ctx.stroke(); ctx.restore();
}
function rainFrom(t, x, y, n, a = 1) {
  ctx.save(); ctx.strokeStyle = `rgba(150,210,255,${0.8 * a})`; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const ph = (t * 2 + srand(i)) % 1, px = x + (srand(i + 3) - 0.5) * 60 + ph * 40, py = y + ph * 380; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 4, py + 24); ctx.stroke(); }
  ctx.restore();
}

