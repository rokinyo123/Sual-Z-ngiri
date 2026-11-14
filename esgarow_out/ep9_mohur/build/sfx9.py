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
if MODE == 'ep9':
    import json as _j
    S_ = _j.load(open('vo/words.json')); P = lambda i: S_[i]['t0'] - LEAD
    def Wd(i, w): return next(x['t'] for x in S_[i]['words'] if x['w'].strip('".,:?!«»') == w) - LEAD
    def stamp_(t): s('stamp', t, 0.3); s('hit', t, 0.2)
    s('reveal', 0.1, 0.12); s('click', P(1), 0.1); s('hit', Wd(1, 'üç'), 0.25)
    for i in (2, 3, 4): s('bubble', P(i), 0.12)
    stamp_(Wd(5, 'möhür')); stamp_(Wd(5, 'möhür') + 0.35); s('whoosh', Wd(6, 'pərdə'), 0.12, 0.7); paper(Wd(6, 'pərdə') + 0.1, 0.12)
    s('riser', P(7) - 0.9, 0.08, 0.9); s('hit', P(7), 0.3); s('whoosh', P(7) - 0.1, 0.1, 0.5)
    CUTS = [8, 13, 22, 29, 36, 45, 49, 54, 56, 60, 64]
    for i in CUTS: s('whoosh', P(i) - 0.5, 0.08, 0.7); paper(P(i) - 0.3, 0.08)
    for i in (8, 9, 10, 11, 12): s('reveal', P(i), 0.09)
    s('click', Wd(15, 'fərqi'), 0.12); s('bubble', P(16), 0.1); s('bubble', P(17), 0.1); s('hit', P(18), 0.15)
    stamp_(Wd(19, 'möhür')); stamp_(Wd(19, 'möhür') + 0.25); s('whoosh', Wd(20, 'pərdə'), 0.1, 0.7); s('reveal', P(21), 0.1)
    s('click', P(23), 0.1); s('chime', P(24), 0.14); s('click', P(25), 0.1); s('hit', P(27), 0.22); lock(P(27) + 0.3)
    s('bubble', P(31), 0.1)
    for j in range(4): add(tone(520 + j * 90, 0.5, 0.25), Wd(32, 'hər') + j * 0.35, 0.05)
    stamp_(Wd(33, 'möhürlə')); s('whoosh', Wd(34, 'qarşısını'), 0.1, 0.6); s('whoosh', Wd(35, 'pərdə'), 0.12, 0.7)
    s('hit', P(37), 0.18)
    for j in range(34): add(tone(110, 0.25, 0.09), P(41) + (j / 34) ** 0.8 * 5.0, 0.05)
    for j in range(4): add(tone(90, 0.3, 0.1), Wd(40, 'qara') + j * 0.15, 0.07)
    heartbeat1(P(42), 0.16); heartbeat1(P(42) + 0.9, 0.14); heartbeat1(P(43), 0.12); s('hit', P(44), 0.2)
    paper(P(46), 0.12); s('reveal', P(47) + 0.3, 0.12); s('hit', Wd(48, 'seçimindən'), 0.15)
    s('reveal', P(49), 0.14)
    for j in range(34): s('chime', Wd(50, 'Əstəğfirullah') + (P(53) + 0.8 - Wd(50, 'Əstəğfirullah')) * j / 34, 0.025)
    s('reveal', P(51), 0.2); s('chime', P(53), 0.16)
    for j in range(14): tick(Wd(54, 'yetmiş') - 0.3 + j * 0.07, 0.04)
    s('hit', Wd(54, 'yetmiş') + 0.7, 0.15); s('chime', P(55), 0.1)
    lock(P(56) + 0.3); lock(P(58), 0.25); s('reveal', P(58), 0.16); s('chime', P(59), 0.14)
    for j in range(6): s('click', P(60) + j * 0.5, 0.05)
    s('reveal', P(62) - 0.2, 0.14); s('chime', P(62), 0.12); s('typing', P(63) + 0.5, 0.07, 1.2)
    s('whoosh', P(65), 0.1, 0.6); s('hit', P(66), 0.15); s('chime', S_[67]['t0'] + 0.2, 0.14)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok', MODE)
