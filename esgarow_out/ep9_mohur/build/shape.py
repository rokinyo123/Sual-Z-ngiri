"""Gain envelope on a music wav. usage: shape.py in.wav out.wav "t0:t1:g0:g1,..." (linear ramps; default gain 1)"""
import sys, wave, numpy as np
w = wave.open(sys.argv[1]); sr = w.getframerate(); ch = w.getnchannels(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float).reshape(-1, ch)
t = np.arange(len(a)) / sr; g = np.ones(len(a))
for seg in sys.argv[3].split(','):
    t0, t1, g0, g1 = map(float, seg.split(':')); m = (t >= t0) & (t < t1); g[m] = g0 + (g1 - g0) * (t[m] - t0) / max(1e-6, t1 - t0)
    g[t >= t1] = g1 if seg == sys.argv[3].split(',')[-1] else g[t >= t1]
o = wave.open(sys.argv[2], 'wb'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.clip(a * g[:, None], -32767, 32767).astype(np.int16).tobytes())
