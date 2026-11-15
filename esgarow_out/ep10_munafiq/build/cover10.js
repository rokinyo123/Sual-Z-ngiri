window.renderAt = async function () {
  const t = 60, V = (location.hash || '#A').slice(1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const T = (s, x, y, size, col, opt = {}) => tx(s, x, y, pf(900, size), col, 1, { glow: opt.glow || '#000', blur: opt.blur ?? 30, stroke: '#000', sw: Math.round(size / 9) });
  if (V === 'A') {
    cover('bg03', t, 0, 1.05, 1.05, { dur: 1, dark: 0.45 });
    T('SƏNDƏ BU', W / 2, 260, 120, '#fff'); T('3 ƏLAMƏT', W / 2, 400, 150, '#ff6b5b', { glow: '#7c1410', blur: 40 }); T('VARMI?', W / 2, 540, 120, '#fff');
    sprite('k_maska_1', W / 2, 860, 420, 1, 0, 1);
    pill('Münafiqin əlamətləri · Buxari 33', W / 2, 1180, 42, MINT, INKD, 99, 0, { r: 14 });
  } else {
    cover('bg01', t, 0, 1.05, 1.05, { dur: 1, dark: 0.45 });
    T('BƏQƏRƏ SURƏSİ', W / 2, 260, 90, '#fff');
    const base = 1180, unit = 42;
    [[220, 4, '#7be3a2', 'MÖMİN'], [540, 2, '#ff6b5b', 'KAFİR'], [860, 13, G1, 'MÜNAFİQ']].forEach(([x, n, c, lab]) => { const h = unit * n; ctx.save(); ctx.fillStyle = lg(0, base - h, 0, base, [[0, c], [1, 'rgba(0,0,0,0.6)']]); ctx.shadowColor = c; ctx.shadowBlur = 30; rrect(x - 95, base - h, 190, h, 18); ctx.fill(); ctx.restore(); T(String(n), x, base - h - 70, n > 9 ? 130 : 96, c); T(lab, x, base + 55, 46, '#fff'); });
    T('NİYƏ 13?', 380, 560, 140, G1, { glow: '#ffb030', blur: 45 });
  }
  return cv.toDataURL('image/jpeg', 0.95);
};
