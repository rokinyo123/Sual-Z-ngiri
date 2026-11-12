// ================= Ayənin sirri 8 — SHORT (9:16) · Bəqərə 2:3–5 =================
// Theory only + one complete story (dog & well); the sirr stays locked -> long video.
loadBgs(['bg01_v', 'bg02_v', 'bg03_v', 'bg04_v', 'bg06_v', 'bg09_v', 'bg11_v', 'bg16_v', 'bg18_v']);
function arWords(line, size) { ctx.save(); ctx.font = `bold ${size}px ${AR}`; ctx.direction = 'rtl'; const ws = line.split(' ').map(w => ctx.measureText(w).width), sp = ctx.measureText(' ').width; ctx.restore(); return { ws, sp, tot: ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1) }; }
function arWordX(line, size, cx, i) { const { ws, sp, tot } = arWords(line, size); let x = cx + tot / 2; for (let j = 0; j < i; j++) x -= ws[j] + sp; return x - ws[i] / 2; } // RTL
const DONE = [K.s2 - 0.6, K.s3 - 0.5, K.c_itir + 1.6, K.s5 - 0.5, K.sirr - 0.5], STARTS = [K.s1, K.s2, K.s3, K.s4, K.s5];
const signChip = (n, t, a, t1) => chipT(`${n}-${['Cİ', 'Cİ', 'CÜ', 'CÜ', 'Cİ'][n - 1]} ƏLAMƏT`, W / 2, 300, t, a, t1, G1, 36);
const L3 = 'وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ';

const SC = {
  hook(t) {
    ctx.fillStyle = '#07060b'; ctx.fillRect(0, 0, W, H); drawDust(t, 0.5);
    const PUSH = K.sayir + 0.05, show = t >= PUSH + 0.45;
    if (show || t >= PUSH) { const a = R(t, PUSH + 0.35, PUSH + 0.75); grp(a, () => { cover('bg01_v', t, PUSH, 1.12, 1.0, { dur: 7 }); }); }
    if (t < PUSH + 0.75) textMask('5', 'bg01_v', t, 0, PUSH, W / 2, 900, 880, 595, 586);
    kwLine([['QURAN', L(K.q1)], ['BİR', L(K.q1) + 0.15], ['İNSANIN', L(K.q1) + 0.3]], W / 2, 330, 58, 800, '#fff', t, K.sonra - 0.2);
    kwLine([['ƏLAMƏTİNİ', L(K.q1) + 0.9], ['SAYIR', L(K.sayir)]], W / 2, 1290, 66, 900, G1, t, PUSH + 0.3);
    // after the push: lanterns ignite one by one on the voice
    const ig = [K.sonra, K.sonra + 0.6, K.qurtulus, K.qurtulus + 0.8, K.mehz];
    lanternRow(t, [180, 360, 540, 720, 900], 760, 200, ig.map(L), PUSH + 0.4, K.hansi - 0.1);
    ct('Sonra deyir:', W / 2, 320, 46, 600, 'rgba(255,255,255,0.92)', t, L(K.sonra), K.hansi - 0.1);
    ct('QURTULUŞA ÇATANLAR', W / 2, 410, 74, 900, G1, t, L(K.qurtulus), K.hansi - 0.1, { glow: '#000' });
    ct('MƏHZ BUNLARDIR', W / 2, 500, 74, 900, '#fff', t, L(K.mehz), K.hansi - 0.1, { glow: '#000' });
    chipT('🔒 Sonda: hər gün eşitdiyin sözün sirri', W / 2, 1010, t, L(K.mehz) + 0.6, K.hansi + 0.6, MINT, 30);
    ct('Bu beşindən', W / 2, 1050, 58, 700, '#fff', t, L(K.hansi));
    ct('HANSI SƏNDƏ VAR?', W / 2, 1215, 92, 900, G1, t, L(K.sende), 1e9, { glow: '#000' });
  },
  ayah(t, a) {
    cover('bg02_v', t, a - 0.6, 1.0, 1.1, { dur: 8, dark: 0.35 }); drawDust(t, 0.35);
    chipT('BƏQƏRƏ · 2:5', W / 2, 300, t, a - 0.2, 1e9, G1, 36);
    arT('أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ', W / 2, 500, 78, t, L(K.ula), 1e9, 2.2);
    arT('وَأُولَٰئِكَ هُمُ', 720, 660, 78, t, L(K.mufl), 1e9, 0.9);
    const mk = R(t, L(K.mufl_w), L(K.mufl_w) + 0.4);
    arT('الْمُفْلِحُونَ', 380, 660, 78, t, L(K.mufl_w) - 0.2, 1e9, 0.8, mk > 0.5 ? '#9ff3d4' : G1);
    ct('Məhz onlar Rəbbindən gələn', W / 2, 860, 46, 700, '#fff', t, L(K.ula) + 0.8);
    ct('hidayət üzərindədirlər', W / 2, 925, 46, 700, '#fff', t, L(K.ula) + 1.4);
    pillT('və məhz onlar NİCAT TAPANLARDIR', W / 2, 1060, 44, MINT, INKD, t, L(K.mufl_w));
  },
  s1(t, a) {
    cover('bg03_v', t, a - 0.6, 1.0, 1.08, { dur: 7 });
    spotlight(t, L(K.s1), 2.4, W / 2, 700, 1500);
    signChip(1, t, L(K.s1));
    ct('QEYBƏ İMAN', W / 2, 430, 112, 900, G1, t, L(K.s1n), 1e9, { glow: '#000' });
    ct('Görmədiyin Rəbbinə inanmaq', W / 2, 545, 50, 700, '#fff', t, L(K.s1d));
    stick('k_elamet_1', W / 2, 920, 300, t, L(K.s1n) + 0.3, 1e9, { bob: 8 });
  },
  s2(t, a) {
    cover('bg06_v', t, a - 0.6, 1.0, 1.08, { dur: 9, dark: 0.25 });
    signChip(2, t, L(K.s2));
    ct('NAMAZ', W / 2, 420, 120, 900, G1, t, L(K.s2n), 1e9, { glow: '#000' });
    strikeReplace('qılırlar', 'AYAQDA TUTURLAR', W / 2, 580, 70, t, L(K.s2q), L(K.s2a));
    arT('يُقِيمُونَ', W / 2, 840, 110, t, L(K.s2a) + 0.4, 1e9, 0.8);
    ['Sübh', 'Zöhr', 'Əsr', 'Şam', 'İşa'].forEach((n, i) => {
      const t0 = L(K.s2h) + i * 0.28, k = pop(t, t0, 0.4); if (k <= 0) return; const x = 190 + i * 175, y = 1040;
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(0, 0, 34, 0, 7); ctx.fill(); ctx.restore();
      tx(String(i + 1), x, y + 2, pf(900, 34), '#1a1000', clamp(k)); tx(n, x, y + 70, pf(700, 34), '#fff', clamp(k), { glow: '#000', blur: 10 });
    });
    pillT('HƏR GÜN · DAVAMLI', W / 2, 1220, 52, MINT, INKD, t, L(K.s2d));
  },
  s3(t, a) {
    cover('bg04_v', t, a - 0.6, 1.0, 1.08, { dur: 7, dark: 0.3 });
    signChip(3, t, L(K.s3));
    ct('RUZİDƏN VERMƏK', W / 2, 420, 96, 900, G1, t, L(K.s3n), 1e9, { glow: '#000' });
    arT(L3, W / 2, 590, 80, t, L(K.s3n) + 0.3, 1e9, 1.1);
    ct('Hamısından yox —', W / 2, 760, 54, 700, '#fff', t, L(K.s3h));
    pillT('BİR QİSMİNDƏN', W / 2, 860, 64, MINT, INKD, t, L(K.s3b));
    stick('k_elamet_3', W / 2, 1120, 260, t, L(K.s3n) + 0.6, 1e9, { bob: 6 });
  },
  story(t, a) {
    const z = 1 + 0.18 * ease(R(t, L(K.st_quyu), L(K.st_quyu) + 1.6)) - 0.18 * ease(R(t, L(K.st_razi), L(K.st_razi) + 1.2));
    ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540, -1150);
    cover('bg09_v', t, a - 0.6, 1.0, 1.06, { dur: 20, dark: R(t, L(K.st_peyg), L(K.st_peyg) + 0.6) * 0.35 });
    // shoe rises from the well, water drips, the dog drinks
    const ty = lerp(1260, 1110, eOut(R(t, L(K.st_ayaq) + 0.4, L(K.st_ayaq) + 1.4)));
    stick('k_su_3', lerp(560, 430, R(t, L(K.st_suvar) - 0.6, L(K.st_suvar))), ty, 170, t, L(K.st_ayaq) + 0.4, K.st_peyg + 0.2, { still: 1 });
    drops(t, L(K.st_ayaq) + 0.9, 560, ty + 40, 1.4);
    const dx = lerp(1180, 820, eOut(R(t, L(K.st_it), L(K.st_it) + 0.9))), dx2 = lerp(dx, 600, eOut(R(t, L(K.st_suvar) - 0.3, L(K.st_suvar) + 0.6)));
    stick('k_heyvan_1', dx2, 1090, 330, t, L(K.st_it), K.st_peyg + 0.2, { flip: 1, still: t > L(K.st_suvar) });
    ctx.restore();
    // god rays + glowing heart on "Allah ona razı qaldı"
    const gr = life(t, L(K.st_razi), K.st_peyg + 0.3, 0.6);
    if (gr > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const an = -Math.PI / 2 + (i - 3) * 0.16 + Math.sin(t * 0.6 + i) * 0.02; const g = ctx.createLinearGradient(540, 0, 540 + Math.cos(an) * 1500, Math.sin(an) * -1500); ctx.strokeStyle = `rgba(255,220,150,${0.12 * gr})`; ctx.lineWidth = 90; ctx.beginPath(); ctx.moveTo(540, -50); ctx.lineTo(540 + (i - 3) * 160, 1300); ctx.stroke(); } ctx.restore(); }
    propS('qelb_3', t, L(K.st_razi) + 0.3, W / 2, 760, 220, K.st_peyg + 0.2, 'rgba(255,190,80,0.9)');
    chipT('HEKAYƏ', W / 2, 300, t, L(K.st0), K.st_peyg - 0.1, MINT, 36);
    // one caption block at a time in the top band
    ct('Sədəqə təkcə insana deyil', W / 2, 420, 58, 800, '#fff', t, L(K.st0), K.st_adam - 0.15);
    kwLine([['Susuz', L(K.st_adam) + 0.3], ['bir', L(K.st_it) - 0.25], ['İT', L(K.st_it), G1]], W / 2, 420, 84, 900, '#fff', t, K.st_quyu - 0.15);
    ct('Quyuya endi…', W / 2, 400, 60, 800, '#fff', t, L(K.st_quyu), K.st_razi - 0.15);
    ct('ayaqqabısını su ilə doldurdu', W / 2, 480, 50, 700, G2, t, L(K.st_ayaq), K.st_razi - 0.15);
    ct('ALLAH ONA RAZI QALDI', W / 2, 420, 80, 900, G1, t, L(K.st_razi), K.st_peyg - 0.15, { glow: '#000' });
    ct('və günahlarını bağışladı', W / 2, 520, 54, 700, '#fff', t, L(K.st_bag), K.st_peyg - 0.15);
    ct('Peyğəmbərimiz buyurdu:', W / 2, 400, 48, 700, 'rgba(255,255,255,0.92)', t, L(K.st_peyg));
    quoteCard([['Hər canlıya edilən', L(K.st_her)], ['yaxşılıqda', L(K.st_her) + 0.6], ['SAVAB VAR', L(K.st_her) + 1.2, G1]], W / 2, 640, 860, t, L(K.st_her), 1e9, { size: 58, w: 800 });
    ['k_heyvan_2', 'k_heyvan_3', 'k_heyvan_1', 'k_heyvan_4', 'k_heyvan_5'].forEach((k, i) => stick(k, 150 + i * 195, 1130, [190, 120, 200, 140, 180][i], t, L(K.st_canli) + 0.4 + i * 0.12));
    sourceTag('Buxari 2363 · Müslim 2244', t, K.st_peyg);
  },
  closing(t, a) {
    cover('bg11_v', t, a - 0.6, 1.0, 1.08, { dur: 12, dark: 0.35 });
    const outG = 1 - R(t, L(K.c_itir) - 0.2, L(K.c_itir) + 0.4);
    ct('Bu gün pulun yoxdursa da,', W / 2, 330, 52, 700, '#fff', t, L(K.c0));
    ct('SƏDƏQƏN VAR', W / 2, 440, 112, 900, G1, t, L(K.c_var), 1e9, { glow: '#000' });
    grp(outG, () => {
      const items = [['k_su_5', 'Pişiyə su qoy', K.c_pisik, 300, 690, 150], ['k_heyvan_3', 'Quşa dən səp', K.c_qus, 780, 690, 140], ['tebiet_3', 'Yoldan daş götür', K.c_das, 300, 1000, 150], [null, 'Gülümsə', K.c_gul, 780, 1000, 0]];
      items.forEach(([k, lab, t0, x, y, h]) => {
        if (k) stick(k, x, y, h, t, L(t0)); else { const kk = pop(t, L(t0), 0.45); if (kk > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(kk, kk); ctx.fillStyle = '#ffd34d'; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#5a3a00'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 8, 38, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.fillStyle = '#5a3a00'; [-24, 24].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -18, 8, 0, 7); ctx.fill(); }); ctx.restore(); } }
        if (k === 'k_heyvan_3') grains(t, L(t0) + 0.3, x, y + 40, 26);
        pillT(lab, x, y + 140, 40, MINT, INKD, t, L(t0) + 0.15);
      });
    });
    ct('ALLAH HEÇ BİR YAXŞILIĞI', W / 2, 820, 70, 900, G1, t, L(K.c_itir), 1e9, { glow: '#000' });
    ct('İTİRMƏZ', W / 2, 920, 110, 900, '#fff', t, L(K.c_itir) + 0.6, 1e9, { glow: '#000' });
  },
  s4(t, a) {
    cover('bg02_v', t, a - 0.6, 1.12, 1.04, { dur: 6, dark: 0.5, filter: 'sepia(0.3)' });
    signChip(4, t, L(K.s4));
    ct('KİTABLARA İMAN', W / 2, 420, 96, 900, G1, t, L(K.s4n), 1e9, { glow: '#000' });
    const P = { TÖVRAT: [260, 700], ZƏBUR: [820, 700], İNCİL: [260, 1060], QURAN: [820, 1060] };
    ['TÖVRAT', 'ZƏBUR', 'İNCİL'].forEach((n, i) => flyline(P[n], [540, 880], [0, -60], t, L(K.s4k) + 0.4 + i * 0.25, 0.6));
    Object.entries(P).forEach(([n, [x, y]], i) => pillT(n, x, y, 46, n === 'QURAN' ? G1 : 'rgba(250,245,230,0.95)', '#1a1000', t, L(K.s4n) + 0.3 + i * 0.3));
    const k = pop(t, L(K.s4k) + 1.1, 0.5); if (k > 0) { glow(540, 880, 160, 'rgba(255,214,140,A)', 0.8); stick('k_elamet_4', 540, 880, 170, t, L(K.s4k) + 1.1); }
    ct('Eyni nur · eyni çağırış', W / 2, 1230, 46, 700, '#fff', t, L(K.s4k) + 1.3);
  },
  s5(t, a) {
    cover('bg16_v', t, a - 0.6, 1.0, 1.1, { dur: 10, dark: 0.2 });
    signChip(5, t, L(K.s5));
    ct('AXİRƏTƏ YƏQİN', W / 2, 420, 96, 900, G1, t, L(K.s5n), 1e9, { glow: '#000' });
    strikeReplace('inanırlar', 'YƏQİN EDİRLƏR', W / 2, 590, 70, t, L(K.s5i), L(K.s5y));
    pillT('ŞÜBHƏSİZ BİLİRLƏR', W / 2, 830, 56, MINT, INKD, t, L(K.s5s));
  },
  sirr(t, a) {
    cover('bg18_v', t, a - 0.6, 1.05, 1.15, { dur: 12, dark: 0.45 });
    ct('İNDİ ƏN GÖZƏL SİRR', W / 2, 320, 56, 800, G1, t, L(K.sirr), 1e9, { ls: '6px' });
    ct('Ayə belə bitir:', W / 2, 420, 44, 600, 'rgba(255,255,255,0.9)', t, L(K.aye_bitir));
    ct('«Məhz onlar nicat tapanlardır»', W / 2, 500, 52, 800, '#fff', t, L(K.nicat));
    arT('الْمُفْلِحُونَ', W / 2, 720, 160, t, L(K.erebce) + 0.1, 1e9, 1.0);
    ct('əl-muflihun', W / 2, 870, 52, 700, MINT, t, L(K.mufl2));
    ct('Bu sözü sən HƏR GÜN eşidirsən…', W / 2, 990, 50, 800, '#fff', t, L(K.her_gun));
    const sh = t > L(K.eşid) ? Math.sin(t * 40) * 6 * Math.exp(-(t - L(K.eşid)) * 3) : 0;
    stick('k_kilid', W / 2 + sh, 1190, 230, t, L(K.her_gun) + 0.4, 1e9, { still: 1 });
    const q = life(t, L(K.eşid), 1e9, 0.3); if (q > 0) tx('?', W / 2 + 170, 1110, pf(900, 120), G1, q * (0.7 + 0.3 * Math.sin(t * 5)), { glow: '#000', blur: 20 });
  },
  outro(t, a) {
    cover('bg18_v', t, a - 4, 1.15, 1.2, { dur: 12, dark: 0.7 });
    const A = grainSet('a', 'الْمُفْلِحُونَ', `bold 160px ${AR}`, W / 2, 720), B = grainSet('b', 'TAM VİDEO', pf(900, 130), W / 2, 640);
    const u = grainDissolve(A, B, t, a - 0.1, 1.5);
    if (t < a - 0.1) { ctx.save(); ctx.font = `bold 160px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = G1; ctx.fillText('الْمُفْلِحُونَ', W / 2, 720); ctx.restore(); }
    ct('TAM VİDEO', W / 2, 640, 130, 900, G1, t, a + 1.3, 1e9, { fi: 0.3, glow: '#ffb030', blur: 40 });
    pillT('▶  6 DƏQİQƏ · KANALDA', W / 2, 790, 54, '#e8343a', '#fff', t, L(K.uzun));
    ct('5 əlamətin tam izahı · hədislər', W / 2, 900, 44, 700, '#fff', t, L(K.uzun) + 0.4);
    ct('və sirrin AÇARI', W / 2, 965, 50, 800, MINT, t, L(K.uzun) + 0.8);
    stick('k_kilid', 330, 1130, 170, t, a + 0.2, 1e9, { still: 1 });
    // bouncing arrow to the related-video link
    const ar = life(t, L(K.link), 1e9, 0.3); if (ar > 0) { const b = Math.abs(Math.sin(t * 5)) * 26; ctx.save(); ctx.globalAlpha = ar; ctx.fillStyle = '#fff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 20; ctx.translate(690, 1180 + b); ctx.beginPath(); ctx.moveTo(-40, -70); ctx.lineTo(40, -70); ctx.lineTo(40, 0); ctx.lineTo(80, 0); ctx.lineTo(0, 90); ctx.lineTo(-80, 0); ctx.lineTo(-40, 0); ctx.closePath(); ctx.fill(); ctx.restore(); tx('LİNKƏ TOXUN', 690, 1320, pf(900, 40), '#fff', ar, { glow: '#000', blur: 14 }); }
  },
};
const SCN8 = [['hook', 0], ['ayah', K.ula - 0.35], ['s1', K.s1 - 0.3], ['s2', K.s2 - 0.3], ['s3', K.s3 - 0.3], ['story', K.st0 - 0.3], ['closing', K.c0 - 0.3], ['s4', K.s4 - 0.3], ['s5', K.s5 - 0.3], ['sirr', K.sirr - 0.3], ['outro', K.outro - 0.1]];
const IMPACTS = [K.sayir + 0.05, K.sende, K.st_razi, K.c_var, K.mufl2];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 10; } return s; }
const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) { lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H); const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real; }
const XF = 0.6;
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  const cz = crash(t, L(K.sende), 1.1, 0.03);
  for (let i = 0; i < SCN8.length; i++) {
    const [key, a] = SCN8[i], b = i + 1 < SCN8.length ? SCN8[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = (1 + 0.06 * (1 - eOut(u))) * (key === 'hook' ? cz : 1);
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  // liquid-glass lens over مِمَّا (a part of it)
  if (t > L(K.s3h) && t < K.st0 - 0.4) { const la = R(t, L(K.s3h), L(K.s3h) + 0.5) * (1 - R(t, K.st0 - 1.0, K.st0 - 0.4)); lens(arWordX(L3, 80, W / 2, 0), 590, 105, 1.55, la); }
  tracker(t, K.s1 - 0.6, STARTS, DONE, K.outro - 0.2);
  watermark8(t, 8);
  subs(t);
  vignette(0.3); filmGrain(t);
  const f = R(t, TOTAL2 - 0.5, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
