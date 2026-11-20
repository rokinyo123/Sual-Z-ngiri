window.renderAt = async function () {
  return coverStyle({ bg: 'bg01', label: 'BƏQƏRƏ 2:14–15', title: 'İKİ ÜZÜN', boxes: ['VARMI?'], hx: 540, hy: 1330,
    hero: (x, y) => {
      sprite('k_uz_1', x - 175, y, 470, 1, -0.12, 1, 'rgba(255,230,170,0.9)');
      sprite('k_uz_2', x + 175, y + 20, 470, 1, 0.12, 1, 'rgba(255,90,70,0.85)');
    } });
};
