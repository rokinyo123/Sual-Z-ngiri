// static covers: YouTube thumbnail (16:9) or Short cover (9:16)
window.renderAt = async function () {
  const t = 30; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  if (!PORT) {
    cover('bg01_w', t, 0, 1.05, 1.05, { dur: 1 });
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, W, H);
    tx('5', 300, 520, pf(900, 640), G1, 1, { glow: '#ffb030', blur: 60, stroke: '#3a2400', sw: 14 });
    tx('ƏLAMƏT', 560, 400, pf(900, 170), '#fff', 1, { align: 'left', glow: '#000', blur: 30, stroke: '#000', sw: 10 });
    tx('SƏN', 568, 560, pf(900, 120), G1, 1, { align: 'left', glow: '#000', blur: 25, stroke: '#000', sw: 8 });
    tx('HANSINDASAN?', 568, 690, pf(900, 120), G1, 1, { align: 'left', glow: '#000', blur: 25, stroke: '#000', sw: 8 });
    pill('MÜTTƏQİ KİMDİR?', 820, 860, 56, MINT, INKD, 99, 0, { r: 14 });
    chipK('BƏQƏRƏ 2:3–5', 1700, 960, 99, 0, G1, 40);
  } else {
    cover('bg01_v', t, 0, 1.05, 1.05, { dur: 1, dark: 0.15 });
    tx('5', W / 2, 640, pf(900, 700), G1, 1, { glow: '#ffb030', blur: 60, stroke: '#3a2400', sw: 14 });
    tx('ƏLAMƏT', W / 2, 1060, pf(900, 170), '#fff', 1, { glow: '#000', blur: 30, stroke: '#000', sw: 10 });
    pill('Bu beşindən hansı səndə var?', W / 2, 1230, 50, MINT, INKD, 99, 0, { r: 14 });
    chipK('BƏQƏRƏ 2:3–5', W / 2, 215, 99, 0, G1, 40);
  }
  return cv.toDataURL('image/jpeg', 0.95);
};
