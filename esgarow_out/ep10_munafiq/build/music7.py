"""Calm Islamic ambient bed, synthesized: D Hijaz drone + slow pads + sparse soft bells + air, long reverb. No percussion.
usage: music7.py duration out.wav"""
import sys, wave, numpy as np
DUR = float(sys.argv[1]); OUT = sys.argv[2]; SR = 44100; N = int(SR * DUR)
rng = np.random.default_rng(int(sys.argv[3]) if len(sys.argv) > 3 else 7); t = np.arange(N) / SR
f = lambda m: 440 * 2 ** ((m - 69) / 12)        # midi -> Hz
def env(n, a, r):
    e = np.ones(n); ai, ri = min(int(a * SR), n // 2), min(int(r * SR), n // 2); e[:ai] = np.linspace(0, 1, ai) ** 2; e[-ri:] *= np.linspace(1, 0, ri) ** 2; return e
def voice(freq, n, bright=0.35):
    x = np.arange(n) / SR; v = np.zeros(n)
    for h, g in [(1, 1), (2, bright), (3, bright * 0.45), (4, bright * 0.2)]:
        for det in (-0.12, 0.12):
            v += g * np.sin(2 * np.pi * freq * h * (1 + det / 100) * x + rng.uniform(0, 6.28))
    return v
out = np.zeros(N)
# drone D2 + A2, slow breathing
out += 0.20 * (np.sin(2 * np.pi * f(38) * t) + 0.6 * np.sin(2 * np.pi * f(45) * t) + 0.25 * np.sin(2 * np.pi * f(50) * t)) * (0.75 + 0.25 * np.sin(2 * np.pi * t / 11))
# pad chords in D Hijaz (D Eb F# G A Bb C): D, Eb, Cm, D
CH = [[50, 54, 57, 62], [51, 55, 58, 63], [48, 51, 55, 60], [50, 54, 57, 62], [55, 58, 62, 67], [51, 55, 58, 63], [50, 54, 57, 62]]
L = 10.0; i = 0; st = 0.0
while st < DUR:
    n = int(min(L + 3, DUR - st) * SR)
    if n > SR:
        ch = CH[i % len(CH)]; seg = sum(voice(f(m), n) for m in ch) * env(n, 3.0, 3.0) * 0.05
        a = int(st * SR); out[a:a + n] += seg[: N - a]
    st += L; i += 1
# sparse soft bells on the Hijaz scale (higher octave)
SC = [62, 63, 66, 67, 69, 70, 72, 74]; tb = 4.0
while tb < DUR - 3:
    m = SC[rng.integers(len(SC))]; n = int(4 * SR); x = np.arange(n) / SR
    b = (np.sin(2 * np.pi * f(m) * x) + 0.4 * np.sin(2 * np.pi * f(m) * 2.76 * x) + 0.15 * np.sin(2 * np.pi * f(m) * 5.4 * x)) * np.exp(-x * 1.6) * np.minimum(1, x / 0.01)
    a = int(tb * SR); out[a:a + n] += 0.045 * b[: N - a]
    tb += rng.uniform(3.5, 6.5)
# air
air = rng.standard_normal(N); k = np.ones(400) / 400; air = np.convolve(air, k, 'same'); out += 0.015 * air / (np.abs(air).max() + 1e-9)
# reverb: FFT convolution with a decaying noise IR (2.4 s)
ir_n = int(2.4 * SR); ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR * 2.6); ir[0] = 1.0
M = 1 << int(np.ceil(np.log2(N + ir_n)))
wet = np.fft.irfft(np.fft.rfft(out, M) * np.fft.rfft(ir / np.abs(ir).sum() * 30, M), M)[:N]
mix = 0.55 * out + 0.45 * wet
mix *= env(N, 2.5, 3.0); mix = mix / np.abs(mix).max() * 0.8
pcm = (np.repeat(mix[:, None], 2, 1) * 32767).astype(np.int16)
with wave.open(OUT, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('music ok', DUR)
