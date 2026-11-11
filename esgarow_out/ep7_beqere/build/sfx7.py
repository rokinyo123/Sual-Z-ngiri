"""SFX/ASMR for ep7 (calm). usage: sfx7.py tl.json sfx_lib.py out.wav sfxdir"""
import sys, subprocess, numpy as np
exec(open(sys.argv[2]).read())
SD = sys.argv[4]; K = T['K']; LEAD = 0.4
def smp(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SD}/{name}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64); return a / (np.max(np.abs(a)) + 1e-9)
S = {n: smp(n) for n in ['whoosh', 'hit', 'stamp', 'riser', 'reveal', 'chime', 'typing', 'click', 'bubble']}
HEAVY = {'hit': 0.45, 'stamp': 0.55}
def s(n, t, g=0.25, d=None):
    g *= HEAVY.get(n, 1.0); x = S[n] if d is None else S[n][: int(d * SR)] * np.linspace(1, 0, int(d * SR)) ** 0.5; add(x, t, g)
def L(k): return K[k] - LEAD
def fnoise(d, a):  # smoothed noise
    x = noise(d); k = int(1 / a); return np.convolve(x, np.ones(k) / k, 'same')
def paper(t, g=0.12):  # page rustle
    d = 0.5; x = (fnoise(d, 0.25) - fnoise(d, 0.04)) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 2 * (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, 40, int(d * SR)))))
    add(x / (np.abs(x).max() + 1e-9), t, g)
def tick(t, g=0.06): add(tone(3000, 0.04, 0.006) + 0.5 * tone(1800, 0.04, 0.01), t, g)
# scene transitions: soft whoosh + page rustle
for k in ['a_elif', 'sirr1', 'sirr2', 'sirr3', 'r_niye', 'mujde', 'serh', 'novbeti']:
    t0 = K[k] - 0.9; s('whoosh', t0, 0.12, 0.8); paper(t0 + 0.2)
# hook
s('reveal', 0.3, 0.18); s('whoosh', L('quran'), 0.08, 0.5); s('click', L('surasi') + 0.3, 0.12)
s('hit', L('uc'), 0.35); s('whoosh', L('uc') - 0.1, 0.1, 0.5)
for k in ['h_elif', 'h_lam', 'h_mim']: s('chime', L(k), 0.16); s('whoosh', L(k) - 0.1, 0.07, 0.4)
for i in range(8): tick(L('esr') + 0.3 + i * 0.5, 0.05)
s('whoosh', L('bes'), 0.08, 0.5); s('click', L('niye'), 0.12)
# ayah
for k in ['a_elif', 'a_lam', 'a_mim']: s('chime', L(k), 0.13)
for k in ['zalik', 'la', 'hudan']: s('reveal', L(k), 0.12)
for k in ['m_kitab', 'm_onda', 'm_mutt']: scratch(L(k), 0.6, 0.025)
s('click', L('m_mutt'), 0.12)
# sirr titles
for k in ['sirr1', 'sirr2', 'sirr3']: s('reveal', K[k] - 0.1, 0.2); add(tone(73.4, 2.5, 1.0) * 0.5, K[k], 0.12)
# sirr 1
for i in range(29): tick(L('s1_29') + 1.3 * (1 - (1 - i / 28) ** 2), 0.035)
s('typing', L('s1_say'), 0.08, 1.0)
for i in range(14): add(tone(1320 + i * 35, 0.25, 0.08), L('s1_14') + i * 0.09, 0.05)
s('click', L('s1_yari'), 0.12); s('bubble', L('s1_yari_w'), 0.12); s('chime', L('s1_allah_w') - 0.2, 0.18); s('reveal', L('s1_allah_w') - 0.2, 0.1)
# sirr 2
s('whoosh', L('s2_niye') + 0.6, 0.08, 0.5); paper(L('s2_kitab'), 0.14); s('stamp', L('s2_benz'), 0.25)
s('click', L('s2_21'), 0.12); scratch(L('s2_21') + 0.3, 0.9, 0.03); s('click', L('s2_21') + 1.0, 0.12)
s('reveal', L('s2_sure'), 0.14); s('chime', L('s2_sure') + 0.4, 0.1)
for i in range(6): tick(L('s2_14') + i * 0.5, 0.05)
s('stamp', L('s2_hec'), 0.3); s('hit', L('s2_hec'), 0.3)
# sirr 3: qalam ASMR
scratch(L('s3_bax'), 1.2, 0.04); s('bubble', L('s3_bax') + 0.4, 0.1)
s('chime', L('s3_la'), 0.1); s('chime', L('s3_la') + 0.3, 0.08); s('chime', L('s3_fih'), 0.1)
for i in range(2): s('bubble', L('s3_uc') + i * 0.25, 0.12)
s('reveal', L('s3_uc'), 0.1); s('click', L('s3_uc') + 0.2, 0.1); s('whoosh', L('s3_iki'), 0.08, 0.5)
s('click', L('s3_r1t'), 0.15); s('click', L('s3_r2t'), 0.15); s('bubble', L('s3_r1'), 0.1); s('bubble', L('s3_r2'), 0.1); s('chime', L('s3_iki_h'), 0.14)
# rain: soft rain bed
d = (K['r_quran'] + 1.5) - L('r_yagis'); r = fnoise(d, 0.3) - fnoise(d, 0.05)
e = np.minimum(1, np.arange(len(r)) / SR / 1.2) * np.minimum(1, (len(r) - np.arange(len(r))) / SR / 1.5)
add(r / (np.abs(r).max() + 1e-9) * e, L('r_yagis'), 0.09)
s('bubble', L('r_yagis'), 0.1); s('bubble', L('r_hazir'), 0.1); s('bubble', L('r_hazir') + 0.4, 0.1)
s('click', L('r_hazir') + 0.9, 0.12); s('click', L('r_hazir') + 1.3, 0.12)
s('reveal', L('r_qelb'), 0.14); s('chime', L('r_qelb') + 0.2, 0.1); s('click', L('r_unut'), 0.1); s('click', L('r_qoru'), 0.1)
# müjdə
s('reveal', L('mujde'), 0.16); s('chime', L('mujde') + 0.5, 0.12); s('click', L('m_10'), 0.12)
for k in ['m_e', 'm_l', 'm_m']: s('chime', L(k), 0.13); s('bubble', L(k) + 0.35, 0.14)
s('stamp', L('m_30'), 0.28); s('hit', L('m_30'), 0.28); s('chime', L('m_30') + 0.3, 0.12)
# comment + teaser
s('bubble', K['serh'] - 0.3, 0.14); s('click', L('serh_yaz'), 0.12); s('typing', L('serh_yaz') + 0.8, 0.08, 0.8)
s('whoosh', L('mutt_kim'), 0.08, 0.5)
for i in range(5): s('bubble', L('bes_elamet') + 0.3 + i * 0.15, 0.08)
s('chime', K['abune'] + 0.2, 0.16); s('click', K['abune'] + 1.0, 0.12)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok')
