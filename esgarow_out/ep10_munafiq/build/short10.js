// ================= Ayənin sirri 10 — SHORT · Bəqərə 2:8–9 "Münafiq" =================
// House structure: hook (4 · 2 · 13 ayahs) → recitation → meaning → xırdalama → nəsihət (3 signs, fear, 3 deeds) → next title.
loadBgs(['bg01', 'bg02', 'bg03', 'bg04', 'bg05', 'bg06', 'bg07', 'bg08', 'bg09', 'bg10', 'bg12']);
const P = i => SUBS[i].t0, PE = i => SUBS[i].t1;
function Wd(i, word) { const w = SUBS[i].w.find(([x]) => x.replace(/[".,:?!«»]/g, '') === word) || SUBS[i].w.find(([x]) => x.replace(/[".,:?!«»]/g, '').startsWith(word)); if (!w) throw new Error('word ' + word + ' in ' + i); return w[1]; }
function counter(from, to, t, t0, d, x, y, size, col = G1, t1 = 1e9) { const a = life(t, t0, t1, 0.4); if (a <= 0) return; const v = Math.round(lerp(from, to, eOut(clamp((t - t0) / d)))); tx(String(v), x, y, pf(900, size), col, a, { glow: '#000', blur: 25 }); }
const A8a = 'وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ', A8b = 'وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ';
const A9a = 'يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا', A9b = 'وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ', A9c = 'وَمَا يَشْعُرُونَ';
function bar(x, base, unit, n, col, t, t0, label, d = 0.9) {
  const u = eOut(clamp((t - t0) / d)); if (u <= 0) return; const h = unit * n * u, w = 190;
  ctx.save(); ctx.fillStyle = lg(0, base - h, 0, base, [[0, col], [1, 'rgba(0,0,0,0.6)']]); ctx.shadowColor = col; ctx.shadowBlur = 30; rrect(x - w / 2, base - h, w, h, 18); ctx.fill(); ctx.restore();
  tx(String(Math.max(1, Math.round(n * u))), x, base - h - 60, pf(900, n > 9 ? 120 : 84), col, clamp(u * 2), { glow: '#000', blur: 20 });
  ct(label, x, base + 50, 38, 800, '#fff', t, t0, 1e9, { align: 'center' });
}
function fog(t, t0, a = 1) { const k = clamp((t - t0) / 1.6) * a; if (k <= 0) return; ctx.save(); for (let i = 0; i < 14; i++) { const x = 540 + Math.sin(t * 0.3 + i) * 380, y = 640 + Math.cos(t * 0.25 + i * 1.7) * 260; const g = ctx.createRadialGradient(x, y, 0, x, y, 300); g.addColorStop(0, `rgba(225,230,236,${0.32 * k})`); g.addColorStop(1, 'rgba(225,230,236,0)'); ctx.fillStyle = g; ctx.fillRect(x - 300, y - 300, 600, 600); } ctx.restore(); }
function rowCheck(icon, label, y, t, t0) { const a = life(t, t0); if (a <= 0) return; grp(a, () => { ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.74)'; rrect(90, y - 85, 900, 170, 30); ctx.fill(); ctx.strokeStyle = 'rgba(255,122,107,0.7)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }); stick(icon, 200, y, 130, t, t0 + 0.1, 1e9, { still: 1 }); ct(label, 300, y + 4, 50, 800, '#fff', t, t0 + 0.2, 1e9, { align: 'left' }); }

const SC = {
  hook(t) {
    cover('bg01', t, 0, 1.12, 1.0, { dur: 14, dark: 0.35 }); drawDust(t, 0.4);
    ctx.fillStyle = `rgba(0,0,0,${1 - R(t, 0, 0.6)})`; ctx.fillRect(0, 0, W, H);
    ct('Quranda belə bir ayə var:', W / 2, 300, 50, 700, '#fff', t, L(P(0)));
    ct('BƏQƏRƏ SURƏSİ AYIRIR:', W / 2, 390, 56, 900, G2, t, L(P(1)));
    const base = 1250, unit = 40;
    bar(220, base, unit, 4, '#7be3a2', t, L(Wd(1, 'dörd')), 'MÖMİNLƏR');
    bar(540, base, unit, 2, '#ff6b5b', t, L(Wd(3, 'iki')), 'KAFİRLƏR');
    bar(860, base, unit, 13, G1, t, L(Wd(5, 'on')), 'MÜNAFİQLƏR', 1.3);
    ct('NİYƏ?', 380, 610, 150, 900, G1, t, L(P(6)), 1e9, { align: 'center', glow: '#ffb030', blur: 45 });
  },
  recite(t, a) {
    cover('bg02', t, a - 0.6, 1.0, 1.1, { dur: 18, dark: 0.45 }); drawDust(t, 0.35);
    chipT('BƏQƏRƏ · 2:8–9', W / 2, 300, t, a - 0.2, 1e9, G1, 36);
    const m7 = P(7) + (PE(7) - P(7)) * 0.62;
    arT(A8a, W / 2, 440, 58, t, L(P(7)), 1e9, m7 - P(7));
    arT(A8b, W / 2, 540, 58, t, L(m7), 1e9, PE(8) - m7);
    arT(A9a, W / 2, 700, 62, t, L(P(9)), 1e9, PE(9) - P(9));
    arT(A9b, W / 2, 800, 62, t, L(P(10)), 1e9, PE(10) - P(10));
    arT(A9c, W / 2, 900, 62, t, L(P(11)), 1e9, PE(11) - P(11));
    badge('2:8', 90, 490, t, L(P(7)), G1, '#1a1000', 34); badge('2:9', 90, 800, t, L(P(9)), G1, '#1a1000', 34);
  },
  meaning(t, a) {
    cover('bg03', t, a - 0.6, 1.0, 1.08, { dur: 20, dark: 0.35 });
    const B = P(16) - 0.25;
    ct('Mənası:', W / 2, 300, 46, 700, G1, t, L(P(12)), B);
    ct('İnsanlardan elələri var ki…', W / 2, 390, 52, 700, '#fff', t, L(P(13)), B);
    pillT('«Allaha və axirətə iman gətirdik»', W / 2, 500, 44, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(14)), B);
    ct('halbuki onlar', W / 2, 630, 50, 700, '#fff', t, L(P(15)), B);
    ct('MÖMİN DEYİLLƏR', W / 2, 720, 84, 900, '#ff7a6b', t, L(Wd(15, 'mömin')), B, { glow: '#000' });
    stick('k_maska_1', W / 2, 1020, 300, t, L(P(14)) + 0.4, B, { bob: 6 });
    ct('Allahı və möminləri', W / 2, 320, 52, 700, '#fff', t, L(P(16)));
    ct('ALDATMAĞA ÇALIŞIRLAR', W / 2, 410, 74, 900, G1, t, L(Wd(16, 'aldatmağa')), 1e9, { glow: '#000' });
    ct('amma yalnız', W / 2, 540, 50, 700, '#fff', t, L(P(17)));
    ct('ÖZLƏRİNİ ALDADIRLAR', W / 2, 630, 74, 900, '#ff7a6b', t, L(Wd(17, 'özlərini')), 1e9, { glow: '#000' });
    fog(t, L(P(18)), 0.8);
    ct('…və bunu hiss etmirlər', W / 2, 820, 56, 800, 'rgba(255,255,255,0.85)', t, L(P(18)));
  },
  why13(t, a) {
    cover('bg04', t, a - 0.6, 1.0, 1.1, { dur: 14, dark: 0.2 });
    chipT('XIRDALAYAQ', W / 2, 300, t, L(P(20)), 1e9, MINT, 36);
    ct('NİYƏ 13 AYƏ?', W / 2, 410, 96, 900, G1, t, L(P(21)), 1e9, { glow: '#000' });
    ct('Alimlər deyir:', W / 2, 520, 44, 700, 'rgba(255,255,255,0.9)', t, L(P(22)));
    pillT('KAFİR — AÇIQ DÜŞMƏN', W / 2, 620, 48, '#ff6b5b', '#fff', t, L(P(23)));
    ct('onu görürsən', W / 2, 715, 42, 700, '#fff', t, L(P(24)));
    pillT('MÜNAFİQ — GİZLİ DÜŞMƏN', W / 2, 820, 48, G1, '#1a1000', t, L(P(25)));
    const pulse = life(t, L(P(25)) + 0.5); if (pulse > 0) glow(330, 1150, 260, 'rgba(255,60,50,A)', 0.35 * pulse * (0.7 + 0.3 * Math.sin(t * 5)));
    ct('ona görə DAHA TƏHLÜKƏLİDİR', W / 2, 930, 54, 900, '#fff', t, L(P(26)), 1e9, { glow: '#000' });
  },
  tongue(t, a) {
    cover('bg05', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.4 });
    ct('«Amənna» deyirlər', W / 2, 300, 54, 800, '#fff', t, L(P(27)), L(P(29)) - 0.05);
    arT('آمَنَّا', W / 2, 420, 110, t, L(P(27)), 1e9, 0.6);
    ct('— iman gətirdik', W / 2, 530, 44, 700, G2, t, L(P(28)));
    ct('Allah buyurur:', W / 2, 300, 44, 700, 'rgba(255,255,255,0.9)', t, L(P(29)) + 0.35);
    arT('وَمَا هُم بِمُؤْمِنِينَ', W / 2, 640, 76, t, L(P(30)), 1e9, 0.9, '#ff9a8f');
    ct('onlar mömin deyillər', W / 2, 740, 46, 800, '#ff9a8f', t, L(P(31)));
    // tongue ↔ heart link breaks
    stick('k_maska_4', 270, 1010, 190, t, L(P(32)), 1e9, { still: 1 }); stick('k_maska_3', 810, 1010, 200, t, L(P(33)), 1e9, { still: 1 });
    ct('SÖZ — DİLDƏ', 270, 1170, 40, 900, '#fff', t, L(P(32)) + 0.2, 1e9, { align: 'center' }); ct('İMAN — QƏLBDƏ', 810, 1170, 40, 900, G1, t, L(P(33)) + 0.2, 1e9, { align: 'center' });
    const lk = L(P(33)) + 0.5, br = clamp((t - lk - 0.6) / 0.3);
    if (t > lk) { ctx.save(); ctx.strokeStyle = br > 0 ? `rgba(255,107,91,${1 - 0.5 * br})` : MINT; ctx.lineWidth = 7; ctx.setLineDash([16, 10]); const u = eOut(clamp((t - lk) / 0.6));
      ctx.beginPath(); ctx.moveTo(380, 1010); ctx.lineTo(lerp(380, 520 - 30 * br, u), 1010 - 18 * br); ctx.stroke(); if (u >= 1) { ctx.beginPath(); ctx.moveTo(560 + 30 * br, 1010 + 18 * br); ctx.lineTo(700, 1010); ctx.stroke(); } ctx.restore(); if (br > 0) tx('✕', 540, 1010, pf(900, 70), '#ff6b5b', br, { glow: '#000', blur: 15 }); }
  },
  deceive(t, a) {
    cover('bg06', t, a - 0.6, 1.0, 1.1, { dur: 22, dark: 0.35 });
    const A = P(39) - 0.25;
    arT('يُخَادِعُونَ', W / 2, 360, 120, t, L(P(34)), A, 0.7);
    ct('aldatmağa ÇALIŞIRLAR', W / 2, 500, 60, 900, G1, t, L(P(35)), A, { glow: '#000' });
    ct('Allahı aldatmaq olarmı?', W / 2, 620, 54, 800, '#fff', t, L(P(36)), A);
    ct('yalnız ÖZLƏRİNİ', W / 2, 740, 70, 900, '#ff7a6b', t, L(Wd(38, 'özlərini')), A, { glow: '#000' });
    stick('k_maska_2', W / 2, 1020, 260, t, L(P(38)) + 0.3, A, { still: 1 });
    ct('ƏN QORXULU HİSSƏ', W / 2, 330, 64, 900, '#ff7a6b', t, L(P(39)), 1e9, { glow: '#000' });
    arT('وَمَا يَشْعُرُونَ', W / 2, 500, 120, t, L(P(40)), 1e9, 0.8);
    fog(t, L(P(41)), 1);
    ct('bunu HİSS ETMİRLƏR', W / 2, 660, 64, 900, '#fff', t, L(P(41)), 1e9, { glow: '#000' });
    ct('İnsan özünü aldadır…', W / 2, 860, 50, 700, '#fff', t, L(P(42)));
    ct('və bundan xəbəri olmur', W / 2, 940, 50, 800, G2, t, L(P(43)));
  },
  signs(t, a) {
    cover('bg07', t, a - 0.6, 1.0, 1.08, { dur: 16, dark: 0.45 });
    ct('Bəs özümüzdə necə yoxlayaq?', W / 2, 300, 50, 700, '#fff', t, L(P(44)));
    ct('MÜNAFİQİN', W / 2, 400, 60, 900, '#fff', t, L(P(46)), 1e9, { glow: '#000' });
    ct('3 ƏLAMƏTİ', W / 2, 490, 84, 900, '#ff7a6b', t, L(Wd(46, 'üçdür')), 1e9, { glow: '#000' });
    rowCheck('k_elamet_1', 'Danışanda yalan deyər', 680, t, L(P(47)));
    rowCheck('k_elamet_2', 'Sözünü tutmaz', 880, t, L(P(48)));
    rowCheck('k_elamet_3', 'Əmanətə xəyanət edər', 1080, t, L(P(49)));
    sourceTag('Buxari 33 · Müslim 59', t, P(45));
  },
  fear(t, a) {
    cover('bg08', t, a - 0.6, 1.0, 1.1, { dur: 16, dark: 0.3 });
    ct('Səhabələr belə', W / 2, 300, 54, 700, '#fff', t, L(P(50)));
    ct('BUNDAN QORXURDU', W / 2, 390, 76, 900, G1, t, L(Wd(50, 'bundan')), 1e9, { glow: '#000' });
    counter(0, 30, t, L(Wd(52, 'otuz')) - 0.3, 0.9, W / 2, 570, 170, G1);
    quoteCard([['Peyğəmbərin 30 səhabəsini gördüm —', L(P(52))], ['hamısı nifaqdan qorxurdu', L(P(53)), G1]], W / 2, 790, 920, t, L(P(52)), 1e9, { size: 42, w: 800 });
    ct('— İbn Əbi Muleykə', W / 2, 905, 34, 700, 'rgba(255,240,210,0.85)', t, L(P(52)) + 0.6);
    ct('Ondan yalnız MÖMİN qorxar,', W / 2, 1040, 52, 900, MINT, t, L(P(54)), 1e9, { glow: '#000' });
    ct('qorxmayan isə özünü aldadır', W / 2, 1120, 46, 700, '#fff', t, L(P(55)));
    sourceTag('Buxari, İman kitabı · Həsən Bəsri', t, P(51));
  },
  today(t, a) {
    cover('bg09', t, a - 0.6, 1.0, 1.08, { dur: 10, dark: 0.3 });
    ct('Gəl, bu gün', W / 2, 310, 56, 700, '#fff', t, L(P(56)));
    ct('3 ŞEY EDƏK', W / 2, 410, 90, 900, MINT, t, L(P(57)), 1e9, { glow: '#000' });
    [['Bir sözünü tut', P(58), 'k_elamet_2'], ['Bir əmanəti qoru', P(59), 'k_elamet_3'], ['Bir yalanı burax', P(60), 'k_elamet_1']].forEach(([s, t0, k], i) => {
      const y = 620 + i * 190; grp(life(t, L(t0)), () => { ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.7)'; rrect(90, y - 75, 900, 150, 28); ctx.fill(); ctx.strokeStyle = 'rgba(159,243,212,0.8)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); });
      prop((u) => icMark(true, u), t, L(t0) + 0.15, 180, y, 90, { shadow: false, float: 0 }); ct(s, 270, y + 4, 54, 900, '#fff', t, L(t0) + 0.1, 1e9, { align: 'left' });
    });
  },
  balance(t, a) {
    cover('bg10', t, a - 0.6, 1.0, 1.06, { dur: 10, dark: 0.15 });
    const lev = ease(R(t, L(P(61)), L(P(61)) + 1.4)), tilt = (1 - lev) * 0.16 * Math.cos((t - a) * 2);
    grp(life(t, a - 0.3), () => sprite('k_terezi', W / 2, 735, 430, 1, tilt, 1));
    ct('QƏLBİN', W / 2, 330, 80, 900, '#fff', t, L(P(61)), 1e9, { glow: '#000' });
    ct('DİLİNLƏ BİR OLSUN', W / 2, 430, 76, 900, G1, t, L(Wd(61, 'dilinlə')), 1e9, { glow: '#000' });
    grp(life(t, L(P(62))), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(90, 1110, 900, 130, 30); ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(160, 1175, 38, 0, 7); ctx.clip(); ctx.drawImage(logo, 122, 1137, 76, 76); ctx.restore(); const s = 'Allahım, məni nifaqdan qoru 🤲', n = Math.floor(clamp((t - L(P(62)) - 0.5) * 12, 0, [...s].length)); tx([...s].slice(0, n).join('') + (Math.sin(t * 10) > 0 ? '|' : ''), 220, 1177, pf(800, 40), INKD, 1, { align: 'left' }); });
    ct('AMİN', W / 2, 1025, 76, 900, MINT, t, L(P(65)), 1e9, { glow: '#000' });
  },
  teaser(t, a) {
    cover('bg12', t, a - 0.6, 1.08, 1.0, { dur: 8, dark: 0.2 });
    chipT('NÖVBƏTİ VİDEO', W / 2, 300, t, L(P(66)), 1e9, G1, 36);
    ct('QƏLBDƏKİ XƏSTƏLİK…', W / 2, 430, 74, 900, '#fff', t, L(P(67)), 1e9, { glow: '#000' });
    ct('ALLAH ONU NİYƏ ARTIRIR?', W / 2, 530, 64, 900, G1, t, L(P(68)), 1e9, { glow: '#000' });
  },
};
const SCN = [['hook', 0], ['recite', P(7) - 0.5], ['meaning', P(12) - 0.4], ['why13', P(19) - 0.4], ['tongue', P(27) - 0.4], ['deceive', P(34) - 0.4], ['signs', P(44) - 0.4], ['fear', P(50) - 0.4], ['today', P(56) - 0.4], ['balance', P(61) - 0.4], ['teaser', P(66) - 0.4]];
const IMPACTS = [Wd(5, 'on') + 1.0, P(6), Wd(15, 'mömin'), P(26), Wd(46, 'üçdür'), Wd(61, 'dilinlə')];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 9; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
const XF = 0.6;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  const cz = crash(t, L(P(6)), 1.08, 0.02);
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = (1 + 0.06 * (1 - eOut(u))) * (key === 'hook' ? cz : 1);
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  watermark8(t, 10, P(69) - 0.6);
  endCard(t);
  if (t < P(69) - 0.6) subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.5, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
