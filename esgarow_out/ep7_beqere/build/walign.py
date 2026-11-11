"""Measured word timing: phrases -> speech segments (DP on syllable rate), then words -> syllable nuclei (DP).
usage: walign.py voice.wav script.txt out.json"""
import sys, re, json, subprocess, math, numpy as np
wav, scr, outp = sys.argv[1:4]
SR = 16000
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-ar', str(SR), '-af', 'highpass=f=250,lowpass=f=3500', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
hop = 160; n = len(a) // hop
rms = np.array([np.sqrt(np.mean(a[i*hop:(i+1)*hop]**2)) + 1e-9 for i in range(n)]); db = 20*np.log10(rms); db -= db.max()
fr = lambda i: i * hop / SR
# speech segments: frames above -38 dB, gaps >= 0.18 s are pauses
k = np.convolve((db > -38).astype(float), np.ones(5)/5, 'same') > 0.2
segs = []; i = 0
while i < n:
    if k[i]:
        j = i
        while j < n and (k[j] or (j+18 < n and k[j:j+18].any())): j += 1
        segs.append((fr(i), fr(j))); i = j
    else: i += 1
segs = [s for s in segs if s[1]-s[0] > 0.08]
V = set('aıoueəiöüAIOUEƏİÖÜ')
def syl(w): return max(1, len(re.findall(r'[aıoueəiöüAIOUEƏİÖÜ]+', w)))
text = open(scr).read().replace('\n', ' ')
phr = [p.strip() for p in re.split(r'(?<=[.,:?!])\s+', text) if p.strip()]
ps = [sum(syl(w) for w in p.split()) for p in phr]
N, M = len(phr), len(segs)
Rm = sum(ps) / sum(b-a for a, b in segs)
INF = 1e18; dp = [[INF]*(M+1) for _ in range(N+1)]; bk = [[0]*(M+1) for _ in range(N+1)]; dp[0][0] = 0
for i in range(1, N+1):
    for j in range(1, M+1):
        for kk in range(max(0, j-6), j):
            if dp[i-1][kk] >= INF: continue
            d = segs[j-1][1] - segs[kk][0]; r = ps[i-1] / d
            c = dp[i-1][kk] + (math.log(r/Rm))**2 * ps[i-1]
            if c < dp[i][j]: dp[i][j] = c; bk[i][j] = kk
# allow phrases to share a segment? (comma without pause) -> handled by merging below if DP infeasible
assert dp[N][M] < INF, 'phrase/segment DP failed'
span = []; j = M
for i in range(N, 0, -1): kk = bk[i][j]; span.append((segs[kk][0], segs[j-1][1], kk, j)); j = kk
span.reverse()
# syllable nuclei inside a span
sm = np.convolve(db, np.ones(4)/4, 'same')
def nuclei(t0, t1):
    i0, i1 = int(t0*SR/hop), int(t1*SR/hop); pk = []
    for i in range(i0+2, i1-2):
        if sm[i] > -32 and sm[i] >= sm[i-1] and sm[i] >= sm[i+1]:
            lo = min(sm[max(i0, i-12):i].min(), sm[i+1:min(i1, i+12)].min())
            if sm[i] - lo >= 2.0 and (not pk or fr(i) - pk[-1] >= 0.09): pk.append(fr(i))
            elif pk and fr(i) - pk[-1] < 0.09 and sm[i] > sm[int(pk[-1]*SR/hop)]: pk[-1] = fr(i)
    return pk
res = []
for p, (t0, t1, s0, s1) in zip(phr, span):
    words = p.split(); sy = [syl(w) for w in words]; S = sum(sy)
    pk = nuclei(t0, t1); P = len(pk)
    # DP: map syllable s -> peak index, monotonic; cost = |rel position diff| + skip penalties
    if P == 0: pk = list(np.linspace(t0+0.05, t1-0.05, S)); P = S
    cost = np.full((S+1, P+1), 1e9); cost[0, :] = np.arange(P+1)*0.3; bkp = {}
    for s in range(1, S+1):
        for q in range(1, P+1):
            m = cost[s-1, q-1] + abs((s-0.5)/S - (q-0.5)/P) * 3
            u = cost[s, q-1] + 0.3            # extra peak
            v = cost[s-1, q] + 0.6            # syllable without its own peak
            cost[s, q], bkp[(s, q)] = min((m, 'm'), (u, 'u'), (v, 'v'))
    s, q = S, int(np.argmin(cost[S, :])); st = [None]*S
    while s > 0 and q > 0:
        mv = bkp[(s, q)]
        if mv == 'm': st[s-1] = pk[q-1]; s -= 1; q -= 1
        elif mv == 'u': q -= 1
        else: s -= 1
    for idx in range(S):   # interpolate missing
        if st[idx] is None:
            prev = next((st[j] for j in range(idx-1, -1, -1) if st[j] is not None), t0)
            nxt = next((st[j] for j in range(idx+1, S) if st[j] is not None), t1)
            st[idx] = (prev + nxt) / 2
    ws = []; c = 0
    for w, n_ in zip(words, sy):
        ws.append({'w': w, 't': round(max(t0, st[c] - 0.07) if c else t0, 2)}); c += n_
    res.append({'p': p, 't0': round(t0, 2), 't1': round(t1, 2), 'rate': round(sum(sy)/(t1-t0), 1), 'words': ws})
json.dump(res, open(outp, 'w'), ensure_ascii=False, indent=0)
for r in res: print(f"{r['t0']:7.2f} {r['t1']:7.2f} {r['rate']:4.1f}  {r['p'][:70]}")
print('phrases', N, 'segments', M)
