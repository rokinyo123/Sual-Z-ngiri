// ================= drawn elements =================
function person(x, y, s, col = '#0a0d18') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, -330, 62, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-58, -265); ctx.quadraticCurveTo(-120, -250, -118, -120); ctx.lineTo(-104, 40); ctx.lineTo(-70, 40); ctx.lineTo(-62, 380); ctx.lineTo(-8, 380); ctx.lineTo(0, 60);
  ctx.lineTo(8, 380); ctx.lineTo(62, 380); ctx.lineTo(70, 40); ctx.lineTo(104, 40); ctx.lineTo(118, -120); ctx.quadraticCurveTo(120, -250, 58, -265); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function galaxy(t, x, y, r, a = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot + t * 0.05); ctx.globalCompositeOperation = 'lighter';
  glow(0, 0, r * 0.5, 'rgba(255,220,160,A)', 0.6 * a);
  for (let i = 0; i < 900; i++) {
    const arm = i % 3, u = srand(i * 1.3), d = Math.pow(u, 0.6) * r, ang = arm * 2.094 + d / r * 5.5 + (srand(i * 7.1) - 0.5) * 0.6;
    const px = Math.cos(ang) * d, py = Math.sin(ang) * d * 0.55;
    ctx.fillStyle = `rgba(${200 + 55 * srand(i)},${190 + 40 * srand(i + 1)},255,${a * (0.25 + 0.6 * srand(i + 2)) * (1 - u * 0.6)})`;
    ctx.fillRect(px, py, 2.2, 2.2);
  }
  ctx.restore();
}
function planet(x, y, r, c1, c2, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.restore();
}
function earth(x, y, r, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  glow(x, y, r * 1.5, 'rgba(90,160,255,A)', 0.35);
  const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, '#5fb0ff'); g.addColorStop(0.7, '#1c4f9c'); g.addColorStop(1, '#0a1f45');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ctx.fillStyle = 'rgba(80,170,90,0.85)';
  for (let i = 0; i < 7; i++) { const cx = x + ((srand(i) * 2 - 1) * r + t * 30 * r / 200) % (2 * r) - 0, cy = y + (srand(i + 5) - 0.5) * r * 1.4;
    ctx.beginPath(); ctx.ellipse(cx, cy, r * (0.15 + 0.2 * srand(i + 2)), r * (0.1 + 0.12 * srand(i + 3)), srand(i) * 3, 0, 7); ctx.fill(); }
  ctx.restore(); ctx.restore();
}
function clockFace(t, x, y, r, spin = 1, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.strokeStyle = G1; ctx.lineWidth = 8; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  ctx.shadowBlur = 0;
  for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; ctx.lineWidth = i % 3 ? 3 : 7; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r * 0.82, Math.sin(an) * r * 0.82); ctx.lineTo(Math.cos(an) * r * 0.93, Math.sin(an) * r * 0.93); ctx.stroke(); }
  const h = t * 0.6 * spin, m = t * 7 * spin;
  ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(h - 1.57) * r * 0.5, Math.sin(h - 1.57) * r * 0.5); ctx.stroke();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(m - 1.57) * r * 0.78, Math.sin(m - 1.57) * r * 0.78); ctx.stroke();
  ctx.fillStyle = G1; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fill();
  ctx.restore();
}
function giftBox(x, y, s, open = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#b8323a'; rrect(-120, -40, 240, 170, 14); ctx.fill();
  ctx.fillStyle = G1; ctx.fillRect(-18, -40, 36, 170);
  ctx.save(); ctx.translate(0, -40 - 120 * open); ctx.rotate(-0.5 * open);
  ctx.fillStyle = '#d23d46'; rrect(-135, -45, 270, 50, 10); ctx.fill(); ctx.fillStyle = G1; ctx.fillRect(-18, -45, 36, 50);
  ctx.strokeStyle = G1; ctx.lineWidth = 14; ctx.beginPath(); ctx.ellipse(-40, -60, 40, 22, -0.4, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(40, -60, 40, 22, 0.4, 0, 7); ctx.stroke();
  ctx.restore(); ctx.restore();
}
function sprout(t, x, y, p, a = 1) { // p 0..1 growth: seed -> sprout -> tree
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.fillStyle = '#3a2614'; ctx.beginPath(); ctx.ellipse(0, 20, 330, 60, 0, 0, 7); ctx.fill();
  if (p < 0.1) { ctx.fillStyle = '#c9a26b'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 14, 0.3, 0, 7); ctx.fill(); ctx.restore(); return; }
  const h = 650 * ease((p - 0.1) / 0.9), sw = Math.sin(t * 1.5) * 8 * p;
  ctx.strokeStyle = '#6b4a2a'; ctx.lineCap = 'round'; ctx.lineWidth = 8 + 40 * p;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sw, -h * 0.5, sw * 2, -h); ctx.stroke();
  // branches + leaves appear with growth
  const nb = Math.floor(10 * p);
  for (let i = 0; i < nb; i++) {
    const by = -h * (0.35 + 0.6 * i / 10), side = i % 2 ? 1 : -1, len = (80 + 140 * p) * (1 - i / 14);
    ctx.lineWidth = 4 + 12 * p * (1 - i / 10);
    ctx.beginPath(); ctx.moveTo(sw * (1 - by / -h), by); ctx.lineTo(side * len + sw, by - len * 0.5); ctx.stroke();
    for (let k = 0; k < 6; k++) {
      const lx = side * len * (0.4 + k * 0.12) + sw, ly = by - len * 0.5 * (0.4 + k * 0.12) + Math.sin(t * 2 + k + i) * 4;
      ctx.fillStyle = `rgba(${70 + 30 * srand(i * 9 + k)},${150 + 60 * srand(i + k)},70,0.95)`;
      ctx.beginPath(); ctx.ellipse(lx, ly, 26 * p + 6, 13 * p + 3, side * 0.6 + srand(k) , 0, 7); ctx.fill();
    }
  }
  if (p < 0.5) { ctx.fillStyle = '#5fbf5a'; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.ellipse(sd * 30 + sw * 2, -h + 6, 34, 16, sd * 0.5, 0, 7); ctx.fill(); }); }
  ctx.restore();
}
function cells(t, x, y, n, r, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.globalCompositeOperation = 'lighter';
  const pts = []; const ring = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) { const an = i * 2.399, d = Math.sqrt(i) * r * 0.95; pts.push([Math.cos(an) * d, Math.sin(an) * d]); }
  pts.forEach(([px, py], i) => {
    const wob = 1 + 0.05 * Math.sin(t * 3 + i);
    const g = ctx.createRadialGradient(px, py, 0, px, py, r * wob);
    g.addColorStop(0, 'rgba(255,220,200,0.9)'); g.addColorStop(0.6, 'rgba(255,140,120,0.45)'); g.addColorStop(1, 'rgba(255,120,100,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r * wob, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,220,0.8)'; ctx.beginPath(); ctx.arc(px, py, r * 0.22, 0, 7); ctx.fill();
  });
  ctx.restore();
}
function fetus(x, y, s, t, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(0.15 + 0.03 * Math.sin(t * 0.8)); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(-30, -60, 10, 0, 0, 260);
  g.addColorStop(0, 'rgba(255,205,180,0.95)'); g.addColorStop(1, 'rgba(220,120,110,0.75)');
  ctx.fillStyle = g; ctx.shadowColor = 'rgba(255,160,140,0.8)'; ctx.shadowBlur = 40;
  ctx.beginPath(); ctx.arc(-20, -120, 110, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(20, 60, 120, 165, -0.35, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-40, 170, 120, 55, 0.5, 0, 7); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,195,170,0.95)'; ctx.lineWidth = 44;
  ctx.beginPath(); ctx.moveTo(30, -10); ctx.quadraticCurveTo(-60, 30, -95, -40); ctx.stroke();
  ctx.beginPath(); ctx.arc(-100, -50, 30, 0, 7); ctx.fillStyle = 'rgba(255,215,190,1)'; ctx.fill();
  ctx.restore();
}
function womb(t, x, y, r, a = 1) {
  const hb = Math.pow(Math.max(0, Math.sin(t * 7.3)), 10);
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x, y, 30, x, y, r * 1.6); g.addColorStop(0, '#5a1a1e'); g.addColorStop(1, 'rgba(12,3,7,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  glow(x, y, r * 1.5, 'rgba(255,90,80,A)', 0.15 + 0.15 * hb);
  ctx.strokeStyle = 'rgba(255,170,150,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  ctx.restore();
}
function scaleDraw(x, y, s, tilt, fillL, fillR, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = G1; ctx.fillStyle = G1; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 260); ctx.lineTo(0, -200); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-120, 270); ctx.lineTo(120, 270); ctx.stroke();
  ctx.save(); ctx.translate(0, -200); ctx.rotate(tilt);
  ctx.beginPath(); ctx.moveTo(-300, 0); ctx.lineTo(300, 0); ctx.stroke();
  [[-300, fillL], [300, fillR]].forEach(([px, f]) => {
    ctx.save(); ctx.translate(px, 0); ctx.rotate(-tilt);
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, 200); ctx.moveTo(0, 0); ctx.lineTo(90, 200); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-110, 200); ctx.quadraticCurveTo(0, 290, 110, 200); ctx.closePath(); ctx.fillStyle = 'rgba(246,199,104,0.25)'; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
    if (f > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(0, 215, 120 * f + 20, 'rgba(255,210,120,A)', 0.8 * f);
      for (let i = 0; i < 40 * f; i++) { ctx.fillStyle = 'rgba(255,230,160,0.9)'; ctx.beginPath(); ctx.arc((srand(i) - 0.5) * 170, 215 - srand(i + 3) * 40 * f, 4, 0, 7); ctx.fill(); }
      ctx.restore(); }
    ctx.restore();
  });
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, -200, 18, 0, 7); ctx.fill();
  ctx.restore();
}
function candle(x, y, s, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  const fl = 1 + 0.12 * Math.sin(t * 19) * Math.sin(t * 7.1);
  glow(0, -170, 380 * fl, 'rgba(255,170,80,A)', 0.35);
  ctx.fillStyle = '#efe2c8'; rrect(-40, -120, 80, 260, 10); ctx.fill();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(0, -145); ctx.stroke();
  ctx.save(); ctx.translate(0, -175); ctx.scale(1, fl);
  const g = ctx.createRadialGradient(0, 10, 2, 0, 0, 45); g.addColorStop(0, '#fff8d8'); g.addColorStop(0.5, '#ffc04a'); g.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -45); ctx.quadraticCurveTo(28, 0, 0, 30); ctx.quadraticCurveTo(-28, 0, 0, -45); ctx.fill();
  ctx.restore(); ctx.restore();
}
function sunrise(t, p, a = 1) { // p 0..1 rising
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, lerpCol('#0b1336', '#2b4a7a', p)); g.addColorStop(0.5, lerpCol('#3a1e3c', '#f4b26b', p)); g.addColorStop(1, '#120a08');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sy = lerp(1350, 950, p);
  glow(W / 2, sy, 800, 'rgba(255,200,120,A)', 0.8 * p);
  ctx.fillStyle = '#fff1c4'; ctx.beginPath(); ctx.arc(W / 2, sy, 110, 0, 7); ctx.fill();
  ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.moveTo(0, 1250); ctx.quadraticCurveTo(300, 1120, 600, 1220); ctx.quadraticCurveTo(850, 1290, W, 1180); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = '#0c0807'; ctx.beginPath(); ctx.moveTo(0, 1400); ctx.quadraticCurveTo(500, 1330, W, 1430); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.restore();
}
function lerpCol(a, b, u) {
  const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(u)))).join(',')})`;
}
function particlesUp(t, x, y, w, n, col = '255,214,140', a = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const ph = ((t * 0.25 + srand(i)) % 1), px = x + (srand(i + 4) - 0.5) * w, py = y - ph * 900;
    ctx.fillStyle = `rgba(${col},${a * (1 - ph) * 0.8})`; ctx.beginPath(); ctx.arc(px, py, 3 + 3 * srand(i + 9), 0, 7); ctx.fill(); }
  ctx.restore();
}
function shock(t, t0, x, y, col = '255,210,130') {
  const u = (t - t0) / 0.7; if (u <= 0 || u >= 1) return;
  ctx.save(); ctx.strokeStyle = `rgba(${col},${1 - u})`; ctx.lineWidth = 18 * (1 - u) + 2; ctx.beginPath(); ctx.arc(x, y, 60 + 700 * eOut(u), 0, 7); ctx.stroke(); ctx.restore();
}
function deepBg(t) { // cosmic brand background
  const g = ctx.createRadialGradient(W / 2, 800, 50, W / 2, 900, 1400); g.addColorStop(0, '#1a1426'); g.addColorStop(1, '#040308');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); drawStars(t, 0.7);
}

