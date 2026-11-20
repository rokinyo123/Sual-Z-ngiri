"""SFX/ASMR for ep8 (short or long). usage: sfx8.py tl.json sfx_lib.py out.wav sfxdir short|long"""
import sys, subprocess, numpy as np
exec(open(sys.argv[2]).read())
SD = sys.argv[4]; MODE = sys.argv[5]; K = T['K']; LEAD = 0.4
def smp(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SD}/{name}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64); return a / (np.max(np.abs(a)) + 1e-9)
S = {n: smp(n) for n in ['whoosh', 'hit', 'stamp', 'riser', 'reveal', 'chime', 'typing', 'click', 'bubble', 'whip', 'shatter']}
HEAVY = {'hit': 0.45, 'stamp': 0.55, 'shatter': 0.5}
def s(n, t, g=0.25, d=None):
    if t < 0: return
    g *= HEAVY.get(n, 1.0); m = len(S[n]) if d is None else min(len(S[n]), int(d * SR)); x = S[n][:m] if d is None else S[n][:m] * np.linspace(1, 0, m) ** 0.5; add(x, t, g)
def L(k): return K[k] - LEAD
def fnoise(d, a): x = noise(d); k = max(1, int(1 / a)); return np.convolve(x, np.ones(k) / k, 'same')
def paper(t, g=0.11):
    d = 0.5; x = (fnoise(d, 0.25) - fnoise(d, 0.04)) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 2; add(x / (np.abs(x).max() + 1e-9), t, g)
def water(t, d, g=0.07):
    x = fnoise(d, 0.35) - fnoise(d, 0.06); m = 0.55 + 0.45 * np.abs(np.sin(np.linspace(0, d * 9, len(x)))); e = np.minimum(1, np.arange(len(x)) / SR / 0.4) * np.minimum(1, (len(x) - np.arange(len(x))) / SR / 0.6)
    add(x / (np.abs(x).max() + 1e-9) * m * e, t, g)
def drip(t, n=6, g=0.07):
    for i in range(n): add(tone(1400 + 300 * np.sin(i * 1.7), 0.08, 0.02), t + i * 0.2, g); add(0.4 * tone(2600, 0.04, 0.008), t + i * 0.2, g)
def wings(t, g=0.08):
    for i in range(6): x = fnoise(0.06, 0.2) * np.hanning(int(0.06 * SR)); add(x / (np.abs(x).max() + 1e-9), t + i * 0.07, g)
def tick(t, g=0.05): add(tone(3000, 0.04, 0.006), t, g); add(0.5 * tone(1800, 0.04, 0.01), t, g)
def heartbeat1(t, g=0.18): add(tone(52, 0.25, 0.07, 0.006), t, g); add(0.7 * tone(64, 0.22, 0.06, 0.005), t + 0.2, g)
def lock(t, g=0.2): add(tone(900, 0.05, 0.01), t, g); add(0.6 * tone(1300, 0.04, 0.008), t, g); add(tone(500, 0.08, 0.02), t + 0.09, g * 0.8)
SIGN = lambda k: (s('reveal', L(k), 0.16), s('whoosh', L(k) - 0.15, 0.08, 0.5), add(tone(73.4, 2.0, 0.8) * 0.5, L(k), 0.1))
if MODE == 'ep10':
    import json as _j
    S_ = _j.load(open('vo/words.json')); P = lambda i: S_[i]['t0'] - LEAD
    def Wd(i, w): return next(x['t'] for x in S_[i]['words'] if x['w'].strip('".,:?!«»') == w) - LEAD
    s('reveal', 0.1, 0.12); s('click', P(1), 0.1)
    for t0, n in [(Wd(1, 'dörd'), 4), (Wd(3, 'iki'), 2), (Wd(5, 'on'), 13)]:
        s('riser', t0, 0.06, 0.9 if n < 10 else 1.3)
        for j in range(n): tick(t0 + (0.9 if n < 10 else 1.3) * j / n, 0.04)
    s('hit', Wd(5, 'on') + 1.3, 0.3); s('whip', P(6) - 0.1, 0.14); s('hit', P(6), 0.25)
    CUTS = [7, 12, 19, 27, 34, 44, 50, 56, 61, 66]
    for i in CUTS: s('whoosh', P(i) - 0.5, 0.08, 0.7); paper(P(i) - 0.3, 0.08)
    for i in (7, 9, 10, 11): s('reveal', P(i), 0.09)
    s('click', P(14), 0.1); s('bubble', P(14) + 0.4, 0.1); s('hit', Wd(15, 'mömin'), 0.18)
    s('click', Wd(16, 'aldatmağa'), 0.1); s('hit', Wd(17, 'özlərini'), 0.15); s('whoosh', P(18), 0.06, 1.0)
    s('click', P(20), 0.1); s('hit', P(21), 0.18); s('click', P(23), 0.12); s('click', P(25), 0.12); add(tone(60, 1.2, 0.5) * 0.6, P(25) + 0.5, 0.12); s('hit', P(26), 0.16)
    s('chime', P(27), 0.12); s('reveal', P(30), 0.12); s('bubble', P(32), 0.1); s('bubble', P(33), 0.1); s('whoosh', P(33) + 0.5, 0.06, 0.5); s('shatter', P(33) + 1.1, 0.07)
    s('reveal', P(34), 0.12); s('click', P(35), 0.1); s('hit', Wd(38, 'özlərini'), 0.14); s('bubble', P(38) + 0.3, 0.1)
    s('hit', P(39), 0.18); s('reveal', P(40), 0.14); s('whoosh', P(41), 0.06, 1.2)
    s('click', P(46), 0.1); s('hit', Wd(46, 'üçdür'), 0.2)
    for i in (47, 48, 49): s('stamp', P(i) + 0.1, 0.12); s('bubble', P(i) + 0.15, 0.08)
    s('reveal', Wd(50, 'bundan'), 0.12)
    for j in range(15): tick(Wd(52, 'otuz') - 0.3 + j * 0.06, 0.04)
    paper(P(52), 0.1); s('chime', P(54), 0.12)
    s('reveal', P(57), 0.12)
    for i in (58, 59, 60): s('click', P(i) + 0.15, 0.12); s('chime', P(i) + 0.2, 0.08)
    s('reveal', P(61), 0.16); s('chime', Wd(61, 'dilinlə'), 0.14); s('typing', P(62) + 0.5, 0.07, 1.5); s('chime', P(65), 0.14)
    s('whoosh', P(67), 0.1, 0.6); s('hit', P(68), 0.15); s('chime', S_[69]['t0'] + 0.2, 0.14)
if MODE == 'ep13':
    import json as _j
    S_ = _j.load(open('vo/words.json')); P = lambda i: S_[i]['t0'] - LEAD
    def Wd(i, w, n=0):
        m = [x['t'] for x in S_[i]['words'] if x['w'].strip('".,:?!«»…—') == w]
        if not m: m = [x['t'] for x in S_[i]['words'] if x['w'].strip('".,:?!«»…—').startswith(w)]
        return m[n] - LEAD
    s('reveal', 0.1, 0.12); s('click', Wd(0, 'insanların'), 0.1); s('bubble', Wd(0, 'insanların') + 0.2, 0.1)
    s('whoosh', Wd(0, 'tək') - 0.2, 0.06, 0.6); s('bubble', Wd(0, 'tək'), 0.1); add(tone(60, 1.2, 0.5) * 0.6, Wd(0, 'tək'), 0.1)
    s('reveal', P(1), 0.12); s('hit', Wd(1, 'açıb'), 0.2)
    CUTS = [2, 7, 13, 18, 23, 31, 33, 40, 42, 46]
    for i in CUTS: s('whoosh', P(i) - 0.5, 0.08, 0.7); paper(P(i) - 0.3, 0.08)
    for i in range(2, 7): s('reveal', P(i), 0.08)
    s('bubble', Wd(8, 'iman'), 0.1); s('bubble', P(11), 0.1); s('chime', P(12), 0.1)
    for i in (14, 15, 16, 17): s('click', P(i), 0.1); s('chime', P(i) + 0.2, 0.06)
    s('chime', P(18), 0.14); s('reveal', P(19), 0.14); s('click', P(20), 0.08); s('click', P(21), 0.08)
    s('hit', P(22), 0.2); add(tone(1200, 0.08, 0.02), P(22) + 0.3, 0.06)
    s('reveal', P(26), 0.12); s('chime', Wd(27, 'dağlar'), 0.12); s('riser', Wd(27, 'dağlar'), 0.05, 1.2)
    s('whoosh', Wd(27, 'toza'), 0.12, 1.4); s('hit', Wd(27, 'toza') + 0.2, 0.14); paper(P(28), 0.1)
    s('reveal', P(32), 0.1); s('chime', Wd(32, 'gecə'), 0.08); s('whoosh', Wd(32, 'amma') + 0.3, 0.08, 0.8); s('stamp', Wd(32, 'Allahın'), 0.14)
    add(tone(48, 1.8, 0.7) * 0.6, Wd(32, 'Allahın'), 0.1)
    for i, w in ((33, 'Instagramda'), (33, 'evdə'), (34, 'Qrup'), (34, 'üzünə')): s('bubble', Wd(i, w), 0.1)
    s('click', P(35), 0.08); paper(P(38), 0.1)
    s('reveal', Wd(40, 'əsl'), 0.16); s('chime', Wd(41, 'Allah'), 0.12); s('chime', Wd(41, 'dağlar'), 0.12)
    s('click', P(42), 0.08); s('typing', P(43) + 0.2, 0.07, 2.2); s('chime', P(45), 0.14)
    s('whoosh', P(47), 0.1, 0.6); s('hit', Wd(47, 'zəlaləti'), 0.14); s('chime', S_[49]['t0'] + 0.2, 0.14)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok', MODE)
