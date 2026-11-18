window.renderAt = async function () {
  return coverStyle({ bg: 'bg01', label: 'BƏQƏRƏ 2:11–12', title: 'QİYAMƏTDƏ', boxes: ['MÜFLİS', 'ÇIXMA'], hx: 540, hy: 1330,
    hero: (x, y) => {
      sprite('k_savab_3', x, y + 40, 520, 1, -0.05, 1, 'rgba(255,170,60,0.9)');
      [[-250, -260, 120, -0.4], [230, -300, 110, 0.5], [-120, -420, 90, 0.2], [140, -470, 80, -0.6], [330, -120, 95, 0.9], [-340, -80, 100, -0.8]].forEach(([dx, dy, h, r]) => sprite('k_savab_1', x + dx, y + dy, h, 1, r, 1, 'rgba(255,200,90,0.9)'));
    } });
};
