// cover variants: #A story (dog & well) · #B self-test checklist · #C azan secret
window.renderAt = async function () {
  const t = 30, V = (location.hash || '#A').slice(1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const T = (s, x, y, size, col, opt = {}) => tx(s, x, y, pf(900, size), col, 1, { align: opt.align || 'center', glow: opt.glow || '#000', blur: opt.blur ?? 30, stroke: opt.stroke ?? '#000', sw: opt.sw ?? Math.round(size / 9), ls: opt.ls });
  const box = (x, y, s, on, col) => { ctx.save(); ctx.fillStyle = on ? MINT : 'rgba(255,255,255,0.12)'; ctx.strokeStyle = on ? MINT : '#fff'; ctx.lineWidth = s * 0.08; rrect(x - s / 2, y - s / 2, s, s, s * 0.2); ctx.fill(); ctx.stroke(); if (on) { ctx.strokeStyle = '#0d3b2a'; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - s * 0.25, y); ctx.lineTo(x - s * 0.05, y + s * 0.2); ctx.lineTo(x + s * 0.27, y - s * 0.2); ctx.stroke(); } else { T('?', x, y + 3, s * 0.7, G1, { sw: 0, blur: 0 }); } ctx.restore(); };
  const SIGNS = [['Görmədən iman', 'k_elamet_1'], ['Namaz', 'k_elamet_2'], ['Sədəqə', 'k_elamet_3'], ['Kitablara iman', 'k_elamet_4'], ['Axirətə yəqin', 'k_elamet_5']];
  if (!PORT) {
    if (V === 'A') {
      cover('bg09_w', t, 0, 1.08, 1.08, { dur: 1 });
      glow(1350, 420, 520, 'rgba(255,200,110,A)', 0.35);
      sprite('k_su_3', 1180, 760, 210, 1, -0.08, 1); for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(190,225,255,0.9)'; ctx.beginPath(); ctx.ellipse(1180 + (i - 2) * 12, 640 + i * 18, 6, 10, 0, 0, 7); ctx.fill(); }
      ctx.save(); ctx.translate(1450, 600); ctx.scale(-1, 1); ctx.translate(-1450, -600); sprite('k_heyvan_1', 1450, 600, 640, 1, 0, 1); ctx.restore();
      T('BİR İT ÜÇÜN', 90, 330, 132, '#fff', { align: 'left' });
      T('BAĞIŞLANDI', 90, 490, 140, G1, { align: 'left', glow: '#ffb030', blur: 45 });
      pill('Səhih hədis · Buxari 2363', 470, 660, 50, MINT, INKD, 99, 0, { r: 14 });
      T('Hər canlıya edilən yaxşılıqda savab var', 90, 800, 44, '#fff', { align: 'left', sw: 6, blur: 15 });
    } else if (V === 'B') {
      cover('bg02_w', t, 0, 1.1, 1.1, { dur: 1, dark: 0.55 });
      T('MÜTTƏQİ', 90, 210, 150, G1, { align: 'left', glow: '#ffb030', blur: 40 });
      T('TESTİ', 90, 360, 150, '#fff', { align: 'left' });
      T('Səndə neçəsi var?', 90, 520, 74, MINT, { align: 'left', sw: 8 });
      pill('Quran · Bəqərə 2:3–5', 330, 650, 44, G1, '#1a1000', 99, 0, { r: 14 });
      SIGNS.forEach(([s, k], i) => { const y = 160 + i * 175; ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.72)'; rrect(1010, y - 72, 820, 144, 30); ctx.fill(); ctx.strokeStyle = 'rgba(246,199,104,0.6)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); sprite(k, 1100, y, 110, 1, 0, 1); T(s, 1180, y + 4, 56, '#fff', { align: 'left', sw: 0, blur: 10 }); box(1750, y, 86, i < 2, G1); });
    } else {
      cover('bg18_w', t, 0, 1.05, 1.05, { dur: 1, dark: 0.35 });
      glow(1450, 660, 520, 'rgba(255,200,110,A)', 0.4);
      ctx.save(); ctx.font = `bold 140px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 50; ctx.lineWidth = 11; ctx.strokeStyle = '#2a1800'; ctx.strokeText('حَيَّ عَلَى الْفَلَاحِ', 1460, 800); ctx.fillStyle = G1; ctx.fillText('حَيَّ عَلَى الْفَلَاحِ', 1460, 800); ctx.restore();
      T('HƏR GÜN', 90, 260, 130, '#fff', { align: 'left' });
      T('EŞİTDİYİN SÖZ', 90, 410, 130, '#fff', { align: 'left' });
      T('BU AYƏDƏDİR', 90, 580, 150, G1, { align: 'left', glow: '#ffb030', blur: 45 });
      pill('Mənasını bilirsənmi?', 420, 760, 56, MINT, INKD, 99, 0, { r: 14 });
      sprite('k_kilid', 1470, 420, 260, 1, 0.08, 1);
    }
  } else {
    if (V === 'A') {
      cover('bg09_v', t, 0, 1.06, 1.06, { dur: 1 });
      glow(540, 1150, 520, 'rgba(255,200,110,A)', 0.35);
      sprite('k_su_3', 360, 1360, 200, 1, -0.08, 1); for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(190,225,255,0.9)'; ctx.beginPath(); ctx.ellipse(360 + (i - 2) * 12, 1240 + i * 16, 6, 10, 0, 0, 7); ctx.fill(); }
      ctx.save(); ctx.translate(640, 1200); ctx.scale(-1, 1); ctx.translate(-640, -1200); sprite('k_heyvan_1', 640, 1200, 620, 1, 0, 1); ctx.restore();
      T('BİR İT ÜÇÜN', W / 2, 330, 120, '#fff');
      T('BAĞIŞLANDI', W / 2, 480, 150, G1, { glow: '#ffb030', blur: 45 });
      pill('Səhih hədis', W / 2, 640, 54, MINT, INKD, 99, 0, { r: 14 });
    } else if (V === 'B') {
      cover('bg02_v', t, 0, 1.08, 1.08, { dur: 1, dark: 0.6 });
      T('MÜTTƏQİ', W / 2, 300, 150, G1, { glow: '#ffb030', blur: 40 });
      T('TESTİ', W / 2, 450, 150, '#fff');
      SIGNS.forEach(([s, k], i) => { const y = 650 + i * 160; ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.75)'; rrect(90, y - 66, 900, 132, 28); ctx.fill(); ctx.strokeStyle = 'rgba(246,199,104,0.6)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); sprite(k, 180, y, 100, 1, 0, 1); T(s, 260, y + 4, 54, '#fff', { align: 'left', sw: 0, blur: 10 }); box(910, y, 80, i < 2, G1); });
      T('Səndə neçəsi var?', W / 2, 1500, 80, MINT, { sw: 9 });
    } else {
      cover('bg18_v', t, 0, 1.05, 1.05, { dur: 1, dark: 0.3 });
      T('HƏR GÜN', W / 2, 300, 120, '#fff'); T('EŞİTDİYİN SÖZ', W / 2, 440, 110, '#fff');
      ctx.save(); ctx.font = `bold 150px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 50; ctx.lineWidth = 12; ctx.strokeStyle = '#2a1800'; ctx.strokeText('حَيَّ عَلَى الْفَلَاحِ', W / 2, 680); ctx.fillStyle = G1; ctx.fillText('حَيَّ عَلَى الْفَلَاحِ', W / 2, 680); ctx.restore();
      T('BU AYƏDƏDİR', W / 2, 900, 130, G1, { glow: '#ffb030', blur: 45 });
      pill('Mənasını bilirsənmi?', W / 2, 1060, 56, MINT, INKD, 99, 0, { r: 14 });
      sprite('k_kilid', W / 2, 1290, 230, 1, 0.08, 1);
    }
  }
  return cv.toDataURL('image/jpeg', 0.95);
};
