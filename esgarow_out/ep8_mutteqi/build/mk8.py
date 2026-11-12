"""Timelines for ep8 from MEASURED word times. Writes tl_short.js / tl_long.js (+ json for SFX)."""
import json, re
def mk(R, name, keys, total_pad):
    def P(sub, k=0, part=None):
        m = [r for r in R if r['p'].startswith(sub) and (part is None or r.get('part') == part)]
        if not m: raise SystemExit(f'{name}: no phrase {sub!r}')
        return m[k]['t0']
    def Wd(sub, word, k=0, part=None):
        m = [r for r in R if r['p'].startswith(sub) and (part is None or r.get('part') == part)][k]
        for w in m['words']:
            if w['w'].strip('".,:?!«»') == word: return w['t']
        for w in m['words']:
            if w['w'].strip('".,:?!«»').startswith(word): return w['t']
        raise SystemExit(f'{name}: no word {word!r} in {sub!r}')
    KT = {k: round(v(P, Wd), 2) for k, v in keys.items()}
    end = R[-1]['t1']; total = round(end + total_pad, 2)
    subs = [{'t0': r['t0'], 't1': r['t1'], 'w': [[w['w'], w['t']] for w in r['words']]} for r in R]
    js = f'// {name}: MEASURED times (vo/*_words.json)\nconst KT = {json.dumps(KT)};\nconst TOTAL2 = {total};\nconst TL = {{ _total: TOTAL2 }};\nconst SUBS = {json.dumps(subs, ensure_ascii=False)};\n'
    open(f'tl_{name}.js', 'w').write(js); json.dump({'_total': total, 'K': KT}, open(f'tl_{name}.json', 'w'))
    print(name, 'total', total); print({k: KT[k] for k in list(KT)[:200]})
S = json.load(open('vo/short_words.json')); L = json.load(open('vo/long_words.json'))
mk(S, 'short', {
 'q1': lambda P, W: P('Quran bir insanın'), 'sayir': lambda P, W: W('Quran bir insanın', 'sayır'), 'sonra': lambda P, W: P('Sonra deyir'),
 'qurtulus': lambda P, W: P('qurtuluşa'), 'mehz': lambda P, W: W('qurtuluşa', 'məhz'), 'hansi': lambda P, W: P('Bu beşindən'), 'sende': lambda P, W: W('Bu beşindən', 'səndə'),
 'ula': lambda P, W: P('Ulaikə alə'), 'mufl': lambda P, W: P('və ulaikə humul'), 'mufl_w': lambda P, W: W('və ulaikə humul', 'humul-muflihun'),
 's1': lambda P, W: P('Birinci əlamət'), 's1n': lambda P, W: P('qeybə iman'), 's1d': lambda P, W: P('Görmədiyin'),
 's2': lambda P, W: P('İkinci əlamət'), 's2n': lambda P, W: P('namaz'), 's2q': lambda P, W: P('Ayədə "qılırlar"'), 's2a': lambda P, W: P('"ayaqda tuturlar"'), 's2h': lambda P, W: P('Yəni hər gün'), 's2d': lambda P, W: P('davamlı'),
 's3': lambda P, W: P('Üçüncü əlamət'), 's3n': lambda P, W: P('ruzidən verirlər'), 's3h': lambda P, W: P('Hamısından yox'), 's3b': lambda P, W: P('bir qismindən'),
 'st0': lambda P, W: P('Və sədəqə təkcə'), 'st_it': lambda P, W: W('Bir adam susuzluqdan', 'it'), 'st_adam': lambda P, W: P('Bir adam susuzluqdan'), 'st_quyu': lambda P, W: P('Quyuya endi'),
 'st_ayaq': lambda P, W: P('ayaqqabısını'), 'st_suvar': lambda P, W: W('ayaqqabısını', 'suvardı'), 'st_razi': lambda P, W: P('Allah ona razı'), 'st_bag': lambda P, W: W('Allah ona razı', 'bağışladı'),
 'st_peyg': lambda P, W: P('Peyğəmbərimiz buyurdu'), 'st_her': lambda P, W: P('"Hər canlıya'), 'st_canli': lambda P, W: W('"Hər canlıya', 'canlıya'),
 'c0': lambda P, W: P('Bu gün pulun'), 'c_var': lambda P, W: P('sədəqən var'), 'c_pisik': lambda P, W: P('Bir pişiyə'), 'c_qus': lambda P, W: P('bir quşa'), 'c_das': lambda P, W: P('yoldan bir daş'), 'c_gul': lambda P, W: P('birinə gülümsə'), 'c_itir': lambda P, W: P('Allah heç bir'),
 's4': lambda P, W: P('Dördüncü əlamət'), 's4n': lambda P, W: P('Qurana və'), 's4k': lambda P, W: W('Qurana və', 'kitablara'),
 's5': lambda P, W: P('Beşinci əlamət'), 's5n': lambda P, W: P('axirətə yəqin'), 's5i': lambda P, W: P('"İnanırlar"'), 's5y': lambda P, W: P('"yəqin edirlər"'), 's5s': lambda P, W: P('Yəni şübhəsiz'),
 'sirr': lambda P, W: P('İndi ən gözəl'), 'aye_bitir': lambda P, W: P('Ayə belə bitir'), 'nicat': lambda P, W: P('"Məhz onlar nicat'), 'erebce': lambda P, W: P('Ərəbcə'), 'mufl2': lambda P, W: P('əl-muflihun'),
 'her_gun': lambda P, W: P('Bu sözü sən'), 'eşid': lambda P, W: W('Bu sözü sən', 'eşidirsən'), 'outro': lambda P, W: P('Bu beş əlamətin'), 'uzun': lambda P, W: P('daha çox hədis'), 'link': lambda P, W: P('Aşağıdakı linkə'),
}, 1.6)
