"""SFX for episode 5: recorded samples from video-effects-skill (public/sfx) + a few synthesized textures. No music."""
import sys, subprocess, json, numpy as np
exec(open(sys.argv[2]).read())          # sfx_lib (add, tone, noise, scratch, ...) – reads T from argv[1]
SD = sys.argv[4]
def smp(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SD}/{name}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64); return a / (np.max(np.abs(a)) + 1e-9)
L = {n: smp(n) for n in ['whoosh', 'hit', 'crack', 'shatter', 'stamp', 'riser', 'reveal', 'chime', 'typing', 'click', 'bubble', 'whip', 'cascade']}
HEAVY = {'hit': 0.55, 'shatter': 0.5, 'cascade': 0.6, 'crack': 0.6, 'stamp': 0.7, 'whip': 0.7}
def s(n, t, g=0.3, d=None):
    g = g * HEAVY.get(n, 1.0)
    x = L[n] if d is None else L[n][: int(d * SR)] * np.linspace(1, 0, int(d * SR)) ** 0.5
    add(x, t, g)
K = {k: v[0] for k, v in T.items() if k != '_total'}
# HOOK
s('cascade', 0.0, 0.35); s('riser', 0.0, 0.12, 1.4); s('hit', 1.45, 0.3)
s('click', K['ilk'] - 0.1, 0.25); s('hit', K['altinci'], 0.45); s('whoosh', K['altinci'] - 0.25, 0.2)
for i in range(3): s('click', K['cemi'] + 0.05 + i * 0.2, 0.3); s('whoosh', K['cemi'] + i * 0.2 - 0.1, 0.1, 0.4)
s('stamp', K['ucsoz'] + 0.35, 0.45)
s('whoosh', K['gunde'] - 0.3, 0.2)
for i in range(5): s('bubble', K['gunde'] + 0.1 + i * 0.2, 0.22)
s('riser', K['defe'] - 1.1, 0.18, 1.2); s('hit', K['defe'] + 0.15, 0.6); s('whoosh', K['defe'], 0.2)
s('whip', K['amma'], 0.25); s('crack', K['menasini'], 0.3); s('click', K['menasini'] + 0.25, 0.25); s('hit', K['menasini'] + 0.2, 0.4)
s('reveal', K['ihdina'] - 0.3, 0.35); s('chime', K['ihdina'] + 0.2, 0.25); s('chime', K['bizi'], 0.15)
s('riser', K['bizi'] + 0.6, 0.15, 2.0)
# SIRR 1: line drawn in sand
s('hit', K['sirr1'] + 0.05, 0.5); s('whoosh', K['birgun'], 0.15)
scratch(K['xett'], 1.8, 0.09); s('click', K['allahin'], 0.3); s('chime', K['allahin'] + 0.05, 0.12)
for i in range(8): scratch(K['sagina'] + i * 0.32, 0.6, 0.05); s('click', K['sagina'] + i * 0.32 + 0.6, 0.1)
s('click', K['bunlar'], 0.2); s('click', K['bunlar'] + 0.2, 0.2)
for i in range(8): s('bubble', K['seytan'] + i * 0.12, 0.08)
add(tone(55, 3.0, 1.2) * 0.6, K['seytan'], 0.25)
s('reveal', K['ayeni'] - 0.2, 0.3); s('crack', K['basqa'], 0.3); s('stamp', K['basqa'] + 0.1, 0.45)
# SIRR 2: word cards + glass lens
s('riser', K['sirr2'] - 0.9, 0.15, 0.9); s('hit', K['sirr2'], 0.5)
for t0, tm in [(K['ihd'], K['ihd_m']), (K['sirat'], K['sirat_m']), (K['mustaqim'], K['mus_m'])]:
    s('whoosh', t0 - 0.35, 0.15); s('click', t0 - 0.15, 0.3); s('bubble', t0 + 0.1, 0.18); s('click', tm, 0.22); s('whoosh', tm, 0.08, 0.4)
# crossroads
s('click', K['diqqet'] + 0.05, 0.25); s('reveal', K['tek'] - 0.2, 0.3); s('stamp', K['tek'] + 0.4, 0.4)
s('hit', K['bir_yol'], 0.45); s('whip', K['cox'] - 0.1, 0.3); s('hit', K['cox'] + 0.1, 0.45); s('stamp', K['cox'] + 0.25, 0.35)
s('crack', K['subul'], 0.3); s('click', K['subul'] + 0.1, 0.3); s('click', K['yollar'], 0.25)
# SIRR 3: rakat counter + lantern
s('riser', K['sirr3'] - 0.9, 0.15, 0.9); s('hit', K['sirr3'], 0.5); s('whoosh', K['bes_biz'], 0.15)
s('hit', K['niye'], 0.45)
for i in range(16): add(tone(2600 + i * 40, 0.04, 0.008), K['rukat'] + i * 1.1 / 16, 0.12)
s('hit', K['rukat'] + 1.15, 0.35); s('stamp', K['cunki'] + 0.6, 0.4)
s('reveal', K['yolda'] - 0.2, 0.3); s('chime', K['yolda'] + 0.2, 0.2); s('hit', K['allahin_k'], 0.4)
# hadith
s('whoosh', K['quran_d'] - 0.2, 0.15); s('reveal', K['quran_d'] + 0.7, 0.25); s('hit', K['artirar'] - 0.5, 0.3); s('hit', K['artirar'], 0.45); s('chime', K['artirar'] + 0.2, 0.2)
s('whoosh', K['qulum'] - 0.45, 0.2); s('hit', K['qulum'], 0.5); s('click', K['verilecek'], 0.3); s('chime', K['verilecek'] + 0.7, 0.25)
# comment
s('bubble', K['serh'] + 0.05, 0.3); s('hit', K['yoldan'], 0.45); s('hit', K['yoldan'] + 0.4, 0.45)
for i in range(5): s('bubble', K['yoldan'] + 0.7 + i * 0.16, 0.2)
s('typing', K['bir_sozle'], 0.25, 1.1); s('bubble', K['bir_sozle'] + 1.0, 0.2)
# next: frame break
s('shatter', K['novbeti'] - 0.02, 0.6); s('click', K['novbeti'] + 0.4, 0.2); s('hit', K['son_aye'], 0.45)
s('hit', K['uc_qrup'], 0.45)
for i in range(3): s('bubble', K['uc_qrup'] + 0.4 + i * 0.2, 0.2)
s('whip', K['hansinda'] - 0.15, 0.3); s('hit', K['hansinda'], 0.55)
s('chime', K['abune'] - 0.4, 0.3); s('click', K['abune'] + 0.3, 0.2)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok')
