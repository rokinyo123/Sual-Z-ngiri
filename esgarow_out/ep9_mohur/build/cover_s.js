window.renderAt = async function () {
  return coverStyle({ bg: 'bg06', label: 'BƏQƏRƏ 2:7', title: 'QƏLBƏ MÖHÜR', boxes: ['NİYƏ', 'VURULUR?'], hx: 560, hy: 1290,
    hero: (x, y) => { sprite('k_qapi_1', x, y, 600, 1, -0.06, 1, 'rgba(255,170,60,0.9)');
      [[-120, -60, 46], [60, -110, 34], [-30, 60, 40], [120, 30, 28]].forEach(([dx, dy, r]) => { ctx.save(); ctx.fillStyle = 'rgba(8,6,8,0.92)'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, 7); ctx.fill(); ctx.restore(); });
      seal(x + 210, y + 170, 99, 0, 100); } });
};
