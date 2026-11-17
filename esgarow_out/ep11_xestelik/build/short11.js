// ================= Ayənin sirri 11 — SHORT · Bəqərə 2:10 "Qəlbin gizli xəstəliyi" =================
// House structure: hook (həkim tapa bilməz · Allah artırır · bir söz) → recitation → meaning → söz-söz → xəstəlik nədir
// → sirr (eyni Quran: iman ↑ / xəstəlik ↑) → səbəb: YALAN (adət) → kiçik yalanlar → dərman → şərh duası → next title.
loadBgs(['bg01', 'bg02', 'bg03', 'bg04', 'bg05', 'bg06', 'bg07', 'bg08', 'bg09', 'bg10']);
const P = i => SUBS[i].t0, PE = i => SUBS[i].t1;
const clean = x => x.replace(/[".,:?!«»…—]/g, '');
function Wd(i, word) { const w = SUBS[i].w.find(([x]) => clean(x) === word) || SUBS[i].w.find(([x]) => clean(x).startsWith(word)); if (!w) throw new Error('word ' + word + ' in ' + i); return w[1]; }
const A1 = 'فِي قُلُوبِهِم مَّرَضٌ', A2 = 'فَزَادَهُمُ اللَّهُ مَرَضًا', A3 = 'وَلَهُمْ عَذَابٌ أَلِيمٌ', A4 = 'بِمَا كَانُوا يَكْذِبُونَ';
const RED2 = '#ff6b5b', REDL = '#ff8f82';

// heart outline (parametric) around (cx,cy), scale s
function heartP(cx, cy, s) { ctx.beginPath(); for (let i = 0; i <= 100; i++) { const a = i / 100 * Math.PI * 2, x = cx + s * 16 * Math.pow(Math.sin(a), 3), y = cy - s * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); }
// medical scanner screen: grid, heart scan, ECG, "NORMAL ✓"; a hidden dark spot that grows
function scanner(t, t0, spot, alarm) {
  const a = life(t, t0); if (a <= 0) return; const x0 = 120, y0 = 560, w = 840, h = 480, cx = W / 2, cy = 745;
  grp(a, () => {
    ctx.save(); ctx.fillStyle = 'rgba(4,14,18,0.82)'; rrect(x0, y0, w, h, 34); ctx.fill(); ctx.strokeStyle = alarm > 0 ? `rgba(255,107,91,${0.5 + 0.5 * alarm})` : 'rgba(120,240,210,0.55)'; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); rrect(x0, y0, w, h, 34); ctx.clip();
    ctx.strokeStyle = 'rgba(120,240,210,0.08)'; ctx.lineWidth = 1; for (let x = x0; x < x0 + w; x += 40) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + h); ctx.stroke(); } for (let y = y0; y < y0 + h; y += 40) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke(); }
    // heart scan
    heartP(cx, cy, 8); ctx.fillStyle = 'rgba(120,240,210,0.10)'; ctx.fill(); ctx.strokeStyle = 'rgba(140,250,220,0.85)'; ctx.lineWidth = 4; ctx.shadowColor = '#5fe8c4'; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0;
    // sweeping scan line
    const sy = y0 + 40 + ((t - t0) * 160) % (h - 180); ctx.fillStyle = lg(0, sy - 30, 0, sy + 4, [[0, 'rgba(120,240,210,0)'], [1, 'rgba(120,240,210,0.35)']]); ctx.fillRect(x0, sy - 30, w, 34);
    // hidden spot
    if (spot > 0) { const r = 14 + 52 * spot, p = 0.75 + 0.25 * Math.sin(t * 6); const g = ctx.createRadialGradient(cx + 22, cy - 6, 0, cx + 22, cy - 6, r * 1.6); g.addColorStop(0, `rgba(8,4,6,${0.95 * p})`); g.addColorStop(0.55, `rgba(40,6,10,${0.8 * p})`); g.addColorStop(1, 'rgba(60,0,10,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx + 22, cy - 6, r * 1.6, 0, 7); ctx.fill(); }
    // ECG
    ctx.strokeStyle = alarm > 0 ? RED2 : '#7cf0cf'; ctx.lineWidth = 4; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const x = x0 + 30 + i * (w - 60) / 200, ph = (i / 40 - (t - t0) * 1.2) % 1, f = ph < 0 ? ph + 1 : ph; const yy = y0 + h - 70 - (f > 0.45 && f < 0.5 ? -60 * Math.sin((f - 0.45) / 0.05 * Math.PI) : 0) - (f > 0.5 && f < 0.56 ? 110 * Math.sin((f - 0.5) / 0.06 * Math.PI) : 0); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
    ctx.stroke(); ctx.restore();
    tx('QƏLB SKANI', x0 + 40, y0 + 46, pf(800, 30), 'rgba(160,250,225,0.9)', 1, { align: 'left', ls: '3px' });
  });
}

function rowWord(ar, mean, y, t, t0, cur) {
  const a = life(t, t0); if (a <= 0) return;
  grp(a, () => { ctx.save(); ctx.fillStyle = cur ? 'rgba(40,28,8,0.82)' : 'rgba(10,10,14,0.66)'; rrect(80, y - 82, 920, 164, 30); ctx.fill(); ctx.strokeStyle = cur ? G1 : 'rgba(246,199,104,0.35)'; ctx.lineWidth = cur ? 5 : 2; if (cur) { ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; } ctx.stroke(); ctx.restore(); });
  arT(ar, 770, y, 62, t, t0, 1e9, 0.6, cur ? G2 : G1);
  ct(mean, 330, y + 2, 40, 800, '#fff', t, t0 + 0.25, 1e9, { align: 'center' });
}
function morph(k1, k2, x, y, h, t, t0, tm, d = 0.9, t1 = 1e9, glowCol = null) {
  const a = life(t, t0, t1, 0.5); if (a <= 0) return; const u = ease(clamp((t - tm) / d)), bob = Math.sin((t - t0) * 1.4) * 7, s = lerp(0.85, 1, eOut(clamp((t - t0) / 0.7)));
  if (u < 1) sprite(k1, x, y + bob, h, a * (1 - u), 0, s * (1 + 0.15 * u));
  if (u > 0) { if (glowCol) glow(x, y, h * 1.1, glowCol, 0.5 * u * a); sprite(k2, x, y + bob, h, a * u, 0, s * lerp(0.8, 1, eOut(u))); }
}
function chain(items, x, y0, dy, t) { // vertical chain of pills with glowing arrows
  items.forEach(([s, t0, bg, fg], i) => { const y = y0 + i * dy; if (i) { flyline([x, y - dy + 55], [x, y - 55], [0, 0], t, t0 - 0.35, 0.35, '255,140,120'); } pillT(s, x, y, 56, bg, fg, t, t0); });
}
function redacted(x, y, t, t0, t1, u = 0) { const a = life(t, t0, t1, 0.4, 0.3); if (a <= 0) return; grp(a, () => { ctx.save(); ctx.fillStyle = '#0b0b0d'; rrect(x - 230, y - 60, 460, 120, 14); ctx.fill(); ctx.strokeStyle = `rgba(255,107,91,${0.4 + 0.3 * Math.sin(t * 5)})`; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); tx('?', x, y + 4, pf(900, 80), RED2, 1, { glow: '#000', blur: 15 }); }); }

const SC = {
  hook(t) {
    cover('bg01', t, 0, 1.12, 1.0, { dur: 14, dark: 0.35 }); drawDust(t, 0.3, '160,240,220');
    ctx.fillStyle = `rgba(0,0,0,${1 - R(t, 0, 0.6)})`; ctx.fillRect(0, 0, W, H);
    ct('Quranda belə bir ayə var:', W / 2, 300, 50, 700, '#fff', t, L(P(0)));
    const tA = L(Wd(2, 'ARTIRIR')), spot = clamp((t - L(Wd(0, 'xəstəlik'))) / 1.5) * 0.35 + 0.65 * eOut(clamp((t - tA) / 1.2));
    scanner(t, 0.2, spot, clamp((t - tA) / 0.4));
    ct('NORMAL ✓', 830, 606, 34, 900, MINT, t, 0.8, tA, { align: 'right' });
    ct('GİZLİ XƏSTƏLİK', W / 2, 400, 74, 900, '#fff', t, L(Wd(0, 'xəstəlik')), 1e9, { glow: '#000' });
    // doctors can't find it
    stick('k_tibb_1', 190, 1160, 180, t, L(Wd(1, 'həkim')), tA + 0.05, { rot: -0.15 }); stick('k_tibb_5', 890, 1160, 190, t, L(Wd(1, 'həkim')) + 0.2, tA + 0.05, { rot: 0.12 });
    stampT('TAPILMADI', t, L(Wd(1, 'tapa')), W / 2, 1160, 58, RED2, tA + 0.05);
    ct('ALLAH ONU', W / 2, 500, 60, 800, '#fff', t, L(P(2)), 1e9, { glow: '#000' });
    grp(life(t, tA), () => { const k = pop(t, tA, 0.4); ctx.save(); ctx.translate(W / 2, 1160); ctx.scale(k, k); tx('ARTIRIR', 0, 0, pf(900, 140), RED2, 1, { glow: '#000', blur: 30 }); ctx.restore(); });
    // the reason: one hidden word
    ct('SƏBƏBİ — BİR SÖZ', W / 2, 1285, 46, 800, G2, t, L(P(3)), 1e9, { glow: '#000' });
  },
  recite(t, a) {
    cover('bg02', t, a - 0.6, 1.0, 1.1, { dur: 16, dark: 0.45 }); drawDust(t, 0.35);
    chipT('BƏQƏRƏ · 2:10', W / 2, 300, t, a - 0.2, 1e9, G1, 36);
    const tv = Wd(5, 'və');
    arT(A1, W / 2, 460, 74, t, L(P(4)), 1e9, PE(4) - P(4));
    arT(A2, W / 2, 590, 74, t, L(P(5)), 1e9, tv - P(5));
    arT(A3, W / 2, 720, 74, t, L(tv), 1e9, PE(5) - tv);
    arT(A4, W / 2, 850, 74, t, L(P(6)), 1e9, PE(6) - P(6), REDL);
    stick('k_tibb_4', W / 2, 1110, 230, t, L(P(4)) + 0.6, 1e9, { bob: 5 });
  },
  meaning(t, a) {
    cover('bg03', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.35 });
    ct('Mənası:', W / 2, 300, 46, 700, G1, t, L(P(7)));
    ct('Onların qəlblərində', W / 2, 400, 54, 700, '#fff', t, L(P(8)));
    ct('XƏSTƏLİK VAR', W / 2, 490, 80, 900, REDL, t, L(Wd(8, 'xəstəlik')), 1e9, { glow: '#000' });
    ct('Allah da onların xəstəliyini', W / 2, 610, 48, 700, '#fff', t, L(Wd(8, 'Allah')));
    ct('ARTIRDI', W / 2, 700, 84, 900, G1, t, L(Wd(8, 'artırdı')), 1e9, { glow: '#000' });
    pillT('YALAN DANIŞDIQLARINA GÖRƏ', W / 2, 840, 46, RED2, '#fff', t, L(P(9)));
    ct('ağrılı əzab gözləyir', W / 2, 940, 46, 700, 'rgba(255,255,255,0.9)', t, L(Wd(9, 'ağrılı')));
    stick('k_qelb_4', W / 2, 1160, 220, t, L(Wd(8, 'xəstəlik')) + 0.3, 1e9, { bob: 5 });
  },
  words(t, a) {
    cover('bg04', t, a - 0.6, 1.0, 1.08, { dur: 18, dark: 0.5 });
    chipT('SÖZ-SÖZ', W / 2, 300, t, L(P(10)), 1e9, MINT, 36);
    const rows = [['فِي قُلُوبِهِم', 'qəlblərində', 12], ['مَرَضٌ', 'xəstəlik', 13], ['فَزَادَهُمُ اللَّهُ', 'Allah artırdı', 14], ['بِمَا كَانُوا يَكْذِبُونَ', 'yalanlarına görə', 15]];
    rows.forEach(([ar, m, i], k) => rowWord(ar, m, 470 + k * 200, t, L(P(i)), t >= L(P(i)) && (k === 3 || t < L(P(rows[k + 1][2])))));
  },
  disease(t, a) {
    cover('bg01', t, a - 0.6, 1.08, 1.0, { dur: 14, dark: 0.55, dx: -60 });
    ct('Bəs bu hansı xəstəlikdir?', W / 2, 300, 52, 800, '#fff', t, L(P(16)));
    ct('İbn Abbas deyir:', W / 2, 390, 42, 700, G2, t, L(P(17)));
    pillT('ŞÜBHƏ VƏ NİFAQ', W / 2, 490, 60, RED2, '#fff', t, L(P(18)));
    [['k_qelb_1', 'HƏSƏD', 230, Wd(19, 'Həsəd')], ['k_qelb_2', 'KİN', 540, Wd(20, 'kin')], ['k_qelb_3', 'RİYA', 850, Wd(21, 'riya')]].forEach(([k, s, x, t0]) => { stick(k, x, 740, 200, t, L(t0), 1e9, { still: 1 }); ct(s, x, 900, 46, 900, '#fff', t, L(t0) + 0.1, 1e9, { glow: '#000' }); });
    const tz = L(Wd(21, 'heç'));
    grp(life(t, tz), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.95)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(130, 1010, 820, 280, 26); ctx.fill(); ctx.restore();
      tx('ANALİZ NƏTİCƏSİ', W / 2, 1052, pf(900, 30), '#7a7f86', 1, { ls: '3px' });
      [['Qan', 'NORMAL ✓', '#1f9d6a'], ['Ürək', 'NORMAL ✓', '#1f9d6a'], ['Qəlbin xəstəliyi', 'GÖRÜNMÜR ?', '#d33a2c']].forEach(([l, r, c], i) => { const k = R(t, tz + 0.2 + i * 0.35, tz + 0.5 + i * 0.35); tx(l, 180, 1112 + i * 60, pf(800, 38), INKD, k, { align: 'left' }); tx(r, 900, 1112 + i * 60, pf(900, 38), c, k, { align: 'right' }); }); });
    sourceTag('İbn Kəsir təfsiri, Bəqərə 2:10', t, P(17));
  },
  sirr(t, a) {
    cover('bg05', t, a - 0.6, 1.0, 1.08, { dur: 22, dark: 0.35 });
    const tE = L(P(26));
    ct('İNDİ ƏN MARAQLI SİRR', W / 2, 300, 60, 900, G1, t, L(P(22)), tE, { glow: '#ffb030', blur: 30 });
    ct('Başqa bir ayədə Allah buyurur:', W / 2, 390, 42, 700, '#fff', t, L(P(23)), tE);
    ct('EYNİ QURAN', W / 2, 310, 74, 900, '#fff', t, tE, 1e9, { glow: '#000' });
    ct('EYNİ AYƏ', W / 2, 400, 60, 900, G2, t, L(P(27)), 1e9, { glow: '#000' });
    const tq = L(P(24)), tL = L(Wd(24, 'möminlərin')), tR = L(Wd(25, 'xəstəliyini'));
    grp(life(t, tq), () => { glow(W / 2, 600, 200, 'rgba(255,214,140,A)', 0.4); propS('k_gun_5', t, tq, W / 2, 600, 210); });
    flyline([W / 2 - 80, 660], [270, 860], [-80, -40], t, tL, 0.8, '159,243,212'); flyline([W / 2 + 80, 660], [810, 860], [80, -40], t, tR, 0.8, '255,120,110');
    propS('k_qelb_5', t, tL + 0.6, 270, 960, 220); propS('k_tibb_4', t, tR + 0.6, 810, 960, 230);
    ct('İMAN ↑', 270, 1130, 56, 900, MINT, t, tL + 0.7, 1e9, { glow: '#000' }); ct('XƏSTƏLİK ↑', 810, 1130, 56, 900, RED2, t, tR + 0.7, 1e9, { glow: '#000' });
    ct('ŞƏFA', 270, 1205, 44, 800, '#fff', t, L(Wd(28, 'şəfa')), 1e9, { glow: '#000' }); ct('DƏRD', 810, 1205, 44, 800, '#fff', t, L(Wd(28, 'dərd')), 1e9, { glow: '#000' });
    grp(life(t, L(P(29))), () => { ctx.save(); ctx.fillStyle = 'rgba(10,8,4,0.8)'; rrect(150, 1240, 780, 100, 50); ctx.fill(); ctx.strokeStyle = G1; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); tx('FƏRQ — QƏLBDƏDİR', W / 2, 1292, pf(900, 54), G1, 1, { glow: '#000', blur: 10 }); });
    sourceTag('Tövbə 9:124–125', t, P(23), L(P(29)));
  },
  lie(t, a) {
    cover('bg06', t, a - 0.6, 1.0, 1.1, { dur: 20, dark: 0.4 });
    const B = L(P(33)) - 0.1, tS = L(P(31));
    ct('Səbəb — ayənin sonunda:', W / 2, 300, 48, 700, '#fff', t, L(P(30)), B);
    redacted(W / 2, 470, t, L(P(30)) + 0.3, tS + 0.2);
    arT(A4, W / 2, 470, 80, t, tS, B, 0.9);
    const A = grainSet('rd', '█████', pf(900, 120), W / 2, 640), Bt = grainSet('yl', 'YALAN', pf(900, 150), W / 2, 640);
    const u = grainDissolve(A, Bt, t, tS + 0.5, 1.4, RED2);
    if (u >= 1) ct('YALAN', W / 2, 640, 150, 900, RED2, t, tS + 1.9, B, { glow: '#000', blur: 30 });
    ct('Bir dəfə yox…', W / 2, 820, 50, 700, '#fff', t, L(P(32)), B);
    pillT('ADƏT EDİRDİLƏR', W / 2, 930, 64, G1, '#1a1000', t, L(Wd(32, 'YALANI')), B);
    ct('كَانُوا = davamlı, hər dəfə', W / 2, 1040, 38, 700, 'rgba(255,240,210,0.9)', t, L(Wd(32, 'YALANI')) + 0.6, B);
    // hadith chain
    ct('Peyğəmbərimiz ﷺ buyurur:', W / 2, 310, 46, 700, G2, t, L(P(33)));
    chain([['YALAN', L(Wd(34, 'Yalan')), '#fff', INKD], ['PİSLİK', L(Wd(34, 'pisliyə')), '#ff9a6b', '#1a0500'], ['CƏHƏNNƏM', L(Wd(34, 'cəhənnəmə')), RED2, '#fff']], W / 2, 460, 170, t);
    stampT('YALANÇI YAZILAR', t, L(Wd(35, 'yalançı')), W / 2, 1060, 64, RED2);
    ct('…ta ki Allah yanında', W / 2, 960, 42, 700, '#fff', t, L(Wd(35, 'ta')));
    sourceTag('Buxari 6094 · Müslim 2607', t, P(33));
  },
  small(t, a) {
    cover('bg07', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.4 });
    ct('Bəlkə deyirsən:', W / 2, 300, 48, 700, '#fff', t, L(P(36)));
    pillT('«Mənim yalanım kiçikdir»', W / 2, 400, 50, 'rgba(250,245,230,0.95)', INKD, t, L(P(37)));
    const t1 = L(Wd(38, 'Evdə')), t2 = L(Wd(38, 'zarafatdır'));
    stick('k_gun_2', 290, 650, 210, t, t1, 1e9, { rot: -0.06 }); ct('«Evdə yoxdur de»', 290, 800, 40, 800, '#fff', t, t1 + 0.15, 1e9, { glow: '#000' });
    stick('k_gun_3', 790, 650, 200, t, t2, 1e9, { rot: 0.06 }); ct('«Zarafatdır»', 790, 800, 40, 800, '#fff', t, t2 + 0.15, 1e9, { glow: '#000' });
    stampT('✕', t, t1 + 0.6, 400, 580, 80, RED2); stampT('✕', t, t2 + 0.6, 900, 580, 80, RED2);
    ct('Peyğəmbərimiz ﷺ buyurur:', W / 2, 920, 42, 700, G2, t, L(P(39)));
    quoteCard([['Vay o kəsin halına ki,', L(P(40))], ['insanları güldürmək üçün', L(P(41))], ['yalan danışır', L(Wd(41, 'yalan')), REDL]], W / 2, 1130, 900, t, L(P(40)), 1e9, { size: 44, w: 800 });
    sourceTag('Tirmizi 2315 · Əbu Davud 4990', t, P(39));
  },
  cure(t, a) {
    cover('bg08', t, a - 0.6, 1.0, 1.08, { dur: 14, dark: 0.3 });
    const tB = L(P(45)) - 0.1;
    ct('Amma bu xəstəliyin', W / 2, 300, 50, 700, '#fff', t, L(P(42)), tB);
    ct('DƏRMANI VAR', W / 2, 395, 84, 900, MINT, t, L(Wd(42, 'dərmanı')), tB, { glow: '#000' });
    morph('k_tibb_2', 'k_gun_5', W / 2, 720, 330, t, L(Wd(42, 'dərmanı')) + 0.2, L(Wd(44, 'Quran')), 0.9, tB, 'rgba(255,214,140,A)');
    arT('وَشِفَاءٌ لِّمَا فِي الصُّدُورِ', W / 2, 960, 66, t, L(P(43)) + 0.3, tB, 1.0);
    ct('Quran — sinələrə ŞƏFADIR', W / 2, 1060, 48, 800, '#fff', t, L(Wd(44, 'sinələrdə')), tB, { glow: '#000' });
    sourceTag('Yunus 10:57', t, P(43), tB);
    ct('Bu gün', W / 2, 300, 50, 700, '#fff', t, tB + 0.1);
    ct('BİR YALANI TƏRK ET', W / 2, 395, 80, 900, G1, t, L(Wd(45, 'yalanı')), 1e9, { glow: '#000' });
    morph('k_qelb_4', 'k_qelb_5', W / 2, 780, 320, t, tB + 0.2, L(Wd(45, 'qəlbin')), 1.1, 1e9, 'rgba(255,220,120,A)');
    ct('qəlbin sağalmağa başlayacaq', W / 2, 1080, 50, 800, MINT, t, L(Wd(45, 'qəlbin')) + 0.3, 1e9, { glow: '#000' });
  },
  cta(t, a) {
    cover('bg09', t, a - 0.6, 1.0, 1.06, { dur: 10, dark: 0.2 });
    ct('Şərhdə yaz:', W / 2, 330, 64, 900, '#fff', t, L(P(46)), 1e9, { glow: '#000' });
    const tc = L(P(47));
    grp(life(t, tc), () => { ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rrect(80, 470, 920, 140, 30); ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(155, 540, 40, 0, 7); ctx.clip(); ctx.drawImage(logo, 115, 500, 80, 80); ctx.restore(); const s = 'Allahım, qəlbimə şəfa ver 🤲', n = Math.floor(clamp((t - tc - 0.2) * 14, 0, [...s].length)); tx([...s].slice(0, n).join('') + (Math.sin(t * 10) > 0 ? '|' : ''), 215, 542, pf(800, 42), INKD, 1, { align: 'left' }); });
    ct('AMİN', W / 2, 740, 96, 900, MINT, t, L(P(49)), 1e9, { glow: '#000', blur: 30 });
  },
  teaser(t, a) {
    cover('bg10', t, a - 0.6, 1.08, 1.0, { dur: 8, dark: 0.2 });
    chipT('NÖVBƏTİ VİDEO', W / 2, 300, t, L(P(50)), 1e9, G1, 36);
    ct('«BİZ İSLAH EDƏNLƏRİK»', W / 2, 430, 64, 900, '#fff', t, L(P(51)), 1e9, { glow: '#000' });
    ct('deyib… FƏSAD TÖRƏDƏNLƏR', W / 2, 530, 56, 900, RED2, t, L(Wd(51, 'fəsad')), 1e9, { glow: '#000' });
    chipT('BƏQƏRƏ · 2:11–12', W / 2, 640, t, L(Wd(51, 'fəsad')) + 0.4, 1e9, G1, 32);
  },
};
const SCN = [['hook', 0], ['recite', P(4) - 0.5], ['meaning', P(7) - 0.4], ['words', P(10) - 0.4], ['disease', P(16) - 0.4], ['sirr', P(22) - 0.4], ['lie', P(30) - 0.4], ['small', P(36) - 0.4], ['cure', P(42) - 0.4], ['cta', P(46) - 0.4], ['teaser', P(50) - 0.4]];
const IMPACTS = [Wd(2, 'ARTIRIR'), P(26), Wd(32, 'YALANI'), Wd(35, 'yalançı')];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 9; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
const XF = 0.6;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  const cz = crash(t, L(Wd(2, 'ARTIRIR')), 1.06, 0.02);
  for (let i = 0; i < SCN.length; i++) {
    const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = (1 + 0.06 * (1 - eOut(u))) * (key === 'hook' ? cz : 1);
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  watermark8(t, 11, P(52) - 0.6);
  endCard(t);
  if (t < P(52) - 0.6) subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.5, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
