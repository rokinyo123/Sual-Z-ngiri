"""Synthesised editorial sound effects for the 30 s vector explainer (no music).
usage: python3 sfx.py out.wav"""
import sys, wave
import numpy as np

SR, DUR = 48000, 30.0
out = np.zeros(int(SR * DUR) + SR)
rng = np.random.default_rng(4)

def tt(d): return np.arange(int(d * SR)) / SR
def add(sig, t, g=1.0):
    i = int(t * SR)
    if i < 0: sig = sig[-i:]; i = 0
    n = min(len(sig), len(out) - i)
    if n > 0: out[i:i + n] += sig[:n] * g
def lp(x, a):  # one-pole low-pass (short signals only)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y
def mx(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def env(d, att, dec): x = tt(d); return np.minimum(1, x / att) * np.exp(-x / dec)
def tone(f, d, dec, att=0.003): x = tt(d); return np.sin(2 * np.pi * f * x) * env(d, att, dec)

def pop(t, f=900, g=0.22):  # clean reveal pop: quick pitch drop + body
    d = 0.14; x = tt(d); fr = f * (1.6 - 0.6 * np.minimum(1, x / 0.03))
    add(np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(d, 0.002, 0.035), t, g)
def tap(t, g=0.25):  # tactile placement
    add(mx(lp(rng.standard_normal(int(0.05 * SR)), 0.25) * env(0.05, 0.0008, 0.01) * 3, tone(180, 0.08, 0.02) * 0.6), t, g)
def click(t, g=0.3):  # structural connection
    add(mx(np.diff(np.concatenate([[0], rng.standard_normal(int(0.012 * SR))])) * env(0.012, 0.0003, 0.003), tone(2400, 0.03, 0.006) * 0.5), t, g)
def whoosh(t, d=0.55, g=0.22, bright=0.08):  # shape transformation
    n = int(d * SR); s = lp(rng.standard_normal(n), bright) * np.sin(np.linspace(0, np.pi, n)) ** 2
    add(s * 4, t - d * 0.45, g)
def sweep(t, d=0.8, g=0.16):  # masked transition, rising filter
    n = int(d * SR); x = rng.standard_normal(n); y = np.empty(n); acc = 0.0
    for i in range(n): a = 0.01 + 0.25 * (i / n) ** 2; acc += a * (x[i] - acc); y[i] = acc
    add(y * np.sin(np.linspace(0, np.pi, n)) * 4, t - d * 0.7, g)
def rise(t, d=0.45, f0=500, f1=1100, g=0.1):
    x = tt(d); fr = np.linspace(f0, f1, len(x)); add(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * x / d) ** 2, t, g)
def confirm(t, g=0.16):  # completed relationship: two soft mallet notes
    for k, f in enumerate((784, 1175)): add(mx(tone(f, 0.9, 0.28), 0.3 * tone(f * 2, 0.6, 0.12)), t + k * 0.09, g)
def thud(t, g=0.4): add(mx(tone(70, 0.4, 0.09), 0.5 * tone(120, 0.3, 0.05)), t, g)
def snap(t, g=0.32):  # line being cut
    add((rng.standard_normal(int(0.05 * SR)) - lp(rng.standard_normal(int(0.05 * SR)), 0.3)) * env(0.05, 0.0005, 0.012), t, g); add(tone(1600, 0.06, 0.012), t, g * 0.5)
def cloth(t, d=0.7, g=0.12):  # ribbon flutter
    n = int(d * SR); s = lp(rng.standard_normal(n), 0.12) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 22, n)))) * np.sin(np.linspace(0, np.pi, n))
    add(s * 3, t, g)
def pen(t, d=0.9, g=0.07):  # writing
    n = int(d * SR); x = np.arange(n) / SR; s = (rng.standard_normal(n) - lp(rng.standard_normal(n), 0.2)) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 6 * x + np.sin(2 * np.pi * 1.7 * x) * 2)))
    add(s * np.minimum(1, x / 0.05) * np.minimum(1, (d - x) / 0.1), t, g)
def crack(t, g=0.3):
    for k in range(5): add((rng.standard_normal(int(0.03 * SR))) * env(0.03, 0.0005, 0.006), t + k * 0.055 + rng.uniform(0, 0.02), g * (1 - k * 0.12))
    add(tone(140, 0.25, 0.06), t, g * 0.6)
def flow(t0, t1, g=0.04):  # soft hum while the diagram flows
    d = t1 - t0; x = tt(d); s = (np.sin(2 * np.pi * 220 * x) + 0.5 * np.sin(2 * np.pi * 330 * x)) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.2 * x))
    add(s * np.minimum(1, x / 0.5) * np.minimum(1, (d - x) / 0.5), t0, g)

# ---- cue sheet (seconds), matched to anim.js ----
pop(0.3, 700, 0.14); sweep(0.15, 0.6, 0.1)                          # headline, rug unrolls
tap(0.55); tap(0.68, 0.2); tap(0.8, 0.22)                            # figure assembles
pop(1.2, 620, 0.25)                                                  # speech bubble
pen(1.7, 0.9)                                                        # arabic written
pop(2.6, 880, 0.14); rise(3.25, 0.45, 600, 1200, 0.08)              # translation, YALNIZ underline
whoosh(4.6, 0.6, 0.24)                                               # bubble -> ribbon
tap(4.85, 0.15); sweep(5.1, 0.7, 0.08)                               # card, tree trunk grows
whoosh(5.6, 1.0, 0.2, 0.05); cloth(5.4, 1.0, 0.12)                   # ribbon flies
for k in range(8): pop(5.45 + k * 0.045, 520 + 40 * k, 0.05)         # canopy blobs
pop(5.95, 760, 0.16); click(6.4, 0.3); cloth(6.35, 0.6, 0.12)        # LENT highlight, knot tied
for k in range(8): pop(6.55 + k * 0.09, 950 + 60 * (k % 3), 0.06)    # other ribbons appear
tap(6.1, 0.18)                                                       # stones
thud(7.55, 0.35); pop(7.9, 600, 0.08); pop(8.4, 520, 0.08)           # ≠ and labels
crack(8.15, 0.3)                                                     # promise breaks
whoosh(9.4, 0.5, 0.16); cloth(9.2, 0.6, 0.1)                         # ribbons fall, card exits
sweep(10.25, 0.9, 0.2)                                               # ink circle wipe
click(10.3, 0.15)
for k in range(4): tap(10.45 + k * 0.09, 0.12)
tap(10.8, 0.12); tap(10.89, 0.12)
pop(11.0, 820, 0.2)                                                  # SÖZ pill
whoosh(12.0, 0.6, 0.18)                                              # pill -> tile
pop(12.3, 700, 0.15); sweep(12.9, 0.5, 0.08)                         # chip, verb tile wipe
click(13.35, 0.15); pop(13.7, 600, 0.08)                             # bracket, translation
click(14.65, 0.15)                                                   # AMMA AYƏDƏ
whoosh(15.5, 0.9, 0.24)                                              # pronoun arc to the front
for k in range(4): tap(16.05 + k * 0.1, 0.09)                        # can't stand alone (wobble)
whoosh(16.4, 0.35, 0.14, 0.15); click(16.6, 0.4); thud(16.6, 0.2)    # iyya clicks in
rise(17.3, 0.4, 500, 900, 0.06); thud(17.75, 0.3); pop(17.85, 990, 0.12)  # YALNIZ drops in
sweep(18.4, 0.5, 0.08); confirm(18.5, 0.12)                          # amber frame
whoosh(20.1, 0.8, 0.22)                                              # tiles -> nodes
for k in range(5): tap(20.3 + k * 0.08, 0.08)                        # headline words
pop(20.65, 560, 0.1); flow(20.9, 26.2, 0.035)                        # first connector
pop(21.0, 900, 0.18); whoosh(21.5, 0.7, 0.14)                        # second iyyakə travels
pop(21.75, 680, 0.14); pop(22.1, 560, 0.1)                           # KÖMƏK node, connector
pop(22.5, 760, 0.08)
for k in range(3): pop(23.0 + k * 0.12, 420 + k * 60, 0.12)          # temptations appear
pen(23.25, 0.6, 0.04)                                                # dashed lines draw
snap(24.15, 0.3); snap(24.2, 0.26); snap(24.26, 0.24)                # lines cut
for k in range(3): thud(24.9 + k * 0.08, 0.16)                       # icons fall
confirm(25.25, 0.16); rise(25.2, 0.6, 400, 800, 0.05)                # centre pulse
sweep(26.95, 0.8, 0.2)                                               # ivory wipe
tap(26.95, 0.12); tap(27.1, 0.12)
pop(27.3, 880, 0.1); pop(27.45, 980, 0.1)                            # Arabic highlights
pop(27.75, 700, 0.08); pop(27.95, 760, 0.08)                         # translation highlights
tap(27.75, 0.15); cloth(28.1, 0.8, 0.12); whoosh(28.6, 0.8, 0.14)    # ribbon unties and flies away
for k in range(4): tap(28.25 + k * 0.1, 0.08)
confirm(28.95, 0.18)                                                 # BİRİNCİ SİR ✓

out = out[: int(SR * DUR)]
out = out / max(1e-6, np.max(np.abs(out))) * 0.7
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok')
