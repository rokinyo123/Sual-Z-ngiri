import re, json, math
exec(open('align7.py').read().split('# sentences with char offsets')[0])
L = json.load(open('cumleler.json'))
fine_all = load_sil('sil_fine.txt'); SEG = segs_from(fine_all)
pos = 0; cues = []
for c in L:
    p = T.find(c['txt'][:25], pos); cues.append((p, c['snap'])); pos = p
texts = [T[c0:(cues[n + 1][0] if n + 1 < len(cues) else len(T))] for n, (c0, _) in enumerate(cues)]
w = [syl(x) for x in texts]; R = sum(w) / sum(e - s for s, e in SEG)
N, M = len(texts), len(SEG); INF = 1e18
LAM = 1.5
dp = [[INF] * (M + 1) for _ in range(N + 1)]; bk = [[0] * (M + 1) for _ in range(N + 1)]; dp[0][0] = 0
for i in range(1, N + 1):
    old = cues[i - 1][1]
    for j in range(i, M - (N - i) + 1):
        for k in range(max(i - 1, j - 20), j):
            if dp[i - 1][k] >= INF: continue
            st = SEG[k][0]; t = SEG[j - 1][1] - st; r = w[i - 1] / t
            c = dp[i - 1][k] + (math.log(r / R)) ** 2 * w[i - 1] + LAM * min(25, (st - old) ** 2)
            if c < dp[i][j]: dp[i][j] = c; bk[i][j] = k
out, j = [], M
for i in range(N, 0, -1): k = bk[i][j]; out.append((k, j)); j = k
out = out[::-1]
# strong anchors: cue starts that sit right after a real pause (>=0.2 s)
anch = []
for n, (k, j) in enumerate(out):
    gap = SEG[k][0] - (SEG[k - 1][1] if k > 0 else 0)
    if n == 0 or gap >= 0.2: anch.append((cues[n][0], k, n))
anch.append((len(T), M, N))
def place(ws, sg):
    """words [(c, w)] onto speech segments sg: DP over (word cut, segment cut) pairs."""
    n, m = len(ws), len(sg); sy = [syl(w) for _, w in ws]
    Rl = sum(sy) / sum(e - s_ for s_, e in sg)
    punct = [bool(re.match(r"[\wəƏıİöÖüÜçÇşŞğĞ'’-]+[,:;.?!]", T[c:c + len(w) + 1])) for c, w in ws]
    INF = 1e18; dp = [[INF] * (m + 1) for _ in range(n + 1)]; bk = [[None] * (m + 1) for _ in range(n + 1)]; dp[0][0] = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            for k in range(max(0, i - 40), i):
                sk = sum(sy[k:i])
                for l in range(max(0, j - 6), j):
                    if dp[k][l] >= INF: continue
                    t = sg[j - 1][1] - sg[l][0]; vt = sum(e - s_ for s_, e in sg[l:j])
                    c = dp[k][l] + (math.log((sk / vt) / Rl)) ** 2 * sk + (0 if (i == n or punct[i - 1]) else 0.8) + 0.3 * (j - l - 1)
                    if c < dp[i][j]: dp[i][j] = c; bk[i][j] = (k, l)
    if dp[n][m] >= INF: return None
    res, i, j = [], n, m
    while i > 0: k, l = bk[i][j]; res.append((k, i, l, j)); i, j = k, l
    out = []
    for k, i, l, j in res[::-1]:
        seg = sg[l:j]; voiced = sum(e - s_ for s_, e in seg); tot = sum(sy[k:i]); acc = 0
        def at(x):
            for s_, e in seg:
                if x <= e - s_ + 1e-9: return s_ + x
                x -= e - s_
            return seg[-1][1]
        for q in range(k, i):
            a_ = at(voiced * acc / tot); acc += sy[q]; b_ = at(voiced * acc / tot)
            out.append({'c': ws[q][0], 'w': ws[q][1], 't0': round(a_, 3), 't1': round(b_, 3)})
    return out
words = []
for (c0, k, n0), (c1, k1, n1) in zip(anch, anch[1:]):
    txt = T[c0:c1]; fine = SEG[k:k1]
    ws = [(c0 + m_.start(), m_.group()) for m_ in re.finditer(r"[\wəƏıİöÖüÜçÇşŞğĞ'’-]+", txt)]
    if len(ws) < len(fine):  # more pauses than words: merge the shortest gaps
        while len(fine) > len(ws):
            g = min(range(len(fine) - 1), key=lambda q: fine[q + 1][0] - fine[q][1]); fine = fine[:g] + [(fine[g][0], fine[g + 1][1])] + fine[g + 2:]
    r = place(ws, fine)
    assert r, (c0, txt[:40])
    words += r
json.dump({'text': T, 'words': words}, open('soz_vaxtlari.json', 'w'), ensure_ascii=False, indent=0)
print('anchors', len(anch) - 1, 'words', len(words))
