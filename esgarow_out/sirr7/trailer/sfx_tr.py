import sys, subprocess, numpy as np
exec(open('sfx_lib.py').read())
def smp(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'sfx/{name}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64); return a / (np.max(np.abs(a)) + 1e-9)
Ls = {n: smp(n) for n in ['whoosh', 'hit', 'shatter', 'riser', 'reveal', 'whip', 'crack', 'cascade']}
def s(n, t, g=0.3, d=None):
    x = Ls[n] if d is None else Ls[n][:int(d * SR)] * np.linspace(1, 0, int(d * SR)) ** 0.5
    add(x, t, g)
def braam(t, g=0.6, d=2.6):  # low brassy trailer hit
    x = tt(d); sig = np.zeros_like(x)
    for f, a in [(43.65, 1), (87.3, 0.6), (65.4, 0.45), (130.8, 0.25), (174.6, 0.12)]:
        ph = (x * f) % 1; sig += a * (2 * ph - 1)
    sig = lp(sig, 0.04) * np.exp(-x / (d * 0.45)) * np.clip(x / 0.03, 0, 1)
    add(sig / np.max(np.abs(sig)), t, g); add(Ls['hit'], t, g * 0.35)
K = {k: v[0] for k, v in T.items() if k != '_total'}
add(tone(41, 12, 20) * 0.5, 0.0, 0.12)
s('hit', 0.0, 0.35); add(tone(30, 6, 6) * 0.6, 0.0, 0.2)          # instant impact on frame 1
s('riser', K['ulduzun'] - 1.2, 0.15, 1.2); braam(K['ureyinde'], 0.6); s('shatter', K['ureyinde'] + 0.02, 0.2)
s('whoosh', K['c1'] - 0.3, 0.2); add(tone(55, 9, 20) * 0.5, K['c1'], 0.08)
s('whip', K['c2'] - 0.2, 0.2); s('hit', K['mikro'], 0.15); s('crack', K['mikro'] + 0.45, 0.15); s('hit', K['tele'], 0.15); s('crack', K['tele'] + 0.45, 0.15)
s('reveal', K['c4'] - 0.1, 0.25); braam(K['yeddi'], 0.5, 2.0)
for it in ['barmaq', 'deniz', 'ari', 'imper', 'firon', 'demir', 'herfler']: s('whip', K[it] - 0.15, 0.2); s('hit', K[it] - 0.1, 0.3)
rumble(K['herfler'], K['c5_end'], 0.3)
s('crack', K['amma'], 0.3); heartbeat(K['c6'], K['c6_end'], 0.9)
s('whip', K['sonuncu'] - 0.15, 0.2); s('hit', K['cunki'] + 0.2, 0.35); s('riser', K['c6_end'] - 1.6, 0.15, 1.6)
braam(K['c6_end'] + 0.1, 0.9, 3.5); s('cascade', K['c6_end'] + 0.15, 0.15)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
