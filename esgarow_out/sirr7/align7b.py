# Anchored word alignment: cue starts from the SRT-derived table (reliable), full text from metn_tam.txt,
# words placed inside each cue over voiced audio (fine silences), phrase boundaries snapped to pauses.
import re, json, math
exec(open('align7.py').read().split('# sentences with char offsets')[0])
L = json.load(open('cumleler.json'))
fine_all = load_sil('sil_fine.txt')
pos = 0; cues = []
for c in L:
    p = T.find(c['txt'][:25], pos)
    assert p >= 0, c
    cues.append([p, c['snap']]); pos = p
words = []; flags = []
for n, (c0, t0) in enumerate(cues):
    c1 = cues[n + 1][0] if n + 1 < len(cues) else len(T)
    t1 = cues[n + 1][1] if n + 1 < len(cues) else DUR
    txt = T[c0:c1]
    fine = segs_from(fine_all, t0, t1)
    if not fine: continue
    # drop trailing silence: fine segments end at last voiced chunk
    phr = [(c0 + m.start(), m.group()) for m in re.finditer(r'[^,:;.?!]+[,:;.?!]*', txt) if re.search(r'\w', m.group())]
    pal = dp_align([p for _, p in phr], fine) if 1 < len(phr) <= len(fine) else None
    if not pal: pal = [(0, len(fine))]; phr = [(c0, txt)]
    for (pc, ptxt), (k2, j2) in zip(phr, pal):
        sg = fine[k2:j2]; voiced = sum(e - s for s, e in sg)
        ws = [(pc + m.start(), m.group()) for m in re.finditer(r"[\wəƏıİöÖüÜçÇşŞğĞ'’-]+", ptxt)]
        tot = sum(syl(w) for _, w in ws); acc = 0
        def at(x):
            for s, e in sg:
                if x <= e - s + 1e-9: return s + x
                x -= e - s
            return sg[-1][1]
        for wc, w in ws:
            a = at(voiced * acc / tot); acc += syl(w); b = at(voiced * acc / tot)
            words.append({'c': wc, 'w': w, 't0': round(a, 3), 't1': round(b, 3), 'cue': L[n]['i']})
    r = syl(txt) / max(0.1, sum(e - s for s, e in fine))
    if not 3.2 <= r <= 7.5: flags.append((L[n]['i'], round(t0, 2), round(r, 1), txt.strip()[:50]))
json.dump({'text': T, 'words': words}, open('soz_vaxtlari.json', 'w'), ensure_ascii=False, indent=0)
print(len(words), 'words'); print('rate flags:'); [print(f) for f in flags]
