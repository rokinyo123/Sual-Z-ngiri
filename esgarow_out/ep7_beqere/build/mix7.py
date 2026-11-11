"""Voice-first mix: voice stays clearly on top of music + SFX.

usage: python3 mix.py voice.wav music.wav sfx.wav out.m4a [work_dir]
"""
import subprocess, sys, re
import numpy as np

VOICE, MUSIC, SFX, OUT = sys.argv[1:5]
TMP = sys.argv[5] if len(sys.argv) > 5 else "."
SR = 44100
MUSIC_GAIN, SFX_GAIN = 0.22, 1.5
GAP_SPEECH, GAP_EDGE = 17.0, 8.0   # minimum voice-over-background margin (dB)
GAP_MAX = 24.0                     # background must not sink further than this below the voice
BOOST_MAX = 12.0
HOP = 0.1                          # analysis resolution (s)

def ff(args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + args, check=True)

def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768

def rms_db(x, hop=HOP, win=0.3):
    m = x.mean(axis=1); n, w = int(SR * hop), int(SR * win)
    out = []
    for i in range(0, len(m), n):
        seg = m[max(0, i - w // 2): i + w // 2]
        out.append(20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -120)
    return np.array(out)

# 1) voice stem: clean, compressed, levelled
ff(["-i", VOICE, "-af", "highpass=f=70,acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=3,loudnorm=I=-16:TP=-2:LRA=7",
    "-ar", str(SR), "-ac", "2", f"{TMP}/stem_voice.wav"])
# 2) background stem (music + sfx), sidechain-ducked under the voice
ff(["-i", MUSIC, "-i", SFX, "-i", f"{TMP}/stem_voice.wav", "-filter_complex",
    f"[0:a]volume={MUSIC_GAIN}[m];[1:a]aformat=channel_layouts=stereo,volume={SFX_GAIN}[s];"
    "[m][s]amix=inputs=2:normalize=0[bg];"
    "[bg][2:a]sidechaincompress=threshold=0.02:ratio=4:attack=20:release=400:makeup=1[o]",
    "-map", "[o]", "-ar", str(SR), "-ac", "2", f"{TMP}/stem_bg.wav"])

v, b = load(f"{TMP}/stem_voice.wav"), load(f"{TMP}/stem_bg.wav")
n = min(len(v), len(b)); v, b = v[:n], b[:n]

# 3) gain automation: keep the background inside a 12-17 dB window under the voice while speaking
vd, bd = rms_db(v), rms_db(b)
gap = vd - bd
need = np.where(vd > -30, GAP_SPEECH, np.where(vd > -40, GAP_EDGE, -np.inf))
cut = np.clip(need - gap, 0, 30)
boost = np.where((vd > -30) & (bd > -60), np.clip(gap - GAP_MAX, 0, BOOST_MAX), 0)
cut = np.maximum.reduce([np.roll(cut, s) for s in (-3, -2, -1, 0, 1, 2)])        # look-ahead / hold
boost = np.minimum.reduce([np.roll(boost, s) for s in (-1, 0, 1)])    # only lift where it is safe around
k = np.array([0.25, 0.5, 0.25]); cut = np.convolve(cut, k, mode="same"); boost = np.convolve(boost, k, mode="same")
cut = cut - boost
t_hop = np.arange(len(cut)) * HOP
gain = 10 ** (-np.interp(np.arange(n) / SR, t_hop, cut) / 20)
b = b * gain[:, None]
bd2 = rms_db(b)
gap2 = vd - bd2
speech = vd > -30
print(f"windows cut: {(cut > 0.5).sum()}, lifted: {(cut < -0.5).sum()} of {len(cut)}")
print(f"voice/bg gap during speech: min {gap2[speech].min():.1f} dB, median {np.median(gap2[speech]):.1f} dB")

# 4) mix, static gain to -14 LUFS, true-peak limit
mix = v + b
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", f"{TMP}/mix_raw.wav"], input=pcm.tobytes(), check=True)
meas = subprocess.run(["ffmpeg", "-i", f"{TMP}/mix_raw.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", meas)[-1])
ff(["-i", f"{TMP}/mix_raw.wav", "-af", f"volume={-14.0 - I:.2f}dB,alimiter=limit=0.89:level=false", "-c:a", "aac", "-b:a", "256k", OUT])
print(f"loudness {I:.1f} LUFS -> -14 LUFS")
