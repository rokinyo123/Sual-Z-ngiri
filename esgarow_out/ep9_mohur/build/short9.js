// ================= Ayənin sirri 9 — SHORT · Bəqərə 2:6–7 "Qəlbə möhür" =================
// House structure: "Quranda belə bir ayə var" hook → recitation → meaning → detail (xırdalama) → advice → next title.
loadBgs(['bg01', 'bg02', 'bg03', 'bg04', 'bg05', 'bg06', 'bg07', 'bg08', 'bg09', 'bg10', 'bg11', 'bg12']);
const P = i => SUBS[i].t0, PE = i => SUBS[i].t1;
function Wd(i, word) { const w = SUBS[i].w.find(([x]) => x.replace(/[".,:?!«»]/g, '') === word) || SUBS[i].w.find(([x]) => x.replace(/[".,:?!«»]/g, '').startsWith(word)); if (!w) throw new Error('word ' + word + ' in ' + i); return w[1]; }
const A6a = 'إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ', A6b = 'أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ';
const A7a = 'خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ', A7b = 'وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ', A7c = 'وَلَهُمْ عَذَابٌ عَظِيمٌ';

// ---- the heart (code-drawn): black dots spread, then istighfar wipes them one by one ----
const HC = [540, 870], HS = 17;
const heartPt = s => [HC[0] + HS * 16 * Math.pow(Math.sin(s), 3), HC[1] - HS * (13 * Math.cos(s) - 5 * Math.cos(2 * s) - 2 * Math.cos(3 * s) - Math.cos(4 * s))];
function heartPath() { ctx.beginPath(); for (let i = 0; i <= 120; i++) { const [x, y] = heartPt(i / 120 * Math.PI * 2); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); }
const DOTS = (() => { const out = []; let k = 0; const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.beginPath(); for (let i = 0; i <= 120; i++) { const s = i / 120 * Math.PI * 2, x = HC[0] + HS * 16 * Math.pow(Math.sin(s), 3), y = HC[1] - HS * (13 * Math.cos(s) - 5 * Math.cos(2 * s) - 2 * Math.cos(3 * s) - Math.cos(4 * s)); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath();
  while (out.length < 34 && k < 5000) { const x = HC[0] + (srand(k * 3 + 1) - 0.5) * 520, y = HC[1] + (srand(k * 5 + 2) - 0.5) * 460; if (g.isPointInPath(x, y)) out.push([x, y, 22 + srand(k + 9) * 36]); k++; } return out; })();
function heart(t, nOn, grow, wipe, shine, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  glow(HC[0], HC[1] - 20, 420, shine > 0 ? 'rgba(255,214,120,A)' : 'rgba(255,255,255,A)', 0.25 + 0.5 * shine);
  heartPath(); ctx.fillStyle = lg(0, HC[1] - 260, 0, HC[1] + 280, [[0, '#ffffff'], [1, shine > 0 ? '#ffe9b0' : '#d9dde3']]); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fill();
  ctx.save(); heartPath(); ctx.clip();
  DOTS.forEach(([x, y, r], i) => { const on = clamp(nOn - i), w = clamp(wipe * DOTS.length - i); const al = on * (1 - w); if (al <= 0) return; const rr = r * (1 + grow * 2.4); ctx.fillStyle = `rgba(14,10,12,${0.92 * al})`; ctx.beginPath(); ctx.arc(x, y, rr * (0.6 + 0.4 * on), 0, 7); ctx.fill(); if (w > 0 && w < 1) glow(x, y, rr * 1.6, 'rgba(255,230,160,A)', 0.8 * w); });
  ctx.restore();
  if (shine > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; heartPath(); ctx.strokeStyle = `rgba(255,220,140,${0.9 * shine})`; ctx.lineWidth = 8; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 40; ctx.stroke(); for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2 + t * 0.4; glow(HC[0] + Math.cos(an) * 330 * shine, HC[1] + Math.sin(an) * 300 * shine, 22, 'rgba(255,240,190,A)', shine); } ctx.restore(); }
  ctx.restore();
}
function seal(x, y, t, t0, r = 62) { const u = clamp((t - t0) / 0.25); if (u <= 0) return; const s = lerp(2.2, 1, eOut(u)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = clamp(u * 1.5); ctx.fillStyle = lg(0, -r, 0, r, [[0, '#c8302b'], [1, '#7c1410']]); ctx.beginPath(); for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2, rr = r * (i % 2 ? 0.92 : 1); i ? ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : ctx.moveTo(rr, 0); } ctx.closePath(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; ctx.fill(); ctx.strokeStyle = 'rgba(255,200,180,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, 7); ctx.stroke(); ctx.restore(); }
function curtain(x, y, w, h, t, t0) { const u = eOut(clamp((t - t0) / 0.6)); if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h * u); ctx.clip(); for (let i = 0; i < 7; i++) { const cx = x - w / 2 + (i + 0.5) * w / 7; ctx.fillStyle = lg(cx - w / 14, 0, cx + w / 14, 0, [[0, '#4a0a12'], [0.5, '#a3182b'], [1, '#4a0a12']]); ctx.fillRect(cx - w / 14, y - h / 2, w / 7 + 1, h); } ctx.restore(); }
function waves360(x, y, t, t0, a = 1) { if (t < t0) return; ctx.save(); for (let i = 0; i < 4; i++) { const u = ((t - t0) * 0.7 + i / 4) % 1; ctx.strokeStyle = `rgba(159,243,212,${a * (1 - u) * 0.9})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 60 + u * 230, 0, 7); ctx.stroke(); } ctx.restore(); }
function cone(x, y, t, t0, a = 1) { if (t < t0) return; const u = clamp((t - t0) / 0.6) * a; ctx.save(); ctx.globalAlpha = u * 0.55; ctx.fillStyle = lg(x, 0, x + 380, 0, [[0, 'rgba(255,220,150,0.9)'], [1, 'rgba(255,220,150,0)']]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 380, y - 120); ctx.lineTo(x + 380, y + 120); ctx.closePath(); ctx.fill(); ctx.restore(); }

function counter(from, to, t, t0, d, x, y, size, col = G1, t1 = 1e9) { const a = life(t, t0, t1, 0.4); if (a <= 0) return; const v = Math.round(lerp(from, to, eOut(clamp((t - t0) / d)))); tx(String(v), x, y, pf(900, size), col, a, { glow: '#ffb030', blur: 35 }); }
const SC = {
  hook(t) {
    cover('bg01', t, 0, 1.12, 1.0, { dur: 14 }); drawDust(t, 0.4);
    ctx.fillStyle = `rgba(0,0,0,${1 - R(t, 0, 0.6)})`; ctx.fillRect(0, 0, W, H);
    ct('Quranda belə bir ayə var:', W / 2, 310, 50, 700, '#fff', t, L(P(0)));
    kwLine([['ALLAH', L(P(1))], ['3', L(Wd(1, 'üç')), G1], ['ŞEYİ', L(Wd(1, 'üç')) + 0.2], ['BAĞLAYIR', L(Wd(1, 'bağlayır'))]], W / 2, 410, 76, 900, '#fff', t);
    [[240, 'k_qapi_1', 'QƏLB', P(2)], [540, 'k_qapi_2', 'QULAQ', P(3)], [840, 'k_qapi_3', 'GÖZ', P(4)]].forEach(([x, k, lab, t0]) => { stick(k, x, 860, 230, t, L(t0), 1e9, { still: 1 }); ct(lab, x, 1035, 40, 900, '#fff', t, L(t0) + 0.15); });
    const st = L(Wd(5, 'möhür')); seal(240, 900, t, st); seal(540, 900, t, st + 0.35);
    if (t > st - 0.35 && t < st + 0.9) { const u = clamp((t - st + 0.35) / 1.2); stick('k_qapi_4', lerp(240, 540, clamp((u - 0.3) / 0.3)), 760 - 60 * Math.abs(Math.sin(u * Math.PI * 2)), 170, t, st - 0.35, st + 0.9, { still: 1 }); }
    curtain(840, 860, 260, 300, t, L(Wd(6, 'pərdə')));
    stampT('MÖHÜR', t, st + 0.5, 390, 1150, 54, '#ff6b5b'); stampT('PƏRDƏ', t, L(Wd(6, 'pərdə')) + 0.3, 840, 1150, 54, G1);
    ct('NİYƏ?', W / 2, 590, 150, 900, G1, t, L(P(7)), 1e9, { glow: '#ffb030', blur: 45 });
  },
  recite(t, a) {
    cover('bg02', t, a - 0.6, 1.0, 1.1, { dur: 16, dark: 0.45 }); drawDust(t, 0.35);
    chipT('BƏQƏRƏ · 2:6–7', W / 2, 300, t, a - 0.2, 1e9, G1, 36);
    arT(A6a, W / 2, 440, 62, t, L(P(8)), 1e9, PE(8) - P(8));
    arT(A6b, W / 2, 545, 58, t, L(P(9)), 1e9, PE(9) - P(9));
    arT(A7a, W / 2, 700, 62, t, L(P(10)), 1e9, PE(10) - P(10));
    arT(A7b, W / 2, 805, 62, t, L(P(11)), 1e9, PE(11) - P(11));
    arT(A7c, W / 2, 910, 62, t, L(P(12)), 1e9, PE(12) - P(12));
    badge('2:6', 90, 490, t, L(P(8)), G1, '#1a1000', 34); badge('2:7', 90, 800, t, L(P(10)), G1, '#1a1000', 34);
  },
  meaning(t, a) {
    cover('bg03', t, a - 0.6, 1.0, 1.1, { dur: 22, dark: 0.3 });
    const B = P(19) - 0.25;
    ct('Mənası:', W / 2, 310, 46, 700, G1, t, L(P(13)), B);
    ct('Kafir olanlar üçün', W / 2, 410, 56, 700, '#fff', t, L(P(15)), B);
    ct('FƏRQİ YOXDUR', W / 2, 510, 96, 900, G1, t, L(Wd(15, 'fərqi')), B, { glow: '#000' });
    pillT('qorxutsan da', 330, 650, 44, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(16)), B); pillT('qorxutmasan da', 750, 650, 44, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(17)), B);
    ct('iman gətirməzlər', W / 2, 790, 64, 900, '#fff', t, L(P(18)), B, { glow: '#000' });
    // phase B
    ct('Allah onların qəlblərinə və qulaqlarına', W / 2, 330, 44, 700, '#fff', t, L(P(19)));
    ct('MÖHÜR VURUB', W / 2, 420, 84, 900, '#ff7a6b', t, L(Wd(19, 'möhür')), 1e9, { glow: '#000' });
    ct('gözlərinin üstündə isə PƏRDƏ var', W / 2, 520, 48, 800, G2, t, L(P(20)));
    stick('k_qapi_1', 300, 800, 190, t, L(P(19)) + 0.2, 1e9, { still: 1 }); stick('k_qapi_2', 540, 800, 190, t, L(P(19)) + 0.5, 1e9, { still: 1 }); stick('k_qapi_3', 790, 800, 190, t, L(P(20)), 1e9, { still: 1 });
    seal(300, 830, t, L(Wd(19, 'möhür')), 50); seal(540, 830, t, L(Wd(19, 'möhür')) + 0.25, 50); curtain(790, 800, 220, 240, t, L(Wd(20, 'pərdə')));
    ct('Onları böyük əzab gözləyir', W / 2, 1060, 52, 800, '#fff', t, L(P(21)));
  },
  savaun(t, a) {
    cover('bg04', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.2 });
    const bx = 330, by = 520, an = Math.sin((t - a) * 0.9) * 0.6 - 0.1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.35 * R(t, a, a + 1); ctx.fillStyle = lg(bx, by, bx + Math.cos(an) * 900, by + Math.sin(an) * 900, [[0, 'rgba(255,230,170,0.9)'], [1, 'rgba(255,230,170,0)']]); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(an - 0.12) * 1000, by + Math.sin(an - 0.12) * 1000); ctx.lineTo(bx + Math.cos(an + 0.12) * 1000, by + Math.sin(an + 0.12) * 1000); ctx.closePath(); ctx.fill(); ctx.restore();
    chipT('XIRDALAYAQ', W / 2, 300, t, L(P(23)), 1e9, MINT, 36);
    arT('سَوَاءٌ', W / 2, 470, 140, t, L(P(24)), 1e9, 0.7);
    ct('= fərqi yoxdur', W / 2, 620, 58, 800, '#fff', t, L(P(25)));
    ct('Problem xəbərdarlıqda deyil…', W / 2, 760, 50, 700, '#fff', t, L(P(26)));
    ct('QƏLBİN QAPISINDADIR', W / 2, 860, 78, 900, G1, t, L(P(27)), 1e9, { glow: '#000' });
    stick('k_dua_1', W / 2, 1080, 200, t, L(P(27)) + 0.3, 1e9, { still: 1 });
    ct('Haqqı bilib üz döndərən qəlbə söz çatmır', W / 2, 1270, 40, 700, '#fff', t, L(P(28)));
  },
  why(t, a) {
    cover('bg05', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.35 });
    ct('Niyə qəlbə və qulağa MÖHÜR,', W / 2, 310, 52, 800, '#fff', t, L(P(29)));
    ct('gözə isə PƏRDƏ?', W / 2, 395, 64, 900, G1, t, L(P(30)), 1e9, { glow: '#000' });
    stick('k_qapi_2', 280, 760, 230, t, L(P(31)), 1e9, { still: 1 }); waves360(280, 760, t, L(P(32)), 1 - R(t, P(34), P(34) + 0.4));
    pillT('HƏR TƏRƏFDƏN', 280, 960, 38, MINT, INKD, t, L(Wd(32, 'hər')));
    seal(280, 800, t, L(P(33)) + 0.3, 56); stampT('MÖHÜR', t, L(Wd(33, 'möhürlə')), 280, 1080, 46, '#ff6b5b');
    stick('k_qapi_3', 790, 760, 210, t, L(P(34)), 1e9, { still: 1 }); cone(870, 760, t, L(Wd(34, 'qarşısını')), 1 - R(t, P(35), P(35) + 0.4));
    pillT('YALNIZ QARŞIDAN', 790, 960, 38, 'rgba(250,245,230,0.95)', '#1a1000', t, L(Wd(34, 'qarşısını')));
    curtain(790, 760, 230, 260, t, L(Wd(35, 'pərdə'))); stampT('PƏRDƏ', t, L(Wd(35, 'pərdə')) + 0.3, 790, 1080, 46, G1);
    sourceTag('Təfsir alimlərinin izahı · Bəqərə 2:7', t, P(31));
  },
  dots(t, a) {
    cover('bg06', t, a - 0.6, 1.0, 1.08, { dur: 18, dark: 0.45 });
    ct('Bəs bu möhür necə vurulur?', W / 2, 300, 52, 800, '#fff', t, L(P(36)), P(38) - 0.15);
    ct('BİR GÜNDƏ YOX', W / 2, 400, 80, 900, G1, t, L(P(37)), P(38) - 0.15, { glow: '#000' });
    ct('Peyğəmbərimiz buyurur:', W / 2, 300, 44, 700, 'rgba(255,255,255,0.9)', t, L(P(38)), P(44) - 0.15);
    ct('Hər günah — qəlbdə QARA bir nöqtə', W / 2, 390, 50, 800, '#fff', t, L(P(40)), P(44) - 0.15);
    ct('Təkrar etsə — nöqtə böyüyür', W / 2, 470, 46, 700, '#ff9a8f', t, L(P(41)), P(44) - 0.15);
    const n = lerp(0, 4, R(t, L(Wd(40, 'qara')), L(Wd(40, 'qara')) + 0.6)) + lerp(0, 10, R(t, L(P(41)), L(P(41)) + 1.5)) + lerp(0, 20, R(t, L(P(43)), L(P(43)) + 1.8));
    heart(t, n, R(t, L(P(42)), L(P(43)) + 1.8) * 0.35, 0, 0, life(t, L(P(39)), 1e9, 0.6));
    ct('QURAN BUNA «PAS» DEYİR', W / 2, 330, 68, 900, '#ff9a8f', t, L(P(44)), 1e9, { glow: '#000' });
    arT('رَانَ عَلَىٰ قُلُوبِهِم', W / 2, 430, 72, t, L(Wd(44, 'pas')), 1e9, 0.8, '#ffb4a8');
    sourceTag('Tirmizi 3334 · Mutaffifin 83:14', t, P(38));
  },
  turn(t, a) {
    cover('bg07', t, a - 0.6, 1.0, 1.1, { dur: 12, dark: 0.3 });
    ct('Başqa bir ayədə:', W / 2, 300, 44, 700, 'rgba(255,255,255,0.9)', t, L(P(45)));
    quoteCard([['Onlar haqdan döndükdə…', L(P(46))], ['Allah da qəlblərini döndərdi', L(P(47)), G1]], W / 2, 500, 900, t, L(P(46)), 1e9, { size: 52, w: 800 });
    arT('فَلَمَّا زَاغُوا أَزَاغَ اللَّهُ قُلُوبَهُمْ', W / 2, 690, 64, t, L(P(47)) + 0.3, 1e9, 1.0);
    ct('Möhür — insanın', W / 2, 860, 56, 800, '#fff', t, L(P(48)));
    ct('ÖZ SEÇİMİNDƏN SONRA', W / 2, 950, 76, 900, '#ff9a8f', t, L(Wd(48, 'seçimindən')), 1e9, { glow: '#000' });
    sourceTag('Saff 61:5', t, P(46));
  },
  polish(t, a) {
    cover('bg08', t, a - 0.6, 1.0, 1.08, { dur: 12, dark: 0.35 });
    ct('AMMA HƏDİSİN DAVAMI VAR', W / 2, 300, 60, 900, MINT, t, L(P(49)), P(51) - 0.15, { glow: '#000' });
    ct('Tövbə edib «Əstəğfirullah» desə…', W / 2, 390, 46, 700, '#fff', t, L(P(50)), P(51) - 0.15);
    ct('QƏLBİ CİLALANIR', W / 2, 330, 96, 900, G1, t, L(P(51)), 1e9, { glow: '#ffb030', blur: 40 });
    ct('Nöqtə silinir… qəlb yenidən parlayır', W / 2, 430, 44, 700, '#fff', t, L(P(52)));
    const wipe = R(t, L(Wd(50, 'Əstəğfirullah')), L(P(53)) + 0.8), shine = R(t, L(P(53)), L(P(53)) + 0.8);
    heart(t, 34, 0.35, wipe, shine);
    stick('k_guzgu_1', 170, 1230, 150, t, a, L(P(51)) + 0.2, { still: 1 }); stick('k_guzgu_2', 170, 1230, 150, t, L(P(51)), 1e9, { still: 1 });
    sourceTag('Tirmizi 3334', t, a);
  },
  prophet(t, a) {
    cover('bg09', t, a - 0.6, 1.0, 1.1, { dur: 10 });
    ct('Peyğəmbərimiz özü gündə', W / 2, 330, 52, 700, '#fff', t, L(P(54)));
    counter(0, 70, t, L(Wd(54, 'yetmiş')) - 0.3, 1.0, W / 2 - 40, 560, 230, G1);
    ct('+', W / 2 + 170, 520, 140, 900, G1, t, L(Wd(54, 'yetmiş')) + 0.7, 1e9, { align: 'center' });
    ct('dəfə istiğfar edərdi', W / 2, 730, 56, 800, '#fff', t, L(Wd(54, 'istiğfar')));
    ct('halbuki bütün günahları bağışlanmışdı', W / 2, 880, 44, 700, G2, t, L(P(55)));
    sourceTag('Buxari 6307 · Fəth 48:2', t, P(54));
  },
  door(t, a) {
    cover('bg10', t, a - 0.6, 1.0, 1.1, { dur: 10, dark: 0.15 });
    ct('Möhürlü qəlb', W / 2, 310, 60, 900, '#ff9a8f', t, L(P(56)), 1e9, { glow: '#000' });
    ct('bağışlanma diləmək istəmir', W / 2, 395, 50, 700, '#fff', t, L(P(56)) + 0.6);
    ct('Sən bu sözü deyirsənsə…', W / 2, 540, 50, 700, '#fff', t, L(P(57)));
    ct('QƏLBİN HƏLƏ AÇIQDIR', W / 2, 640, 78, 900, MINT, t, L(P(58)), 1e9, { glow: '#000' });
    stick('k_dua_1', W / 2, 960, 230, t, L(P(56)) + 0.3, L(P(58)) + 0.1, { still: 1 }); stick('k_dua_2', W / 2, 960, 230, t, L(P(58)), 1e9, { still: 1 });
    if (t > L(P(58))) glow(W / 2, 960, 260, 'rgba(255,214,140,A)', 0.6 * R(t, L(P(58)), L(P(58)) + 0.8));
    ct('QAPI HƏLƏ AÇIQDIR', W / 2, 1210, 70, 900, G1, t, L(P(59)), 1e9, { glow: '#000' });
  },
  together(t, a) {
    cover('bg11', t, a - 0.6, 1.0, 1.08, { dur: 10, dark: 0.3 });
    ct('Gəl, bu an birlikdə deyək:', W / 2, 320, 54, 700, '#fff', t, L(P(60)));
    arT('أَسْتَغْفِرُ اللَّهَ', W / 2, 520, 130, t, L(P(62)) - 0.2, 1e9, 0.9);
    ct('Əstəğfirullah', W / 2, 680, 76, 900, G1, t, L(P(62)), 1e9, { glow: '#ffb030', blur: 35 });
    grp(life(t, L(P(63))), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(110, 860, 860, 140, 30); ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(185, 930, 40, 0, 7); ctx.clip(); ctx.drawImage(logo, 145, 890, 80, 80); ctx.restore(); const s = 'Əstəğfirullah 🤲', n = Math.floor(clamp((t - L(P(63)) - 0.5) * 9, 0, [...s].length)); tx([...s].slice(0, n).join('') + (Math.sin(t * 10) > 0 ? '|' : ''), 250, 932, pf(800, 46), INKD, 1, { align: 'left' }); });
    ct('Şərhdə yaz 👇', W / 2, 1100, 54, 900, MINT, t, L(P(63)) + 0.3);
  },
  teaser(t, a) {
    cover('bg12', t, a - 0.6, 1.08, 1.0, { dur: 8, dark: 0.2 });
    chipT('NÖVBƏTİ VİDEO', W / 2, 300, t, L(P(64)), 1e9, G1, 36);
    ct('DİLİ İLƏ İNANAN…', W / 2, 430, 76, 900, '#fff', t, L(P(65)), 1e9, { glow: '#000' });
    ct('QƏLBİ İLƏ İNANMAYAN', W / 2, 530, 76, 900, G1, t, L(P(66)), 1e9, { glow: '#000' });
  },
};
const SCN = [['hook', 0], ['recite', P(8) - 0.5], ['meaning', P(13) - 0.4], ['savaun', P(22) - 0.4], ['why', P(29) - 0.4], ['dots', P(36) - 0.4], ['turn', P(45) - 0.4], ['polish', P(49) - 0.4], ['prophet', P(54) - 0.4], ['door', P(56) - 0.4], ['together', P(60) - 0.4], ['teaser', P(64) - 0.4]];
const IMPACTS = [Wd(1, 'üç'), Wd(5, 'möhür'), P(7), Wd(19, 'möhür'), P(27), P(51), P(58)];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 9; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
const XF = 0.6;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  const cz = crash(t, L(P(7)), 1.08, 0.02);
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = (1 + 0.06 * (1 - eOut(u))) * (key === 'hook' ? cz : 1);
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  watermark8(t, 9, P(67) - 0.6);
  endCard(t);
  if (t < P(67) - 0.6) subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.5, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
