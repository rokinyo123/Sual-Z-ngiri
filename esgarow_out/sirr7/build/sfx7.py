"""SFX for 'Qurandakı 7 sirr' (16:9): recorded samples + synthesized textures. No music."""
import sys, subprocess, numpy as np
exec(open(sys.argv[2]).read())
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
def card(t):  # sirr chapter card
    s('riser', t - 1.0, 0.14, 1.0); s('hit', t + 0.05, 0.5); s('whoosh', t - 0.15, 0.2); s('click', t + 0.4, 0.3); s('chime', t + 0.6, 0.15)
def ay(t): s('reveal', t - 0.1, 0.22); s('chime', t + 0.5, 0.1)
def chipS(t, g=0.22): s('click', t, g); s('whoosh', t - 0.1, 0.06, 0.3)
def popS(t, g=0.2): s('bubble', t, g); s('whoosh', t - 0.1, 0.07, 0.35)
def tick_run(t0, d, n, f=2600, g=0.12):
    for i in range(n): add(tone(f + i * 25, 0.04, 0.008), t0 + i * d / n, g)
# ---------------- HOOK
s('cascade', 0.0, 0.35); s('riser', 0.0, 0.12, 1.4); s('hit', 1.45, 0.3)
tick_run(K['h_14esr'] - 0.1, 0.9, 14); s('hit', K['h_14esr'] + 0.8, 0.4)
popS(K['h_mikro'] - 0.15); s('crack', K['h_mikro'] + 0.5, 0.25); popS(K['h_tele'] - 0.15); s('crack', K['h_tele'] + 0.45, 0.25)
s('whoosh', K['h_okean'] - 0.2, 0.25); bubbles(K['h_okean'], K['h_ulduz'], 7, 0.1); add(tone(48, 2.4, 1.0) * 0.5, K['h_okean'], 0.25)
s('hit', K['h_ulduz'] + 0.1, 0.5); rumble(K['h_ulduz'], K['h_amma'], 0.25); popS(K['h_ulduz'] + 0.2)
s('reveal', K['h_amma'], 0.3)
for i in range(7): s('whoosh', K['h_ayeler'] + 0.1 + i * 0.28, 0.08, 0.5); s('bubble', K['h_ayeler'] + 0.4 + i * 0.28, 0.12)
s('whoosh', K['h_29'] - 0.2, 0.2); tick_run(K['h_29n'] - 0.1, 1.1, 29, 2400, 0.08); s('hit', K['h_29n'] + 1.1, 0.45)
popS(K['h_14'] + 0.2); chipS(K['h_14'] + 0.6)
for i in range(7): s('click', K['h_7'] + 0.2 + i * 0.33, 0.22); s('chime', K['h_7'] + 0.25 + i * 0.33, 0.06)
s('riser', K['h_7n'] - 1.0, 0.15, 1.0); s('hit', K['h_7n'] + 0.1, 0.6); s('cascade', K['h_7n'] + 0.15, 0.2)
s('stamp', K['h_zorla'] + 0.4, 0.4); chipS(K['h_aye']); chipS(K['h_aye'] + 1.0); s('whoosh', K['h_netice'], 0.15)
s('whip', K['h_sert'] - 0.05, 0.3); s('crack', K['h_sert'] + 0.05, 0.3); heartbeat(K['h_sert'], K['h_sonuncu'] + 1.5, 0.9)
chipS(K['h_sonuncu'] + 0.2); rumble(K['h_sonuncu'], K['h_sual'], 0.25)
s('hit', K['h_sual'] + 0.3, 0.5); s('crack', K['h_sual'] + 0.3, 0.3)
# ---------------- SIRR 1
card(K['s1']); s('hit', K['s1_herfi'], 0.5); s('chime', K['s1_herfi'] + 0.1, 0.2)
breeze(K['s1_mushrik'], K['s1_aye'], 0.12); ay(K['s1_sumuk']); chipS(K['s1_qiyame'] - 2.9); ay(K['s1_aye']); ay(K['s1_beli']); s('stamp', K['s1_beli'] + 0.05, 0.45)
ay(K['s1_barmaq']); s('chime', K['s1_ucunu'], 0.2)
chipS(K['s1_diqqet']); heartbeat(K['s1_ureyi'] - 0.2, K['s1_beyni'], 0.5); s('crack', K['s1_ureyi'] + 0.35, 0.25); popS(K['s1_beyni'] - 0.2); s('crack', K['s1_beyni'] + 0.35, 0.25)
popS(K['s1_barm2']); s('hit', K['s1_barm2'] + 0.1, 0.45); s('chime', K['s1_barm2'] + 0.4, 0.25)
for k in ['s1_1880', 's1_1905']: s('click', K[k] + 0.2, 0.3); s('whoosh', K[k], 0.1)
s('click', K['s1_1892'], 0.3); popS(K['s1_shubhe']); popS(K['s1_shubhe'] + 0.25); s('stamp', K['s1_eyni'] + 0.3, 0.45)
popS(K['s1_yeni'] + 0.1); s('stamp', K['s1_imza'] + 0.3, 0.45); s('hit', K['s1_imza'] + 0.35, 0.35)
pageflip(K['s1_tefsir']); chipS(K['s1_tefsir'] + 0.2); zap(K['s1_bugun']); chipS(K['s1_bugun'] + 0.1); blips(K['s1_bugun'] + 0.3, K['s1_bugun'] + 2, 0.05); s('hit', K['s1_bugun'] + 1.2, 0.4)
s('crack', K['s1_tesaduf'] + 0.1, 0.35); s('hit', K['s1_tesaduf'] + 0.1, 0.45)
# ---------------- SIRR 2
card(K['s2']); water(K['s2_rehman'], K['s2_ceb'], 0.07); chipS(K['s2_rehman'] + 0.1); ay(K['s2_aye']); ay(K['s2_sedd'])
s('whoosh', K['s2_ceb'], 0.25); chipS(K['s2_ceb'] + 1.8); s('chime', K['s2_ceb'] + 1.6, 0.15)
s('whoosh', K['s2_duzlu'] - 0.1, 0.2); water(K['s2_duzlu'], K['s2_durust'], 0.1); chipS(K['s2_duzlu'] + 1.2); chipS(K['s2_asagi'] + 0.6); chipS(K['s2_asagi'] + 1.8)
s('hit', K['s2_iki'], 0.4); s('stamp', K['s2_kecid'] + 0.2, 0.45); shimmer(K['s2_kecid'] + 0.3, 1.2, 0.1)
s('stamp', K['s2_durust'] + 0.05, 0.45); chipS(K['s2_hereri'] + 0.1); chipS(K['s2_hereri'] + 0.8); chipS(K['s2_hereri'] + 1.2)
ay(K['s2_aye2'] - 0.1); s('crack', K['s2_aye2'] + 1.2, 0.25); s('chime', K['s2_aye2'] + 2.6, 0.25)
s('whoosh', K['s2_20esr'], 0.2); chipS(K['s2_20esr'] + 0.2); breeze(K['s2_sehra'], K['s3'] - 0.5, 0.1); s('crack', K['s2_sehra'] + 1.2, 0.3); s('hit', K['s2_sehra'] + 1.2, 0.4)
# ---------------- SIRR 3
card(K['s3']); buzz(K['s3'] + 0.5, K['s3_kisi'], 0.07); s('hit', K['s3_nehl'], 0.4); s('chime', K['s3_nehl'] + 0.1, 0.15)
ay(K['s3_evler'] - 0.2); ay(K['s3_ye'])
for i in range(3): popS(K['s3_qadin'] - 0.2 + i * 0.35)
shimmer(K['s3_qadin'] + 1.4, 1.0, 0.1); chipS(K['s3_qadin'] + 1.6); s('whoosh', K['s3_qadin'] + 2.4, 0.12)
buzz(K['s3_bio'], K['s3_durust'], 0.05); chipS(K['s3_bio'] + 0.1); popS(K['s3_disi'] + 0.2); s('chime', K['s3_disi'] + 1.2, 0.2); popS(K['s3_erkek'] + 0.1); s('crack', K['s3_erkek'] + 2.2, 0.25)
s('stamp', K['s3_durust'] + 0.05, 0.45); chipS(K['s3_dogru'] + 0.1); chipS(K['s3_secib'] + 0.2)
s('crack', K['s3_tesaduf'] + 0.1, 0.35); s('hit', K['s3_tesaduf'] + 0.1, 0.45)
# ---------------- SIRR 4
card(K['s4']); chipS(K['s4_sened'] + 0.3); pageflip(K['s4_sened'])
tick_run(K['s4_614'], 0.9, 14, 2000); s('hit', K['s4_614'] + 0.9, 0.5); rumble(K['s4_614'], K['s4_misir'], 0.3); popS(K['s4_fars'] + 0.3); popS(K['s4_fars'] + 0.6); chipS(K['s4_fars'] + 1.4)
s('whoosh', K['s4_misir'], 0.2); tick_run(K['s4_misir'], 0.6, 5, 1800); s('stamp', K['s4_cokus'] + 0.2, 0.4)
popS(K['s4_musrik'] + 0.2); popS(K['s4_musrik'] + 0.4); s('chime', K['s4_odp'] + 0.7, 0.15); s('crack', K['s4_odp'] + 0.9, 0.25)
chipS(K['s4_nazil'] + 0.2); ay(K['s4_rum']); ay(K['s4_amma']); s('whoosh', K['s4_amma'] + 3.4, 0.12)
s('hit', K['s4_bid'] + 0.1, 0.45)
for i in range(7): s('click', K['s4_bid'] + 1.6 + i * 0.22, 0.25)
s('chime', K['s4_bid'] + 3.2, 0.2); popS(K['s4_ebubekr'] + 0.3); chipS(K['s4_ebubekr'] + 0.6)
rumble(K['s4_622'], K['s4_qafqaz'], 0.35); s('click', K['s4_622'] - 0.4, 0.3); s('click', K['s4_622'] + 0.6, 0.3); s('click', K['s4_627'] + 0.4, 0.3); s('hit', K['s4_627'] + 1.2, 0.45); chipS(K['s4_622'] + 1.6)
breeze(K['s4_qafqaz'], K['s4_atro'] + 0.6, 0.12); chipS(K['s4_qafqaz'] + 0.3); chipS(K['s4_qafqaz'] + 2.4)
scratch(K['s4_atro'] + 0.9, K['s4_qelebe'] - K['s4_atro'] - 1.1, 0.07); s('hit', K['s4_qelebe'] - 0.2, 0.35)
s('reveal', K['s4_qelebe'], 0.3); popS(K['s4_qelebe'] + 0.2); s('hit', K['s4_qelebe'] + 2.6, 0.45); s('chime', K['s4_qelebe'] + 2.7, 0.2)
# ---------------- SIRR 5
card(K['s5']); chipS(K['s5'] + 2.0); s('whoosh', K['s5_firon'], 0.2); bubbles(K['s5_firon'], K['s5_diqqet'], 5, 0.08); add(tone(50, 3, 1.2) * 0.5, K['s5_firon'], 0.2)
ay(K['s5_aye']); ay(K['s5_aye'] + 1.8); s('whoosh', K['s5_aye'] + 1.0, 0.12)
chipS(K['s5_diqqet']); popS(K['s5_ruh']); s('crack', K['s5_ruh'] + 0.35, 0.3); popS(K['s5_ruh'] + 0.6); s('hit', K['s5_ruh'] + 0.6, 0.45); s('chime', K['s5_ruh'] + 0.9, 0.25)
breeze(K['s5_nazil'] + 1.4, K['s5_tapildi'], 0.08); popS(K['s5_qum'] + 0.3); popS(K['s5_qum'] + 0.7); popS(K['s5_qum'] + 1.1); s('stamp', K['s5_hec'] + 0.2, 0.45)
chipS(K['s5_tapildi'] + 0.3); chipS(K['s5_tapildi'] + 1.4); tick_run(K['s5_muzey'] + 0.6, 1.6, 24, 2200, 0.08); s('hit', K['s5_muzey'] + 2.2, 0.35)
s('stamp', K['s5_durust'] + 0.05, 0.45); chipS(K['s5_adlar'] + 0.1); chipS(K['s5_adlar'] + 0.5); s('hit', K['s5_ibret'] + 0.8, 0.5)
ay(K['s5_rebb'] - 0.4); add(tone(41, 3, 1.5) * 0.6, K['s5_rebb'], 0.3); popS(K['s5_rebb'] + 1.2)
# ---------------- SIRR 6
card(K['s6']); for_ = None
for i in range(6): s('click', K['s6_hedid'] + 0.2 + i * 0.9, 0.15)  # forge hammer taps
s('hit', K['s6_hedid'] + 0.4, 0.4); s('chime', K['s6_hedid'] + 1.6, 0.15); ay(K['s6_endirdik'] - 0.15); ay(K['s6_quvvet'])
s('whoosh', K['s6_endir2'] - 0.3, 0.3); s('hit', K['s6_endir2'], 0.5); rumble(K['s6_endir2'], K['s6_astro'], 0.3); s('crack', K['s6_cixar'] + 0.5, 0.25); s('chime', K['s6_cixar'] + 1.0, 0.2)
chipS(K['s6_astro'] + 0.1); s('whoosh', K['s6_yaranmir'], 0.12); tick_run(K['s6_8x'] + 1.0, 1.0, 8, 2400); s('hit', K['s6_8x'] + 2.0, 0.35)
s('riser', K['s6_partla'] - 1.0, 0.18, 1.0); s('shatter', K['s6_partla'] + 0.05, 0.45); s('hit', K['s6_partla'] + 0.1, 0.6); rumble(K['s6_partla'], K['s6_partla'] + 2.5, 0.5)
s('whoosh', K['s6_yer'], 0.2); popS(K['s6_yer'] + 1.0); popS(K['s6_yer'] + 1.6); chipS(K['s6_esa'] + 0.4)
s('stamp', K['s6_durust'] + 0.05, 0.45); s('reveal', K['s6_enzelna'], 0.2); ay(K['s6_enzelna'] + 1.2); chipS(K['s6_bexs'] + 0.6); chipS(K['s6_bexs'] + 1.0)
heartbeat(K['s6_dusun'], K['s7_gel'] - 0.3, 0.6); s('hit', K['s6_qan'] + 1.0, 0.4); shimmer(K['s6_qan'] + 2.6, 1.5, 0.1); popS(K['s6_qan'] + 3.6)
# ---------------- SIRR 7
s('shatter', K['s7_gel'] - 0.02, 0.6); chipS(K['s7_gel'] + 0.2); rumble(K['s7_gel'], K['s7_boyuk'] + 0.6, 0.35)
s('stamp', K['s7_boyuk'], 0.45); card(K['s7_boyuk'] + 0.6)
pageflip(K['s7_ac']); chipS(K['s7_ac'] + 0.1); s('reveal', K['s7_beqere'] + 0.3, 0.25); chipS(K['s7_ilk'] + 0.1)
for k in ['s7_elif', 's7_lam', 's7_mim']: s('hit', K[k], 0.55); s('whoosh', K[k] - 0.15, 0.12)
chipS(K['s7_soz'] + 0.1); chipS(K['s7_cumle'] + 0.1); s('hit', K['s7_3'] + 0.4, 0.45)
for k in ['s7_yasin', 's7_taha', 's7_qaf', 's7_nun', 's7_kaf']: s('hit', K[k], 0.55); s('whip', K[k] - 0.1, 0.12)
tick_run(K['s7_29'] + 0.3, 1.0, 20, 2200, 0.08); s('hit', K['s7_29'] + 1.3, 0.35); tick_run(K['s7_29'] + 2.6, 1.0, 15, 2600, 0.08); s('hit', K['s7_29'] + 3.6, 0.45)
for i in range(28): s('click', K['s7_14'] + 0.1 + i * 0.03, 0.06)
shimmer(K['s7_14'] + 1.6, 1.4, 0.12); s('hit', K['s7_14'] + 2.6, 0.4); chipS(K['s7_14b'] + 0.3)
chipS(K['s7_alim'] + 0.2)
for k in ['s7_biri1', 's7_biri2', 's7_biri3']: chipS(K[k], 0.28)
ay(K['s7_gucunuz'] - 0.2); s('hit', K['s7_gucunuz'] + 0.9, 0.55); s('crack', K['s7_gucunuz'] + 0.9, 0.2)
ay(K['s7_allah'] - 0.2); chipS(K['s7_belke'] + 0.1); s('riser', K['s7_bilmediyin'] - 0.6, 0.12, 1.0); s('hit', K['s7_bilmediyin'] + 0.4, 0.5)
# ---------------- SUMMARY + END
for n in range(1, 8): s('whip', K[f'n_{n}'] - 0.08, 0.2); s('hit', K[f'n_{n}'], 0.35)
for i in range(7): s('click', K['n_tesaduf'] - 0.6 + i * 0.08, 0.15)
s('crack', K['n_tesaduf'] + 0.6, 0.3); s('hit', K['n_tesaduf'] + 0.6, 0.4); chipS(K['n_belke'])
s('reveal', K['n_cagir'], 0.25); ay(K['n_aye'] - 0.1); s('crack', K['n_kor'] + 1.0, 0.2); s('chime', K['n_kor'] + 2.4, 0.25)
s('hit', K['n_video'] + 0.2, 0.4); s('hit', K['n_serh'] + 0.1, 0.45)
for i in range(7): s('bubble', K['n_serh'] + 0.6 + i * 0.12, 0.18)
s('typing', K['n_reqem'], 0.25, 1.0); s('bubble', K['n_reqem'] + 1.0, 0.2); chipS(K['n_bilir'] + 0.6); chipS(K['n_yeni'] + 0.1)
s('chime', K['n_abune'] - 0.3, 0.3); s('click', K['n_abune'] + 0.3, 0.25); s('click', K['n_abune'] + 1.0, 0.2)
s('reveal', K['n_salam'] - 0.3, 0.2); s('chime', K['n_salam'] + 0.5, 0.15)
# chapter wipes
for k in ['s1', 's2', 's3', 's4', 's5', 's6']: s('whoosh', K[k] - 0.15, 0.25)
out = out / max(1e-6, np.max(np.abs(out))) * 0.9
pcm = (np.repeat(out[:, None], 2, axis=1) * 32767).astype(np.int16)
with wave.open(sys.argv[3], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok')
