import json
R = json.load(open('vo/words.json'))
def P(sub, k=0):
    m = [r for r in R if sub in r['p']]; return m[k]['t0']
def Wd(sub, word, k=0):
    m = [r for r in R if sub in r['p']][k]
    for w in m['words']:
        if w['w'].strip('".,:?!') == word: return w['t']
    for w in m['words']:
        if w['w'].strip('".,:?!').startswith(word): return w['t']
    raise SystemExit('missing ' + word)
KT = {
 'quran': P('ən uzun'), 'surasi': Wd('ən uzun', 'surəsi'), 'bir_soz': Wd('ən uzun', 'bir'), 'uc': P('üç hərflə'), 'h_elif': P('Əlif.'), 'h_lam': P('Lam.'), 'h_mim': P('Mim.'),
 'esr': P('On dörd əsrdir alimlər'), 'bes': P('Bəs onlar'), 'niye': Wd('Bəs onlar', 'niyə'),
 'a_elif': P('Əlif,'), 'a_lam': P('Laaam'), 'a_mim': P('Miiim'), 'zalik': P('Zəlikəl'), 'la': Wd('Zəlikəl', 'la'), 'fih': Wd('Zəlikəl', 'fih'), 'hudan': P('Hudən'),
 'm_bu': P('Bu,', 0), 'm_kitab': P('o Kitabdır'), 'm_onda': P('onda heç'), 'm_mutt': P('müttəqilər üçün hidayətdir'),
 'sirr1': P('Birinci sirr'), 's1_29': Wd('iyirmi doqquz', 'iyirmi'), 's1_say': P('Bu hərfləri say'), 's1_tekrar': P('Təkrarlananları'), 's1_14': Wd('cəmi on dörd', 'on'), 's1_yari': P('ərəb əlifbasının'), 's1_yari_w': Wd('ərəb əlifbasının', 'yarısıdır'),
 's1_allah': P('Onların dəqiq'), 's1_allah_w': Wd('Onların dəqiq', 'Allah'),
 'sirr2': P('İkinci sirr'), 's2_niye': P('Bəs niyə məhz'), 's2_alim': P('Alimlər deyir'), 's2_allah': P('Allah sanki'), 's2_kitab': P('Bu Kitab sizin'), 's2_herf': Wd('Bu Kitab sizin', 'hərflərdən'),
 's2_bacar': P('Bacarırsınızsa'), 's2_benz': P('bənzərini'), 's2_ele': Wd('bənzərini', 'Elə'), 's2_21': P('iyirmi bir ayə'), 's2_cagir': P('bu çağırış'), 's2_sure': P('Onun kimi'), 's2_14': Wd('Onun kimi', 'On'), 's2_hec': Wd('Onun kimi', 'heç'),
 'sirr3': P('Üçüncü sirr'), 's3_bax': P('Mushafa'), 's3_la': P('"La rəyb"'), 's3_fih': Wd('"La rəyb"', 'fih'), 's3_uc': Wd('"La rəyb"', 'üç'), 's3_dayan': P('dayanma'), 's3_iki': Wd('dayanma', 'iki'),
 's3_r1': P('Birincisi'), 's3_r1t': P('"Onda şübhə'), 's3_r2': Wd('"Onda şübhə', 'İkincisi'), 's3_r2t': P('"Şübhə yoxdur'), 's3_r2b': P('Onda hidayət var'), 's3_iki_h': Wd('Onda hidayət var', 'Bir'),
 'r_niye': P('Bəs niyə hidayət'), 'r_mutt': Wd('Bəs niyə hidayət', 'müttəqilər'), 'r_yagis': P('Yağış hər'), 'r_hazir': P('amma yalnız hazır'), 'r_bitir': Wd('amma yalnız hazır', 'bitirir'),
 'r_quran': P('Quran da hamıya'), 'r_qelb': P('amma ondan qəlbini'), 'r_mutt2': P('Müttəqi də budur'), 'r_unut': P('Allahı unutmayan'), 'r_qoru': P('özünü günahdan'),
 'mujde': P('Bir müjdə'), 'm_peyg': P('Peyğəmbərimiz'), 'm_herf': P('Qurandan oxuduğun'), 'm_10': Wd('Qurandan oxuduğun', 'on'), 'm_e': P('Əlif bir'), 'm_l': P('Lam bir'), 'm_m': P('Mim bir'),
 'm_yeni': P('Yəni bu üç'), 'm_30': Wd('Yəni bu üç', 'otuz'),
 'serh': P('Bu gün Qurandan'), 'serh_yaz': P('Şərhdə'), 'novbeti': P('Növbəti'), 'mutt_kim': P('müttəqi kimdir'), 'bes_elamet': Wd('Quran onun beş', 'beş'), 'abune': P('Abunə'),
}
end = R[-1]['t1']; KT['_end'] = end
js = '// Ayənin sirri 7 — Bəqərə 2:1–2. MEASURED times (vo/words.json from walign.py), seconds in vo/voice.wav\nconst KT = ' + json.dumps(KT) + ';\nconst TOTAL2 = ' + str(round(end + 3.4, 2)) + ';\nconst TL = { _total: TOTAL2 };\n'
open('timeline.js', 'w').write(js)
json.dump({'_total': round(end + 3.4, 2), 'K': KT}, open('tl.json', 'w'))
print(js)
