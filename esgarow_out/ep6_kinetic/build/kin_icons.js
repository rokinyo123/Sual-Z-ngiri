// Code-drawn "3D cut-out" props for the kinetic format: soft studio shading + contact shadow.
// Every icon is drawn around (0,0) in a box of about ±100, then scaled by s/200.
function shadowBlob(x, y, w, a = 0.22) {
  ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, w); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.translate(x, y); ctx.scale(1, 0.18); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, w, 0, 7); ctx.fill(); ctx.restore();
}
function lg(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rg(x, y, r0, r1, stops, x1 = x, y1 = y) { const g = ctx.createRadialGradient(x, y, r0, x1, y1, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
// pose wrapper: pop-in with back-ease + idle float + slight tilt, shadow stays on the floor
function prop(draw, t, t0, x, y, s, opt = {}) {
  const k = pop(t, t0, opt.d || 0.5); if (k <= 0) return 0;
  const bob = Math.sin((t - t0) * 2.2 + (opt.ph || 0)) * 10 * (opt.float ?? 1), rot = Math.sin((t - t0) * 1.6 + (opt.ph || 0)) * 0.04 * (opt.float ?? 1) + (opt.rot || 0);
  const a = clamp(k * 2) * (opt.alpha ?? 1);
  if (opt.shadow !== false) { ctx.save(); ctx.globalAlpha *= a; shadowBlob(x, y + s * 0.55, s * 0.42 * (1 - bob / 160), opt.dark ? 0.6 : 0.24); ctx.restore(); }
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + bob); ctx.rotate(rot); ctx.scale(k * s / 200, k * s / 200); draw(t - t0); ctx.restore();
  return k;
}

// ---- open Quran ----
function icBook(u) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18;
  // cover
  ctx.fillStyle = lg(0, -70, 0, 80, [[0, '#0f6b4a'], [1, '#063a28']]);
  ctx.beginPath(); ctx.moveTo(-118, -58); ctx.quadraticCurveTo(-60, -78, 0, -58); ctx.quadraticCurveTo(60, -78, 118, -58); ctx.lineTo(122, 74); ctx.quadraticCurveTo(60, 58, 0, 80); ctx.quadraticCurveTo(-60, 58, -122, 74); ctx.closePath(); ctx.fill(); ctx.restore();
  // pages (left / right), curved
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.scale(sd, 1);
    ctx.fillStyle = lg(0, 0, 110, 0, [[0, '#d9cfb4'], [0.15, '#fbf6e8'], [1, '#efe5cc']]);
    ctx.beginPath(); ctx.moveTo(0, -50); ctx.quadraticCurveTo(55, -72, 108, -54); ctx.lineTo(110, 64); ctx.quadraticCurveTo(55, 48, 0, 70); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(120,95,40,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
    // gold frame + text lines
    ctx.strokeStyle = 'rgba(190,140,40,0.85)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(14, -42); ctx.quadraticCurveTo(55, -60, 96, -45); ctx.lineTo(97, 50); ctx.quadraticCurveTo(55, 38, 14, 55); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,30,20,0.55)'; ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) { const yy = -32 + i * 14; ctx.beginPath(); ctx.moveTo(24, yy - 6 + i * 0.5); ctx.quadraticCurveTo(55, yy - 16 + i * 1.6, 88, yy - 8 + i * 0.4); ctx.setLineDash([10 + (i % 3) * 4, 5]); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
  }
  // gutter shade
  ctx.fillStyle = lg(-12, 0, 12, 0, [[0, 'rgba(0,0,0,0)'], [0.5, 'rgba(60,40,10,0.35)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(-12, -55, 24, 125);
}
// ---- 3D question mark (extruded) ----
function icQ(u, col = '#ffffff', side = '#9aa3ad') {
  ctx.font = `900 260px "P"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let d = 16; d > 0; d--) { ctx.fillStyle = side; ctx.globalAlpha = 1; ctx.fillText('?', d * 1.3, d * 1.6 + 10); }
  ctx.fillStyle = lg(0, -120, 0, 120, [[0, '#ffffff'], [1, col === '#ffffff' ? '#dfe4ea' : col]]); ctx.fillText('?', 0, 10);
}
// ---- wooden signpost with three boards ----
function icSign(u, lit = 0) {
  ctx.fillStyle = lg(-10, 0, 10, 0, [[0, '#6b4423'], [0.5, '#a8743f'], [1, '#5b391c']]); rrect(-10, -95, 20, 200, 6); ctx.fill();
  const board = (y, dir, w, k) => {
    ctx.save(); ctx.translate(0, y); ctx.scale(dir, 1);
    ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
    ctx.fillStyle = k > 0 ? lg(0, -20, 0, 20, [[0, '#ffe08a'], [1, '#e2a52a']]) : lg(0, -20, 0, 20, [[0, '#c48a4c'], [1, '#8a5a2b']]);
    ctx.beginPath(); ctx.moveTo(-8, -22); ctx.lineTo(w, -22); ctx.lineTo(w + 26, 0); ctx.lineTo(w, 22); ctx.lineTo(-8, 22); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(60,30,10,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(w - 6, -8); ctx.moveTo(6, 8); ctx.lineTo(w - 10, 7); ctx.stroke();
    if (k > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg(w / 2, 0, 0, w, [[0, `rgba(255,220,120,${0.6 * k})`], [1, 'rgba(255,220,120,0)']]); ctx.fillRect(-40, -80, w + 120, 160); }
    ctx.restore();
  };
  board(-70, 1, 92, 0); board(-22, -1, 96, 0); board(26, 1, 86, lit);
  ctx.fillStyle = lg(0, -110, 0, -90, [[0, '#8a5a2b'], [1, '#5b391c']]); ctx.beginPath(); ctx.ellipse(0, -96, 13, 6, 0, 0, 7); ctx.fill();
}
// ---- lantern with inner light (nur) ----
function icLantern(u) {
  const fl = 0.85 + 0.15 * Math.sin(u * 13) * Math.sin(u * 7.3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg(0, 10, 0, 170, [[0, `rgba(255,200,90,${0.55 * fl})`], [1, 'rgba(255,200,90,0)']]); ctx.fillRect(-170, -160, 340, 340); ctx.restore();
  ctx.strokeStyle = '#8a6420'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -100, 16, Math.PI, 0); ctx.stroke();
  const gold = lg(-60, 0, 60, 0, [[0, '#7a5414'], [0.35, '#f2cf73'], [0.6, '#c99630'], [1, '#6e4a10']]);
  ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(-34, -60); ctx.quadraticCurveTo(0, -112, 34, -60); ctx.closePath(); ctx.fill();
  rrect(-52, -64, 104, 14, 6); ctx.fill();
  ctx.fillStyle = rg(0, 5, 4, 70, [[0, '#fff8d8'], [0.4, `rgba(255,205,100,${0.95 * fl})`], [1, 'rgba(230,140,40,0.85)']]); rrect(-44, -50, 88, 112, 10); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; rrect(-34, -44, 12, 98, 6); ctx.fill();
  ctx.fillStyle = gold; for (const xx of [-46, -2, 42]) { rrect(xx, -52, 5, 116, 2); ctx.fill(); }
  rrect(-56, 60, 112, 16, 6); ctx.fill(); rrect(-40, 76, 80, 14, 5); ctx.fill();
}
// ---- faceted gem (sıdq: pure, clear) ----
function icGem(u) {
  const P = [[-90, -30], [-50, -70], [50, -70], [90, -30], [0, 90]];
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 25; ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#21b0a0'; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
  const tri = (a, b, c, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath(); ctx.fill(); };
  tri([-90, -30], [-50, -70], [-30, -30], '#7ff0de'); tri([-50, -70], [50, -70], [0, -30], '#c9fff5'); tri([50, -70], [90, -30], [30, -30], '#5fd8c6');
  tri([-50, -70], [0, -30], [-30, -30], '#a6f7ea'); tri([50, -70], [0, -30], [30, -30], '#8eeede');
  tri([-90, -30], [-30, -30], [0, 90], '#1aa696'); tri([-30, -30], [30, -30], [0, 90], '#46cdbb'); tri([30, -30], [90, -30], [0, 90], '#0f7f73');
  const sp = 0.5 + 0.5 * Math.sin(u * 3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg(-30, -52, 0, 40, [[0, `rgba(255,255,255,${0.9 * sp})`], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-80, -100, 100, 100); ctx.restore();
}
// ---- red tulip (lalə) ----
function icTulip(u) {
  ctx.strokeStyle = lg(-6, 0, 6, 0, [[0, '#2f7a2f'], [1, '#56a84a']]); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 100); ctx.quadraticCurveTo(6, 40, 0, -10); ctx.stroke();
  ctx.fillStyle = lg(-60, 0, 0, 0, [[0, '#2d7d2f'], [1, '#6cbf55']]); ctx.beginPath(); ctx.moveTo(2, 96); ctx.quadraticCurveTo(-70, 60, -56, 0); ctx.quadraticCurveTo(-30, 50, 2, 70); ctx.fill();
  ctx.fillStyle = lg(0, 0, 60, 0, [[0, '#4ea43f'], [1, '#2a6e28']]); ctx.beginPath(); ctx.moveTo(2, 100); ctx.quadraticCurveTo(70, 70, 60, 20); ctx.quadraticCurveTo(36, 66, 2, 80); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  ctx.fillStyle = lg(0, -100, 0, 0, [[0, '#ff4a4a'], [1, '#a50f1f']]);
  ctx.beginPath(); ctx.moveTo(-46, -66); ctx.quadraticCurveTo(-58, -6, 0, -2); ctx.quadraticCurveTo(58, -6, 46, -66); ctx.lineTo(24, -40); ctx.lineTo(0, -92); ctx.lineTo(-24, -40); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = lg(-10, -90, 10, 0, [[0, '#ff7b6b'], [1, '#c81e2e']]); ctx.beginPath(); ctx.moveTo(-20, -40); ctx.lineTo(0, -92); ctx.lineTo(20, -40); ctx.quadraticCurveTo(0, -6, -20, -40); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-28, -44, 6, 18, 0.25, 0, 7); ctx.fill();
}
// ---- prayer beads (təsbeh) ----
function icTasbeh(u) {
  const n = 33, R0 = 74;
  ctx.strokeStyle = 'rgba(70,40,20,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -10, R0, R0 * 0.82, 0, 0, 7); ctx.stroke();
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i + 0.5) / n * Math.PI * 2 + Math.PI / n, x = Math.cos(a) * R0, y = -10 + Math.sin(a) * R0 * 0.82;
    if (Math.abs(a - Math.PI / 2) < 0.12) continue;
    ctx.fillStyle = rg(x - 4, y - 4, 1, 12, [[0, '#f3c27a'], [0.6, '#a9621f'], [1, '#5a2c0c']]); ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fill();
  }
  ctx.fillStyle = rg(-5, 50, 2, 18, [[0, '#f3c27a'], [0.6, '#a9621f'], [1, '#5a2c0c']]); ctx.beginPath(); ctx.ellipse(0, 58, 11, 18, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#7a3c12'; ctx.lineWidth = 3; for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * 1.5, 74); ctx.quadraticCurveTo(i * 3, 90, i * 4 + Math.sin(u * 2 + i) * 2, 110); ctx.stroke(); }
}
// ---- tick / cross badges ----
function icMark(ok, u) {
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
  ctx.fillStyle = ok ? lg(0, -80, 0, 80, [[0, '#5fe39b'], [1, '#13985a']]) : lg(0, -80, 0, 80, [[0, '#ff6b6b'], [1, '#c0182a']]); ctx.beginPath(); ctx.arc(0, 0, 80, 0, 7); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.beginPath(); ctx.ellipse(-20, -40, 40, 20, -0.4, 0, 7); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  if (ok) { ctx.moveTo(-36, 4); ctx.lineTo(-10, 30); ctx.lineTo(40, -26); } else { ctx.moveTo(-30, -30); ctx.lineTo(30, 30); ctx.moveTo(30, -30); ctx.lineTo(-30, 30); }
  ctx.stroke();
}
