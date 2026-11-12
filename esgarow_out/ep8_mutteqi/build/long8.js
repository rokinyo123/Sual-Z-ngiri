// ================= Ayənin sirri 8 — LONG (16:9) · Bəqərə 2:3–5 · "Müttəqinin 5 əlaməti" =================
// Text column left (x 110–860), visuals right, tracker top centre, subtitles in the reserved bottom band.
loadBgs(['bg01_w', 'bg02_w', 'bg03_w', 'bg04_w', 'bg06_w', 'bg07_w', 'bg09_w', 'bg11_w', 'bg12_w', 'bg14_w', 'bg16_w', 'bg18_w', 'bg19_w', 'bg20_w', 'bg21_w', 'bg22_w']);
const P = i => SUBS[i].t0, PE = i => SUBS[i].t1;
function Wd(i, word) { const w = SUBS[i].w.find(([x]) => x.replace(/[".,:?!«»]/g, '') === word) || SUBS[i].w.find(([x]) => x.replace(/[".,:?!«»]/g, '').startsWith(word)); if (!w) throw new Error('word ' + word + ' in ' + i); return w[1]; }
const X0 = 110;
const lt = (s, y, size, weight, col, t, t0, t1 = 1e9, opt = {}) => ct(s, X0, y, size, weight, col, t, t0, t1, { ...opt, align: 'left' });
const lpill = (s, y, size, bg, fg, t, t0, t1 = 1e9) => { const w = measure(s, pf(800, size)) + size * 0.7; pillT(s, X0 + w / 2, y, size, bg, fg, t, t0, t1); };
const lchip = (s, y, t, t0, t1 = 1e9, col = G1) => { const w = measure(s, pf(800, 30)) + 64 + 30 * 0.2 * s.length; chipT(s, X0 + w / 2, y, t, t0, t1, col, 30); };
const signChip = (n, t, t0, t1) => lchip(`${n}-${['Cİ', 'Cİ', 'CÜ', 'CÜ', 'Cİ'][n - 1]} ƏLAMƏT`, 190, t, t0, t1);
const STARTS = [P(24), P(47), P(66), P(98), P(110)], DONE = [P(47) - 0.6, P(66) - 0.6, P(98) - 0.6, P(110) - 0.6, P(125) + 0.4];
const AY3 = 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ';
const AY4 = 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ';
const AY5 = 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ';
const MIMMA = 'وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ';
function arWords(line, size) { ctx.save(); ctx.font = `bold ${size}px ${AR}`; ctx.direction = 'rtl'; const ws = line.split(' ').map(w => ctx.measureText(w).width), sp = ctx.measureText(' ').width; ctx.restore(); return { ws, sp, tot: ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1) }; }
function arWordX(line, size, cx, i) { const { ws, sp, tot } = arWords(line, size); let x = cx + tot / 2; for (let j = 0; j < i; j++) x -= ws[j] + sp; return x - ws[i] / 2; }

const SC = {
  hook(t) {
    ctx.fillStyle = '#07060b'; ctx.fillRect(0, 0, W, H); drawDust(t, 0.5);
    const PUSH = Wd(0, 'sayır') + 0.05;
    if (t >= PUSH) grp(R(t, PUSH + 0.35, PUSH + 0.75), () => cover('bg01_w', t, PUSH, 1.12, 1.0, { dur: 8 }));
    if (t < PUSH + 0.75) textMask('5', 'bg01_w', t, 0, PUSH, 1380, 520, 860, 1430, 250);
    kwLine([['QURAN', L(P(0))], ['BİR', L(P(0)) + 0.15], ['İNSANIN', L(P(0)) + 0.3]], X0, 380, 64, 800, '#fff', t, P(1) - 0.2, { align: 'left' });
    kwLine([['ƏLAMƏTİNİ', L(P(0)) + 0.9], ['SAYIR', L(Wd(0, 'sayır'))]], X0, 480, 76, 900, G1, t, PUSH + 0.3, { align: 'left' });
    const ig = [P(1), P(1) + 0.6, P(2), P(2) + 0.8, Wd(2, 'məhz')];
    lanternRow(t, [1080, 1260, 1440, 1620, 1800], 330, 170, ig.map(L), PUSH + 0.4);
    lt('Sonra deyir:', 250, 40, 600, 'rgba(255,255,255,0.92)', t, L(P(1)), P(3) - 0.1);
    lt('QURTULUŞA ÇATANLAR', 340, 70, 900, G1, t, L(P(2)), P(3) - 0.1, { glow: '#000' });
    lt('MƏHZ BUNLARDIR', 430, 70, 900, '#fff', t, L(Wd(2, 'məhz')), P(3) - 0.1, { glow: '#000' });
    lt('Bu beşindən', 560, 54, 700, '#fff', t, L(P(3)));
    lt('HANSI SƏNDƏ VAR?', 660, 84, 900, G1, t, L(Wd(3, 'səndə')), 1e9, { glow: '#000' });
    lchip('🔒 Sonda: hər gün eşitdiyin sözün sirri', 790, t, L(Wd(2, 'məhz')) + 0.6, 1e9, MINT);
  },
  intro(t, a) {
    cover('bg02_w', t, a - 0.6, 1.0, 1.1, { dur: 14, dark: 0.2 }); drawDust(t, 0.3);
    lt('Əvvəlki videoda öyrəndik:', 250, 44, 600, 'rgba(255,255,255,0.9)', t, L(P(4)));
    lpill('Quran — müttəqilər üçün hidayətdir', 340, 44, G1, '#1a1000', t, L(P(5)));
    lt('BƏS MÜTTƏQİ', 500, 96, 900, '#fff', t, L(P(6)), 1e9, { glow: '#000' });
    lt('KİMDİR?', 610, 96, 900, G1, t, L(P(6)) + 0.4, 1e9, { glow: '#000' });
    lchip('BƏQƏRƏ · 2:3 · 2:4 · 2:5', 740, t, L(P(7)));
  },
  ayah(t, a) {
    cover('bg02_w', t, a - 0.6, 1.1, 1.18, { dur: 24, dark: 0.55 }); starLattice(t, 0.06); drawDust(t, 0.4);
    chipT('BƏQƏRƏ · 2:3–5', W / 2, 160, t, a - 0.2, 1e9, G1, 32);
    arT(AY3, W / 2, 330, 60, t, L(P(9)), 1e9, PE(11) - P(9));
    arT(AY4, W / 2, 520, 56, t, L(P(12)), 1e9, PE(14) - P(12));
    arT(AY5, W / 2, 710, 64, t, L(P(15)), 1e9, PE(16) - P(15));
    ['2:3', '2:4', '2:5'].forEach((n, i) => badge(n, 160, [330, 520, 710][i], t, L([P(9), P(12), P(15)][i]), G1, '#1a1000', 34));
  },
  meaning(t, a) {
    cover('bg02_w', t, a - 0.6, 1.18, 1.1, { dur: 24, dark: 0.45 });
    lt('Mənası:', 200, 44, 700, G1, t, L(P(17)));
    lt('O müttəqilər ki…', 270, 48, 700, '#fff', t, L(P(18)));
    const items = [['Qeybə iman gətirir', P(19)], ['Namaz qılır', Wd(20, 'namazı')], ['Ruzidən xərcləyir', Wd(20, 'ruzidən')], ['Nazil edilənlərə iman gətirir', P(21)], ['Axirətə yəqin edir', P(22)]];
    items.forEach(([s, t0], i) => { const y = 360 + i * 82; badge(i + 1, X0 + 28, y, t, L(t0), G1, '#1a1000', 28); ct(s, X0 + 80, y, 46, 800, '#fff', t, L(t0) + 0.1, 1e9, { align: 'left' }); });
    lanternRow(t, [1180, 1330, 1480, 1630, 1780], 300, 150, items.map(([, t0]) => L(t0)), a, 1e9);
    arT('الْمُفْلِحُونَ', 1480, 620, 110, t, L(P(23)) + 2.5, 1e9, 1.0);
    pillT('MƏHZ ONLAR NİCAT TAPANLARDIR', 1480, 760, 40, MINT, INKD, t, L(P(23)) + 3.0);
  },
  s1a(t, a) {
    cover('bg03_w', t, a - 0.6, 1.0, 1.1, { dur: 22 });
    spotlight(t, L(P(24)), 2.6, 1400, 380, 1700);
    const A = P(33) - 0.3;
    signChip(1, t, L(P(24)), A);
    lt('QEYBƏ İMAN', 300, 100, 900, G1, t, L(P(25)), A, { glow: '#000' });
    lt('Görmədiyin Rəbbinə inanmaq', 400, 46, 700, '#fff', t, L(P(26)), A);
    lt('Qeyb — gözlə görmədiyimiz,', 490, 40, 600, 'rgba(255,255,255,0.9)', t, L(P(27)), A);
    lt('amma Allahın xəbər verdiyi:', 545, 40, 600, 'rgba(255,255,255,0.9)', t, L(P(28)), A);
    [['Allahın Özü', 29], ['Mələklər', 30], ['Axirət', 31], ['Cənnət · Cəhənnəm', 32]].forEach(([s, i], k) => { const w = measure(s, pf(800, 36)) + 26; pillT(s, X0 + w / 2 + [0, 0, 0, 0][k], 630 + k * 62, 36, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(i)), A); });
    stick('k_elamet_1', 1500, 560, 300, t, L(P(25)) + 0.3, A, { bob: 8 });
    // Jibril hadith
    lt('Cəbrail soruşdu:', 220, 44, 700, 'rgba(255,255,255,0.9)', t, L(P(33)) + 2.0);
    lt('«İhsan nədir?»', 300, 64, 900, G1, t, L(P(34)), 1e9, { glow: '#000' });
    quoteCard([['Allaha Onu görürmüş kimi', L(P(36))], ['ibadət et.', L(P(36)) + 0.8], ['Sən Onu görməsən də,', L(P(37))], ['O SƏNİ GÖRÜR', L(P(38)), G1]], 520, 590, 840, t, L(P(35)), 1e9, { size: 44, w: 800 });
    sourceTag('Müslim 8 · Cəbrail hədisi', t, P(35));
  },
  s1b(t, a) {
    cover('bg04_w', t, a - 0.6, 1.0, 1.08, { dur: 14 });
    for (let i = 0; i < 9; i++) { const u = ((t - a) * 0.22 + srand(i)) % 1; if (t < a) break; stick('k_tebiet_5', 900 + u * 1200 - 150, 200 + srand(i + 4) * 520 + Math.sin(t * 2 + i) * 40, 70 + srand(i + 2) * 40, t, a + srand(i) * 0.8, 1e9, { rot: u * 6, still: 1, border: 0 }); }
    lt('Küləyi görmürsən,', 260, 60, 800, '#fff', t, L(P(39)));
    lt('amma yarpaq tərpənəndə', 350, 48, 700, '#fff', t, L(P(40)));
    lt('bilirsən ki, VAR', 430, 64, 900, G1, t, L(P(41)) - 0.6, 1e9, { glow: '#000' });
    lt('Rəbbini də görmürsən…', 560, 48, 700, '#fff', t, L(P(42)));
    [['qelb_3', 'ürəyin döyünür', P(43), X0 + 90], ['k_su_1', 'yağış yağır', P(44), X0 + 330], ['tebiet_5', 'sübh açılır', P(45), X0 + 570]].forEach(([k, s, t0, x]) => {
      const beat = k === 'qelb_3' ? 1 + 0.08 * Math.max(0, Math.sin(t * 7)) : 1; grp(life(t, L(t0)), () => { ctx.save(); ctx.translate(x, 680); ctx.scale(beat, beat); ctx.translate(-x, -680); sprite(k, x, 680, 110, 1, 0, 1, k === 'k_su_1' ? null : 'rgba(255,190,80,0.8)'); ctx.restore(); });
      ct(s, x, 775, 32, 700, '#fff', t, L(t0) + 0.2, 1e9, { align: 'center' });
    });
    ct('O VAR', 1420, 420, 150, 900, G1, t, L(P(46)), 1e9, { align: 'center', glow: '#ffb030', blur: 40 });
  },
  s2a(t, a) {
    cover('bg06_w', t, a - 0.6, 1.0, 1.08, { dur: 10, dark: 0.15 });
    signChip(2, t, L(P(47)));
    lt('NAMAZ', 300, 110, 900, G1, t, L(P(48)), 1e9, { glow: '#000' });
    strikeReplace('qılırlar', 'AYAQDA TUTURLAR', 420, 430, 62, t, L(P(49)), L(P(50)));
    arT('يُقِيمُونَ', 1450, 330, 120, t, L(P(50)) + 0.4, 1e9, 0.8);
    ['Sübh', 'Zöhr', 'Əsr', 'Şam', 'İşa'].forEach((n, i) => { const t0 = L(P(51)) + i * 0.28, k = pop(t, t0, 0.4); if (k <= 0) return; const x = X0 + 40 + i * 140, y = 650; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fill(); ctx.restore(); tx(String(i + 1), x, y + 2, pf(900, 30), '#1a1000', clamp(k)); tx(n, x, y + 58, pf(700, 28), '#fff', clamp(k), { glow: '#000', blur: 10 }); });
    lpill('HƏR GÜN · DAVAMLI', 790, 44, MINT, INKD, t, L(P(52)));
    pillT('Qiyamət günü ilk hesab: NAMAZ', 1450, 560, 40, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(53)));
    sourceTag('Tirmizi 413', t, P(53));
  },
  s2b(t, a) {
    cover('bg07_w', t, a - 0.6, 1.0, 1.1, { dur: 16 });
    lt('Peyğəmbərimiz soruşdu:', 220, 44, 700, 'rgba(255,255,255,0.9)', t, L(P(54)), P(57) - 0.1);
    quoteCard([['Qapınızın önündən çay axsa', L(P(55))], ['və gündə 5 dəfə yuyunsanız,', L(P(55)) + 2.0], ['üstünüzdə kir qalarmı?', L(P(56)), G1]], 470, 420, 760, t, L(P(55)), P(57) + 0.2, { size: 42, w: 800 });
    for (let i = 0; i < 5; i++) { const t0 = L(P(55)) + 2.2 + i * 0.35, k = pop(t, t0, 0.4); if (k > 0) { ctx.save(); ctx.globalAlpha = clamp(k) * (1 - R(t, P(57), P(57) + 0.4)); ctx.strokeStyle = '#bfe6ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(1500, 520, 40 + i * 30 + 10 * Math.sin(t * 3 + i), 0, 7); ctx.stroke(); ctx.restore(); } }
    lt('Səhabələr: «Xeyr, heç nə qalmaz.»', 260, 48, 800, '#fff', t, L(P(58)), 1e9);
    lt('Beş vaxt namaz da belədir:', 380, 52, 700, '#fff', t, L(P(60)));
    lt('GÜNAHLARI YUYUR', 480, 88, 900, G1, t, L(P(61)), 1e9, { glow: '#000' });
    propS('k_su_2', t, L(P(60)), 1500, 540, 300);
    sourceTag('Buxari 528 · Müslim 667', t, P(55));
  },
  s2c(t, a) {
    cover('bg20_w', t, a - 0.6, 1.08, 1.0, { dur: 10, dark: 0.1 });
    lt('Bu gün namaz qılmırsansa,', 300, 54, 700, '#fff', t, L(P(62)));
    lt('özünü qınama.', 385, 54, 700, '#fff', t, L(P(63)));
    lt('Sadəcə bir vaxtdan başla.', 500, 54, 800, MINT, t, L(P(64)));
    lt('ALLAH İLK ADDIMI GÖRÜR', 640, 72, 900, G1, t, L(P(65)), 1e9, { glow: '#000' });
  },
  s3a(t, a) {
    cover('bg12_w', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.25 });
    signChip(3, t, L(P(66)));
    lt('RUZİDƏN VERMƏK', 300, 90, 900, G1, t, L(P(67)), 1e9, { glow: '#000' });
    arT(MIMMA, 1420, 300, 80, t, L(P(67)) + 0.3, 1e9, 1.1);
    lt('Hamısından yox —', 420, 52, 700, '#fff', t, L(P(68)));
    lpill('BİR QİSMİNDƏN', 510, 56, MINT, INKD, t, L(P(69)));
    lt('Ruzi təkcə pul deyil:', 640, 46, 700, '#fff', t, L(P(70)));
    [['güc', P(71)], ['vaxt', P(72)], ['bilik', P(73)], ['təbəssüm', Wd(74, 'təbəssüm')]].forEach(([s, t0], i) => { const xs = [0, 140, 290, 440][i], w = measure(s, pf(800, 40)) + 28; pillT(s, X0 + xs + w / 2, 730, 40, 'rgba(250,245,230,0.95)', '#1a1000', t, L(t0)); });
    stick('k_elamet_3', 1450, 560, 260, t, L(P(68)) + 0.3, 1e9, { bob: 6 });
  },
  s3b(t, a) {
    const z = 1 + 0.15 * ease(R(t, L(P(77)), L(P(77)) + 1.6)) - 0.15 * ease(R(t, L(P(79)), L(P(79)) + 1.2));
    ctx.save(); ctx.translate(1300, 700); ctx.scale(z, z); ctx.translate(-1300, -700);
    cover('bg09_w', t, a - 0.6, 1.0, 1.06, { dur: 26, dark: R(t, L(P(83)), L(P(83)) + 0.6) * 0.3 });
    const ty = lerp(820, 640, eOut(R(t, L(P(78)) + 0.4, L(P(78)) + 1.4)));
    stick('k_su_3', lerp(1320, 1180, R(t, L(Wd(78, 'suvardı')) - 0.6, L(Wd(78, 'suvardı')))), ty, 150, t, L(P(78)) + 0.4, P(83) + 0.2, { still: 1 });
    drops(t, L(P(78)) + 0.9, 1320, ty + 40, 1.4);
    const dx = lerp(2050, 1620, eOut(R(t, L(Wd(76, 'it')), L(Wd(76, 'it')) + 0.9))), dx2 = lerp(dx, 1380, eOut(R(t, L(Wd(78, 'suvardı')) - 0.3, L(Wd(78, 'suvardı')) + 0.6)));
    stick('k_heyvan_1', dx2, 650, 300, t, L(Wd(76, 'it')), P(83) + 0.2, { flip: 1, still: t > L(Wd(78, 'suvardı')) });
    ctx.restore();
    const gr = life(t, L(P(79)), P(80), 0.6);
    if (gr > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { ctx.strokeStyle = `rgba(255,220,150,${0.1 * gr})`; ctx.lineWidth = 80; ctx.beginPath(); ctx.moveTo(1300, -50); ctx.lineTo(1300 + (i - 3) * 200, 900); ctx.stroke(); } ctx.restore(); }
    propS('qelb_3', t, L(P(79)) + 0.3, 1300, 330, 180, P(80), 'rgba(255,190,80,0.9)');
    lchip('HEKAYƏ', 190, t, L(P(75)), P(83), MINT);
    lt('Sədəqə təkcə insana deyil', 300, 56, 800, '#fff', t, L(P(75)), P(76) - 0.15);
    kwLine([['Susuz', L(P(76)) + 0.3], ['bir', L(Wd(76, 'it')) - 0.25], ['İT', L(Wd(76, 'it')), G1]], X0, 300, 80, 900, '#fff', t, P(77) - 0.15, { align: 'left' });
    lt('Quyuya endi…', 300, 60, 800, '#fff', t, L(P(77)), P(79) - 0.15);
    lt('ayaqqabısını su ilə doldurdu', 380, 46, 700, G2, t, L(P(78)), P(79) - 0.15);
    lt('ALLAH ONA RAZI QALDI', 300, 72, 900, G1, t, L(P(79)), P(80) - 0.15, { glow: '#000' });
    lt('və günahlarını bağışladı', 390, 50, 700, '#fff', t, L(Wd(79, 'bağışladı')) - 0.6, P(80) - 0.15);
    lt('Səhabələr soruşdu:', 260, 42, 700, 'rgba(255,255,255,0.9)', t, L(P(80)), P(83) - 0.15);
    lt('«Heyvanlara görə də savab var?»', 340, 52, 800, '#fff', t, L(P(81)), P(83) - 0.15);
    lt('Peyğəmbərimiz buyurdu:', 250, 42, 700, 'rgba(255,255,255,0.9)', t, L(P(83)));
    quoteCard([['Hər canlıya edilən', L(P(84))], ['yaxşılıqda', L(P(84)) + 0.6], ['SAVAB VAR', L(P(84)) + 1.2, G1]], 470, 470, 740, t, L(P(84)), 1e9, { size: 54, w: 800 });
    sourceTag('Buxari 2363 · Müslim 2244', t, P(83));
  },
  s3c(t, a) {
    cover('bg11_w', t, a - 0.6, 1.0, 1.06, { dur: 14, dark: 0.35 });
    const A = P(86) - 0.2, B = P(89) - 0.2;
    lt('Bir qadın isə bir pişiyi bağlayıb', 300, 46, 700, '#fff', t, L(P(85)), A);
    lt('ac saxladığına görə', 370, 46, 700, '#fff', t, L(P(85)) + 1.6, A);
    lt('CƏZALANDIRILDI', 470, 76, 900, '#ff7a6b', t, L(Wd(85, 'cəzalandırıldı')), A, { glow: '#000' });
    lt('Müsəlman bir ağac əksə,', 300, 50, 700, '#fff', t, L(P(86)), B);
    lt('ondan quş, heyvan, insan yesə —', 380, 44, 700, '#fff', t, L(P(86)) + 1.4, B);
    lt('SƏDƏQƏDİR', 490, 90, 900, G1, t, L(P(88)), B, { glow: '#000' });
    propS('k_tebiet_2', t, L(P(86)), 1350, 540, 320, B); stick('k_heyvan_3', 1450, 420, 110, t, L(P(86)) + 1.2, B); stick('k_heyvan_4', 1250, 470, 120, t, L(P(87)), B);
    sourceTag('Buxari 3482 · Buxari 2320', t, P(85) + 0.5, B);
    // closing call-to-action (same as the Short)
    lt('Bu gün pulun yoxdursa da,', 220, 46, 700, '#fff', t, L(P(89)));
    lt('SƏDƏQƏN VAR', 320, 96, 900, G1, t, L(P(90)), 1e9, { glow: '#000' });
    const outG = 1 - R(t, L(P(95)) - 0.2, L(P(95)) + 0.4);
    grp(outG, () => [['k_su_5', 'Pişiyə su qoy', P(91), 1080], ['k_heyvan_3', 'Quşa dən səp', P(92), 1330], ['tebiet_3', 'Yoldan daş götür', P(93), 1580], [null, 'Gülümsə', P(94), 1810]].forEach(([k, lab, t0, x]) => {
      if (k) stick(k, x, 520, 130, t, L(t0)); else { const kk = pop(t, L(t0), 0.45); if (kk > 0) { ctx.save(); ctx.translate(x, 520); ctx.scale(kk, kk); ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.fill(); ctx.strokeStyle = '#5a3a00'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 6, 32, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.fillStyle = '#5a3a00'; [-20, 20].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -15, 7, 0, 7); ctx.fill(); }); ctx.restore(); } }
      if (k === 'k_heyvan_3') grains(t, L(t0) + 0.3, x, 560, 22);
      pillT(lab, x, 640, 32, MINT, INKD, t, L(t0) + 0.15);
    }));
    lt('ALLAH HEÇ BİR YAXŞILIĞI', 470, 62, 900, G1, t, L(P(95)), 1e9, { glow: '#000' });
    lt('İTİRMƏZ', 560, 90, 900, '#fff', t, L(P(95)) + 0.6, 1e9, { glow: '#000' });
    lpill('Sədəqə malı azaltmaz', 700, 44, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(97)));
    sourceTag('Müslim 2588', t, P(97));
  },
  s4(t, a) {
    cover('bg14_w', t, a - 0.6, 1.0, 1.08, { dur: 28, dark: 0.3 });
    const A = P(104) - 0.3;
    signChip(4, t, L(P(98)), A);
    lt('KİTABLARA İMAN', 300, 90, 900, G1, t, L(P(99)), A, { glow: '#000' });
    const PP = { TÖVRAT: [1150, 260], ZƏBUR: [1500, 200], İNCİL: [1800, 300], QURAN: [1480, 600] };
    [['TÖVRAT', 100], ['ZƏBUR', 101], ['İNCİL', 102]].forEach(([n, i]) => { pillT(n, ...PP[n], 40, 'rgba(250,245,230,0.95)', '#1a1000', t, L(P(i)), A); flyline(PP[n], PP.QURAN, [0, -40], t, L(P(103)) + 0.3 + (i - 100) * 0.3, 0.7); });
    pillT('QURAN', ...PP.QURAN, 52, G1, '#1a1000', t, L(P(103)) + 1.2, A);
    lt('Hər birini öz dövründə', 430, 46, 700, '#fff', t, L(P(103)), A);
    lt('hidayət olaraq endirdi', 495, 46, 700, '#fff', t, L(P(103)) + 1.0, A);
    lt('Bütün peyğəmbərlər eyni çağırışla gəldi:', 240, 44, 700, '#fff', t, L(P(104)));
    arT('لَا إِلَٰهَ إِلَّا اللَّهُ', 470, 380, 110, t, L(P(105)), 1e9, 1.0);
    lt('Allahdan başqa ilah yoxdur,', 510, 46, 700, '#fff', t, L(P(105)) + 0.3);
    lt('yalnız Ona ibadət edin', 570, 46, 800, MINT, t, L(P(106)));
    lt('Quran — eyni nurun', 680, 50, 800, '#fff', t, L(P(107)));
    lt('SONUNCU HALQASI', 760, 70, 900, G1, t, L(Wd(109, 'sonuncu')), 1e9, { glow: '#000' });
    for (let i = 0; i < 6; i++) { const t0 = L(P(107)) + i * 0.35; if (t < t0) continue; const x = 1050 + i * 150, on = R(t, t0, t0 + 0.3); glow(x, 620, 70, 'rgba(255,200,90,A)', 0.8 * on); if (i) flyline([x - 150, 620], [x, 620], [0, -30], t, t0 - 0.3, 0.3); }
    sourceTag('Ənbiya 21:25', t, P(104));
  },
  s5(t, a) {
    cover('bg16_w', t, a - 0.6, 1.0, 1.08, { dur: 34, dark: 0.15 });
    const A = P(117) - 0.3;
    signChip(5, t, L(P(110)), A);
    lt('AXİRƏTƏ YƏQİN', 300, 90, 900, G1, t, L(P(111)), A, { glow: '#000' });
    strikeReplace('inanırlar', 'YƏQİN EDİRLƏR', 360, 420, 58, t, L(P(112)), L(P(113)), A);
    lpill('ŞÜBHƏSİZ BİLİRLƏR', 620, 48, MINT, INKD, t, L(P(114)), A);
    lt('Sabaha yəqin edən bu gecə hazırlaşır,', 720, 40, 700, '#fff', t, L(P(115)), A);
    lt('axirətə yəqin edən — bu gün.', 775, 40, 800, G2, t, L(P(116)), A);
    const C = P(123) - 0.1;
    lt('Peyğəmbərimiz buyurur:', 220, 42, 700, 'rgba(255,255,255,0.9)', t, L(P(117)), C);
    quoteCard([['Dünyada bir qərib,', L(P(118))], ['ya da bir YOLÇU kimi ol', L(P(119)), G1]], 470, 360, 760, t, L(P(118)), C, { size: 46, w: 800 });
    quoteCard([['Axşama çıxanda səhəri gözləmə,', L(P(121))], ['səhərə çıxanda axşamı gözləmə', L(P(122))]], 470, 580, 760, t, L(P(120)) + 1.5, C, { size: 36, w: 700 });
    lt('— İbn Ömər', 680, 32, 700, 'rgba(255,240,210,0.85)', t, L(P(120)) + 1.6, C);
    lt('Yolçu bilir ki, əsl evi', 380, 56, 700, '#fff', t, L(P(123)));
    lt('YOLUN SONUNDADIR', 480, 80, 900, G1, t, L(P(124)), 1e9, { glow: '#000' });
    const g = life(t, L(P(124)), 1e9, 1.0); if (g > 0) glow(1240, 230, 420, 'rgba(255,220,150,A)', 0.7 * g);
    sourceTag('Buxari 6416', t, P(117));
  },
  res(t, a) {
    cover('bg19_w', t, a - 0.6, 1.0, 1.1, { dur: 18, dx: -60 });
    lt('Bu beş əlamətdən sonra:', 220, 44, 700, '#fff', t, L(P(125)));
    lt('«Məhz onlar Rəbbindən gələn', 310, 50, 700, '#fff', t, L(P(126)));
    lt('HİDAYƏT ÜZƏRİNDƏDİRLƏR»', 400, 66, 900, G1, t, L(Wd(126, 'hidayət')), 1e9, { glow: '#000' });
    arT('عَلَىٰ هُدًى', 1450, 330, 120, t, L(P(126)) + 0.5, 1e9, 0.9);
    lt('Hidayətə minib onunla irəliləyirlər', 540, 42, 700, '#fff', t, L(P(128)));
    lpill('HİDAYƏT ONLARI DAŞIYIR', 650, 50, MINT, INKD, t, L(P(129)));
    const u = R(t, L(P(128)), L(P(129)) + 1.5); if (u > 0) { for (let i = 0; i < 18; i++) { const s = (u * 1.4 + i / 18) % 1; glow(1000 + s * 900, 760 - s * 330, 26, 'rgba(255,214,140,A)', 0.8 * u * (1 - s)); } }
    sourceTag('Bəzi təfsirçilər: «əla» = hidayətə minmək', t, P(127));
  },
  sirr(t, a) {
    cover('bg18_w', t, a - 0.6, 1.05, 1.15, { dur: 24, dark: 0.45 });
    lt('İNDİ ƏN GÖZƏL SİRR', 200, 52, 800, G1, t, L(P(130)), 1e9, { ls: '6px' });
    lt('Ayə belə bitir: «Məhz onlar nicat tapanlardır»', 280, 38, 700, '#fff', t, L(P(131)));
    arT('الْمُفْلِحُونَ', 520, 430, 130, t, L(P(133)) + 0.2, 1e9, 1.0);
    lt('əl-muflihun', 560, 44, 700, MINT, t, L(P(134)));
    const sh = t > L(P(135)) && t < L(P(136)) + 0.5 ? Math.sin(t * 40) * 5 : 0;
    stick('k_kilid', 1450 + sh, 430, 220, t, L(P(135)), L(P(136)) + 0.6, { still: 1 });
    grainDissolve(grainSet('lk', '🔒', '220px "Noto Color Emoji"', 1450, 430), grainSet('ad', 'حَيَّ عَلَى الْفَلَاحِ', `bold 96px ${AR}`, 1450, 430), t, L(P(136)) + 0.3, 1.0, '#bff7e2');
    arT('حَيَّ عَلَى الْفَلَاحِ', 1450, 430, 96, t, L(P(137)), 1e9, 0.5, '#9ff3d4');
    lt('Azanda: «Həyyə aləl-fəlah»', 650, 42, 700, '#fff', t, L(P(136)));
    lt('— Haydı qurtuluşa!', 710, 42, 800, G2, t, L(P(138)));
    // the shared root ف ل ح, linked from both words
    const rootA = life(t, L(P(139)), 1e9, 0.5);
    if (rootA > 0) { ['ف', 'ل', 'ح'].forEach((ch, i) => { const x = 1300 + i * 120, y = 650, k = pop(t, L(P(139)) + i * 0.15, 0.4); ctx.save(); ctx.globalAlpha = rootA; ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = 'rgba(12,9,5,0.75)'; rrect(-50, -55, 100, 110, 20); ctx.fill(); ctx.strokeStyle = MINT; ctx.lineWidth = 3; ctx.stroke(); ctx.font = `bold 70px ${AR}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = MINT; ctx.fillText(ch, 0, 4); ctx.restore(); });
      flyline([520, 500], [1300, 650], [0, 80], t, L(P(139)) + 0.2, 0.7, '159,243,212'); flyline([1450, 480], [1420, 600], [40, 0], t, L(P(139)) + 0.4, 0.5, '159,243,212');
      ct('EYNİ KÖK · EYNİ ÇAĞIRIŞ', 1420, 760, 40, 900, MINT, t, L(P(140)), 1e9, { align: 'center' }); }
    lt('GÜNDƏ 5 DƏFƏ', 800, 64, 900, G1, t, L(P(141)), 1e9, { glow: '#000' });
  },
  felah(t, a) {
    cover('bg19_w', t, a - 0.6, 1.1, 1.0, { dur: 12 });
    lt('«Fəlah» sözünün kökü:', 220, 46, 700, '#fff', t, L(P(142)));
    lpill('torpağı yarıb əkin əkmək', 310, 50, G1, '#1a1000', t, L(P(142)) + 1.2);
    lt('Əkinçi torpağı yarır ki,', 430, 48, 700, '#fff', t, L(P(143)));
    lt('məhsul çıxsın.', 500, 48, 800, G2, t, L(P(144)));
    const gk = lerp(0.5, 1.2, eOut(R(t, L(P(144)), L(P(146)) + 1)));
    grp(life(t, L(P(143))), () => { ctx.save(); ctx.translate(1450, 700); ctx.scale(gk, gk); ctx.translate(-1450, -700); sprite('k_tebiet_1', 1450, 600, 340, 1, 0, 1, 'rgba(160,255,170,0.7)'); ctx.restore(); });
    lt('Namaz da qəlbi yumşaldır ki,', 640, 48, 700, '#fff', t, L(P(145)));
    lt('ORADA İMAN BİTSİN', 730, 66, 900, MINT, t, L(P(146)), 1e9, { glow: '#000' });
    propS('qelb_3', t, L(P(146)) + 0.3, 1450, 300, 150, 1e9, 'rgba(255,190,80,0.9)');
  },
  rahmet(t, a) {
    cover('bg20_w', t, a - 0.6, 1.0, 1.08, { dur: 20, dark: 0.15 });
    const A = P(154) - 0.3;
    lt('Bəlkə düşünürsən:', 220, 44, 700, '#fff', t, L(P(147)), A);
    lt('«mənim üçün gecdir…»', 300, 60, 800, 'rgba(255,255,255,0.85)', t, L(P(148)), A);
    lt('Allah hədisi-qüdsidə buyurur:', 400, 40, 700, G2, t, L(P(149)), A);
    // span → cubit → fathom bars
    [['bəndə: 1 qarış', P(150), 140, '#fff'], ['Allah: 1 arşın', P(151), 300, G1]].forEach(([s, t0, len, c], i) => { const u = eOut(R(t, L(t0), L(t0) + 0.8)); grp(life(t, L(t0), A), () => { ctx.fillStyle = c; rrect(X0, 470 + i * 90, len * u * 2, 26, 13); ctx.fill(); tx(s, X0 + len * 2 * u + 20, 483 + i * 90, pf(800, 34), '#fff', u, { align: 'left', glow: '#000', blur: 10 }); }); });
    lt('Mənə YERİYƏRƏK gəlsə,', 700, 44, 700, '#fff', t, L(P(152)), A);
    lt('Mən ona QAÇARAQ gələrəm', 770, 54, 900, G1, t, L(P(153)), A, { glow: '#000' });
    lt('QAPI AÇIQDIR', 330, 100, 900, G1, t, L(P(154)), 1e9, { glow: '#000' });
    stick('k_elamet_5', 1450, 460, 320, t, L(P(154)), 1e9, { still: 1 }); if (t > L(P(154))) glow(1450, 470, 260, 'rgba(255,214,140,A)', 0.6 * R(t, L(P(154)), L(P(154)) + 1));
    lt('Bu gecə', 480, 54, 700, '#fff', t, L(P(155)));
    lt('İKİ RÜKƏTLƏ BAŞLA', 570, 70, 900, MINT, t, L(P(155)) + 0.4, 1e9, { glow: '#000' });
    sourceTag('Buxari 7405 · Müslim 2675', t, P(149));
  },
  dua(t, a) {
    cover('bg21_w', t, a - 0.6, 1.0, 1.08, { dur: 16 });
    lt('Allahım,', 240, 60, 700, '#fff', t, L(P(156)));
    lt('BİZİ MÜTTƏQİLƏRDƏN ET', 340, 72, 900, G1, t, L(P(157)), 1e9, { glow: '#000' });
    grp(life(t, L(P(158))), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(X0, 440, 640, 110, 26); ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(X0 + 55, 495, 32, 0, 7); ctx.clip(); ctx.drawImage(logo, X0 + 23, 463, 64, 64); ctx.restore(); const s = 'Amin 🤲', n = Math.floor(clamp((t - L(P(158)) - 0.4) * 8, 0, [...s].length)); tx([...s].slice(0, n).join('') + (Math.sin(t * 10) > 0 ? '|' : ''), X0 + 110, 497, pf(800, 44), INKD, 1, { align: 'left' }); });
    lt('Bu videonu namaza başlamaq', 640, 44, 700, '#fff', t, L(P(159)));
    lt('istəyən birinə göndər ↗', 700, 44, 800, MINT, t, L(P(159)) + 1.0);
    lpill('Xeyrə yol göstərən, onu edən kimidir', 800, 38, G1, '#1a1000', t, L(P(161)));
    sourceTag('Müslim 1893', t, P(160));
  },
  teaser(t, a) {
    cover('bg22_w', t, a - 0.6, 1.0, 1.1, { dur: 10, dark: 0.2 });
    lchip('NÖVBƏTİ VİDEO', 220, t, L(P(163)));
    lt('ALLAH BƏZİ QƏLBLƏRƏ', 340, 64, 900, '#fff', t, L(P(164)), 1e9, { glow: '#000' });
    lt('NİYƏ MÖHÜR VURUR?', 430, 72, 900, G1, t, L(Wd(164, 'möhür')), 1e9, { glow: '#000' });
    stick('k_kilid', 1500, 470, 260, t, L(P(164)) + 0.5, 1e9, { still: 1 });
  },
};
const SCN = [['hook', 0], ['intro', P(4) - 0.3], ['ayah', P(9) - 0.4], ['meaning', P(17) - 0.3], ['s1a', P(24) - 0.3], ['s1b', P(39) - 0.3], ['s2a', P(47) - 0.3], ['s2b', P(54) - 0.3], ['s2c', P(62) - 0.3],
  ['s3a', P(66) - 0.3], ['s3b', P(75) - 0.3], ['s3c', P(85) - 0.3], ['s4', P(98) - 0.3], ['s5', P(110) - 0.3], ['res', P(125) - 0.3], ['sirr', P(130) - 0.3], ['felah', P(142) - 0.3], ['rahmet', P(147) - 0.3], ['dua', P(156) - 0.3], ['teaser', P(163) - 0.3]];
const IMPACTS = [Wd(0, 'sayır') + 0.05, Wd(3, 'səndə'), P(46), P(79), P(90), P(134), P(154)];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 8; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
function endCard16(t, t0) {
  const k = R(t, t0, t0 + 0.6); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(5,5,10,0.95)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  const s = lerp(0.85, 1, eOut((t - t0) / 0.8)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2 - 330, 430); ctx.scale(s, s); glow(0, 0, 300, 'rgba(255,200,110,A)', 0.35); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 170, 0, 7); ctx.clip(); ctx.drawImage(logo, -170, -170, 340, 340); ctx.restore(); ctx.strokeStyle = G1; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 173, 0, 7); ctx.stroke(); ctx.restore();
  tx('@esgarow', W / 2 + 200, 360, pf(900, 96), G2, k, { glow: '#ffb030', blur: 30 });
  tx('YouTube · TikTok · Instagram', W / 2 + 200, 440, pf(600, 32), 'rgba(230,235,255,0.85)', k);
  const b = R(t, t0 + 0.5, t0 + 0.9), p = 1 + 0.04 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = b; ctx.translate(W / 2 + 200, 560); ctx.scale(p, p); ctx.fillStyle = '#e8343a'; rrect(-230, -56, 460, 112, 56); ctx.fill(); ctx.restore();
  tx('ABUNƏ OL', W / 2 + 200, 562, pf(900, 56), '#fff', b, { ls: '4px' });
}
const XF = 0.7;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  const cz = crash(t, L(Wd(3, 'səndə')), 1.08, 0.02);
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = (1 + 0.05 * (1 - eOut(u))) * (key === 'hook' ? cz : 1);
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  if (t > L(P(68)) && t < P(70) - 0.2) { const la = R(t, L(P(68)), L(P(68)) + 0.5) * (1 - R(t, P(70) - 0.8, P(70) - 0.2)); lens(arWordX(MIMMA, 80, 1420, 0), 300, 95, 1.55, la); }
  tracker(t, P(24) - 0.6, STARTS, DONE, P(130) - 0.3);
  watermark8(t, 8, P(165) - 0.2);
  endCard16(t, P(165) + 0.2);
  if (t < P(165) + 0.2) subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.6, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.9);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
