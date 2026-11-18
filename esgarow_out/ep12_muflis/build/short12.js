// ================= Ayənin sirri 12 — SHORT · Bəqərə 2:11–12 "Müflis" =================
// Hook: savab meter fills (namaz, oruc) → drains at MÜFLİS, coins fly away → recitation → meaning → söz-söz
// → sirr (1 təkid vs 3 təkid) → STORY "Bilirsinizmi müflis kimdir?" (Müslim 2581) on a scale → daily life → halallıq → dua → next.
loadBgs(['bg01', 'bg02', 'bg03', 'bg04', 'bg05', 'bg06', 'bg07', 'bg08', 'bg09', 'bg10']);
const P = i => SUBS[i].t0, PE = i => SUBS[i].t1;
const clean = x => x.replace(/[".,:?!«»…—]/g, '');
function Wd(i, word) { const w = SUBS[i].w.find(([x]) => clean(x) === word) || SUBS[i].w.find(([x]) => clean(x).startsWith(word)); if (!w) throw new Error('word ' + word + ' in ' + i); return w[1]; }
const A11a = 'وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ', A11b = 'قَالُوا إِنَّمَا نَحْنُ مُصْلِحُونَ', A12a = 'أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ', A12b = 'وَلَٰكِن لَّا يَشْعُرُونَ';
const RD = '#ff6b5b', RDL = '#ff8f82';

// gold savab meter: fill 0..1, red when drained
function meter(x, y, w, fill, t, t0, t1 = 1e9, red = 0) {
  const a = life(t, t0, t1); if (a <= 0) return;
  grp(a, () => {
    ctx.save(); ctx.fillStyle = 'rgba(10,8,4,0.78)'; rrect(x - w / 2 - 16, y - 46, w + 32, 92, 46); ctx.fill(); ctx.strokeStyle = red > 0 ? `rgba(255,107,91,${0.6 + 0.4 * red})` : 'rgba(246,199,104,0.8)'; ctx.lineWidth = 4; ctx.stroke();
    const fw = Math.max(0, w * fill); if (fw > 2) { ctx.fillStyle = lg(x - w / 2, 0, x + w / 2, 0, [[0, '#b8862b'], [1, '#ffe2a0']]); ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; rrect(x - w / 2, y - 30, fw, 60, 30); ctx.fill(); }
    ctx.restore();
    tx('SAVAB', x - w / 2 - 16, y - 80, pf(900, 40), G1, 1, { align: 'left', ls: '4px', glow: '#000' });
    tx(Math.round(fill * 100) + '%', x + w / 2 + 16, y - 80, pf(900, 40), red > 0 ? RD : G2, 1, { align: 'right', glow: '#000' });
  });
}
// coins flying out from (x,y)
function coinBurst(x, y, t, t0, n = 14, d = 1.6, dir = 0) {
  const u0 = t - t0; if (u0 < 0 || u0 > d + 0.4) return;
  for (let i = 0; i < n; i++) { const st = srand(i * 3.1) * 0.5, u = u0 - st; if (u < 0 || u > d) continue; const an = (dir ? -Math.PI / 2 + (srand(i) - 0.5) * 1.2 : srand(i) * Math.PI * 2), sp = 500 + srand(i + 7) * 500;
    sprite('k_savab_1', x + Math.cos(an) * sp * u, y + Math.sin(an) * sp * u + 260 * u * u * (dir ? -0.2 : 1), 70, 1 - u / d, u * 6 + i, 1); }
}
function rowWord(ar, mean, y, t, t0, cur) {
  const a = life(t, t0); if (a <= 0) return;
  grp(a, () => { ctx.save(); ctx.fillStyle = cur ? 'rgba(40,28,8,0.82)' : 'rgba(10,10,14,0.66)'; rrect(80, y - 82, 920, 164, 30); ctx.fill(); ctx.strokeStyle = cur ? G1 : 'rgba(246,199,104,0.35)'; ctx.lineWidth = cur ? 5 : 2; if (cur) { ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; } ctx.stroke(); ctx.restore(); });
  arT(ar, 760, y, 66, t, t0, 1e9, 0.6, cur ? G2 : G1);
  ct(mean, 320, y + 2, 42, 800, '#fff', t, t0 + 0.25, 1e9, { align: 'center' });
}
function fog(t, t0, a = 1) { const k = clamp((t - t0) / 1.6) * a; if (k <= 0) return; ctx.save(); for (let i = 0; i < 12; i++) { const x = 540 + Math.sin(t * 0.3 + i) * 380, y = 700 + Math.cos(t * 0.25 + i * 1.7) * 240; const g = ctx.createRadialGradient(x, y, 0, x, y, 300); g.addColorStop(0, `rgba(225,230,236,${0.28 * k})`); g.addColorStop(1, 'rgba(225,230,236,0)'); ctx.fillStyle = g; ctx.fillRect(x - 300, y - 300, 600, 600); } ctx.restore(); }
function iconLab(k, lab, x, y, h, t, t0, col = '#fff', t1 = 1e9) { stick(k, x, y, h, t, t0, t1, { still: 1 }); ct(lab, x, y + Math.max(h, 140) / 2 + 42, 36, 900, col, t, t0 + 0.1, t1, { glow: '#000' }); }
function rowItem(k, label, y, t, t0, t1 = 1e9) { const a = life(t, t0, t1); if (a <= 0) return; grp(a, () => { ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.74)'; rrect(90, y - 80, 900, 160, 30); ctx.fill(); ctx.strokeStyle = 'rgba(255,122,107,0.7)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }); stick(k, 200, y, 120, t, t0 + 0.1, t1, { still: 1 }); ct(label, 300, y + 4, 50, 800, '#fff', t, t0 + 0.2, t1, { align: 'left' }); }

const SC = {
  hook(t) {
    cover('bg01', t, 0, 1.12, 1.0, { dur: 12, dark: 0.3 }); drawDust(t, 0.35);
    ctx.fillStyle = `rgba(0,0,0,${1 - R(t, 0, 0.6)})`; ctx.fillRect(0, 0, W, H);
    const tM = L(Wd(1, 'MÜFLİS'));
    ct('Quranda belə bir ayə var:', W / 2, 300, 50, 700, '#fff', t, L(P(0)));
    // savab meter fills with namaz, oruc → drains at MÜFLİS
    const f1 = L(Wd(0, 'namaz')), f2 = L(Wd(1, 'oruc')), fill = 0.15 + 0.4 * eOut(clamp((t - f1) / 0.8)) + 0.4 * eOut(clamp((t - f2) / 0.8)), drain = eOut(clamp((t - tM) / 0.7));
    meter(W / 2, 520, 700, fill * (1 - drain), t, 0.3, 1e9, drain);
    iconLab('k_emel_1', 'NAMAZ', 330, 790, 190, t, f1, '#fff');
    iconLab('k_emel_2', 'ORUC', 750, 790, 170, t, f2, '#fff');
    coinBurst(W / 2, 520, t, tM, 16, 1.6);
    stampT('MÜFLİS', t, tM + 0.15, W / 2, 1060, 120, RD);
    ct('…və bunu HİSS ETMİR', W / 2, 1250, 56, 900, '#fff', t, L(Wd(2, 'hiss')), 1e9, { glow: '#000' });
  },
  recite(t, a) {
    cover('bg02', t, a - 0.6, 1.0, 1.1, { dur: 16, dark: 0.45 }); drawDust(t, 0.35);
    chipT('BƏQƏRƏ · 2:11–12', W / 2, 300, t, a - 0.2, 1e9, G1, 36);
    arT(A11a, W / 2, 450, 54, t, L(P(3)), 1e9, PE(3) - P(3));
    arT(A11b, W / 2, 560, 62, t, L(P(4)), 1e9, PE(4) - P(4));
    arT(A12a, W / 2, 720, 66, t, L(P(5)), 1e9, PE(5) - P(5), RDL);
    arT(A12b, W / 2, 830, 62, t, L(P(6)), 1e9, PE(6) - P(6));
    badge('2:11', 90, 505, t, L(P(3)), G1, '#1a1000', 34); badge('2:12', 90, 775, t, L(P(5)), G1, '#1a1000', 34);
  },
  meaning(t, a) {
    cover('bg03', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.35 });
    ct('Mənası:', W / 2, 300, 46, 700, G1, t, L(P(7)));
    ct('Onlara deyiləndə:', W / 2, 390, 46, 700, '#fff', t, L(P(8)));
    pillT('«Yer üzündə fəsad törətməyin»', W / 2, 480, 46, 'rgba(250,245,230,0.95)', INKD, t, L(Wd(8, 'yer')));
    ct('deyirlər:', W / 2, 590, 44, 700, '#fff', t, L(P(9)));
    ct('«BİZ İSLAH EDƏNLƏRİK»', W / 2, 680, 70, 900, MINT, t, L(Wd(9, 'biz')), 1e9, { glow: '#000' });
    ct('Bilin ki,', W / 2, 820, 46, 700, '#fff', t, L(P(10)));
    ct('FƏSAD TÖRƏDƏNLƏR', W / 2, 910, 74, 900, RD, t, L(P(11)), 1e9, { glow: '#000' });
    ct('MƏHZ ONLARDIR', W / 2, 1000, 74, 900, RD, t, L(Wd(11, 'məhz')), 1e9, { glow: '#000' });
    fog(t, L(Wd(11, 'amma')), 0.8);
    ct('…amma bunu hiss etmirlər', W / 2, 1130, 50, 800, 'rgba(255,255,255,0.9)', t, L(Wd(11, 'amma')));
  },
  words(t, a) {
    cover('bg03', t, a - 0.6, 1.1, 1.0, { dur: 14, dark: 0.55, dx: 80 });
    chipT('SÖZ-SÖZ', W / 2, 300, t, L(P(12)), 1e9, MINT, 36);
    const rows = [['لَا تُفْسِدُوا', 'fəsad törətməyin', 13], ['مُصْلِحُونَ', 'islah edənlər', 14], ['لَا يَشْعُرُونَ', 'hiss etmirlər', 16]];
    rows.forEach(([ar, m, i], k) => rowWord(ar, m, 520 + k * 230, t, L(P(i)), t >= L(P(i)) && (k === 2 || t < L(P(rows[k + 1][2])))));
  },
  sirr(t, a) {
    cover('bg04', t, a - 0.6, 1.0, 1.08, { dur: 18, dark: 0.3 });
    ct('GİZLİ SİRR', W / 2, 300, 76, 900, G1, t, L(P(17)), 1e9, { glow: '#ffb030', blur: 30 });
    // their claim: 1
    grp(life(t, L(P(18))), () => { ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.74)'; rrect(110, 380, 860, 190, 30); ctx.fill(); ctx.strokeStyle = 'rgba(159,243,212,0.7)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); });
    ct('ONLAR:', 220, 430, 38, 900, MINT, t, L(P(18)), 1e9, { align: 'center' });
    arT('إِنَّمَا نَحْنُ مُصْلِحُونَ', 620, 430, 54, t, L(P(19)), 1e9, 0.8, '#fff');
    ct('1 TƏKİD', W / 2, 520, 44, 900, MINT, t, L(P(19)) + 0.6, 1e9, { glow: '#000' });
    // Allah's answer: 3
    ct('ALLAHIN CAVABI:', W / 2, 650, 50, 900, '#fff', t, L(P(20)), 1e9, { glow: '#000' });
    const toks = [['أَلَا', 'Diqqət!', 21, 830], ['إِنَّهُمْ', 'Həqiqətən onlar!', 22, 540], ['هُمُ', 'MƏHZ onlar!', 23, 250]];
    toks.forEach(([ar, m, i, x], k) => { const t0 = L(P(i)); const al = life(t, t0); if (al <= 0) return;
      grp(al, () => { ctx.save(); ctx.fillStyle = 'rgba(40,28,8,0.82)'; rrect(x - 135, 720, 270, 250, 28); ctx.fill(); ctx.strokeStyle = G1; ctx.lineWidth = 4; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 20; ctx.stroke(); ctx.restore(); });
      badge(String(k + 1), x, 720, t, t0, G1, '#1a1000', 30); arT(ar, x, 820, 80, t, t0, 1e9, 0.5); ct(m, x, 920, 32, 900, '#fff', t, t0 + 0.2, 1e9, { align: 'center' }); });
    ct('3 TƏKİD', W / 2, 1050, 84, 900, G1, t, L(Wd(23, 'fəsad')), 1e9, { glow: '#ffb030', blur: 35 });
    ct('fəsad törədənlər MƏHZ onlardır!', W / 2, 1160, 48, 900, RD, t, L(Wd(23, 'MƏHZ')), 1e9, { glow: '#000' });
    sourceTag('Zəməxşəri, əl-Kəşşaf · Bəqərə 2:12', t, P(20));
  },
  story(t, a) {
    cover('bg05', t, a - 0.6, 1.0, 1.1, { dur: 16, dark: 0.3 });
    const B = L(P(26)) - 0.1;
    ct('Bəs insan necə fəsad törədib,', W / 2, 330, 50, 800, '#fff', t, L(P(24)), B);
    ct('bunu HİSS ETMƏZ?', W / 2, 430, 74, 900, G1, t, L(P(25)), B, { glow: '#000' });
    ct('Peyğəmbərimiz ﷺ səhabələrdən soruşdu:', W / 2, 300, 40, 700, G2, t, L(P(26)));
    quoteCard([['Bilirsinizmi,', L(P(27))], ['MÜFLİS kimdir?', L(P(28)), G1]], W / 2, 480, 800, t, L(P(27)), 1e9, { size: 64, w: 900 });
    ct('Dedilər:', W / 2, 680, 44, 700, '#fff', t, L(P(29)));
    pillT('«Pulu, malı olmayan»', W / 2, 770, 52, 'rgba(250,245,230,0.95)', INKD, t, L(P(30)));
    stick('k_savab_3', W / 2, 1010, 230, t, L(P(30)) + 0.3, 1e9, { bob: 4 });
    ct('Buyurdu:', W / 2, 1220, 50, 900, G1, t, L(P(32)), 1e9, { glow: '#000' });
  },
  scale(t, a) {
    cover('bg06', t, a - 0.6, 1.0, 1.08, { dur: 20, dark: 0.4 });
    ct('ÜMMƏTİMİN MÜFLİSİ', W / 2, 300, 70, 900, G1, t, L(P(33)), 1e9, { glow: '#000' });
    const tG = L(Wd(39, 'onlara')), tE = L(Wd(39, 'bitəndə')), tS = L(P(40));
    // good deeds row
    [['k_emel_1', 'NAMAZ', 230, P(34)], ['k_emel_2', 'ORUC', 540, P(35)], ['k_emel_3', 'ZƏKAT', 850, Wd(36, 'zəkatla')]].forEach(([k, s, x, t0]) => iconLab(k, s, x, 470, 150, t, L(t0), MINT));
    // sins row
    [['k_gunah_1', 'SÖYÜŞ', 230, Wd(36, 'söyüb')], ['k_gunah_2', 'BÖHTAN', 540, Wd(37, 'böhtan')], ['k_gunah_3', 'HAQQ YEMƏK', 850, Wd(38, 'malını')]].forEach(([k, s, x, t0]) => iconLab(k, s, x, 760, k === 'k_gunah_2' ? 85 : 140, t, L(t0), RDL));
    // savab meter drains while coins fly to the sins row
    const drain = clamp((t - tG) / (tE - tG + 0.4));
    meter(W / 2, 1010, 640, 1 - drain, t, L(P(39)) - 0.2, 1e9, drain > 0.95 ? 1 : 0);
    if (t > tG && t < tE + 0.6) for (let j = 0; j < 3; j++) { const x0 = [230, 540, 850][j]; for (let q = 0; q < 3; q++) { const u = ((t - tG) * 0.9 + q / 3 + j * 0.13) % 1; sprite('k_savab_1', lerp(x0, [230, 540, 850][(j + 1) % 3], 0) , lerp(560, 690, u), 50, Math.sin(u * Math.PI), u * 5); } }
    // their sins fall on him
    for (let i = 0; i < 5; i++) { const t0 = tS + i * 0.25, u = clamp((t - t0) / 0.5); if (u <= 0) continue; sprite('k_savab_5', 330 + i * 105, lerp(560, 1170, u * u), 110, 1, i * 0.7); }
    ct('günahları onun üstünə', W / 2, 1270, 44, 900, RDL, t, tS + 0.3, 1e9, { glow: '#000' });
    sourceTag('Müslim 2581', t, P(33));
  },
  life_(t, a) {
    cover('bg07', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.35 });
    const B = L(P(43)) - 0.1;
    ct('O, dünyada özünü', W / 2, 330, 52, 700, '#fff', t, L(P(42)), B);
    ct('YAXŞI İNSAN SANIRDI', W / 2, 430, 74, 900, MINT, t, L(Wd(42, 'yaxşı')), B, { glow: '#000' });
    fog(t, L(Wd(42, 'amma')), 0.7);
    ct('…amma HİSS ETMƏDİ', W / 2, 560, 64, 900, RD, t, L(Wd(42, 'amma')), B, { glow: '#000' });
    rowItem('k_gunah_5', 'Bir qeybət…', 400, t, L(P(43)));
    rowItem('k_gunah_1', 'bir söyüş…', 590, t, L(Wd(43, 'söyüş')));
    rowItem('k_gunah_4', 'qaytarılmayan borc…', 780, t, L(Wd(43, 'qaytarılmayan')));
    ct('hamısı qiyamətdə', W / 2, 950, 50, 800, '#fff', t, L(Wd(43, 'hamısı')));
    ct('SAVABLA ÖDƏNƏCƏK', W / 2, 1050, 76, 900, G1, t, L(Wd(43, 'savabla')), 1e9, { glow: '#000' });
    coinBurst(W / 2, 1050, t, L(Wd(43, 'savabla')) + 0.2, 10, 1.4, 1);
  },
  halal(t, a) {
    cover('bg08', t, a - 0.6, 1.0, 1.08, { dur: 12, dark: 0.25 });
    ct('Bu gün haqqı olan birindən', W / 2, 310, 46, 700, '#fff', t, L(P(44)));
    ct('HALALLIQ AL', W / 2, 410, 96, 900, MINT, t, L(Wd(44, 'halallıq')), 1e9, { glow: '#000', blur: 30 });
    [['DÜNYADA', 'bir söz', MINT, 290, P(45)], ['QİYAMƏTDƏ', 'savabla', RD, 790, Wd(45, 'qiyamətdə')]].forEach(([h, s, c, x, t0]) => { const al = life(t, L(t0)); if (al <= 0) return;
      grp(al, () => { ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.76)'; rrect(x - 220, 600, 440, 330, 30); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); });
      ct(h, x, 660, 42, 900, c, t, L(t0), 1e9, { align: 'center' }); ct(s, x, 870, 46, 900, '#fff', t, L(t0) + 0.2, 1e9, { align: 'center' }); });
    grp(life(t, L(P(45)) + 0.2), () => { glow(290, 760, 90, 'rgba(159,243,212,A)', 0.4); tx('🤝', 290, 765, pf(700, 100), '#fff', 1); });
    propS('k_savab_2', t, L(Wd(45, 'qiyamətdə')) + 0.2, 790, 765, 140);
  },
  cta(t, a) {
    cover('bg09', t, a - 0.6, 1.0, 1.06, { dur: 10, dark: 0.2 });
    ct('Şərhdə yaz:', W / 2, 330, 64, 900, '#fff', t, L(P(46)), 1e9, { glow: '#000' });
    const tc = L(P(47));
    grp(life(t, tc), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(70, 470, 940, 140, 30); ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(145, 540, 40, 0, 7); ctx.clip(); ctx.drawImage(logo, 105, 500, 80, 80); ctx.restore(); const s = 'Allahım, məni müflislərdən etmə 🤲', n = Math.floor(clamp((t - tc - 0.2) * 14, 0, [...s].length)); tx([...s].slice(0, n).join('') + (Math.sin(t * 10) > 0 ? '|' : ''), 205, 542, pf(800, 38), INKD, 1, { align: 'left' }); });
    ct('AMİN', W / 2, 740, 96, 900, MINT, t, L(P(49)), 1e9, { glow: '#000', blur: 30 });
  },
  teaser(t, a) {
    cover('bg10', t, a - 0.6, 1.08, 1.0, { dur: 8, dark: 0.2 });
    chipT('NÖVBƏTİ VİDEO', W / 2, 300, t, L(P(50)), 1e9, G1, 36);
    ct('Möminlərə', W / 2, 420, 56, 800, '#fff', t, L(P(51)), 1e9, { glow: '#000' });
    ct('«SƏFEH» DEYƏNLƏR', W / 2, 520, 76, 900, RD, t, L(Wd(51, 'səfeh')), 1e9, { glow: '#000' });
    ct('…Allahın cavabı', W / 2, 620, 56, 900, G1, t, L(Wd(51, 'Allahın')), 1e9, { glow: '#000' });
    chipT('BƏQƏRƏ · 2:13', W / 2, 720, t, L(Wd(51, 'Allahın')) + 0.4, 1e9, G1, 32);
  },
};
const SCN = [['hook', 0], ['recite', P(3) - 0.5], ['meaning', P(7) - 0.4], ['words', P(12) - 0.4], ['sirr', P(17) - 0.4], ['story', P(24) - 0.4], ['scale', P(33) - 0.4], ['life_', P(41) - 0.4], ['halal', P(44) - 0.4], ['cta', P(46) - 0.4], ['teaser', P(50) - 0.4]];
const IMPACTS = [Wd(1, 'MÜFLİS') + 0.15, Wd(23, 'MƏHZ'), P(40)];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 9; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
const XF = 0.6;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  const cz = crash(t, L(Wd(1, 'MÜFLİS')), 1.06, 0.02);
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = (1 + 0.06 * (1 - eOut(u))) * (key === 'hook' ? cz : 1);
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  watermark8(t, 12, P(52) - 0.6);
  endCard(t);
  if (t < P(52) - 0.6) subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.5, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
