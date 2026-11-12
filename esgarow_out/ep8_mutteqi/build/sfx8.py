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
if MODE == 'short':
    # hook: mask glyph, push-through, lanterns ignite one by one
    s('riser', 0.0, 0.1, 2.3); s('reveal', 0.05, 0.14)
    for w, d in [('q1', 0), ('q1', 0.15), ('q1', 0.3)]: s('click', L(w) + d, 0.1)
    s('whoosh', K['sayir'] - 0.2, 0.25); s('hit', K['sayir'] + 0.05, 0.35)
    for t0 in [K['sonra'], K['sonra'] + 0.6, K['qurtulus'], K['qurtulus'] + 0.8, K['mehz']]: s('chime', t0 - LEAD, 0.08); add(tone(180, 0.4, 0.15) * 0.4, t0 - LEAD, 0.06)
    s('bubble', L('mehz') + 0.6, 0.1); s('whip', L('sende') - 0.1, 0.15); s('hit', L('sende'), 0.3)
    paper(K['ula'] - 0.9); s('reveal', L('ula'), 0.12); s('chime', L('mufl_w'), 0.14)
    for k in ['s1', 's2', 's3', 's4', 's5']: SIGN(k); paper(K[k] - 0.7)
    for k in ['s1n', 's2n', 's3n', 's4n', 's5n']: s('click', L(k), 0.1)
    s('bubble', L('s1n') + 0.3, 0.12)
    s('click', L('s2q'), 0.1); s('whip', L('s2a'), 0.12); s('chime', L('s2a') + 0.4, 0.1)
    for i in range(5): s('bubble', L('s2h') + i * 0.28, 0.08)
    s('click', L('s2d'), 0.1); s('reveal', L('s3h'), 0.08); s('click', L('s3b'), 0.12); s('bubble', L('s3n') + 0.6, 0.1)
    # story ASMR
    paper(K['st0'] - 0.7); s('bubble', L('st_it'), 0.12); add(fnoise(2.5, 0.02) * 0.0, 0, 0)
    s('whoosh', L('st_quyu'), 0.08, 0.8); water(L('st_ayaq') + 0.2, 2.2, 0.08); drip(L('st_ayaq') + 0.9, 6, 0.06)
    water(L('st_suvar') - 0.2, 1.6, 0.06); s('reveal', L('st_razi'), 0.18); s('chime', L('st_razi') + 0.3, 0.14); heartbeat1(L('st_razi') + 0.3)
    s('click', L('st_peyg'), 0.08); paper(L('st_her') - 0.1, 0.12)
    for i in range(5): s('bubble', L('st_canli') + 0.4 + i * 0.12, 0.09)
    s('hit', L('c_var'), 0.25); s('chime', L('c_var'), 0.1)
    water(L('c_pisik'), 0.8, 0.05); s('bubble', L('c_pisik'), 0.1); wings(L('c_qus')); s('bubble', L('c_qus'), 0.1)
    for i in range(10): tick(L('c_qus') + 0.4 + i * 0.05, 0.03)
    s('click', L('c_das'), 0.12); s('bubble', L('c_gul'), 0.12); s('reveal', L('c_itir'), 0.16); s('chime', L('c_itir') + 0.6, 0.14)
    for i in range(3): s('whoosh', L('s4k') + 0.4 + i * 0.25, 0.05, 0.4)
    s('chime', L('s4k') + 1.1, 0.12)
    s('click', L('s5i'), 0.1); s('whip', L('s5y'), 0.12); s('click', L('s5s'), 0.1)
    # sirr tease
    s('riser', K['sirr'] - 1.2, 0.08, 1.0); s('reveal', L('erebce') + 0.1, 0.16); s('chime', L('mufl2'), 0.12)
    lock(L('her_gun') + 0.4); lock(L('eşid'), 0.25); s('hit', L('eşid'), 0.15)
    s('shatter', K['outro'] - 0.1, 0.12); s('reveal', K['outro'] + 1.2, 0.18); s('click', L('uzun'), 0.12)
    for i in range(3): s('bubble', L('link') + i * 0.4, 0.08)

if MODE == 'long':
    import json as _j
    S_ = _j.load(open('vo/long_words.json')); P = lambda i: S_[i]['t0'] - LEAD
    def Wd(i, w): return next(x['t'] for x in S_[i]['words'] if x['w'].strip('".,:?!«»') == w) - LEAD
    s('riser', 0.0, 0.1, 2.3); s('reveal', 0.05, 0.14); s('whoosh', Wd(0, 'sayır') + 0.2, 0.25); s('hit', Wd(0, 'sayır') + 0.45, 0.35)
    for t0 in [P(1), P(1) + 0.6, P(2), P(2) + 0.8, Wd(2, 'məhz')]: s('chime', t0, 0.08); add(tone(180, 0.4, 0.15) * 0.4, t0, 0.06)
    s('whip', Wd(3, 'səndə') - 0.1, 0.14); s('hit', Wd(3, 'səndə'), 0.28); s('bubble', Wd(2, 'məhz') + 0.6, 0.1)
    CUTS = [4, 9, 17, 24, 39, 47, 54, 62, 66, 75, 85, 98, 110, 125, 130, 142, 147, 156, 163]
    for i in CUTS: s('whoosh', P(i) - 0.5, 0.09, 0.7); paper(P(i) - 0.3, 0.09)
    s('click', P(5), 0.1); s('reveal', P(6), 0.12)
    for i in (9, 12, 15): s('reveal', P(i), 0.1); s('chime', P(i) + 0.2, 0.08)
    for t0 in [P(19), Wd(20, 'namazı'), Wd(20, 'ruzidən'), P(21), P(22)]: s('chime', t0, 0.1); s('bubble', t0, 0.08)
    s('chime', P(23) + 2.5, 0.12)
    for i in (24, 47, 66, 98, 110): s('reveal', P(i), 0.15); add(tone(73.4, 2.0, 0.8) * 0.5, P(i), 0.1); s('click', P(i + 1), 0.1)
    for i in (29, 30, 31, 32): s('bubble', P(i), 0.08)
    paper(P(35), 0.12); s('chime', P(38), 0.12)
    s('whoosh', P(39), 0.12, 1.5); s('whoosh', P(40), 0.08, 1.2); heartbeat1(P(43)); heartbeat1(P(43) + 0.85, 0.12); drip(P(44), 4, 0.05); s('chime', P(45), 0.1); s('hit', P(46), 0.2); s('reveal', P(46), 0.14)
    s('click', P(49), 0.1); s('whip', P(50), 0.12); s('chime', P(50) + 0.4, 0.1)
    for i in range(5): s('bubble', P(51) + i * 0.28, 0.08)
    s('click', P(53), 0.1); water(P(54), 9.0, 0.06); s('reveal', P(61), 0.12); s('chime', P(65), 0.12)
    s('click', P(69), 0.12); s('reveal', P(68), 0.08)
    for i in (71, 72, 73): s('bubble', P(i), 0.08)
    s('bubble', Wd(76, 'it'), 0.12); water(P(78) + 0.2, 2.4, 0.08); drip(P(78) + 0.9, 6, 0.06); s('reveal', P(79), 0.18); s('chime', P(79) + 0.3, 0.14); heartbeat1(P(79) + 0.3)
    paper(P(84) - 0.1, 0.12); s('stamp', Wd(85, 'cəzalandırıldı'), 0.12); wings(P(86) + 1.2); wings(P(87)); s('reveal', P(88), 0.12)
    s('hit', P(90), 0.22); water(P(91), 0.8, 0.05); s('bubble', P(91), 0.1); wings(P(92)); s('bubble', P(92), 0.1); s('click', P(93), 0.12); s('bubble', P(94), 0.12)
    s('reveal', P(95), 0.16); s('chime', P(95) + 0.6, 0.14); s('click', P(97), 0.1)
    for i in (100, 101, 102): s('bubble', P(i), 0.1)
    for j in range(3): s('whoosh', P(103) + 0.3 + j * 0.3, 0.05, 0.4)
    s('chime', P(103) + 1.2, 0.12); s('reveal', P(105), 0.14)
    for j in range(6): s('chime', P(107) + j * 0.35, 0.05)
    s('click', P(112), 0.1); s('whip', P(113), 0.12); s('click', P(114), 0.1); paper(P(118), 0.12); paper(P(120) + 1.5, 0.1); s('reveal', P(124), 0.15)
    s('reveal', Wd(126, 'hidayət'), 0.14); s('chime', P(129), 0.1)
    s('riser', P(130) - 1.4, 0.07, 1.2); s('reveal', P(133) + 0.2, 0.16); lock(P(135)); lock(P(135) + 0.4, 0.25); s('shatter', P(136) + 0.3, 0.1); s('chime', P(137), 0.14)
    for j in range(3): s('bubble', P(139) + j * 0.15, 0.1)
    s('chime', P(140), 0.12); s('hit', P(141), 0.18)
    s('click', P(142) + 1.2, 0.1); s('bubble', P(144), 0.12); s('reveal', P(146), 0.14)
    s('reveal', P(150), 0.1); s('reveal', P(151), 0.12); s('whoosh', P(153), 0.12, 0.8); s('hit', P(154), 0.2); s('chime', P(154) + 0.2, 0.14); s('chime', P(155) + 0.4, 0.12)
    s('typing', P(158) + 0.4, 0.07, 0.8); s('click', P(159) + 1.0, 0.1); s('chime', P(161), 0.1)
    lock(P(164) + 0.5); s('chime', S_[165]['t0'] + 0.3, 0.16); s('click', S_[165]['t0'] + 1.0, 0.12)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok', MODE)
