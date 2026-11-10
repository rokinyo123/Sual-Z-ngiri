// ===== Qurandakı 7 sirr — 9:16 trailer (50 s), cinematic "streaming trailer" style =====
// hard cuts, flash frames, dips to black, sparse white type, low braam hits, silence before the title.
const K = KT;
const IM = {};
const BGS = ['bg01_kitab_isiq', 'bg03_sehra_gece', 'bg04_okean_derinlik', 'bg05_ulduz_nuve', 'bg10_ovuc', 'bg16_iki_su', 'bg20_ari_makro', 'bg27_qilinc', 'bg36_mumiya', 'bg39_meteor', 'bg44_zencir_mohur', 'bg08_qum_saati', 'bg02_kitab_acilir', 'bg43_qan_damci', 'bg41_supernova'];
BGS.forEach(k => load(k, `img/${k}.jpg`));
['el01_1', 'el01_2', 'el02_1', 'el02_2', 'el02_3', 'el02_4', 'el02_5', 'el03_1', 'el03_2'].forEach(k => load(k, `img/${k}.png`));
function load(k, s) { pending++; const im = new Image(); im.onload = () => { IM[k] = im; pending--; }; im.onerror = () => { console.log('missing ' + s); pending--; }; im.src = s; }
const WHITE = '#f4f1ea';
function cover(k, t, t0, dur, z0, z1, ax = 0.5, opt = {}) {
  const im = IM[k]; if (!im) return; const u = ease(clamp((t - t0) / dur)), z = lerp(z0, z1, u);
  const s = H / im.height * z, w = im.width * s, h = im.height * s;
  const x = (W - w) * ax + (opt.dx || 0) * u, y = (H - h) / 2 + (opt.dy || 0) * u;
  ctx.save(); if (opt.filter) ctx.filter = opt.filter; ctx.drawImage(im, x, y, w, h); ctx.restore(); ctx.filter = 'none';
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(0.35, 'rgba(0,0,0,0.05)'); g.addColorStop(0.7, 'rgba(0,0,0,0.15)'); g.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function black(a = 1) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); }
function sprite(k, x, y, h, a = 1, sc = 1, glowCol = null, rot = 0) { const im = IM[k]; if (!im || a <= 0) return; const w = im.width * h / im.height;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 50; } ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); }
// thin cinematic title: letters spaced wide, fade + slight tracking-in
function ctitle(s, t, t0, y, size = 92, col = WHITE, d = 0.6, out = null) {
  const a = R(t, t0, t0 + d) * (out ? 1 - R(t, out, out + 0.35) : 1); if (a <= 0) return;
  const ls = lerp(30, 14, eOut(clamp((t - t0) / 1.6)));
  tx(s, W / 2, y, `${size}px ${AN}`, col, a, { ls: ls + 'px', glow: 'rgba(0,0,0,0.9)', blur: 30 });
}
function small(s, t, t0, y, out = null, col = 'rgba(244,241,234,0.85)', size = 40) { const a = R(t, t0, t0 + 0.4) * (out ? 1 - R(t, out, out + 0.3) : 1); tx(s, W / 2, y, `${size}px ${MO}`, col, a, { ls: '10px', glow: '#000', blur: 14 }); }
function cross(x, y, s, t, t0) { const u = R(t, t0, t0 + 0.2), v = R(t, t0 + 0.12, t0 + 0.32); if (u <= 0) return; ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round'; ctx.shadowColor = RED; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x - s / 2 + s * u, y - s / 2 + s * u); ctx.stroke(); if (v > 0) { ctx.beginPath(); ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + s / 2 - s * v, y - s / 2 + s * v); ctx.stroke(); } ctx.restore(); }
function flash(t, t0, d = 0.12, a = 0.9) { const u = (t - t0) / d; if (u < 0 || u > 1) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,250,240,${a * (1 - u)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function glitchTx(s, x, y, font, col, t, t0) { if (t < t0) return; const g = clamp(1 - (t - t0) / 0.5), j = n => (srand(Math.floor(t * 30) + n) - 0.5) * 50 * g;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; if (g > 0) { tx(s, x + j(1) - 10 * g, y + j(2), font, 'rgba(255,40,60,0.8)', 1); tx(s, x + j(3) + 10 * g, y + j(4), font, 'rgba(40,220,255,0.8)', 1); } ctx.restore();
  tx(s, x, y, font, col, clamp((t - t0) / 0.12), { glow: '#000', blur: 20 }); }
function bubbles(t, a) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const ph = (t * (0.08 + 0.1 * srand(i)) + srand(i + 3)) % 1, x = srand(i + 1) * W + Math.sin(t * 2 + i) * 12, y = H - ph * H, r = 2 + 8 * srand(i + 5);
  ctx.strokeStyle = `rgba(210,245,255,${a * 0.6 * (1 - ph)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); } ctx.restore(); }

function letterbox(a = 1) { const h = 120 * a; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); }

const ITEMS = [['barmaq', 'bg10_ovuc', 'el02_1', 'I', 'BARMAQ İZLƏRİ', 0.7], ['deniz', 'bg16_iki_su', 'el02_2', 'II', 'İKİ DƏNİZ', 0.5], ['ari', 'bg20_ari_makro', 'el02_3', 'III', 'BAL ARISI', 0.7],
  ['imper', 'bg27_qilinc', 'el02_4', 'IV', 'İMPERİYA', 0.5], ['firon', 'bg36_mumiya', 'el02_5', 'V', 'FİRON', 0.5], ['demir', 'bg39_meteor', 'el03_1', 'VI', 'DƏMİR', 0.45]];

function scene(t) {
  black();
  // ---- 0–6 s HOOK: blood drop with a star inside, no black intro, text on the first word
  if (t < K.c1 - 0.15) {
    const supa = R(t, K.ureyinde, K.ureyinde + 0.25);
    if (supa < 1) { cover('bg43_qan_damci', t, -0.6, 4.6, 1.55, 2.3, 0.62); }
    if (supa > 0) { ctx.save(); ctx.globalAlpha = supa; cover('bg41_supernova', t, K.ureyinde, 1.6, 1.3, 1.7, 0.5); ctx.restore(); }
    // star inside the drop pulses harder as "ulduzun" is spoken
    const pulse = 0.4 + 0.6 * R(t, K.ulduzun - 0.3, K.ulduzun + 0.3);
    if (supa < 1) glow(W * 0.5, H * 0.56, 260 + 60 * Math.sin(t * 9), 'rgba(255,240,210,A)', pulse * 0.5 * (1 - supa));
    ctitle('QANINDAKI DƏMİR', t, 0.0, 400, 104, WHITE, 0.15);
    small('BİR ULDUZDAN GƏLİB', t, K.ulduzun - 0.1, 520, null, 'rgba(246,199,104,0.95)', 44);
    flash(t, K.ureyinde, 0.18, 0.9); shock(t, K.ureyinde + 0.05, W / 2, H / 2, '255,220,180');
    black(R(t, K.c1 - 0.45, K.c1 - 0.15));
    return;
  }
  // ---- 6–10.6 the book
  if (t < K.c2 - 0.15) {
    cover('bg01_kitab_isiq', t, K.c1 - 0.15, 5, 1.15, 1.32, 0.62); drawDust(t, 0.7);
    ctitle('14 ƏSR ƏVVƏL', t, K.ondord - 0.1, 520, 96, WHITE, 0.4);
    small('BİR KİTAB...', t, K.kitab - 0.1, 640, null, 'rgba(246,199,104,0.9)');
    return;
  }
  // ---- 10.6–15.5 no microscope, no telescope
  if (t < K.c4 - 0.15) {
    cover('bg03_sehra_gece', t, K.c2 - 0.15, 5, 1.0, 1.12, 0.5); flash(t, K.c2 - 0.15, 0.1, 0.4);
    [['el01_1', K.mikro, 340], ['el01_2', K.tele, 740]].forEach(([k, t0, x]) => { if (t < t0 - 0.1) return; const p = pop(t, t0 - 0.1, 0.4); sprite(k, x, 820, 300, clamp(p), p, '#ffb030'); cross(x, 820, 230, t, t0 + 0.45); });
    return;
  }
  // ---- 15.5–20.6 seven secrets
  if (t < K.c5 - 0.1) {
    cover('bg02_kitab_acilir', t, K.c4 - 0.15, 5, 1.2, 1.35, 0.6, { filter: 'brightness(0.6)' }); drawDust(t, 0.8);
    for (let i = 0; i < 7; i++) { const t0 = K.c4 + 0.2 + i * 0.22; if (t < t0) continue; const u = eOut(clamp((t - t0) / 0.8)), ang = -Math.PI / 2 + i * 2 * Math.PI / 7;
      sprite(SIRR[i], lerp(W / 2, W / 2 + Math.cos(ang) * 330, u), lerp(H * 0.55, 900 + Math.sin(ang) * 330, u), lerp(30, 130, u), clamp(u * 2), 1, '#ffb030'); }
    const k = pop(t, K.yeddi, 0.45); tx('7 SİRR', W / 2, 900, `170px ${AN}`, G1, clamp(k), { sc: k, ls: '8px', glow: '#ffb030', blur: 50 });
    return;
  }
  // ---- 20.6–34.5 rapid montage of the seven secrets
  if (t < K.c6 - 0.15) {
    const IT = ITEMS.concat([['herfler', 'bg44_zencir_mohur', 'el03_2', 'VII', 'SİRLİ HƏRFLƏR', 0.5]]);
    let i = 0; IT.forEach((it, q) => { if (t >= K[it[0]] - 0.12) i = q; });
    const [key, bg, ic, num, name, ax] = IT[i], t0 = K[key] - 0.12;
    const sh = i === 6 ? Math.sin(t * 55) * 8 : 0; ctx.save(); ctx.translate(sh, 0); cover(bg, t, t0, 1.6, 1.25, 1.4, ax); ctx.restore(); flash(t, t0, 0.1, 0.7);
    const k = pop(t, t0 + 0.05, 0.35); sprite(ic, W / 2, 760, 300, clamp(k), k, '#ffb030');
    tx(num, W / 2, 470, `70px ${SERIF}`, WHITE, clamp(k), { glow: '#000', blur: 20 });
    ctitle(name, t, t0 + 0.1, 1010, 74, WHITE, 0.2);
    return;
  }
  // ---- 34.5–42.3 the condition
  if (t < K.sonuncu - 0.1) {
    cover('bg08_qum_saati', t, K.c6 - 0.15, 2.5, 1.2, 1.25, 0.5, { filter: 'grayscale(1) brightness(0.8)' });
    glitchTx('AMMA BİR ŞƏRTLƏ', W / 2, 420, `86px ${AN}`, WHITE, t, K.amma); return;
  }
  if (t < K.cunki - 0.1) {
    const sh = Math.sin(t * 60) * 7; ctx.save(); ctx.translate(sh, 0); cover('bg44_zencir_mohur', t, K.sonuncu - 0.1, 2.3, 1.5, 1.7, 0.5); ctx.restore();
    ctitle('SONUNCU SİRRƏ QƏDƏR', t, K.sonuncu, 380, 74, WHITE, 0.3); return;
  }
  if (t < K.c6_end + 0.1) {
    letterbox(); glitchTx('?', W / 2, 900, `520px ${AN}`, G1, t, K.cunki + 0.2);
    small('HEÇ KİMİN CAVABINI TAPA BİLMƏDİYİ SUAL', t, K.sual - 0.8, 1300, null, WHITE, 34); return;
  }
  // ---- title (right after the last word, no dead air)
  const t0 = K.c6_end + 0.1;
  flash(t, t0, 0.15, 0.8);
  cover('bg02_kitab_acilir', t, t0, 4, 1.2, 1.3, 0.6, { filter: 'brightness(0.55)' }); black(0.25); drawDust(t, 0.8);
  const k = pop(t, t0, 0.45);
  tx('QURANDAKI', W / 2, 650, `110px ${AN}`, WHITE, clamp(k), { sc: k, ls: '14px', glow: '#000', blur: 30 });
  tx('7 SİRR', W / 2, 880, `220px ${AN}`, G1, clamp(k), { sc: k, ls: '10px', glow: '#ffb030', blur: 60 });
  small('TAM VİDEO · YOUTUBE', t, t0 + 0.5, 1080, null, WHITE, 44);
  tx('@esgarow', W / 2, 1200, `64px ${AN}`, G2, R(t, t0 + 0.8, t0 + 1.1), { ls: '4px', glow: '#000' });
  small('LİNK PROFİLDƏ', t, t0 + 1.2, 1300, null, 'rgba(246,199,104,0.9)', 36);
}
const SIRR = ['el02_1', 'el02_2', 'el02_3', 'el02_4', 'el02_5', 'el03_1', 'el03_2'];
const lay = document.createElement('canvas'); lay.width = W; lay.height = H; const lc = lay.getContext('2d');
const HITS = () => [K.ureyinde, K.c2 - 0.15, K.yeddi, ...ITEMS.map(i => K[i[0]] - 0.1), K.herfler - 0.1, K.amma, K.c6_end + 0.1];
window.renderAt = async function (t) {
  ctx = lc; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  scene(t); vignette(0.55); filmGrain(t);
  const f = R(t, TOTAL2 - 0.8, TOTAL2); if (f > 0) black(f);
  let sh = 0; for (const h of HITS()) { const d = t - h; if (d >= 0 && d < 0.4) sh += Math.exp(-d * 10) * 16; }
  const real = cv.getContext('2d'); real.setTransform(1, 0, 0, 1, 0, 0); real.fillStyle = '#000'; real.fillRect(0, 0, W, H);
  const z = 1 + sh * 0.001; real.save(); real.translate(W / 2 + (srand(Math.floor(t * 60)) - 0.5) * sh, H / 2 + (srand(Math.floor(t * 60) + 3) - 0.5) * sh); real.scale(z, z); real.drawImage(lay, -W / 2, -H / 2); real.restore();
  return cv.toDataURL('image/jpeg', 0.92);
};
(function waitAll() { if (pending <= 0) window.ready = true; else setTimeout(waitAll, 50); })();
