// Short cover v2 (white kinetic style, matches the video). Loaded after kin_main.js.
window.renderAt = async function () {
  const t = 50;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.letterSpacing = '0px';
  bgW(t, 540, 1050);
  glow(540, 1060, 520, 'rgba(255,200,90,A)', 0.35);
  chipK('FATİHƏ · 1:7', 540, 215, t, 0, '#1a1a1a', 38, false);
  tx('Hər namazda', 540, 310, pf(700, 66), '#3a3f45', 1);
  tx('KİMİN', 540, 500, pf(900, 175), INKD, 1);
  pill('YOLUNU', 540, 668, 112, MINT, INKD, t, 0, { rot: -0.03 });
  tx('istəyirsən?', 540, 815, pf(800, 78), INKD, 1);
  // centre: Quran with the 4 groups around it
  prop(icBook, t, 0, 540, 1110, 330, { float: 0 });
  const S = [[230, 1000, icLantern, 'Peyğəmbərlər', -0.08], [850, 1000, icGem, 'Siddiqlər', 0.08], [230, 1330, icTulip, 'Şəhidlər', -0.06], [850, 1330, icTasbeh, 'Salehlər', 0.06]];
  S.forEach(([x, y, fn, lab, r], i) => { prop(fn, t, 0, x, y, 210, { float: 0, rot: r }); pill(lab, x, y + 140, 36, '#111214', '#fff', t, 0, { rot: r * 0.5 }); });
  ctx.save(); ctx.setLineDash([10, 12]); ctx.strokeStyle = 'rgba(120,126,134,0.6)'; ctx.lineWidth = 4;
  for (const [x, y] of S) { ctx.beginPath(); ctx.moveTo(540 + (x - 540) * 0.33, 1110 + (y - 1110) * 0.33); ctx.lineTo(540 + (x - 540) * 0.68, 1110 + (y - 1110) * 0.68); ctx.stroke(); }
  ctx.restore();
  pill('9 SÖZ · GÜNDƏ 17 DƏFƏ', 540, 1608, 50, G1, '#1a1000', t, 0);
  watermark(t); vignette(0.12); filmGrain(t);
  return cv.toDataURL('image/jpeg', 0.95);
};
