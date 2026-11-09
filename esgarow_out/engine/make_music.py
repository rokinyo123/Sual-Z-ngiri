"""Scene-aware score: the base track (build -> silence -> hopeful) plus a rhythmic pulse that
speeds up at every new stop of the journey, impacts on the big reveals and a riser into the turn.

usage: python3 make_music.py timeline.json config.json out.wav
config: {"base": mp3, "journey": [keys where the tempo steps up], "impacts": [keys],
         "turn": key where everything cuts to silence, "hope": key where the hopeful part starts}
"""
import json, subprocess, sys
import numpy as np

T = json.load(open(sys.argv[1])); C = json.load(open(sys.argv[2])); OUT = sys.argv[3]
SR = 44100; DUR = T["_total"]; N = int(SR * DUR)
rng = np.random.default_rng(11)

def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def tt(d): return np.arange(int(d * SR)) / SR
def place(buf, sig, t, g=1.0):
    i = int(t * SR); n = min(len(sig), len(buf) - i)
    if n > 0 and i >= 0: buf[i:i + n] += sig[:n] * g
def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def fade(x, fi, fo):
    n = len(x); e = np.ones(n, np.float32)
    a, b = int(fi * SR), int(fo * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if b: e[-b:] = np.minimum(e[-b:], np.linspace(1, 0, b))
    return x * e

base = load(C["base"])
turn = T[C["turn"]][0]; hope0 = T[C["hope"]][0] - 0.7
out = np.zeros(N, np.float32)

# base build: loop the calm-to-tense section until the turn
build_len = turn - 0.3
seg = base[: int(44.3 * SR)]
loop = base[int(6 * SR): int(30 * SR)]
b = seg.copy()
while len(b) < build_len * SR:
    xf = int(3 * SR); b = np.concatenate([b[:-xf], b[-xf:] * np.linspace(1, 0, xf) + loop[:xf] * np.linspace(0, 1, xf), loop[xf:]])
place(out, fade(b[: int(build_len * SR)], 0.6, 1.2), 0, 0.8)
# hopeful part from the first ayah to the end
h = base[int(47.9 * SR): int(63.6 * SR)]
h2 = base[int(50.5 * SR): int(67.3 * SR)]
xf = int(3 * SR); hh = np.concatenate([h[:-xf], h[-xf:] * np.linspace(1, 0, xf) + h2[:xf] * np.linspace(0, 1, xf), h2[xf:]])
while len(hh) < (DUR - hope0) * SR: hh = np.concatenate([hh, h2])
place(out, fade(hh[: int((DUR - hope0) * SR)], 1.5, 3.0), hope0, 0.9)

# rhythmic pulse: kick on every beat, shaker on off-beats later on; tempo rises at every stop
kick_t = tt(0.22); kick = np.sin(2 * np.pi * np.cumsum(np.linspace(120, 42, len(kick_t))) / SR) * np.exp(-kick_t / 0.08)
shaker = lp(rng.standard_normal(int(0.05 * SR)), 0.6) - lp(rng.standard_normal(int(0.05 * SR)), 0.2)
shaker = shaker * np.exp(-tt(0.05) / 0.015)
stops = [T[k][0] - 0.2 for k in C["journey"]]
end = turn - 0.3
bpm0, step = 74, 6
pulse = np.zeros(N, np.float32)
for si, s0 in enumerate(stops):
    s1 = stops[si + 1] if si + 1 < len(stops) else end
    bpm = bpm0 + step * si; per = 60 / bpm; t = s0
    vol = 0.45 + 0.55 * si / max(1, len(stops) - 1)
    while t < min(s1, end):
        place(pulse, kick, t, vol)
        if si >= 3: place(pulse, shaker, t + per / 2, 0.25 * vol)
        t += per
place(out, pulse, 0, 0.55)

# impacts on the big reveals, each preceded by a short reverse swell
boom_t = tt(1.6); boom = (np.sin(2 * np.pi * 38 * boom_t) * 0.9 + lp(rng.standard_normal(len(boom_t)), 0.02) * 2) * np.exp(-boom_t / 0.45)
for k in C["impacts"]:
    t0 = T[k][0] + C.get("impact_offset", 0.0)
    sw = lp(rng.standard_normal(int(0.6 * SR)), 0.08) * np.linspace(0, 1, int(0.6 * SR)) ** 3
    place(out, sw, t0 - 0.6, 0.35); place(out, boom, t0, 0.5)

# riser into the turn, then hard silence
rd = 2.6; r_t = tt(rd)
riser = lp(rng.standard_normal(len(r_t)), 0.05) * (r_t / rd) ** 2 + np.sin(2 * np.pi * np.cumsum(np.linspace(150, 900, len(r_t))) / SR) * 0.15 * (r_t / rd) ** 2
place(out, riser, turn - rd - 0.05, 0.45)
cut0, cut1 = int((turn - 0.05) * SR), int(hope0 * SR)
d = int(0.15 * SR); out[cut0:cut0 + d] *= np.linspace(1, 0, d); out[cut0 + d:cut1] = 0  # hard drop, silence until the hope part
place(out, boom, turn, 0.6)  # the drop itself lands as one deep hit

out = out / max(1e-6, np.max(np.abs(out))) * 0.89
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", OUT], input=pcm.tobytes(), check=True)
print("music ok", round(DUR, 2), "turn", round(turn, 2), "hope", round(hope0, 2))
