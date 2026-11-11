// Short cover (1080x1920): loaded after kin_main.js, overrides renderAt. Static frame.
window.renderAt = async function () {
  const t = 50;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.letterSpacing = '0px';
  ctx.fillStyle = lg(0, 0, 0, H, [[0, '#07140f'], [0.55, '#030806'], [1, '#000']]); ctx.fillRect(0, 0, W, H);
  starLattice(t, 0.09);
  glow(540, 1000, 900, 'rgba(255,190,80,A)', 0.28);
  // golden road to the light
  const xl = y => lerp(250, 515, (1720 - y) / 880), xr = y => lerp(830, 565, (1720 - y) / 880);
  ctx.save(); ctx.fillStyle = lg(0, 840, 0, 1720, [[0, '#fff1c4'], [0.5, '#f0c35a'], [1, '#b97a1c']]); ctx.shadowColor = 'rgba(255,190,60,0.8)'; ctx.shadowBlur = 60;
  ctx.beginPath(); ctx.moveTo(xl(1720), 1720); ctx.lineTo(xl(840), 840); ctx.lineTo(xr(840), 840); ctx.lineTo(xr(1720), 1720); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 9; ctx.setLineDash([46, 36]); ctx.beginPath(); ctx.moveTo(540, 1720); ctx.lineTo(540, 850); ctx.stroke(); ctx.restore();
  glow(540, 830, 330, 'rgba(255,225,150,A)', 1); glow(540, 830, 150, 'rgba(255,255,240,A)', 0.9);
  // wrong turns
  drawStroke(curvePts(430, 1500, 110, 1150, 230, 1480, 40), 1, 40, 'rgba(226,58,58,0.95)', '#ff2a2a', false);
  drawStroke(Array.from({ length: 41 }, (_, i) => { const s = i / 40; return [lerp(650, 980, s) + Math.sin(s * 14) * 38 * s, lerp(1330, 1060, s)]; }), 1, 34, 'rgba(150,156,164,0.95)', null, false);
  prop((u) => icMark(false, u), t, 0, 120, 1150, 130, { shadow: false, float: 0 });
  prop((u) => icMark(false, u), t, 0, 975, 1050, 120, { shadow: false, float: 0 });
  prop((u) => icMark(true, u), t, 0, 540, 830, 150, { shadow: false, float: 0 });
  pill('QƏZƏB', 230, 1290, 46, REDK, '#fff', t, 0, { rot: -0.05 });
  pill('AZMAQ', 880, 1180, 46, GREY, '#fff', t, 0, { rot: 0.05 });
  // headline
  chipK('FATİHƏ · 1:7', 540, 230, t, 0, G1, 40);
  { const parts = [['GÜNDƏ', 100, '#fff', '#000'], ['17', 146, G1, '#ffb030'], ['DƏFƏ', 100, '#fff', '#000']], gap = 30;
    const ws = parts.map(([s, z]) => measure(s, pf(900, z))), tot = ws.reduce((a, b) => a + b, 0) + gap * 2; let x = 540 - tot / 2;
    parts.forEach(([s, z, c, g], i) => { tx(s, x + ws[i] / 2, 385, pf(900, z), c, 1, { glow: g, blur: g === '#000' ? 20 : 45 }); x += ws[i] + gap; }); }
  tx('OXUDUĞUN', 540, 520, pf(900, 112), '#fff', 1, { glow: '#000', blur: 20 });
  pill('9 SÖZ', 540, 665, 104, MINT, INKD, t, 0, { rot: -0.03 });
  // question at the bottom (above platform UI)
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.55)'; rrect(90, 1500, 900, 150, 30); ctx.fill(); ctx.restore();
  tx('SƏN HANSI YOLDASAN?', 540, 1577, pf(900, 76), '#fff', 1, { glow: '#ffb030', blur: 25 });
  watermark(t); vignette(0.35); filmGrain(t);
  return cv.toDataURL('image/jpeg', 0.95);
};
