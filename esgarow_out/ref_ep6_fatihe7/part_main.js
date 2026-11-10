// ================= Ayənin sirri 6 — Fatihə 1:7 =================
// New in this episode (ideas from hyperframes cut-the-curve / motion-doctrine, video-effects, video-shotcraft):
// velocity-matched seams (zoom-through, inverse zoom, whip-pan, rack-focus blur), waterfall word entry,
// three glowing doors, colour-coded ayah (gold / red / grey = three groups), ladder of four,
// split screen with ✓/✗, two lines merging into one road, "Amin" star-wave, 1→7 lamp counter.
const K = KT;
const IM = {};
['yol', 'heyet', 'kitab', 'nerdivan', 'yolcular', 'dua', 'ikiyol', 'mescid', 'ulduz', 'yeddi', 'sema'].forEach(k => load(k, `img/${k}.jpg`));
['kandil', 'door1', 'door2', 'door3', 'A_1', 'A_2', 'A_3', 'A_4', 'A_5', 'B_1', 'B_2', 'B_3', 'B_4', 'B_5', 'C_1', 'C_2', 'C_3', 'C_4', 'C_5'].forEach(k => load(k, `img/${k}.png`));
function load(k, src) { pending++; const im = new Image(); im.onload = () => { IM[k] = im; IMG[k] = im; pending--; }; im.onerror = () => pending--; im.src = src; }

const GREY = '#c8d0dc', OK = '#7be3a2';
const e4o = t => 1 - Math.pow(1 - clamp(t), 4), e4i = t => Math.pow(clamp(t), 4);

// ---------- new helpers ----------
// WATERFALL entry: words drop in one after another (heavier words land later and harder)
function waterfall(s, x, y, font, col, t, t0, step = 0.07, opt = {}) {
  if (t < t0) return;
  const words = s.split(' ');
  ctx.save(); ctx.font = font; ctx.letterSpacing = opt.ls || '0px';
  const sp = ctx.measureText(' ').width, ws = words.map(w => ctx.measureText(w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  ctx.restore();
  let cx = x - tot / 2;
  words.forEach((w, i) => {
    const u = clamp((t - t0 - i * step) / 0.42);
    if (u > 0) {
      const e = e4o(u), dy = -90 * (1 - e), bl = 10 * (1 - e);
      ctx.save(); if (bl > 0.5) ctx.filter = `blur(${bl.toFixed(1)}px)`;
      tx(w, cx + ws[i] / 2, y + dy, font, col, clamp(u * 2), { glow: opt.glow || '#000', blur: opt.blur || 20, ls: opt.ls });
      ctx.restore();
    }
    cx += ws[i] + sp;
  });
}
// ✓ / ✗ marks drawn as strokes
function tick(x, y, s, u, col = OK) {
  if (u <= 0) return; const p = [[-0.5, 0], [-0.15, 0.38], [0.55, -0.45]];
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.moveTo(p[0][0] * s, p[0][1] * s);
  const L1 = 0.45, k = clamp(u);
  if (k < L1) { const v = k / L1; ctx.lineTo(lerp(p[0][0], p[1][0], v) * s, lerp(p[0][1], p[1][1], v) * s); }
  else { const v = (k - L1) / (1 - L1); ctx.lineTo(p[1][0] * s, p[1][1] * s); ctx.lineTo(lerp(p[1][0], p[2][0], v) * s, lerp(p[1][1], p[2][1], v) * s); }
  ctx.stroke(); ctx.restore();
}
function cross(x, y, s, u, col = RED) {
  if (u <= 0) return; const a = clamp(u * 2), b = clamp(u * 2 - 1);
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(lerp(-s / 2, s / 2, a), lerp(-s / 2, s / 2, a)); ctx.stroke();
  if (b > 0) { ctx.beginPath(); ctx.moveTo(s / 2, -s / 2); ctx.lineTo(lerp(s / 2, -s / 2, b), lerp(-s / 2, s / 2, b)); ctx.stroke(); }
  ctx.restore();
}
// strike-through line across a text width
function strike(x, y, w, u, col = RED) {
  if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y + 6); ctx.lineTo(x - w / 2 + w * e4o(u), y - 6); ctx.stroke(); ctx.restore();
}
// glass panel (rounded, dark, gold edge)
function panel(x, y, w, h, k, edge = 'rgba(246,199,104,0.85)', fill = 'rgba(14,10,5,0.8)') {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = fill; rrect(-w / 2, -h / 2, w, h, 30); ctx.fill();
  ctx.strokeStyle = edge; ctx.lineWidth = 3.5; ctx.shadowColor = edge; ctx.shadowBlur = 18; ctx.stroke(); ctx.restore();
}
// expanding rings (sound / amin wave)
function rings(t, x, y, n, col, a = 1, speed = 0.6, maxR = 900) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const ph = ((t * speed + i / n) % 1); ctx.strokeStyle = `rgba(${col},${a * (1 - ph) * 0.7})`; ctx.lineWidth = 6 * (1 - ph) + 1;
    ctx.beginPath(); ctx.ellipse(x, y, maxR * ph, maxR * ph * 0.42, 0, 0, 7); ctx.stroke(); }
  ctx.restore();
}
function counterTx(n, x, y, size, col, k) { tx(String(n), x, y, `${size}px ${AN}`, col, clamp(k), { sc: k, glow: '#ffb030', blur: 50 }); }

const IMPACTS = [K.son, K.soz, K.uc_qrup, K.hansinda, K.yox, K.kimdir, K.p4, K.yoldasi, K.sen_verdin, K.sen_qez, K.sen_azd, K.etmeyen, K.bilmeden,
  K.dogru + 1.0, K.qezebe_ap, K.amin, K.siz_de, K.bagis, K.her_biri, K.etmek_q, K.hansidir];
function shakeAt(t) {
  let s = 0; for (const i of IMPACTS) { const d = t - i; if (d >= 0 && d < 0.5) s += Math.exp(-d * 9) * 14; }
  const d = t - K.amin; if (d >= 0 && d < 0.8) s += Math.exp(-d * 6) * 22;
  return s;
}

// ================= scenes =================
const AYL = ['صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ', 'وَلَا الضَّالِّينَ'];
const AYW = ['صِرَاطَ', 'الَّذِينَ', 'أَنْعَمْتَ', 'عَلَيْهِمْ', 'غَيْرِ', 'الْمَغْضُوبِ', 'عَلَيْهِمْ', 'وَلَا', 'الضَّالِّينَ'];
const SCENES = {
  hook(t) {
    if (t < 1.55) fracture('yol', t, 0, 1.5); else bgImage('yol', t, 1.55, 1.0, 1.14, { dur: 9 });
    lightLeak(t, 0.12);
    // last ayah of the first surah
    grp(fadeOut(t, K.bu_doqquz - 0.15, 0.35), () => {
      sideChip('QURAN · FATİHƏ', t, K.quran, W / 2, 300, G1, 44);
      bigText('1 : 7', t, K.son - 0.15, 470, 200, '#fff');
      waterfall('son ayə — ən uzun ayə', W / 2, 620, `64px ${CV}`, G2, t, K.uzun - 0.3, 0.08);
      // nine word tiles
      AYW.forEach((w, i) => {
        const t0 = K.cemi + i * 0.09, k = pop(t, t0, 0.32); if (k <= 0) return;
        const col = i % 3, row = Math.floor(i / 3), x = 820 - col * 280, y = 830 + row * 175;
        panel(x, y, 250, 145, k, i < 4 ? 'rgba(246,199,104,0.9)' : i < 7 ? 'rgba(226,67,63,0.9)' : 'rgba(200,208,220,0.9)');
        tx(w, x, y - 4, `bold ${w.length > 8 ? 46 : 54}px ${AR}`, i < 4 ? G1 : i < 7 ? '#ff8a80' : GREY, clamp(k), { sc: k, glow: '#000', blur: 15 });
        tx(String(i + 1), x + 105, y - 52, `28px ${AN}`, 'rgba(255,240,210,0.6)', clamp(k));
      });
      if (t >= K.doqquz) { const n = Math.min(9, 1 + Math.floor(R(t, K.doqquz - 0.2, K.soz, x => x) * 8)); stamp(`${n} SÖZ`, t, K.doqquz - 0.2, W / 2, 1450, 96, G1, -0.05); }
    });
    // three doors = three groups
    if (t >= K.bu_doqquz - 0.2) {
      darken(0.35 * R(t, K.bu_doqquz - 0.2, K.bu_doqquz + 0.3));
      waterfall('Bu 9 sözün içində', W / 2, 330, `66px ${CV}`, '#fff', t, K.bu_doqquz, 0.07);
      bigText('3 QRUP İNSAN', t, K.uc_qrup, 470, 120, G1);
      [['door1', 210, 'rgba(255,200,110,A)'], ['door2', 540, 'rgba(255,60,50,A)'], ['door3', 870, 'rgba(200,210,230,A)']].forEach(([d, x, gc], i) => {
        const t0 = K.uc_qrup + 0.15 + i * 0.18, k = pop(t, t0, 0.45); if (k <= 0) return;
        const f = 0.75 + 0.25 * Math.sin(t * 4 + i * 2);
        glow(x, 1080, 260, gc, 0.45 * clamp(k) * f);
        sprite(d, x, 1080 + 30 * (1 - clamp(k)), 560, clamp(k * 2), 0, k);
      });
      if (t >= K.hansinda) glitchTx('SƏN HANSINDASAN?', W / 2, 1530, `96px ${AN}`, '#fff', t, K.hansinda);
    }
  },

  ayah(t, a) {
    bgImage('heyet', t, a, 1.1, 1.0, { dur: 12 }); darken(0.3);
    const k = pop(t, a + 0.3, 0.6), fl = 0.8 + 0.2 * Math.sin(t * 9) * Math.sin(t * 3.1);
    glow(W / 2, 1520, 300, 'rgba(255,180,80,A)', 0.5 * clamp(k) * fl);
    sprite('kandil', W / 2, 1600, 360, clamp(k * 2), Math.sin(t * 1.2) * 0.03, k);
    const cols = [G1, '#ff8a80', GREY], gcol = ['#ffb030', '#ff3a30', '#9fb0c8'], t0s = [a, K.gayril - 0.1, K.veled - 0.1];
    AYL.forEach((l, i) => { if (t >= t0s[i]) arabic(l, W / 2, 330 + i * 140, i ? 84 : 76, t, t0s[i], i ? 1.0 : 1.6, cols[i]); });
    // meaning, colour-coded
    if (t >= K.nemet - 0.1) {
      waterfall('Nemət verdiyin kəslərin yoluna', W / 2, 820, `54px ${MO}`, G2, t, K.nemet - 0.1, 0.09, { glow: '#ffb030', blur: 18 });
      tick(W / 2, 925, 70, R(t, K.nemet + 1.2, K.nemet + 1.6, x => x));
    }
    if (t >= K.qezebe - 0.1) {
      waterfall('Qəzəbə uğrayanların', W / 2, 1060, `60px ${MO}`, '#ff8a80', t, K.qezebe - 0.1, 0.09);
      waterfall('və azanların', W / 2, 1145, `60px ${MO}`, GREY, t, K.azan - 0.1, 0.09);
      if (t >= K.yox) stamp('YOLUNA YOX', t, K.yox, W / 2, 1290, 76, RED, -0.05);
    }
    sourceTag('Fatihə 1:7', t, a + 1.8, 205);
  },

  sozsoz(t, a) {
    bgImage('kitab', t, a, 1.0, 1.12, { dur: 9 }); darken(0.35);
    bigText('SÖZ-SÖZ', t, a + 0.05, 290, 110, G1);
    const items = [['صِرَاطَ', 'YOL', 'A_1', K.w1], ['الَّذِينَ', 'O KƏSLƏR Kİ', 'A_2', K.w2], ['أَنْعَمْتَ', 'NEMƏT VERDİN', 'A_3', K.w3],
      ['غَيْرِ', 'DEYİL', null, K.w4], ['الْمَغْضُوبِ', 'QƏZƏBƏ UĞRAYAN', 'A_4', K.w5], ['الضَّالِّينَ', 'YOLUNU AZANLAR', 'A_5', K.w6]];
    items.forEach(([ar, az, ic, t0], i) => {
      const x = i % 2 ? 790 : 290, y = 560 + Math.floor(i / 2) * 400, k = pop(t, t0 - 0.25, 0.4); if (k <= 0) return;
      const active = t >= t0 - 0.1 && (i === 5 || t < items[i + 1][3] - 0.1);
      panel(x, y, 470, 360, k, active ? 'rgba(255,226,160,1)' : 'rgba(246,199,104,0.55)', active ? 'rgba(30,20,6,0.88)' : 'rgba(14,10,5,0.78)');
      if (ic) sprite(ic, x, y - 85, 135, clamp(k), Math.sin(t * 2 + i) * 0.05, k);
      else cross(x, y - 85, 90, R(t, t0, t0 + 0.4, x => x));
      tx(ar, x, y + 40, `bold ${ar.length > 8 ? 62 : 70}px ${AR}`, G1, clamp(k), { sc: k, glow: '#ffb030', blur: 22 });
      tx(az, x, y + 130, `${az.length > 12 ? 38 : 44}px ${AN}`, '#fff', R(t, t0 + 0.1, t0 + 0.4), { ls: '2px' });
    });
  },

  sirr1(t, a) {
    if (t < K.kimdir - 0.1) { sirrCard(t, a, 1, 'nemət verilənlər', 'nerdivan'); return; }
    bgImage('nerdivan', t, K.kimdir - 0.1, 1.15, 1.02, { dur: 11 }); darken(0.2);
    grp(fadeOut(t, K.p1 - 0.3, 0.35), () => {
      waterfall('Nemət verilənlər', W / 2, 360, `70px ${CV}`, G2, t, K.kimdir, 0.1);
      bigText('KİMDİR?', t, K.kimdir + 0.9, 500, 150, '#fff');
      if (t >= K.quran_ozu - 0.1) { waterfall('Quran özü cavab verir', W / 2, 680, `56px ${MO}`, '#fff', t, K.quran_ozu - 0.1, 0.08); }
    });
    // ladder of four (Nisa 4:69): bottom → top, each step lights up
    const steps = [['PEYĞƏMBƏRLƏR', 'B_1', K.p1], ['SİDDİQLƏR', 'B_2', K.p2], ['ŞƏHİDLƏR', 'B_3', K.p3], ['SALEHLƏR', 'B_4', K.p4]];
    const done = R(t, K.deyir - 0.2, K.deyir + 0.3);
    steps.forEach(([s, ic, t0], i) => {
      const k = pop(t, t0 - 0.1, 0.45); if (k <= 0) return;
      const y = 540 + i * 250, x = W / 2 + (i % 2 ? 40 : -40);
      glow(x, y, 300, 'rgba(255,200,110,A)', 0.25 * clamp(k));
      panel(x, y, 820, 190, k);
      sprite(ic, x - 300, y, 140, clamp(k), 0, k, '#ffb030');
      tx(s, x + 70, y, `78px ${AN}`, i === steps.findIndex(z => t < z[2] + 0.9) || t > K.deyir - 0.3 ? G2 : '#fff', clamp(k), { sc: k, ls: '3px', glow: '#000', blur: 18 });
      tx(String(i + 1), x + 375, y - 70, `34px ${AN}`, 'rgba(255,226,160,0.6)', clamp(k));
    });
    if (t >= K.p1 - 0.1) arabic('مَعَ الَّذِينَ أَنْعَمَ اللَّهُ عَلَيْهِم', W / 2, 300, 68, t, K.p1 - 0.1, 1.2);
    if (t >= K.deyir) {
      const k = pop(t, K.yoldas - 0.2, 0.5);
      panel(W / 2, 1620, 940, 170, k, 'rgba(255,226,160,1)', 'rgba(30,20,6,0.9)');
      tx('«ONLAR NƏ GÖZƏL YOLDAŞDIR»', W / 2, 1620, `64px ${AN}`, G2, clamp(k), { sc: k, ls: '2px', glow: '#ffb030' });
    }
    sourceTag('Nisa 4:69', t, K.p1 + 0.6, 1780);
  },

  yoldas(t, a) {
    bgImage('yolcular', t, a, 1.2, 1.05, { dur: 7 });
    lightLeak(t, 0.15);
    waterfall('Bu duanı edəndə', W / 2, 330, `68px ${CV}`, G2, t, a + 0.05, 0.08);
    bigText('TƏKCƏ YOL', t, K.yol_tek - 0.1, 480, 120, '#fff');
    if (t >= K.yol_tek + 0.5) strike(W / 2, 480, 600, R(t, K.yol_tek + 0.6, K.yol_tek + 0.9, x => x), G1);
    if (t >= K.yoldasi - 0.05) { bigText('YOL YOLDAŞI', t, K.yoldasi, 640, 130, G1); waterfall('da istəyirsən', W / 2, 780, `64px ${CV}`, '#fff', t, K.yoldasi + 0.9, 0.1); }
    // footprints appear two by two along the path
    for (let i = 0; i < 10; i++) {
      const t0 = a + 0.6 + i * 0.45; if (t < t0) continue;
      const side = i % 2 ? 1 : -1, y = 1820 - i * 52, x = W / 2 + side * (70 - i * 3) + (i >> 1) * 4, s = 1 - i * 0.055;
      const al = clamp((t - t0) / 0.3) * (1 - clamp((t - t0 - 3) / 1.5));
      [-1, 1].forEach(p => sprite('B_5', x + p * 120 * s, y, 70 * s, al * 0.9, side * 0.08, 1));
    }
  },

  sirr2(t, a) {
    if (t < K.nemetden - 0.1) { sirrCard(t, a, 2, 'sözlərin ədəbi', 'dua'); return; }
    bgImage('dua', t, K.nemetden - 0.1, 1.05, 1.15, { dur: 16 }); darken(0.35);
    const out = fadeOut(t, K.yaxsiliq - 0.2, 0.4);
    grp(out, () => {
      tx('Nemətdən danışanda:', W / 2, 300, `58px ${CV}`, G2, R(t, K.nemetden, K.nemetden + 0.4), { glow: '#000' });
      // row 1 — favour: said directly
      if (t >= K.enamte - 0.1) {
        cardFlip(t, K.enamte - 0.1, W / 2, 520, 940, 260, () => {
          tx('أَنْعَمْتَ', -230, -10, `bold 92px ${AR}`, G1, 1, { glow: '#ffb030', blur: 25 });
          if (t >= K.sen_verdin) tx('«SƏN VERDİN»', 170, 0, `68px ${AN}`, '#fff', R(t, K.sen_verdin, K.sen_verdin + 0.3), { ls: '2px' });
        });
        tick(870, 400, 80, R(t, K.sen_verdin + 0.3, K.sen_verdin + 0.7, x => x));
      }
      // row 2 — anger: never "You were angry"
      if (t >= K.amma_q) {
        tx('Qəzəbdən danışanda:', W / 2, 760, `58px ${CV}`, '#ff8a80', R(t, K.amma_q, K.amma_q + 0.4), { glow: '#000' });
        const k = pop(t, K.sen_qez - 0.1, 0.4);
        panel(W / 2, 920, 940, 190, k, 'rgba(226,67,63,0.9)');
        const swap = R(t, K.sadece - 0.1, K.sadece + 0.3);
        tx('«SƏN QƏZƏBLƏNDİN»', W / 2, 920, `66px ${AN}`, '#fff', clamp(k) * (1 - swap), { sc: k, ls: '2px' });
        grp(1 - swap, () => { strike(W / 2, 920, 680, R(t, K.sen_qez + 0.7, K.sen_qez + 1.0, x => x)); cross(870, 830, 70, R(t, K.sen_qez + 0.7, K.sen_qez + 1.1, x => x)); });
        if (swap > 0) tick(870, 830, 70, R(t, K.sadece + 0.3, K.sadece + 0.7, x => x));
        if (swap > 0) { tx('الْمَغْضُوبِ', W / 2 - 220, 915, `bold 76px ${AR}`, '#ff8a80', swap, { glow: '#000' }); tx('qəzəbə uğrayanlar', W / 2 + 170, 925, `54px ${CV}`, '#fff', swap); }
      }
      // row 3 — the astray: never "You led astray"
      if (t >= K.azanlar) {
        tx('Azanlar haqqında da:', W / 2, 1150, `58px ${CV}`, GREY, R(t, K.azanlar, K.azanlar + 0.4), { glow: '#000' });
        const k = pop(t, K.sen_azd - 0.1, 0.4);
        panel(W / 2, 1310, 940, 190, k, 'rgba(200,208,220,0.9)');
        tx('«SƏN AZDIRDIN»', W / 2, 1310, `66px ${AN}`, '#fff', clamp(k), { sc: k, ls: '2px' });
        strike(W / 2, 1310, 560, R(t, K.sen_azd + 0.6, K.sen_azd + 0.9, x => x));
        cross(870, 1220, 70, R(t, K.sen_azd + 0.6, K.sen_azd + 1.0, x => x));
        tx('DEMİR', W / 2, 1470, `72px ${AN}`, RED, R(t, K.sen_azd + 0.9, K.sen_azd + 1.1), { ls: '8px', glow: '#000' });
      }
    });
    if (t >= K.yaxsiliq - 0.2) {
      const u = R(t, K.yaxsiliq - 0.2, K.yaxsiliq + 0.8);
      lightBeam(W / 2, u); particlesUp(t, W / 2, 1700, 500, 30, '255,214,140', u * 0.8);
      bigText('YAXŞILIĞI', t, K.yaxsiliq, 420, 120, '#fff');
      bigText('ALLAHA BAĞLA', t, K.yaxsiliq + 0.5, 560, 120, G1);
      stamp('DUADA BELƏ ƏDƏB', t, K.edebi, W / 2, 760, 70, G1, -0.04);
    }
  },

  sirr3(t, a) {
    if (t < K.alimler - 0.1) { sirrCard(t, a, 3, 'iki yanlış yol', 'ikiyol'); return; }
    bgImage('ikiyol', t, K.alimler - 0.1, 1.1, 1.0, { dur: 11 }); darken(0.35);
    // split screen: left = anger (red), right = astray (grey)
    const hl = t >= K.biri2 ? 1 : t >= K.biri1 ? 0 : -1;
    const sideA = (t, x0, col, tint) => { ctx.save(); ctx.fillStyle = tint; ctx.fillRect(x0, 0, W / 2, H); ctx.restore(); };
    const sp = R(t, K.alimler, K.alimler + 0.5);
    ctx.save(); ctx.globalAlpha = sp; sideA(t, 0, RED, `rgba(120,10,10,${hl === 0 ? 0.35 : 0.2})`); sideA(t, W / 2, GREY, `rgba(80,90,110,${hl === 1 ? 0.35 : 0.2})`);
    ctx.strokeStyle = 'rgba(255,240,210,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2, 560 + 900 * (1 - sp)); ctx.lineTo(W / 2, 1640); ctx.stroke(); ctx.restore();
    tx('Alimlər deyir:', W / 2, 300, `60px ${CV}`, G2, R(t, K.alimler, K.alimler + 0.4), { glow: '#000' });
    const col = (x, title, tcol, t0, items) => {
      const k = pop(t, t0, 0.45); if (k <= 0) return;
      tx(title[0], x, 470, `58px ${AN}`, tcol, clamp(k), { sc: k, ls: '2px', glow: '#000' }); tx(title[1], x, 540, `58px ${AN}`, tcol, clamp(k), { sc: k, ls: '2px', glow: '#000' });
      items.forEach(([ic, word, good, ti], j) => {
        const kk = pop(t, ti, 0.45); if (kk <= 0) return; const y = 820 + j * 420;
        panel(x, y, 440, 360, kk, good ? 'rgba(123,227,162,0.9)' : 'rgba(226,67,63,0.9)');
        sprite(ic, x, y - 50, 190, clamp(kk), 0, kk);
        tx(word, x, y + 120, `64px ${AN}`, good ? OK : '#ff8a80', clamp(kk), { sc: kk, ls: '3px' });
        if (good) tick(x + 160, y - 130, 60, R(t, ti + 0.2, ti + 0.6, x => x)); else cross(x + 160, y - 130, 55, R(t, ti + 0.2, ti + 0.6, x => x));
      });
      const pulse = (x < W / 2 ? hl === 0 : hl === 1) ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
      if (pulse > 0) glow(x, 1000, 380, 'rgba(255,230,180,A)', 0.18 * pulse);
    };
    col(270, ['QƏZƏBƏ', 'UĞRAYAN'], '#ff8a80', K.qezebe_ugr, [['C_1', 'BİLİR', true, K.bilib], ['C_2', 'ETMİR', false, K.etmeyen]]);
    col(810, ['AZAN', ''], GREY, K.azan2, [['C_2', 'EDİR', true, K.emel_eden], ['C_1', 'BİLMİR', false, K.bilmeden]]);
    if (t >= K.biri1) waterfall(hl === 0 ? 'Biri bilir, etmir.' : 'Biri edir, bilmir.', W / 2, 1720, `62px ${CV}`, '#fff', t, hl === 0 ? K.biri1 : K.biri2, 0.08);
    sourceTag('İbn Kəsir, Fatihə 7 təfsiri', t, K.qezebe_ugr + 0.6, 1840);
  },

  birles(t, a) {
    bgImage('yol', t, a, 1.25, 1.05, { dur: 9, filter: 'brightness(0.75)' }); darken(0.15);
    // two paths come from the sides and merge into ONE straight road
    const L = curvePts(80, 1780, 540, 1180, 200, 1250, 50), Rr = curvePts(1000, 1780, 540, 1180, 880, 1250, 50), M = curvePts(540, 1180, 540, 640, 540, 900, 40);
    const ul = R(t, a + 0.2, K.bilmek + 0.3, e4o), ur = R(t, a + 0.5, K.etmek + 0.3, e4o), um = R(t, K.etmek + 0.3, K.etmek + 1.1, e4o);
    drawStroke(L, ul, 14, '#9fd0ff', '#5fb0ff');
    drawStroke(Rr, ur, 14, '#7be3a2', '#3fbf7a');
    const tip = drawStroke(M, um, 20, G1, '#ffb030');
    if (um > 0 && tip) glow(tip[0], tip[1], 120, 'rgba(255,230,160,A)', 0.9 * (1 - um * 0.5));
    if (um >= 1) glow(540, 900, 500, 'rgba(255,200,110,A)', 0.25);
    sprite('C_1', 190, 1560, 150, R(t, K.bilmek - 0.2, K.bilmek + 0.2), 0, 1); tx('BİLMƏK', 230, 1680, `58px ${AN}`, '#9fd0ff', R(t, K.bilmek, K.bilmek + 0.3), { ls: '3px', glow: '#000' });
    sprite('C_2', 890, 1560, 150, R(t, K.etmek - 0.2, K.etmek + 0.2), 0, 1); tx('ETMƏK', 850, 1680, `58px ${AN}`, OK, R(t, K.etmek, K.etmek + 0.3), { ls: '3px', glow: '#000' });
    grp(fadeOut(t, K.elmsiz - 0.2, 0.35), () => {
      bigText('DOĞRU YOL', t, a + 0.95, 380, 130, '#fff');
      waterfall('ikisinin birləşdiyi yerdir', W / 2, 520, `62px ${CV}`, G2, t, a + 1.3, 0.08);
      if (um >= 0.98) stamp('=', t, K.etmek + 1.1, W / 2, 1180, 70, G1, 0);
    });
    if (t >= K.elmsiz - 0.2) {
      const k1 = pop(t, K.elmsiz, 0.4), k2 = pop(t, K.ibadetsiz, 0.4);
      panel(W / 2, 380, 960, 200, k1, 'rgba(200,208,220,0.9)');
      tx('ELMSİZ İBADƏT', W / 2, 345, `66px ${AN}`, '#fff', clamp(k1), { sc: k1, ls: '2px' }); tx('→ yolu azdırar', W / 2, 425, `54px ${CV}`, GREY, R(t, K.elmsiz + 0.6, K.elmsiz + 1));
      panel(W / 2, 640, 960, 200, k2, 'rgba(226,67,63,0.9)');
      tx('İBADƏTSİZ ELM', W / 2, 605, `66px ${AN}`, '#fff', clamp(k2), { sc: k2, ls: '2px' }); tx('→ qəzəbə aparar', W / 2, 685, `54px ${CV}`, '#ff8a80', R(t, K.qezebe_ap - 0.2, K.qezebe_ap + 0.2));
    }
  },

  amin(t, a) {
    bgImage('mescid', t, a, 1.0, 1.15, { dur: 10 }); darken(0.3);
    grp(fadeOut(t, K.peyg - 0.2, 0.35), () => {
      tx('Və sonda...', W / 2, 330, `72px ${CV}`, G2, R(t, a + 0.1, a + 0.5), { glow: '#000' });
      if (t >= K.amin - 0.05) {
        const k = pop(t, K.amin - 0.05, 0.4); shock(t, K.amin, W / 2, 640);
        tx('آمِين', W / 2, 620, `bold 260px ${AR}`, G1, clamp(k), { sc: lerp(1.8, 1, clamp(k)), glow: '#ffb030', blur: 60 });
        tx('AMİN', W / 2, 860, `100px ${AN}`, '#fff', R(t, K.amin + 0.2, K.amin + 0.5), { ls: '20px', glow: '#000' });
      }
      if (t >= K.deyil) sideChip('QURAN AYƏSİ DEYİL · SÜNNƏDİR', t, K.deyil, W / 2, 1040, G2, 40);
    });
    if (t >= K.peyg - 0.1) {
      waterfall('Peyğəmbərimiz ﷺ buyurdu:', W / 2, 330, `62px ${CV}`, G2, t, K.peyg - 0.1, 0.08);
      cardFlip(t, K.imam - 0.3, W / 2, 680, 960, 460, () => {
        if (t >= K.imam) waterfall('İMAM «AMİN» DEYƏNDƏ,', 0, -90, `66px ${AN}`, '#fff', t, K.imam, 0.08, { ls: '2px' });
        if (t >= K.siz_de - 0.1) { const k = pop(t, K.siz_de - 0.1, 0.45); tx('SİZ DƏ «AMİN» DEYİN', 0, 50, `76px ${AN}`, G1, clamp(k), { sc: k, ls: '2px', glow: '#ffb030' }); }
      });
      if (t >= K.siz_de) rings(t, W / 2, 1450, 4, '255,214,140', R(t, K.siz_de, K.siz_de + 0.5), 0.7, 700);
    }
    sourceTag('Səhih Buxari, 780', t, K.imam + 0.5, 1000);
  },

  melek(t, a) {
    bgImage('ulduz', t, a, 1.15, 1.0, { dur: 7 });
    drawStars(t, 0.5);
    // angels symbolised by light only: a wave of stars answers "Amin"
    rings(t, W / 2, 1300, 5, '200,220,255', R(t, K.melek - 0.2, K.melek + 0.6), 0.5, 900);
    particlesUp(t, W / 2, 1500, 900, 50, '220,230,255', R(t, K.melek, K.melek + 1));
    waterfall('Kimin amini', W / 2, 330, `70px ${CV}`, G2, t, a + 0.05, 0.1);
    bigText('MƏLƏKLƏRİN AMİNİNƏ', t, K.melek, 480, 92, '#fff');
    bigText('UYĞUN GƏLSƏ', t, K.uygun, 600, 92, '#cfe0ff');
    if (t >= K.kecmis - 0.1) {
      const k = pop(t, K.kecmis - 0.1, 0.45);
      panel(W / 2, 880, 960, 330, k, 'rgba(255,226,160,1)', 'rgba(20,14,6,0.82)');
      tx('KEÇMİŞ GÜNAHLARI', W / 2, 810, `76px ${AN}`, '#fff', clamp(k), { sc: k, ls: '3px' });
      if (t >= K.bagis - 0.1) { const k2 = pop(t, K.bagis - 0.1, 0.5); tx('BAĞIŞLANAR', W / 2, 935, `118px ${AN}`, G1, clamp(k2), { sc: k2, ls: '4px', glow: '#ffb030', blur: 45 }); shock(t, K.bagis, W / 2, 935); }
    }
    sourceTag('Səhih Buxari, 780', t, K.melek + 0.6, 1100);
  },

  yeddi(t, a) {
    bgImage('yeddi', t, a, 1.12, 1.0, { dur: 5 }); darken(0.15);
    const n = Math.min(7, 1 + Math.floor(R(t, a + 0.1, a + 0.9, x => x) * 6));
    const k = pop(t, a + 0.05, 0.4); counterTx(n, W / 2, 560, 360 * (n === 7 ? 1 + 0.06 * clamp(1 - (t - a - 0.9) * 4) : 1), G1, k);
    tx('AYƏ', W / 2, 790, `90px ${AN}`, '#fff', R(t, a + 0.2, a + 0.5), { ls: '14px', glow: '#000' });
    for (let i = 0; i < 7; i++) { const t0 = a + 0.1 + i * 0.12, x = 150 + i * 130, y = 1000 + Math.abs(i - 3) * -18; if (t < t0) continue;
      glow(x, y, 70, 'rgba(255,200,110,A)', 0.8 * pop(t, t0, 0.3)); tx(String(i + 1), x, y, `52px ${AN}`, G2, pop(t, t0, 0.3)); }
    if (t >= K.her_biri) stamp('7 SİRR', t, K.her_biri, W / 2, 1220, 100, G1, -0.05);
  },

  serh(t, a) {
    brandBg(t);
    waterfall('Bəs səndə hansı', W / 2, 360, `76px ${CV}`, '#fff', t, a + 0.05, 0.08);
    bigText('ÇATIŞMIR?', t, a + 0.7, 510, 150, G1);
    [['C_1', 'BİLMƏK', K.bilmek_q, 290, '#9fd0ff'], ['C_2', 'ETMƏK', K.etmek_q, 790, OK]].forEach(([ic, w, t0, x, c], i) => {
      const k = pop(t, t0 - 0.1, 0.45); if (k <= 0) return; const bob = Math.sin(t * 3 + i * 2) * 10;
      panel(x, 930 + bob, 440, 440, k, c);
      sprite(ic, x, 880 + bob, 230, clamp(k), 0, k);
      tx(w, x, 1070 + bob, `72px ${AN}`, c, clamp(k), { sc: k, ls: '3px' });
    });
    if (t >= K.etmek_q + 0.3) tx('?', W / 2, 930, `120px ${AN}`, '#fff', pop(t, K.etmek_q + 0.3, 0.4), { glow: '#000' });
    typeText('Şərhdə bir sözlə yaz', W / 2, 1330, `62px ${MO}`, '#fff', t, K.serh, 20);
    if (t >= K.serh + 1.0) { const p = 0.7 + 0.3 * Math.sin(t * 6); tx('👇', W / 2, 1480 + 12 * Math.sin(t * 5), `110px "Noto Color Emoji"`, '#fff', p); }
  },

  novbeti(t, a) {
    bgImage('sema', t, a, 1.0, 1.18, { dur: 7 });
    grp(fadeOut(t, K.novbeti - 0.2, 0.3), () => { bigText('FATİHƏ', t, a + 0.05, 560, 150, '#fff'); stamp('TAMAMLANDI ✓', t, a + 0.45, W / 2, 740, 70, OK, -0.05); });
    if (t >= K.novbeti - 0.1) {
      sideChip('NÖVBƏTİ BÖLÜM', t, K.novbeti, W / 2, 300, G1, 44);
      waterfall('Quranın', W / 2, 460, `72px ${CV}`, G2, t, K.novbeti + 0.4, 0.1);
      bigText('ƏN BÖYÜK AYƏSİ', t, K.en_boyuk, 600, 112, '#fff');
      if (t >= K.hansidir - 0.1) {
        const p = 1 + 0.06 * Math.sin(t * 6); glow(W / 2, 1000, 420, 'rgba(255,200,110,A)', 0.4);
        glitchTx('?', W / 2, 1000, `${Math.round(480 * p)}px ${AN}`, G1, t, K.hansidir - 0.1);
        tx('hansıdır, bilirsənmi?', W / 2, 1300, `64px ${CV}`, '#fff', R(t, K.hansidir, K.hansidir + 0.4), { glow: '#000' });
        sideChip('İPUCU: BƏQƏRƏ SURƏSİ', t, K.hansidir + 0.7, W / 2, 1450, G2, 38);
      }
    }
  },
};

function watermark(t) {
  const a = 0.7 * (1 - R(t, K.abune - 0.8, K.abune - 0.4)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.save(); ctx.beginPath(); ctx.arc(78, 78, 28, 0, 7); ctx.clip(); ctx.drawImage(logo, 50, 50, 56, 56); ctx.restore();
  ctx.font = `bold 32px ${MO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.fillText('@esgarow', 118, 79);
  ctx.restore();
  tx('AYƏNİN SİRRİ · 6', W - 50, 79, `30px ${AN}`, G1, a * 0.9, { align: 'right', ls: '3px' });
}

// ================= compositor with velocity-matched seams =================
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const LA = mk(), LB = mk();
function drawScene(i, t, into) {
  const [key, a] = SCN[i], b = i + 1 < SCN.length ? SCN[i + 1][1] : TOTAL2 + 1;
  const c = into.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none'; c.clearRect(0, 0, W, H);
  const real = ctx; ctx = c; ctx.save(); SCENES[key](t, a, b); ctx.restore(); ctx = real;
  return into;
}
function put(layer, { x = 0, z = 1, a = 1, blur = 0, ghost = 0 } = {}, sx = 0, sy = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; if (blur > 0.5) ctx.filter = `blur(${blur.toFixed(1)}px)`;
  ctx.translate(W / 2 + x + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.drawImage(layer, 0, 0);
  if (ghost) { ctx.globalAlpha = a * 0.35; ctx.drawImage(layer, -ghost, 0); ctx.drawImage(layer, ghost, 0); }
  ctx.restore();
}
const SEAM = { zoom: 0.5, inv: 0.5, whip: 0.42, blur: 0.5, wipe: 0, break: 0, none: 0 };
window.renderAt = async function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.letterSpacing = '0px'; ctx.filter = 'none';
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t), sx = (srand(Math.floor(t * 60)) - 0.5) * sh, sy = (srand(Math.floor(t * 60) + 5) - 0.5) * sh;
  let i = 0; while (i + 1 < SCN.length && t >= SCN[i + 1][1] - SEAM[SCN[i + 1][2]] / 2) i++;
  // i = scene that owns the frame (or is entering)
  const [, a, type] = SCN[i], d = SEAM[type], u = d ? clamp((t - (a - d / 2)) / d) : 1;
  if (type === 'break') {
    if (!breakReady || breakAt !== a) { drawScene(i - 1, a - 0.05, LA); breakC.getContext('2d').clearRect(0, 0, W, H); breakC.getContext('2d').drawImage(LA, 0, 0); breakReady = true; breakAt = a; }
  }
  const cur = drawScene(i, t, LB);
  if (d && u < 1 && i > 0) {
    const prev = drawScene(i - 1, t, LA);
    // mirrored power-4 eases: the outgoing shot accelerates out, the incoming one decelerates in at the same speed
    const o = e4i(Math.min(1, u * 2)), n = e4o(Math.max(0, u * 2 - 1));
    if (type === 'zoom') { if (u < 0.5) put(prev, { z: 1 + 2.2 * o, blur: 18 * o }, sx, sy); else put(cur, { z: 0.55 + 0.45 * n, blur: 18 * (1 - n), a: clamp(n * 3) }, sx, sy); }
    if (type === 'inv') { if (u < 0.5) put(prev, { z: 1 - 0.45 * o, blur: 14 * o }, sx, sy); else put(cur, { z: 1.9 - 0.9 * n, blur: 14 * (1 - n), a: clamp(n * 3) }, sx, sy); }
    if (type === 'whip') { if (u < 0.5) put(prev, { x: -W * 0.9 * o, ghost: 60 * o, blur: 6 * o }, sx, sy); else put(cur, { x: W * 0.9 * (1 - n), ghost: 60 * (1 - n), blur: 6 * (1 - n) }, sx, sy); }
    if (type === 'blur') { put(prev, { blur: 26 * ease(u), a: 1 }, sx, sy); put(cur, { blur: 26 * (1 - ease(u)), a: ease(u) }, sx, sy); }
    if (u > 0.35 && u < 0.65) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,220,160,${0.18 * (1 - Math.abs(u - 0.5) / 0.15)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  } else put(cur, {}, sx, sy);
  if (type === 'break') frameBreak(t, a);
  if (type === 'wipe') wipe(t, a - 0.2, 0.45);
  // liquid-glass lens glides over the active word card
  if (t > K.w1 - 0.2 && t < K.sirr1 - 0.25) {
    const ws = [K.w1, K.w2, K.w3, K.w4, K.w5, K.w6], j = Math.max(0, ws.filter(w => t >= w - 0.15).length - 1);
    const pos = q => [q % 2 ? 790 : 290, 560 + Math.floor(q / 2) * 400 + 40];
    const p0 = pos(Math.max(0, j - 1)), p1 = pos(j), mv = j ? R(t, ws[j] - 0.15, ws[j] + 0.3, e4o) : 1;
    const enter = R(t, K.w1 - 0.2, K.w1 + 0.3, e4o), leave = R(t, K.sirr1 - 0.9, K.sirr1 - 0.3);
    const x = lerp(p0[0], p1[0], mv), y = lerp(p0[1], p1[1], mv) + (1 - enter) * 600 - leave * 500;
    lens(x, y, 95, 1.35, enter * (1 - leave));
  }
  watermark(t); endCard(t);
  vignette(0.4); filmGrain(t);
  const f = R(t, TOTAL2 - 0.8, TOTAL2); if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  return cv.toDataURL('image/jpeg', 0.92);
};
let breakAt = -1;
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
