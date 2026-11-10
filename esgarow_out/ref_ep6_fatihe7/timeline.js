// Ayənin sirri 6 — Fatihə 1:7 (Sıratəlləzinə ən'amtə aleyhim…). Seconds in voice.wav (135.8 s, natural speed, 0.5 s lead-in)
const KT = {
  quran: 0.58, son: 2.09, uzun: 4.04, cemi: 5.59, doqquz: 6.13, soz: 6.42,
  bu_doqquz: 7.29, uc_qrup: 8.77, hansinda: 10.21,
  ayah: 11.43, gayril: 14.39, veled: 15.87, nemet: 17.18, qezebe: 20.89, azan: 22.66, yox: 24.30,
  sozsoz: 25.51, w1: 27.04, w2: 28.19, w3: 29.38, w4: 30.42, w5: 31.66, w6: 33.29,
  sirr1: 35.73, kimdir: 37.24, quran_ozu: 39.90, p1: 41.73, p2: 42.76, p3: 43.65, p4: 44.90,
  deyir: 46.05, yoldas: 47.06, yeni: 49.26, yol_tek: 51.29, yoldasi: 52.90,
  sirr2: 56.36, edeb: 57.45, nemetden: 58.92, enamte: 60.86, sen_verdin: 61.91, amma_q: 63.01, sen_qez: 64.87,
  sadece: 66.65, azanlar: 69.01, sen_azd: 70.83, yaxsiliq: 72.59, edebi: 74.45,
  sirr3: 76.77, iki_yanlis: 77.91, alimler: 79.22, qezebe_ugr: 80.02, bilib: 81.89, etmeyen: 82.38,
  azan2: 83.67, emel_eden: 84.66, bilmeden: 86.26, biri1: 87.59, etmir: 88.63, biri2: 89.47, bilmir: 90.59,
  dogru: 91.39, bilmek: 94.12, etmek: 94.86, elmsiz: 95.94, ibadetsiz: 98.36, qezebe_ap: 100.07,
  sonda: 101.79, amin: 102.86, deyil: 103.61, peyg: 105.56, buyurdu: 108.56, imam: 109.41, siz_de: 111.17,
  kimin: 112.81, melek: 113.87, uygun: 115.57, kecmis: 116.33, bagis: 118.35,
  yeddi: 119.67, her_biri: 120.76, bes: 121.84, bilmek_q: 123.73, etmek_q: 124.58, serh: 125.86,
  fatihe: 127.69, novbeti: 128.96, en_boyuk: 130.64, hansidir: 132.17, abune: 133.99,
};
const TOTAL2 = 137.4;
// [scene, start, incoming transition]
const SCN = [['hook', 0, 'none'], ['ayah', 11.43, 'zoom'], ['sozsoz', 25.51, 'whip'], ['sirr1', 35.73, 'wipe'], ['yoldas', 49.26, 'blur'],
  ['sirr2', 56.36, 'inv'], ['sirr3', 76.77, 'whip'], ['birles', 91.39, 'blur'], ['amin', 101.79, 'break'], ['melek', 112.81, 'blur'],
  ['yeddi', 119.67, 'zoom'], ['serh', 121.84, 'whip'], ['novbeti', 127.69, 'inv']];
const TL = { _total: TOTAL2 };
