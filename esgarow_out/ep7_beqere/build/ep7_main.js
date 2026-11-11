// ================= Ayənin sirri 7 — Bəqərə 2:1–2 =================
// Calm standard (skill 5a): measured word times, every entrance starts LEAD s before the word,
// natural pauses kept (visuals hold), one-scene hook, soft 0.9 s dissolves, ≥1.5 s on screen, few impacts.
const K = KT, LEAD = 0.4, L = x => x - LEAD;
const IM = {};
function load(k, src) { pending++; const im = new Image(); im.onload = () => { IM[k] = im; pending--; }; im.onerror = () => { console.log('img fail', src); pending--; }; im.src = src; }
for (let i = 1; i <= 8; i++) load('bg' + i, `img/bg${i}.jpg`);
['kitab_4', 'kitab_5', 'tebiet_1', 'tebiet_2', 'tebiet_3', 'tebiet_4', 'tebiet_5', 'qelb_1', 'qelb_3', 'qelb_4', 'qelb_5', 'rehal'].forEach(k => load(k, `img/${k}.png`));

// ---------- generic ----------
const gl = document.createElement('canvas'); gl.width = W; gl.height = H; const gctx = gl.getContext('2d');
const gl2 = document.createElement('canvas'); gl2.width = W; gl2.height = H; const gctx2 = gl2.getContext('2d');
let grpDepth = 0;
function grp(a, fn) {
  if (a <= 0) return; if (a >= 1) { fn(); return; }
  const c = grpDepth ? gctx2 : gctx, cnv = grpDepth ? gl2 : gl; grpDepth++;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, W, H);
  const real = ctx; ctx = c; ctx.save(); fn(); ctx.restore(); ctx = real; grpDepth--;
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(cnv, 0, 0); ctx.restore();
}
const life = (t, t0, t1 = 1e9, fi = 0.6, fo = 0.5) => R(t, t0, t0 + fi) * (1 - R(t, t1 - fo, t1));
// calm text: fade + small rise, soft shadow, optional end time
function ct(s, x, y, size, weight, col, t, t0, t1 = 1e9, opt = {}) {
  const a = life(t, t0, t1, opt.fi ?? 0.5); if (a <= 0) return;
  const dy = 30 * (1 - eOut(clamp((t - t0) / 0.5)));
  tx(s, x, y + dy, pf(weight, size), col, a, { glow: opt.glow || 'rgba(0,0,0,0.85)', blur: opt.blur ?? 22, ls: opt.ls, align: opt.align });
}
function pillT(s, x, y, size, bg, fg, t, t0, t1 = 1e9, opt = {}) { grp(1 - R(t, t1 - 0.5, t1), () => pill(s, x, y, size, bg, fg, t, t0, opt)); }
function arT(s, x, y, size, t, t0, t1 = 1e9, d = 0.9, col = G1) { grp(1 - R(t, t1 - 0.5, t1), () => arabicK(s, x, y, size, t, t0, d, col)); }
function chipT(s, x, y, t, t0, t1 = 1e9, col = G1, size = 38) { grp(1 - R(t, t1 - 0.5, t1), () => chipK(s, x, y, t, t0, col, size)); }
function stampT(s, t, t0, x, y, size, col, t1 = 1e9) { grp(1 - R(t, t1 - 0.5, t1), () => stampK(s, t, t0, x, y, size, col, -0.06, 'rgba(10,8,4,0.55)')); }
function sprite(k, x, y, h, a = 1, rot = 0, sc = 1, glowCol = null) {
  const im = IM[k]; if (!im || a <= 0) return; const w = im.width * h / im.height;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.shadowColor = glowCol || 'rgba(0,0,0,0.55)'; ctx.shadowBlur = glowCol ? 45 : 30; ctx.shadowOffsetY = glowCol ? 0 : 14;
  ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
}
// calm prop: slow scale-in (no bounce), idle float, optional exit
function propS(k, t, t0, x, y, h, t1 = 1e9, glowCol = null) {
  const a = life(t, t0, t1, 0.5); if (a <= 0) return;
  const s = lerp(0.82, 1, eOut(clamp((t - t0) / 0.7))), bob = Math.sin((t - t0) * 1.4) * 7;
  sprite(k, x, y + bob, h, a, Math.sin((t - t0) * 0.9) * 0.025, s, glowCol);
}
function bgImage(k, t, t0, z0 = 1.0, z1 = 1.1, opt = {}) {
  const im = IM[k]; if (!im) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); return; }
  const u = ease((t - t0) / (opt.dur || 14)), z = lerp(z0, z1, u);
  ctx.save(); ctx.translate(W / 2 + (opt.dx || 0) * u, H / 2 + (opt.dy || 0) * u); if (opt.mirror) ctx.scale(-1, 1); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  if (opt.filter) ctx.filter = opt.filter; ctx.drawImage(im, 0, 0, W, H); ctx.restore();
  if (opt.dark) { ctx.fillStyle = `rgba(0,0,0,${opt.dark})`; ctx.fillRect(0, 0, W, H); }
  const g2 = ctx.createLinearGradient(0, 0, 0, 900); g2.addColorStop(0, 'rgba(5,5,8,0.85)'); g2.addColorStop(1, 'rgba(5,5,8,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, 900);
  const g = ctx.createLinearGradient(0, H * 0.55, 0, H); g.addColorStop(0, 'rgba(5,5,8,0)'); g.addColorStop(1, 'rgba(5,5,8,0.88)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function sourceTag(s, t, t0, t1 = 1e9) { tx(s, W / 2, 1608, pf(500, 30), 'rgba(255,240,210,0.85)', life(t, t0, t1) * 0.9, { glow: '#000', blur: 12 }); }
function bigLetter(ch, x, y, size, t, t0, t1 = 1e9, col = G1) {
  const a = life(t, t0, t1, 0.5); if (a <= 0) return; const s = lerp(1.25, 1, eOut(clamp((t - t0) / 0.7))), fl = Math.sin((t - t0) * 1.2) * 6;
  glow(x, y, size * 0.9, 'rgba(255,190,80,A)', 0.35 * a);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y + fl); ctx.scale(s, s); ctx.font = `bold ${size}px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 40; ctx.fillStyle = col; ctx.fillText(ch, 0, 0); ctx.restore();
}
function counter(from, to, t, t0, d, x, y, size, col = G1, t1 = 1e9) {
  const a = life(t, t0, t1, 0.4); if (a <= 0) return; const v = Math.round(lerp(from, to, eOut(clamp((t - t0) / d))));
  tx(String(v), x, y, pf(900, size), col, a, { glow: '#ffb030', blur: 35 });
}
// sirr title: big for ~1.8 s, then shrinks to a chip at the top
function sirrTitle(t, a, n, word) {
  const big = life(t, a, a + 1.9, 0.5, 0.45);
  if (big > 0) {
    ctx.save(); ctx.fillStyle = `rgba(0,0,0,${0.35 * big})`; ctx.fillRect(0, 0, W, H); ctx.restore();
    ct(word, W / 2, 760, 64, 800, G1, t, L(a), a + 1.9, { ls: '6px' });
    const k = clamp((t - a) / 0.8); tx('SİRR', W / 2, 920, pf(900, 210), '#fff', big, { sc: lerp(1.15, 1, eOut(k)), glow: '#000', blur: 30 });
    badgeBig(n, 860, 790, t, a + 0.4, big);
  }
  grp(R(t, a + 1.9, a + 2.4), () => chipK(`${n} · ${word} SİRR`, W / 2, 205, t, a + 1.9, G1, 34));
}
function badgeBig(n, x, y, t, t0, a) { const k = pop(t, t0, 0.5); if (k <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill(); ctx.restore(); tx(String(n), x, y + 3, pf(900, 72), '#1a1000', a * clamp(k), { sc: k }); }
function underline(x0, x1, y, t, t0, t1 = 1e9) { const a = life(t, t0, t1, 0.3); if (a <= 0) return; grp(a, () => drawStroke([[x0, y], [x1, y]].length && Array.from({ length: 21 }, (_, i) => [lerp(x0, x1, i / 20), y + Math.sin(i * 0.7) * 2]), clamp((t - t0) / 0.6), 6, G1, '#ffb030', false)); }
function rain(t, t0, a = 1) {
  const k = a * clamp((t - t0) / 1.2); if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = `rgba(210,225,255,${0.35 * k})`; ctx.lineWidth = 2;
  for (let i = 0; i < 160; i++) { const x = srand(i) * W * 1.2 - 60, sp = 900 + srand(i + 9) * 700, y = ((srand(i + 3) * H + (t - t0) * sp) % (H + 200)) - 100;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 46); ctx.stroke(); }
  ctx.restore();
}
function candle(t, x, y, a = 1) { const f = 0.8 + 0.2 * Math.sin(t * 9) * Math.sin(t * 5.3 + 1); glow(x, y, 260, 'rgba(255,170,70,A)', 0.32 * f * a); }

// ---------- data ----------
const ALPHA = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
const MUQ = new Set(['ا', 'ل', 'م', 'ص', 'ر', 'ك', 'ه', 'ي', 'ع', 'ط', 'س', 'ح', 'ق', 'ن']);
const MUQ_ORDER = ALPHA.filter(c => MUQ.has(c));
const cellPos = i => [900 - (i % 7) * 120, 830 + Math.floor(i / 7) * 128];

// ---------- scenes ----------
const SC = {
  hook(t) {
    bgImage('bg1', t, 0, 1.0, 1.14, { dur: 16, dy: 30 });
    candle(t, 668, 1050); drawDust(t, 0.45);
    ctx.fillStyle = `rgba(0,0,0,${1 - R(t, 0, 1.3)})`; ctx.fillRect(0, 0, W, H);
    const top = K.esr - 0.25;
    ct('Quranın ən uzun surəsi', W / 2, 300, 62, 800, '#fff', t, L(K.quran), top);
    chipT('BƏQƏRƏ · 286 AYƏ', W / 2, 395, t, L(K.surasi) + 0.3, top, G1, 34);
    ct('bir sözlə yox,', W / 2, 500, 50, 500, 'rgba(255,255,255,0.9)', t, L(K.bir_soz), top);
    ct('ÜÇ HƏRFLƏ', W / 2, 600, 118, 900, G1, t, L(K.uc), top, { glow: '#000' });
    // the three letters stay on screen through the whole hook
    bigLetter('ا', 790, 880, 250, t, L(K.h_elif)); bigLetter('ل', 540, 880, 250, t, L(K.h_lam)); bigLetter('م', 290, 880, 250, t, L(K.h_mim));
    ct('ƏLİF', 790, 1050, 40, 700, '#fff', t, L(K.h_elif)); ct('LAM', 540, 1050, 40, 700, '#fff', t, L(K.h_lam)); ct('MİM', 290, 1050, 40, 700, '#fff', t, L(K.h_mim));
    ct('14 ƏSRDİR', W / 2, 330, 104, 900, G1, t, L(K.esr), 1e9, { glow: '#000' });
    ct('alimlər bu hərflər üzərində düşünür', W / 2, 450, 44, 600, '#fff', t, L(K.esr) + 0.5);
    propS('qelb_1', t, L(K.esr) + 0.3, 540, 1330, 300, K.bes - 0.1);
    ct('Bəs onlar', W / 2, 1270, 56, 700, '#fff', t, L(K.bes));
    ct('NİYƏ ORADADIR?', W / 2, 1375, 92, 900, '#fff', t, L(K.niye), 1e9, { glow: '#000' });
  },
  ayah(t, a) {
    bgImage('bg2', t, a - 1, 1.04, 1.14, { dur: 18, dark: 0.25 });
    drawDust(t, 0.4);
    ct('NİYƏ ORADADIR?', W / 2, 1375, 92, 900, '#fff', t, -9, a + 1.1, { glow: '#000' });
    chipT('BƏQƏRƏ · 2:1–2', W / 2, 220, t, a - 0.2, 1e9, G1, 34);
    bigLetter('ا', 700, 430, 150, t, L(K.a_elif)); bigLetter('ل', 540, 430, 150, t, L(K.a_lam)); bigLetter('م', 380, 430, 150, t, L(K.a_mim));
    arT('ذَٰلِكَ الْكِتَابُ', W / 2, 660, 96, t, L(K.zalik), 1e9, 1.2);
    arT('لَا رَيْبَ ۛ فِيهِ ۛ', W / 2, 830, 96, t, L(K.la), 1e9, K.fih - K.la + 0.5);
    arT('هُدًى لِّلْمُتَّقِينَ', W / 2, 1000, 96, t, L(K.hudan), 1e9, 1.2);
    // meaning, each line underlines its Arabic part as it is said
    ct('Bu, o Kitabdır ki,', W / 2, 1220, 54, 700, '#fff', t, L(K.m_bu)); underline(330, 750, 730, t, L(K.m_kitab));
    ct('onda heç bir şübhə yoxdur.', W / 2, 1305, 54, 700, '#fff', t, L(K.m_onda)); underline(290, 790, 900, t, L(K.m_onda));
    pillT('müttəqilər üçün hidayətdir', W / 2, 1420, 52, G1, '#1a1000', t, L(K.m_mutt)); underline(300, 780, 1070, t, L(K.m_mutt));
  },
  sirr1(t, a) {
    bgImage('bg3', t, a - 1, 1.0, 1.12, { dur: 20, dy: -40 });
    sirrTitle(t, a, 1, 'BİRİNCİ');
    // 29 surahs
    const e29 = K.s1_say + 0.2;
    counter(1, 29, t, L(K.s1_29), 1.3, W / 2, 480, 220, G1, e29);
    ct('SURƏ', W / 2, 640, 64, 800, '#fff', t, L(K.s1_29) + 0.4, e29);
    ct('belə hərflərlə başlayır', W / 2, 720, 44, 500, 'rgba(255,255,255,0.9)', t, L(K.s1_29) + 1.2, e29);
    chipT('29 SURƏ', W / 2, 330, t, e29, 1e9, G1, 34);
    // alphabet grid: 28 letters, 14 light up
    const gIn = L(K.s1_say), dim = R(t, K.s1_tekrar, K.s1_tekrar + 0.8), fade = 1 - 0.88 * R(t, L(K.s1_allah), K.s1_allah + 0.6);
    ct('Ərəb əlifbası · 28 hərf', W / 2, 440, 46, 700, '#fff', t, e29 + 0.1, L(K.s1_allah));
    ALPHA.forEach((ch, i) => {
      const [x, y] = cellPos(i), ap = life(t, gIn + i * 0.035, 1e9, 0.4); if (ap <= 0) return;
      const mi = MUQ_ORDER.indexOf(ch), lit = mi >= 0 ? R(t, L(K.s1_14) + mi * 0.09, L(K.s1_14) + mi * 0.09 + 0.3) : 0;
      ctx.save(); ctx.globalAlpha = ap * fade; ctx.fillStyle = lit > 0 ? `rgba(246,199,104,${0.18 * lit})` : 'rgba(0,0,0,0.35)'; rrect(x - 52, y - 56, 104, 112, 18); ctx.fill();
      ctx.strokeStyle = lit > 0 ? `rgba(246,199,104,${0.9 * lit})` : 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      const col = lit > 0.5 ? G1 : `rgba(255,255,255,${lerp(0.95, 0.3, dim)})`;
      ctx.save(); ctx.globalAlpha = ap * fade; ctx.font = `bold 66px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; if (lit > 0.5) { ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 25; } ctx.fillStyle = col; ctx.fillText(ch, x, y + 4); ctx.restore();
    });
    counter(0, 14, t, L(K.s1_14), 1.4, 380, 1400, 150, G1, L(K.s1_allah) + 0.2);
    ct('/ 28', 640, 1410, 90, 800, '#fff', t, L(K.s1_yari), L(K.s1_allah) + 0.2);
    pillT('ƏLİFBANIN DÜZ YARISI', W / 2, 1530, 50, MINT, INKD, t, L(K.s1_yari_w), L(K.s1_allah) + 0.2);
    // only Allah knows
    arT('وَاللّٰهُ أَعْلَمُ', W / 2, 1180, 120, t, L(K.s1_allah_w) - 0.2, 1e9, 1.0);
    ct('Dəqiq mənasını yalnız Allah bilir', W / 2, 1350, 48, 700, '#fff', t, L(K.s1_allah));
    sourceTag('İbn Kəsir təfsiri · Bəqərə 2:1', t, K.s1_allah + 0.5);
  },
  sirr2(t, a) {
    bgImage('bg4', t, a - 1, 1.12, 1.0, { dur: 26, dark: 0.3 });
    candle(t, 160, 1500, 0.6); candle(t, 980, 1560, 0.5);
    sirrTitle(t, a, 2, 'İKİNCİ');
    const A1 = K.s2_ele - 0.35;  // phase A ends
    ct('Bəs niyə məhz', W / 2, 330, 56, 700, '#fff', t, L(K.s2_niye), A1);
    ct('HƏRFLƏR?', W / 2, 440, 110, 900, G1, t, L(K.s2_niye) + 0.6, A1, { glow: '#000' });
    ct('Alimlər deyir:', W / 2, 560, 44, 600, 'rgba(255,255,255,0.9)', t, L(K.s2_alim), A1);
    grp(life(t, L(K.s2_kitab), A1, 0.6), () => { ctx.save(); ctx.fillStyle = 'rgba(12,9,5,0.72)'; rrect(110, 650, 860, 420, 30); ctx.fill(); ctx.strokeStyle = 'rgba(246,199,104,0.8)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); tx('“', 175, 700, pf(900, 120), G1, 1); });
    ct('Bu Kitab sizin hər gün', W / 2, 760, 52, 700, '#fff', t, L(K.s2_kitab), A1);
    ct('danışdığınız hərflərdən', W / 2, 850, 52, 700, '#fff', t, L(K.s2_kitab) + 1.4, A1);
    ct('qurulub.', W / 2, 940, 52, 700, G1, t, L(K.s2_herf) + 0.4, A1);
    ct('Bacarırsınızsa,', W / 2, 1180, 56, 800, '#fff', t, L(K.s2_bacar), A1);
    stampT('BƏNZƏRİNİ GƏTİRİN', t, L(K.s2_benz), W / 2, 1310, 64, G1, A1);
    // phase B: 2:2 -> 2:23
    ct('Elə bu surədə,', W / 2, 330, 58, 700, '#fff', t, L(K.s2_ele));
    chipT('2:2', 270, 500, t, L(K.s2_21), 1e9, '#fff', 48); chipT('2:23', 810, 500, t, L(K.s2_21) + 1.0, 1e9, G1, 48);
    grp(life(t, L(K.s2_21) + 0.3, 1e9, 0.3), () => drawStroke(curvePts(380, 500, 680, 500, 530, 420, 30), clamp((t - L(K.s2_21) - 0.3) / 0.9), 6, G1, '#ffb030', false));
    ct('+21 ayə sonra', W / 2, 400, 40, 700, G1, t, L(K.s2_21) + 0.6);
    ct('bu çağırış açıq deyilir:', W / 2, 650, 46, 600, 'rgba(255,255,255,0.92)', t, L(K.s2_cagir));
    arT('فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ', W / 2, 820, 86, t, L(K.s2_sure), 1e9, 1.2);
    ct('«Onun kimi bir surə gətirin»', W / 2, 960, 52, 800, '#fff', t, L(K.s2_sure) + 0.4);
    propS('qelb_1', t, L(K.s2_14), 250, 1290, 300);
    ct('14 ƏSR', 690, 1220, 100, 900, G1, t, L(K.s2_14), 1e9, { glow: '#000' });
    stampT('HEÇ KİM', t, L(K.s2_hec), 690, 1370, 70, '#ff6b5b');
    ct('gətirə bilməyib', 690, 1475, 44, 700, '#fff', t, L(K.s2_hec) + 0.5);
    sourceTag('Bəqərə 2:23', t, K.s2_sure + 0.5);
  },
  sirr3(t, a) {
    bgImage('bg5', t, a - 1, 1.0, 1.12, { dur: 24, dark: 0.35 });
    sirrTitle(t, a, 3, 'ÜÇÜNCÜ');
    ct('Mushafa diqqətlə bax', W / 2, 330, 58, 800, '#fff', t, L(K.s3_bax));
    propS('kitab_5', t, L(K.s3_bax) + 0.4, 930, 420, 190, K.s3_la);
    // the line with its two three-dot marks, word by word (RTL)
    const Y = 640;
    const word = (s, x, t0, col = '#fff7e0', a2 = 1) => { const a3 = life(t, t0, 1e9, 0.6) * a2; if (a3 <= 0) return; ctx.save(); ctx.globalAlpha = a3; ctx.font = `bold 104px ${AR}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 25; ctx.fillStyle = col; ctx.fillText(s, x, Y); ctx.restore(); };
    const r2 = R(t, L(K.s3_r2t), L(K.s3_r2t) + 0.5), r1 = R(t, L(K.s3_r1t), L(K.s3_r1t) + 0.5) * (1 - r2);
    word('لَا', 920, L(K.s3_la)); word('رَيْبَ', 720, L(K.s3_la) + 0.3); word('فِيهِ', 470, L(K.s3_fih));
    word('هُدًى', 205, L(K.s3_fih) + 0.3, G1, 0.55 + 0.45 * r2);
    // custom 3-dot marks (ۛ) next to ريب and فيه
    [[600, Y - 95], [340, Y - 95]].forEach(([x, y], i) => {
      const a3 = life(t, L(K.s3_uc) + i * 0.25, 1e9, 0.4); if (a3 <= 0) return; const p = 1 + 0.25 * Math.sin(t * 4 + i);
      glow(x, y, 70, 'rgba(255,200,90,A)', 0.6 * a3);
      ctx.save(); ctx.globalAlpha = a3; ctx.fillStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 20;
      [[0, -12], [-11, 8], [11, 8]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(x + dx, y + dy, 8 * p, 0, 7); ctx.fill(); }); ctx.restore();
    });
    const R1 = K.s3_r1 - 0.3;
    pillT('ÜÇ NÖQTƏ', W / 2, 820, 50, G1, '#1a1000', t, L(K.s3_uc) + 0.2, R1);
    ct('dayanma işarəsidir', W / 2, 930, 52, 700, '#fff', t, L(K.s3_dayan), R1);
    ct('İKİ MƏNA', W / 2, 1060, 104, 900, G1, t, L(K.s3_iki), R1, { glow: '#000' });
    // stop bar: reading 1 stops after فيه, reading 2 after ريب
    const bx = lerp(340, 600, r2), ba = Math.max(r1, r2);
    if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; ctx.strokeStyle = '#7be3a2'; ctx.lineWidth = 8; ctx.shadowColor = '#7be3a2'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.moveTo(bx, Y - 70); ctx.lineTo(bx, Y + 70); ctx.stroke(); ctx.restore(); }
    badge(1, 150, 900, t, L(K.s3_r1), G1, '#1a1000', 40);
    ct('«Onda şübhə yoxdur.»', 590, 900, 50, 800, '#fff', t, L(K.s3_r1t));
    badge(2, 150, 1060, t, L(K.s3_r2), G1, '#1a1000', 40);
    ct('«Şübhə yoxdur.', 560, 1040, 50, 800, '#fff', t, L(K.s3_r2t));
    ct('Onda hidayət var.»', 560, 1115, 50, 800, '#fff', t, L(K.s3_r2b));
    pillT('BİR AYƏDƏ İKİ HƏQİQƏT', W / 2, 1330, 54, G1, '#1a1000', t, L(K.s3_iki_h));
    sourceTag('Təanuq vəqfi · mushafdakı ۛ ۛ işarəsi', t, K.s3_uc + 0.5);
  },
  rain(t, a) {
    bgImage('bg6', t, a - 1, 1.0, 1.1, { dur: 20 });
    rain(t, L(K.r_yagis));
    const A = K.r_quran + 0.3;
    ct('Bəs niyə hidayət yalnız', W / 2, 310, 52, 700, '#fff', t, L(K.r_niye), A);
    ct('MÜTTƏQİLƏR ÜÇÜN?', W / 2, 410, 92, 900, G1, t, L(K.r_mutt), A, { glow: '#000' });
    propS('tebiet_1', t, L(K.r_yagis), W / 2, 640, 260, A);
    ct('Yağış hər torpağa yağır', W / 2, 820, 50, 700, '#fff', t, L(K.r_yagis) + 0.3, A);
    propS('tebiet_2', t, L(K.r_hazir), 290, 1180, 240, A); propS('tebiet_3', t, L(K.r_hazir) + 0.4, 790, 1190, 230, A);
    grp(1 - R(t, A - 0.5, A), () => { prop((u) => icMark(true, u), t, L(K.r_hazir) + 0.9, 400, 1060, 110, { shadow: false, float: 0 }); prop((u) => icMark(false, u), t, L(K.r_hazir) + 1.3, 900, 1060, 110, { shadow: false, float: 0 }); });
    pillT('hazır torpaq bitirir', 290, 1360, 40, MINT, INKD, t, L(K.r_hazir) + 0.6, A);
    // phase B
    ct('QURAN HAMIYA ENİB', W / 2, 330, 84, 900, G1, t, L(K.r_quran) + 0.25, 1e9, { glow: '#000' });
    propS('qelb_3', t, L(K.r_qelb), W / 2, 640, 280, 1e9, 'rgba(255,190,80,0.9)');
    ct('qəlbini hazırlayan faydalanır', W / 2, 850, 50, 700, '#fff', t, L(K.r_qelb) + 0.6);
    ct('MÜTTƏQİ', W / 2, 1060, 120, 900, '#fff', t, L(K.r_mutt2), 1e9, { glow: '#000' });
    pillT('Allahı unutmayan', W / 2, 1200, 50, MINT, INKD, t, L(K.r_unut));
    pillT('özünü günahdan qoruyan insan', W / 2, 1310, 50, MINT, INKD, t, L(K.r_qoru));
    sourceTag('Yağış misalı · Buxari 79', t, K.r_hazir);
  },
  mujde(t, a) {
    bgImage('bg7', t, a - 1, 1.08, 1.0, { dur: 18, dark: 0.45 });
    drawDust(t, 0.35);
    ct('BİR MÜJDƏ', W / 2, 320, 110, 900, G1, t, L(K.mujde), 1e9, { glow: '#000' });
    propS('tebiet_5', t, L(K.mujde) + 0.5, 110, 320, 110, 1e9, 'rgba(255,200,90,0.8)'); propS('tebiet_5', t, L(K.mujde) + 0.7, 970, 320, 110, 1e9, 'rgba(255,200,90,0.8)');
    ct('Peyğəmbərimiz (s.ə.s.) buyurub:', W / 2, 450, 46, 600, 'rgba(255,255,255,0.92)', t, L(K.m_peyg));
    ct('Qurandan oxuduğun hər hərfə', W / 2, 560, 54, 800, '#fff', t, L(K.m_herf));
    pillT('+10 SAVAB', W / 2, 680, 70, G1, '#1a1000', t, L(K.m_10));
    [['ا', 790, K.m_e], ['ل', 540, K.m_l], ['م', 290, K.m_m]].forEach(([ch, x, t0]) => {
      bigLetter(ch, x, 980, 220, t, L(t0));
      const k = pop(t, L(t0) + 0.35, 0.45); if (k > 0) { ctx.save(); ctx.translate(x, 830); ctx.scale(k, k); ctx.fillStyle = 'rgba(12,9,5,0.75)'; rrect(-80, -38, 160, 76, 38); ctx.fill(); ctx.strokeStyle = G1; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); tx('+10', x, 832, pf(900, 46), G1, clamp(k), { sc: k }); }
    });
    const n = (t >= L(K.m_e) + 0.35 ? 10 : 0) + (t >= L(K.m_l) + 0.35 ? 10 : 0) + (t >= L(K.m_m) + 0.35 ? 10 : 0);
    if (n > 0 && t < L(K.m_30)) tx(`= ${n}`, W / 2, 1230, pf(900, 110), '#fff', life(t, L(K.m_e) + 0.35, L(K.m_30)), { glow: '#000', blur: 25 });
    stampT('30 SAVAB', t, L(K.m_30), W / 2, 1260, 104, G1);
    ct('bu üç hərfi oxuyan kimi', W / 2, 1420, 46, 700, '#fff', t, L(K.m_yeni));
    sourceTag('Tirmizi 2910', t, K.m_herf + 0.5);
  },
  serh(t, a) {
    bgImage('bg1', t, a - 1, 1.1, 1.18, { dur: 8, mirror: true, dark: 0.5 });
    candle(t, 412, 1050, 0.7);
    grp(life(t, a - 0.3, 1e9, 0.6), () => {
      ctx.save(); ctx.fillStyle = 'rgba(250,248,242,0.96)'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40; rrect(90, 640, 900, 360, 34); ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(170, 720, 42, 0, 7); ctx.clip(); ctx.drawImage(logo, 128, 678, 84, 84); ctx.restore();
      tx('@esgarow', 230, 720, pf(800, 36), INKD, 1, { align: 'left' });
    });
    ct('Bu gün Qurandan', W / 2, 820, 56, 800, INKD, t, L(K.serh), 1e9, { glow: 'rgba(0,0,0,0)', blur: 0 });
    ct('neçə hərf oxudun?', W / 2, 905, 56, 800, '#0f7f5a', t, L(K.serh) + 0.8, 1e9, { glow: 'rgba(0,0,0,0)', blur: 0 });
    pillT('Şərhdə rəqəmlə yaz 👇', W / 2, 1130, 54, G1, '#1a1000', t, L(K.serh_yaz));
    grp(life(t, L(K.serh_yaz) + 0.4), () => { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.95)'; rrect(140, 1250, 800, 100, 50); ctx.fill(); ctx.restore(); const nums = '30'; const n = Math.floor(clamp((t - L(K.serh_yaz) - 0.8) * 3, 0, nums.length)); tx(nums.slice(0, n) + (Math.sin(t * 10) > 0 ? '|' : ''), 200, 1300, pf(700, 46), INKD, 1, { align: 'left' }); });
  },
  teaser(t, a) {
    bgImage('bg8', t, a - 1, 1.0, 1.1, { dur: 10 });
    chipT('NÖVBƏTİ VİDEO', W / 2, 260, t, L(K.novbeti), 1e9, G1, 38);
    ct('MÜTTƏQİ KİMDİR?', W / 2, 400, 96, 900, '#fff', t, L(K.mutt_kim), 1e9, { glow: '#000' });
    ct('5 ƏLAMƏT', W / 2, 530, 84, 900, G1, t, L(K.bes_elamet), 1e9, { glow: '#000' });
    for (let i = 0; i < 5; i++) { const k = pop(t, L(K.bes_elamet) + 0.3 + i * 0.15, 0.45); if (k <= 0) continue; ctx.save(); ctx.translate(300 + i * 120, 640); ctx.scale(k, k); ctx.fillStyle = G1; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.fill(); ctx.restore(); tx(String(i + 1), 300 + i * 120, 642, pf(800, 26), '#1a1000', clamp(k)); }
    propS('rehal', t, L(K.novbeti) + 0.5, W / 2, 1120, 470);
  },
};
const SCN7 = [['hook', 0], ['ayah', K.a_elif - 0.1], ['sirr1', K.sirr1], ['sirr2', K.sirr2], ['sirr3', K.sirr3], ['rain', K.r_niye], ['mujde', K.mujde], ['serh', K.serh], ['teaser', K.novbeti]];
const IMPACTS = [K.uc, K.s2_hec, K.m_30];
function shakeAt(t) { let s = 0; for (const i of IMPACTS) { const d = t - L(i); if (d >= 0 && d < 0.6) s += Math.exp(-d * 8) * 9; } return s; }

const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const lctx = layer.getContext('2d');
function drawScene(key, t, a, b) {
  lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.globalAlpha = 1; lctx.filter = 'none'; lctx.clearRect(0, 0, W, H);
  const real = ctx; ctx = lctx; ctx.save(); SC[key](t, a, b); ctx.restore(); ctx = real;
}
function watermark7(t) {
  const a = 0.85 * (1 - R(t, K.abune + 0.1, K.abune + 0.6)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(10,10,12,0.5)'; rrect(36, 44, 300, 70, 35); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(79, 79, 26, 0, 7); ctx.clip(); ctx.drawImage(logo, 53, 53, 52, 52); ctx.restore();
  ctx.font = pf(700, 30); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('@esgarow', 118, 81);
  ctx.fillStyle = 'rgba(10,10,12,0.5)'; rrect(W - 356, 44, 320, 70, 35); ctx.fill(); ctx.restore();
  tx('AYƏNİN SİRRİ · 7', W - 196, 81, pf(800, 28), G1, a, { ls: '2px' });
}
const XF = 0.9; // dissolve length
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  for (let i = 0; i < SCN7.length; i++) {
    const [key, a] = SCN7[i], b = i + 1 < SCN7.length ? SCN7[i + 1][1] : TOTAL2 + 1, pre = i === 0 ? 0 : XF;
    if (t < a - pre || t >= b) continue;
    drawScene(key, t, a, b);
    const u = pre ? clamp((t - (a - pre)) / pre) : 1, z = 1 + 0.05 * (1 - eOut(u));
    ctx.save(); ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = ease(u); ctx.drawImage(layer, 0, 0); ctx.restore();
  }
  // liquid-glass lens over the two three-dot marks (sirr 3)
  if (t > L(K.s3_uc) && t < K.s3_r1 + 0.2) { const la = R(t, L(K.s3_uc), K.s3_uc + 0.6) * (1 - R(t, K.s3_r1 - 0.4, K.s3_r1 + 0.2)); const x = lerp(600, 340, ease(R(t, K.s3_uc + 0.9, K.s3_uc + 2.2))); lens(x, 560, 120, 1.6, la); }
  watermark7(t); endCard(t - 0.8);
  vignette(0.35); filmGrain(t);
  const f = R(t, TOTAL2 - 0.7, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
