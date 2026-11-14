window.renderAt = async function () {
  const t = 30, V = (location.hash || '#A').slice(1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const T = (s, x, y, size, col, opt = {}) => tx(s, x, y, pf(900, size), col, 1, { glow: opt.glow || '#000', blur: opt.blur ?? 30, stroke: '#000', sw: Math.round(size / 9) });
  if (V === 'A') {
    cover('bg06', t, 0, 1.05, 1.05, { dur: 1, dark: 0.5 });
    T('QƏLBİNƏ', W / 2, 270, 130, '#fff'); T('MÖHÜR', W / 2, 410, 170, '#ff6b5b', { glow: '#7c1410', blur: 40 }); T('VURULUBMU?', W / 2, 560, 120, '#fff');
    heart(t, 9, 0.0, 0, 0, 1); seal(720, 1060, 99, 0, 80);
    pill('Hər günah — bir qara nöqtə', W / 2, 1290, 48, MINT, INKD, 99, 0, { r: 14 });
  } else {
    cover('bg01', t, 0, 1.05, 1.05, { dur: 1, dark: 0.35 });
    T('ALLAH 3 ŞEYİ', W / 2, 290, 110, '#fff'); T('BAĞLAYIR', W / 2, 420, 130, G1, { glow: '#ffb030', blur: 40 });
    [[240, 'k_qapi_1'], [540, 'k_qapi_2'], [840, 'k_qapi_3']].forEach(([x, k]) => stick(k, x, 780, 240, 99, 0, 1e9, { still: 1 }));
    seal(240, 820, 99, 0, 64); seal(540, 820, 99, 0, 64); curtain(840, 780, 270, 310, 99, 0);
    T('NİYƏ?', W / 2, 1130, 190, G1, { glow: '#ffb030', blur: 50 });
    pill('Bəqərə 2:7', W / 2, 1300, 46, MINT, INKD, 99, 0, { r: 14 });
  }
  return cv.toDataURL('image/jpeg', 0.95);
};
