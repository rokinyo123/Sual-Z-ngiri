"""SFX for ep6 kinetic sample. usage: sfx6.py tl.json sfx_lib.py out.wav sfxdir"""
import sys, subprocess, numpy as np
exec(open(sys.argv[2]).read())
SD = sys.argv[4]
def smp(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SD}/{name}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64); return a / (np.max(np.abs(a)) + 1e-9)
L = {n: smp(n) for n in ['whoosh', 'hit', 'crack', 'shatter', 'stamp', 'riser', 'reveal', 'chime', 'typing', 'click', 'bubble', 'whip', 'cascade']}
HEAVY = {'hit': 0.55, 'shatter': 0.5, 'cascade': 0.6, 'crack': 0.6, 'stamp': 0.7, 'whip': 0.7}
def s(n, t, g=0.3, d=None):
    g = g * HEAVY.get(n, 1.0); x = L[n] if d is None else L[n][: int(d * SR)] * np.linspace(1, 0, int(d * SR)) ** 0.5; add(x, t, g)
K = T['K']
# transitions
for c, kind in [(3.4, 'circle'), (6.42, 'bar'), (7.85, 'slide'), (13.45, 'circle'), (20.9, 'circle'), (24.35, 'push'), (27.7, 'bar')]:
    s('whoosh', c - 0.3, 0.28); s('whip' if kind in ('bar', 'push') else 'click', c - 0.05, 0.2)
# hook
s('whoosh', 0.0, 0.15, 0.6)
for i in range(9): s('click', 0.05 + i * 0.035, 0.08)
s('bubble', 0.25, 0.25); s('hit', K['son'], 0.35)
s('typing', K['cemi'], 0.15, 0.4)
for i in range(9): s('bubble', K['doqquz'] + i * 0.06, 0.15)
s('hit', K['doqquz'], 0.5); s('stamp', K['soz'] + 0.05, 0.35)
# 17
s('click', K['amma'], 0.2); s('whoosh', K['gunde'], 0.15, 0.5)
for i in range(17): add(tone(1800 + i * 70, 0.05, 0.012), K['on_yeddi'] + i * 0.72 / 17, 0.14)
s('hit', K['on_yeddi'] + 0.72, 0.5); s('chime', K['on_yeddi'] + 0.75, 0.15); s('click', K['defe'], 0.25); s('stamp', K['oxu'] + 0.05, 0.35)
# question
for i in range(8): s('click', K['menasini'] + i * 0.035, 0.07)
s('bubble', 6.62, 0.3); s('crack', K['bilir'], 0.3); s('hit', K['bilir'] + 0.05, 0.4)
# ayah
s('reveal', 7.8, 0.3); s('click', K['a1'] - 0.1, 0.2)
for i in range(1, 10): s('chime', K[f'a{i}'], 0.10); s('bubble', K[f'a{i}'] - 0.05, 0.12)
s('stamp', K['a9'] + 0.45, 0.45)
# road
s('riser', K['nemet'] + 0.1, 0.12, 1.7); s('reveal', K['verdik'] + 1.0, 0.3); s('chime', K['verdik'] + 1.1, 0.2); s('stamp', K['yoluna'] + 0.05, 0.3)
scratch(K['qezeb'], 0.6, 0.06); s('click', K['qezeb'] + 0.15, 0.2); s('crack', K['qezeb'] + 1.1, 0.3); s('hit', K['qezeb'] + 1.1, 0.3)
scratch(K['azan'], 0.6, 0.05); s('click', K['azan'] + 0.15, 0.2); s('crack', K['azan'] + 0.7, 0.3)
s('stamp', K['yox'], 0.55); s('hit', K['yox'], 0.4)
# sirr (frame break)
s('shatter', 19.78, 0.6); s('riser', 19.0, 0.1, 0.8); s('hit', K['sirr1'] + 0.15, 0.55); s('click', K['sirr1'] + 0.45, 0.25)
# prev
s('click', K['evvelki'], 0.2); s('bubble', K['evvelki'] + 0.35, 0.25); s('reveal', K['evvelki'] + 0.6, 0.25); s('whoosh', K['bizi'], 0.12, 0.5); s('stamp', K['bizi'] + 1.0, 0.3); s('typing', K['deyirik'], 0.12, 0.4); s('bubble', K['bizi'] + 0.3, 0.2)
# kimin
s('bubble', K['bu_aye'] + 0.2, 0.3); s('hit', K['kimin'], 0.5); s('whoosh', K['kimin'] + 0.45, 0.15); s('reveal', K['aciq'] - 0.1, 0.3); s('stamp', K['aciq'] + 0.05, 0.3)
# four groups
s('click', K['nemet2'], 0.2); s('typing', K['basqa'], 0.12, 0.5)
for i in range(4): s('bubble', K['basqa'] + 0.3 + i * 0.12, 0.18)
s('stamp', K['sayilir'], 0.35)
for k in ['peyg', 'sidd', 'sehid', 'saleh']: s('hit', K[k], 0.35); s('bubble', K[k] + 0.05, 0.25); s('chime', K[k] + 0.12, 0.12)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok')
