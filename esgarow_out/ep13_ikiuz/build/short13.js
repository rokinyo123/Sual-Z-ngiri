// ================= Ayənin sirri 13 — SHORT · Bəqərə 2:14–15 "İki üz" =================
// Hook: two masks / two phones (insanların yanında ↔ tək qalanda) → recitation → meaning (split) → söz-söz
// → sirr "xalav" = tək qalmaq → telefonun qarşısında → STORY dağlar boyda savab toza dönür (İbn Macə 4245)
// → bu gün (Instagram, qrup çatı, iki üzlü hədisi) → əsl sən → dua → next.
loadBgs(['bg01', 'bg02', 'bg03', 'bg04', 'bg05', 'bg06', 'bg07', 'bg08', 'bg10']);
const P = i => SUBS[i].t0, PE = i => SUBS[i].t1;
const clean = x => x.replace(/[".,:?!«»…—]/g, '');
function Wd(i, word) { const w = SUBS[i].w.find(([x]) => clean(x) === word) || SUBS[i].w.find(([x]) => clean(x).startsWith(word)); if (!w) throw new Error('word ' + word + ' in ' + i); return w[1]; }
function WdN(i, word, n) { const ws = SUBS[i].w.filter(([x]) => clean(x) === word); if (!ws[n]) throw new Error('word ' + word + ' #' + n + ' in ' + i); return ws[n][1]; }
const RD = '#ff6b5b', RDL = '#ff8f82';
const A = ['وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا', 'وَإِذَا خَلَوْا إِلَىٰ شَيَاطِينِهِمْ قَالُوا إِنَّا مَعَكُمْ', 'إِنَّمَا نَحْنُ مُسْتَهْزِئُونَ', 'اللَّهُ يَسْتَهْزِئُ بِهِمْ', 'وَيَمُدُّهُمْ فِي طُغْيَانِهِمْ يَعْمَهُونَ'];

function rowWord(ar, mean, y, t, t0, cur) {
  const a = life(t, t0); if (a <= 0) return;
  grp(a, () => { ctx.save(); ctx.fillStyle = cur ? 'rgba(40,28,8,0.82)' : 'rgba(10,10,14,0.66)'; rrect(80, y - 76, 920, 152, 30); ctx.fill(); ctx.strokeStyle = cur ? G1 : 'rgba(246,199,104,0.35)'; ctx.lineWidth = cur ? 5 : 2; if (cur) { ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; } ctx.stroke(); ctx.restore(); });
  arT(ar, 760, y, 64, t, t0, 1e9, 0.6, cur ? G2 : G1);
  ct(mean, 320, y + 2, 40, 800, '#fff', t, t0 + 0.25, 1e9, { align: 'center' });
}
function morph(k1, k2, x, y, h, t, t0, tm, d = 0.9, t1 = 1e9, glowCol = null) {
  const a = life(t, t0, t1, 0.5); if (a <= 0) return; const u = ease(clamp((t - tm) / d)), bob = Math.sin((t - t0) * 1.4) * 7, s = lerp(0.85, 1, eOut(clamp((t - t0) / 0.7)));
  if (u < 1) sprite(k1, x, y + bob, h, a * (1 - u), 0, s * (1 + 0.15 * u));
  if (u > 0) { if (glowCol) glow(x, y, h * 1.1, glowCol, 0.5 * u * a); sprite(k2, x, y + bob, h, a * u, 0, s * lerp(0.8, 1, eOut(u))); }
}
// split divider line drawn top→bottom
function divider(t, t0, x = W / 2, y0 = 480, y1 = 1120, col = 'rgba(255,255,255,0.8)') { const u = eOut(clamp((t - t0) / 0.6)); if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = '#fff'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, u)); ctx.stroke(); ctx.restore(); }
// sprite that dissolves into dust particles upward
function dustAway(k, x, y, h, t, t0, d = 1.4) { const u = clamp((t - t0) / d); if (u >= 1) return; sprite(k, x, y, h, 1 - u, 0, 1); if (u <= 0) return; ctx.save(); for (let i = 0; i < 70; i++) { const st = srand(i) * 0.4, v = clamp((u - st) / (1 - st)); if (v <= 0) continue; const px = x + (srand(i * 3) - 0.5) * h * 0.9 + (srand(i * 5) - 0.3) * 220 * v, py = y + (srand(i * 7) - 0.3) * h * 0.7 - 260 * v; ctx.fillStyle = `rgba(220,220,225,${0.8 * (1 - v)})`; ctx.beginPath(); ctx.arc(px, py, 3 + 5 * srand(i * 11), 0, 7); ctx.fill(); } ctx.restore(); }
function card2(x, y, w, h, col, t, t0, t1 = 1e9) { grp(life(t, t0, t1), () => { ctx.save(); ctx.fillStyle = 'rgba(10,10,14,0.74)'; rrect(x - w / 2, y - h / 2, w, h, 28); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }); }

const SC = {
  hook(t) {
    cover('bg01', t, 0, 1.12, 1.0, { dur: 10, dark: 0.25 }); drawDust(t, 0.3, '160,200,255');
    ctx.fillStyle = `rgba(0,0,0,${1 - R(t, 0, 0.6)})`; ctx.fillRect(0, 0, W, H);
    ct('Quranda belə bir ayə var:', W / 2, 300, 50, 700, '#fff', t, L(P(0)));
    ct('İKİ ÜZ', W / 2, 410, 110, 900, G1, t, L(Wd(0, 'insanların')), 1e9, { glow: '#ffb030', blur: 35 });
    const tL = L(Wd(0, 'insanların')), tR = L(Wd(0, 'tək'));
    divider(t, tR - 0.2, W / 2, 520, 1080);
    stick('k_uz_1', 280, 720, 280, t, tL + 0.2, 1e9, { rot: -0.05 }); sprite('k_uz_3', 280, 960, 170, life(t, tL + 0.5), -0.08);
    ct('İNSANLARIN YANINDA', 280, 1100, 36, 900, MINT, t, tL + 0.4, 1e9, { glow: '#000' });
    stick('k_uz_2', 800, 720, 280, t, tR, 1e9, { rot: 0.05 }); sprite('k_uz_4', 800, 960, 170, life(t, tR + 0.3), 0.08);
    ct('TƏK QALANDA', 800, 1100, 36, 900, RDL, t, tR + 0.2, 1e9, { glow: '#000' });
    const tE = L(Wd(1, 'açıb')); grp(life(t, L(P(1))), () => { glow(W / 2, 1230, 120, 'rgba(255,214,120,A)', 0.5); });
    propS('k_sv_3', t, L(P(1)), W / 2, 1220, 130);
    ct('ALLAH İKİSİNİ DƏ AÇIB', W / 2, 1320, 40, 900, G2, t, tE, 1e9, { glow: '#000' });
  },
  recite(t, a) {
    cover('bg02', t, a - 0.6, 1.0, 1.1, { dur: 18, dark: 0.45 }); drawDust(t, 0.35);
    chipT('BƏQƏRƏ · 2:14–15', W / 2, 300, t, a - 0.2, 1e9, G1, 36);
    const ys = [430, 535, 640, 800, 905], sz = [56, 50, 62, 64, 56];
    A.forEach((s, k) => arT(s, W / 2, ys[k], sz[k], t, L(P(2 + k)), 1e9, PE(2 + k) - P(2 + k), k === 3 ? MINT : G1));
    badge('2:14', 80, 535, t, L(P(2)), G1, '#1a1000', 32); badge('2:15', 80, 850, t, L(P(5)), G1, '#1a1000', 32);
  },
  meaning(t, a) {
    cover('bg03', t, a - 0.6, 1.0, 1.06, { dur: 16, dark: 0.35 });
    const B = L(P(12)) - 0.1;
    ct('Mənası:', W / 2, 300, 46, 700, G1, t, L(P(7)));
    ct('MÖMİNLƏRLƏ', 270, 400, 40, 900, MINT, t, L(P(8)), 1e9, { align: 'center', glow: '#000' });
    stick('k_cat_1', 270, 560, 190, t, L(Wd(8, 'iman')), 1e9, { still: 1 });
    ct('«İman gətirdik»', 270, 720, 44, 900, '#fff', t, L(Wd(8, 'iman')) + 0.1, 1e9, { align: 'center', glow: '#000' });
    ct('TƏK QALANDA', 810, 400, 40, 900, RDL, t, L(P(9)), 1e9, { align: 'center', glow: '#000' });
    stick('k_cat_4', 810, 560, 180, t, L(P(11)), 1e9, { still: 1 });
    ct('«Biz sizinləyik…', 810, 700, 38, 900, '#fff', t, L(P(10)), 1e9, { align: 'center', glow: '#000' });
    ct('ələ salırdıq»', 810, 755, 38, 900, '#fff', t, L(P(11)), 1e9, { align: 'center', glow: '#000' });
    card2(W / 2, 980, 920, 230, 'rgba(246,199,104,0.8)', t, L(P(12)));
    ct('Allah da onları ƏLƏ SALIR', W / 2, 940, 50, 900, G1, t, L(P(12)), 1e9, { glow: '#000' });
    ct('və azğınlıqlarında sərgərdan buraxır', W / 2, 1020, 38, 700, '#fff', t, L(Wd(12, 'azğınlıqları')), 1e9);
  },
  words(t, a) {
    cover('bg03', t, a - 0.6, 1.1, 1.0, { dur: 14, dark: 0.6, dx: 60 });
    chipT('SÖZ-SÖZ', W / 2, 300, t, L(P(13)), 1e9, MINT, 36);
    const rows = [['لَقُوا', 'görüşəndə', 14], ['خَلَوْا', 'tək qalanda', 15], ['مُسْتَهْزِئُونَ', 'ələ salanlar', 16], ['يَعْمَهُونَ', 'sərgərdan gəzirlər', 17]];
    rows.forEach(([ar, m, i], k) => rowWord(ar, m, 470 + k * 190, t, L(P(i)), t >= L(P(i)) && (k === 3 || t < L(P(rows[k + 1][2])))));
  },
  sirr(t, a) {
    cover('bg04', t, a - 0.6, 1.0, 1.1, { dur: 14, dark: 0.3 });
    ct('GİZLİ SİRR', W / 2, 300, 76, 900, G1, t, L(P(18)), 1e9, { glow: '#ffb030', blur: 30 });
    grp(life(t, L(P(19))), () => glow(W / 2, 500, 200, 'rgba(255,214,120,A)', 0.35));
    arT('خَلَوْا', W / 2, 500, 150, t, L(P(19)), 1e9, 0.7, G2);
    ct('XALAV — TƏK QALMAQ', W / 2, 650, 54, 900, '#fff', t, L(Wd(19, 'tək')), 1e9, { glow: '#000' });
    ct('Ayə insanı TƏK QALDIĞI anda göstərir', W / 2, 760, 40, 800, 'rgba(255,255,255,0.92)', t, L(P(20)));
    ct('Bəs bu gün ən çox harada tək qalırıq?', W / 2, 850, 40, 800, G2, t, L(P(21)));
    ct('TELEFONUN QARŞISINDA', W / 2, 980, 70, 900, RD, t, L(P(22)), 1e9, { glow: '#000', blur: 25 });
    grp(life(t, L(P(22)) + 0.2), () => glow(W / 2, 1190, 140, 'rgba(120,170,255,A)', 0.4));
    propS('k_uz_4', t, L(P(22)) + 0.2, W / 2, 1190, 200);
  },
  story(t, a) {
    cover('bg05', t, a - 0.6, 1.0, 1.08, { dur: 16, dark: 0.3 });
    const tQ = L(P(28)) - 0.1, tD = L(Wd(27, 'toza'));
    ct('Peyğəmbərimiz ﷺ buyurur:', W / 2, 300, 44, 800, G2, t, L(P(23)));
    quoteCard([['Ümmətimdən elə insanlar tanıyıram ki,', L(P(26))], ['qiyamətdə DAĞLAR BOYDA', L(Wd(27, 'dağlar')), G1], ['ağ savablarla gələcəklər…', L(Wd(27, 'ağ'))]], W / 2, 500, 940, t, L(P(26)), tQ, { size: 40, w: 800 });
    quoteCard([['«Ya Rəsulallah, onları bizə tanıt…', L(P(29))], ['bilmədən onlardan olmayaq»', L(Wd(30, 'bilmədən')), G2]], W / 2, 480, 940, t, L(P(28)), 1e9, { size: 40, w: 800 });
    ct('Səhabə soruşdu:', W / 2, 360, 36, 700, '#fff', t, L(P(28)));
    const mA = life(t, L(Wd(27, 'dağlar')));
    if (t < tD) { grp(mA, () => { glow(W / 2, 860, 260, 'rgba(255,255,255,A)', 0.35); sprite('k_sv_1', W / 2, 860, 320, 1, 0, lerp(0.8, 1, eOut(clamp((t - L(Wd(27, 'dağlar'))) / 0.8)))); }); }
    else { dustAway('k_sv_1', W / 2, 860, 320, t, tD, 1.4); sprite('k_sv_2', W / 2, 960, 130, R(t, tD + 0.6, tD + 1.4)); }
    ct('TOZA ÇEVRİLƏCƏK', W / 2, 1130, 64, 900, RD, t, tD + 0.2, 1e9, { glow: '#000' });
    sourceTag('İbn Macə 4245', t, P(26));
  },
  story2(t, a) {
    cover('bg06', t, a - 0.6, 1.0, 1.08, { dur: 12, dark: 0.25 });
    const tA = L(Wd(32, 'amma'));
    ct('Buyurdu:', W / 2, 300, 46, 900, G2, t, L(P(31)));
    ct('Onlar sizin QARDAŞLARINIZDIR…', W / 2, 400, 52, 900, '#fff', t, L(P(32)), 1e9, { glow: '#000' });
    ct('gecə ibadət edirlər…', W / 2, 490, 48, 800, MINT, t, L(Wd(32, 'gecə')), 1e9, { glow: '#000' });
    const lampA = life(t, L(Wd(32, 'gecə')) + 0.2) * (1 - R(t, tA + 0.3, tA + 1.0));
    grp(lampA, () => { glow(W / 2, 720, 180, 'rgba(255,200,110,A)', 0.55); sprite('k_sv_4', W / 2, 740, 170, 1); });
    if (t > tA) { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${0.45 * R(t, tA + 0.3, tA + 1.2)})`; ctx.fillRect(0, 560, W, 800); ctx.restore(); }
    ct('amma TƏK QALANDA…', W / 2, 920, 66, 900, RDL, t, L(Wd(32, 'tək')), 1e9, { glow: '#000' });
    pillT('ALLAHIN HARAMLARINI POZURLAR', W / 2, 1050, 46, RD, '#fff', t, L(Wd(32, 'Allahın')));
    sourceTag('İbn Macə 4245', t, P(31));
  },
  today(t, a) {
    cover('bg07', t, a - 0.6, 1.0, 1.08, { dur: 18, dark: 0.45 });
    chipT('İKİ ÜZ — BU GÜN', W / 2, 300, t, L(P(33)), 1e9, RDL, 34);
    const r1 = L(P(33)), r1b = L(Wd(33, 'evdə')), r2 = L(P(34)), r2b = L(Wd(34, 'üzünə'));
    card2(W / 2, 510, 920, 240, 'rgba(255,255,255,0.4)', t, r1);
    sprite('k_uz_3', 250, 490, 170, life(t, r1), -0.06); ct('Instagramda bir insan…', 250, 600, 32, 900, '#fff', t, r1 + 0.1, 1e9, { align: 'center' });
    ct('→', W / 2, 500, 70, 900, G1, t, r1b - 0.1); sprite('k_uz_4', 830, 490, 170, life(t, r1b), 0.06); ct('evdə başqa', 830, 600, 32, 900, RDL, t, r1b + 0.1, 1e9, { align: 'center' });
    card2(W / 2, 800, 920, 240, 'rgba(255,255,255,0.4)', t, r2);
    stick('k_cat_2', 250, 780, 140, t, r2, 1e9, { still: 1 }); ct('Qrup çatında bir söz…', 250, 890, 32, 900, '#fff', t, r2 + 0.1, 1e9, { align: 'center' });
    ct('→', W / 2, 790, 70, 900, G1, t, r2b - 0.1); stick('k_cat_3', 830, 780, 140, t, r2b, 1e9, { still: 1 }); ct('üzünə başqa söz', 830, 890, 32, 900, RDL, t, r2b + 0.1, 1e9, { align: 'center' });
    ct('Peyğəmbərimiz ﷺ buyurur:', W / 2, 1000, 38, 800, G2, t, L(P(35)));
    quoteCard([['İnsanların ən pisi İKİ ÜZLÜDÜR —', L(P(38))], ['bunlara bir üzlə, onlara başqa üzlə gəlir', L(P(39)), RDL]], W / 2, 1150, 960, t, L(P(38)), 1e9, { size: 36, w: 800 });
    sourceTag('Buxari 6058 · Müslim 2526', t, P(35));
  },
  real(t, a) {
    cover('bg08', t, a - 0.6, 1.0, 1.08, { dur: 12, dark: 0.25 });
    ct('Telefonu söndürəndə kim olursan…', W / 2, 310, 48, 800, '#fff', t, L(P(40)));
    ct('ƏSL SƏN ODUR', W / 2, 420, 96, 900, MINT, t, L(Wd(40, 'əsl')), 1e9, { glow: '#000', blur: 30 });
    morph('k_uz_4', 'k_sv_3', W / 2, 700, 240, t, L(P(40)) + 0.3, L(Wd(41, 'Allah')), 0.8, 1e9, 'rgba(255,214,120,A)');
    ct('Tək qalanda da ALLAH GÖRÜR', W / 2, 920, 54, 900, G1, t, L(Wd(41, 'Allah')), 1e9, { glow: '#000' });
    ct('tək qalanda edilən bir yaxşılıq', W / 2, 1030, 42, 800, '#fff', t, L(WdN(41, 'tək', 0)));
    ct('DAĞLAR BOYDA OLUR', W / 2, 1120, 64, 900, G2, t, L(Wd(41, 'dağlar')), 1e9, { glow: '#ffb030', blur: 30 });
  },
  cta(t, a) {
    cover('bg06', t, a - 0.6, 1.1, 1.0, { dur: 10, dark: 0.3, dx: -50 });
    ct('Şərhdə yaz:', W / 2, 330, 64, 900, '#fff', t, L(P(42)), 1e9, { glow: '#000' });
    const tc = L(P(43));
    grp(life(t, tc), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(60, 470, 960, 140, 30); ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(135, 540, 40, 0, 7); ctx.clip(); ctx.drawImage(logo, 95, 500, 80, 80); ctx.restore(); const s = 'Allahım, gizlimi aşkarımdan xeyirli et 🤲', n = Math.floor(clamp((t - tc - 0.2) * 15, 0, [...s].length)); tx([...s].slice(0, n).join('') + (Math.sin(t * 10) > 0 ? '|' : ''), 192, 542, pf(800, 34), INKD, 1, { align: 'left' }); });
    ct('AMİN', W / 2, 740, 96, 900, MINT, t, L(P(45)), 1e9, { glow: '#000', blur: 30 });
  },
  teaser(t, a) {
    cover('bg10', t, a - 0.6, 1.08, 1.0, { dur: 8, dark: 0.2 });
    chipT('NÖVBƏTİ VİDEO', W / 2, 300, t, L(P(46)), 1e9, G1, 36);
    ct('Hidayəti verib…', W / 2, 420, 56, 800, '#fff', t, L(P(47)), 1e9, { glow: '#000' });
    ct('ZƏLALƏTİ SATIN ALANLAR', W / 2, 520, 64, 900, RD, t, L(Wd(47, 'zəlaləti')), 1e9, { glow: '#000' });
    ct('Ən zərərli ticarət', W / 2, 620, 56, 900, G1, t, L(P(48)), 1e9, { glow: '#000' });
    chipT('BƏQƏRƏ · 2:16', W / 2, 720, t, L(P(48)) + 0.4, 1e9, G1, 32);
  },
};
const SCN = [['hook', 0], ['recite', P(2) - 0.5], ['meaning', P(7) - 0.4], ['words', P(13) - 0.4], ['sirr', P(18) - 0.4], ['story', P(23) - 0.4], ['story2', P(31) - 0.4], ['today', P(33) - 0.4], ['real', P(40) - 0.4], ['cta', P(42) - 0.4], ['teaser', P(46) - 0.4]];
const IMPACTS = [Wd(1, 'açıb'), P(22), Wd(27, 'toza'), Wd(32, 'haramlarını')];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 7; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
const XF = 0.6;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = 1 + 0.06 * (1 - eOut(u));
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  watermark8(t, 13, P(49) - 0.6);
  endCard(t);
  if (t < P(49) - 0.6) subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.5, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
