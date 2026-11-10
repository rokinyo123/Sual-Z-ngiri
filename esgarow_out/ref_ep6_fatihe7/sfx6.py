"""SFX for episode 6: recorded samples (engine/sfx) + synthesized textures. No music."""
import sys, subprocess, json, wave, numpy as np
exec(open(sys.argv[2]).read())          # sfx_lib: add, tone, scratch, ... (reads T from argv[1])
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
K = {k: v[0] for k, v in T.items() if k != '_total' and not k.startswith('cut_')}
# seams: each transition type has its own sound
for k, v in T.items():
    if not k.startswith('cut_'): continue
    t0, ty = v
    if ty == 'zoom': s('riser', t0 - 0.9, 0.14, 0.9); s('whoosh', t0 - 0.3, 0.25); s('hit', t0 + 0.05, 0.35)
    if ty == 'inv': s('whoosh', t0 - 0.3, 0.22); s('hit', t0 + 0.05, 0.3)
    if ty == 'whip': s('whip', t0 - 0.2, 0.35)
    if ty == 'blur': s('whoosh', t0 - 0.35, 0.12); s('reveal', t0 - 0.1, 0.18)
    if ty == 'wipe': s('whoosh', t0 - 0.25, 0.2); s('hit', t0, 0.45)
    if ty == 'break': s('shatter', t0 - 0.02, 0.6)
# HOOK
s('cascade', 0.0, 0.35); s('riser', 0.0, 0.12, 1.4); s('hit', 1.45, 0.3)
s('click', K['quran'], 0.25); s('hit', K['son'] - 0.15, 0.45); s('whoosh', K['son'] - 0.4, 0.2)
for i in range(4): s('click', K['uzun'] - 0.3 + i * 0.08, 0.12)
for i in range(9): s('bubble', K['cemi'] + i * 0.09, 0.14)
for i in range(8): add(tone(2400 + i * 60, 0.04, 0.008), K['doqquz'] - 0.2 + i * 0.12, 0.12)
s('stamp', K['soz'], 0.45)
s('whoosh', K['bu_doqquz'] - 0.2, 0.15); s('hit', K['uc_qrup'], 0.45)
for i in range(3): s('reveal', K['uc_qrup'] + 0.15 + i * 0.18, 0.12, 0.8); s('click', K['uc_qrup'] + 0.2 + i * 0.18, 0.2)
s('crack', K['hansinda'], 0.3); s('hit', K['hansinda'] + 0.05, 0.45)
# AYAH
s('chime', K['ayah'] + 0.1, 0.2); s('chime', K['gayril'], 0.12); s('chime', K['veled'], 0.12)
s('reveal', K['nemet'] - 0.2, 0.2); s('click', K['nemet'] + 1.3, 0.25)
s('whoosh', K['qezebe'] - 0.2, 0.12); add(tone(60, 2.0, 0.8) * 0.5, K['qezebe'], 0.2)
s('whoosh', K['azan'] - 0.2, 0.1); s('stamp', K['yox'], 0.45)
# WORD BY WORD
s('hit', K['sozsoz'] + 0.05, 0.35)
for k in ['w1', 'w2', 'w3', 'w4', 'w5', 'w6']: s('whoosh', K[k] - 0.35, 0.1, 0.4); s('click', K[k] - 0.25, 0.3); s('bubble', K[k], 0.15)
s('crack', K['w4'] + 0.05, 0.2)
# SIRR 1
s('hit', K['sirr1'] + 0.1, 0.45); s('whoosh', K['kimdir'] - 0.1, 0.15); s('hit', K['kimdir'] + 0.9, 0.45)
s('reveal', K['quran_ozu'] - 0.1, 0.2); s('chime', K['p1'] - 0.1, 0.15)
for k in ['p1', 'p2', 'p3', 'p4']: s('click', K[k] - 0.1, 0.3); add(tone({'p1': 523, 'p2': 659, 'p3': 784, 'p4': 1047}[k], 0.6, 0.25), K[k], 0.12)
s('whoosh', K['yoldas'] - 0.4, 0.15); s('chime', K['yoldas'], 0.2)
# companions
for i in range(10): add(click * 0.8, K['yeni'] + 0.6 + i * 0.45, 0.25); scratch(K['yeni'] + 0.6 + i * 0.45, 0.12, 0.03)
s('hit', K['yol_tek'] - 0.1, 0.35); scratch(K['yol_tek'] + 0.6, 0.3, 0.06); s('hit', K['yoldasi'], 0.5); s('chime', K['yoldasi'] + 0.2, 0.15)
# SIRR 2
s('hit', K['sirr2'] + 0.1, 0.45); s('whoosh', K['nemetden'], 0.12)
s('whoosh', K['enamte'] - 0.2, 0.2); s('reveal', K['enamte'], 0.15); s('click', K['sen_verdin'], 0.25); s('chime', K['sen_verdin'] + 0.4, 0.2)
s('whoosh', K['amma_q'], 0.12); s('click', K['sen_qez'] - 0.1, 0.25); scratch(K['sen_qez'] + 0.7, 0.3, 0.07); s('crack', K['sen_qez'] + 0.75, 0.3)
s('whoosh', K['sadece'] - 0.1, 0.15); s('chime', K['sadece'] + 0.4, 0.15)
s('whoosh', K['azanlar'], 0.12); s('click', K['sen_azd'] - 0.1, 0.25); scratch(K['sen_azd'] + 0.6, 0.3, 0.07); s('crack', K['sen_azd'] + 0.65, 0.3); s('stamp', K['sen_azd'] + 0.9, 0.35)
s('riser', K['yaxsiliq'] - 1.0, 0.12, 1.0); s('reveal', K['yaxsiliq'] - 0.2, 0.3); s('hit', K['yaxsiliq'] + 0.5, 0.4); s('stamp', K['edebi'], 0.4)
# SIRR 3
s('hit', K['sirr3'] + 0.1, 0.45); s('whoosh', K['alimler'], 0.15)
s('click', K['qezebe_ugr'], 0.25); s('bubble', K['bilib'], 0.2); s('click', K['bilib'] + 0.3, 0.25); s('bubble', K['etmeyen'], 0.2); s('crack', K['etmeyen'] + 0.3, 0.25)
s('click', K['azan2'], 0.25); s('bubble', K['emel_eden'], 0.2); s('click', K['emel_eden'] + 0.3, 0.25); s('bubble', K['bilmeden'], 0.2); s('crack', K['bilmeden'] + 0.3, 0.25)
s('whoosh', K['biri1'], 0.1); s('whoosh', K['biri2'], 0.1)
# MERGE
scratch(K['dogru'] + 0.2, 2.3, 0.06); s('hit', K['dogru'] + 0.95, 0.4)
s('click', K['bilmek'], 0.25); s('click', K['etmek'], 0.25); s('riser', K['etmek'] - 0.3, 0.12, 0.8); s('reveal', K['etmek'] + 0.3, 0.3); s('chime', K['etmek'] + 1.1, 0.25)
s('whoosh', K['elmsiz'] - 0.2, 0.15); s('click', K['elmsiz'], 0.25); s('whoosh', K['ibadetsiz'] - 0.2, 0.15); s('click', K['ibadetsiz'], 0.25); s('hit', K['qezebe_ap'], 0.4)
# AMIN
s('hit', K['amin'], 0.6); s('chime', K['amin'] + 0.1, 0.3); add(tone(55, 2.5, 1.0) * 0.6, K['amin'], 0.25)
s('click', K['deyil'], 0.2); s('reveal', K['peyg'] - 0.1, 0.2); s('whoosh', K['imam'] - 0.3, 0.2); s('click', K['imam'], 0.2); s('hit', K['siz_de'], 0.45); s('chime', K['siz_de'] + 0.1, 0.2)
# ANGELS
s('reveal', K['melek'] - 0.2, 0.25); s('chime', K['melek'], 0.15); s('chime', K['uygun'], 0.12)
s('click', K['kecmis'] - 0.1, 0.25); s('riser', K['bagis'] - 1.0, 0.12, 0.9); s('hit', K['bagis'], 0.5); s('chime', K['bagis'] + 0.1, 0.3)
# 7 AYAH + COMMENT
for i in range(7): add(tone(1800 + i * 120, 0.05, 0.01), K['yeddi'] + 0.1 + i * 0.12, 0.14)
s('stamp', K['her_biri'], 0.45)
s('hit', K['bes'] + 0.7, 0.4); s('bubble', K['bilmek_q'] - 0.1, 0.25); s('bubble', K['etmek_q'] - 0.1, 0.25); s('click', K['etmek_q'] + 0.3, 0.25)
s('typing', K['serh'], 0.25, 1.1); s('bubble', K['serh'] + 1.0, 0.2)
# NEXT
s('hit', K['fatihe'] + 0.05, 0.4); s('stamp', K['fatihe'] + 0.45, 0.4)
s('click', K['novbeti'], 0.2); s('hit', K['en_boyuk'], 0.45); s('riser', K['hansidir'] - 1.0, 0.14, 1.0); s('crack', K['hansidir'] - 0.1, 0.3); s('hit', K['hansidir'], 0.55)
s('chime', K['abune'] - 0.4, 0.3); s('click', K['abune'] + 0.3, 0.2)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok')
