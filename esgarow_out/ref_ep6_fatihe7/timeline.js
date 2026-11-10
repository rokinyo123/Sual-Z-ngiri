// Ayənin sirri 6 — Fatihə 1:7 (Sıratəlləzinə ən'amtə aleyhim…). Seconds in voice.wav (117.6 s)
const KT = {
  quran: 0.07, son: 1.39, uzun: 3.08, cemi: 4.43, doqquz: 4.90, soz: 5.15,
  bu_doqquz: 5.90, uc_qrup: 7.19, hansinda: 8.45,
  ayah: 9.51, gayril: 12.08, veled: 13.36, nemet: 14.50, qezebe: 17.73, azan: 19.27, yox: 20.70,
  sozsoz: 21.75, w1: 23.08, w2: 24.08, w3: 25.11, w4: 26.02, w5: 27.10, w6: 28.51,
  sirr1: 30.64, kimdir: 31.95, quran_ozu: 34.26, p1: 35.85, p2: 36.75, p3: 37.52, p4: 38.61,
  deyir: 39.61, yoldas: 40.49, yeni: 42.40, yol_tek: 44.16, yoldasi: 45.57,
  sirr2: 48.57, edeb: 49.52, nemetden: 50.80, enamte: 52.48, sen_verdin: 53.40, amma_q: 54.36, sen_qez: 55.98,
  sadece: 57.53, azanlar: 59.57, sen_azd: 61.16, yaxsiliq: 62.69, edebi: 64.31,
  sirr3: 66.33, iki_yanlis: 67.31, alimler: 68.45, qezebe_ugr: 69.15, bilib: 70.77, etmeyen: 71.20,
  azan2: 72.32, emel_eden: 73.18, bilmeden: 74.57, biri1: 75.73, etmir: 76.64, biri2: 77.36, bilmir: 78.34,
  dogru: 79.04, bilmek: 81.41, etmek: 82.05, elmsiz: 82.99, ibadetsiz: 85.09, qezebe_ap: 86.58,
  sonda: 88.08, amin: 89.00, deyil: 89.66, peyg: 91.36, buyurdu: 93.97, imam: 94.71, siz_de: 96.24,
  kimin: 97.66, melek: 98.58, uygun: 100.06, kecmis: 100.72, bagis: 102.48,
  yeddi: 103.63, her_biri: 104.58, bes: 105.51, bilmek_q: 107.16, etmek_q: 107.90, serh: 109.01,
  fatihe: 110.60, novbeti: 111.70, en_boyuk: 113.17, hansidir: 114.50, abune: 116.07,
};
const TOTAL2 = 119.2;
// [scene, start, incoming transition]
const SCN = [['hook', 0, 'none'], ['ayah', 9.51, 'zoom'], ['sozsoz', 21.75, 'whip'], ['sirr1', 30.64, 'wipe'], ['yoldas', 42.40, 'blur'],
  ['sirr2', 48.57, 'inv'], ['sirr3', 66.33, 'whip'], ['birles', 79.04, 'blur'], ['amin', 88.08, 'break'], ['melek', 97.66, 'blur'],
  ['yeddi', 103.63, 'zoom'], ['serh', 105.51, 'whip'], ['novbeti', 110.60, 'inv']];
const TL = { _total: TOTAL2 };
