# Align full narration text to the voice: sentences -> speech segments (DP on syllable rate),
# then phrases (comma/colon) inside each sentence -> fine segments, then words by syllables.
import re, json, math
V = set('aıoueəiöüâAIOUEƏİÖÜÂ')
LET = {'əlif', 'lam', 'mim', 'ya', 'sin', 'ta', 'ha', 'qaf', 'nun', 'kaf', 'eyn', 'sad'}
def syl(s):
    ws = re.findall(r"[\wəƏıİöÖüÜçÇşŞğĞ'’-]+", s)
    if ws and all(w.lower() in LET for w in ws): return sum(3 for w in ws)
    return max(1, sum(c in V for c in s))
DUR = 564.5
T = open('metn_tam.txt').read().replace('\n', ' ').strip()
def load_sil(f): return [tuple(map(float, l.split())) for l in open(f) if len(l.split()) == 2]
def segs_from(sil, a=0.0, b=DUR):
    out, p = [], a
    for s, e in sil:
        if e <= a or s >= b: continue
        s, e = max(s, a), min(e, b)
        if s - p > 0.04: out.append((p, s))
        p = e
    if b - p > 0.04: out.append((p, b))
    return out
def dp_align(units, segs):
    N, M = len(units), len(segs)
    if N > M: return None
    w = [syl(u) for u in units]; R = sum(w) / sum(e - s for s, e in segs)
    INF = 1e18; dp = [[INF] * (M + 1) for _ in range(N + 1)]; bk = [[0] * (M + 1) for _ in range(N + 1)]; dp[0][0] = 0
    for i in range(1, N + 1):
        for j in range(i, M - (N - i) + 1):
            for k in range(max(i - 1, j - 25), j):
                if dp[i - 1][k] >= INF: continue
                t = segs[j - 1][1] - segs[k][0]; r = w[i - 1] / t
                c = dp[i - 1][k] + (math.log(r / R)) ** 2 * w[i - 1]
                if c < dp[i][j]: dp[i][j] = c; bk[i][j] = k
    out, j = [], M
    for i in range(N, 0, -1): k = bk[i][j]; out.append((k, j)); j = k
    return out[::-1]
# sentences with char offsets
sents = [(m.start(), m.group()) for m in re.finditer(r'[^.?!]+[.?!]', T)]
sil = load_sil('sil.txt'); SEG = segs_from(sil)
al = dp_align([s for _, s in sents], SEG)
words = []
for (c0, st), (k, j) in zip(sents, al):
    a, b = SEG[k][0], SEG[j - 1][1]
    fine = segs_from(load_sil('sil_fine.txt'), a, b)
    # phrases split at , : ;
    phr = [(c0 + m.start(), m.group()) for m in re.finditer(r'[^,:;]+[,:;]?', st) if m.group().strip()]
    pal = dp_align([p for _, p in phr], fine) if len(phr) > 1 and len(fine) >= len(phr) else None
    if not pal: pal = [(0, len(fine))]; phr = [(c0, st)]
    for (pc, ptxt), (k2, j2) in zip(phr, pal):
        sg = fine[k2:j2]; voiced = sum(e - s for s, e in sg)
        ws = [(pc + m.start(), m.group()) for m in re.finditer(r"[\wəƏıİöÖüÜçÇşŞğĞ'’-]+", ptxt)]
        tot = sum(syl(w) for _, w in ws); acc = 0
        def at(x):  # voiced-time x -> real time
            for s, e in sg:
                if x <= e - s: return s + x
                x -= e - s
            return sg[-1][1]
        for wc, w in ws:
            t0 = at(voiced * acc / tot); acc += syl(w); t1 = at(voiced * acc / tot)
            words.append({'c': wc, 'w': w, 't0': round(t0, 3), 't1': round(t1, 3)})
    r = syl(st) / (b - a)
    if not 3 <= r <= 7.5: print('!! rate %.1f %.2f %s' % (r, a, st[:50]))
json.dump({'text': T, 'words': words}, open('soz_vaxtlari.json', 'w'), ensure_ascii=False, indent=0)
print(len(sents), 'sentences', len(SEG), 'segs', len(words), 'words')
for x in words[:30]: print(x['t0'], x['w'])
