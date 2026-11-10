# Trailer audio: voice clips from the narration placed on the trailer timeline + key word times (TK)
import json, subprocess, numpy as np
SR = 44100
CL = [('c0', 426.57, 432.42, 0.0), ('c1', 0.02, 4.46, 6.15), ('c2', 4.94, 9.52, 10.89), ('c4', 33.02, 37.82, 15.77), ('c5', 511.92, 525.53, 20.87), ('c6', 47.87, 55.35, 34.78)]
TOTAL = 45.06
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', '../ses_elevenlabs.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
src = np.frombuffer(raw, np.float32).astype(np.float64)
out = np.zeros(int(SR * (TOTAL + 1)))
for n, a, b, t in CL:
    x = src[int(a * SR):int(b * SR)].copy(); f = int(0.02 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    out[int(t * SR):int(t * SR) + len(x)] += x
pcm = (np.repeat(np.clip(out, -1, 1)[:, None], 2, axis=1) * 32767).astype(np.int16)
import wave
with wave.open('voice.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
W = json.load(open('../soz_vaxtlari.json'))['words']
def tw(word, a, b):  # trailer time of word inside clip
    for n, s0, s1, t in CL:
        for w in W:
            if s0 <= w['t0'] < s1 and a <= w['t0'] < b and w['w'].lower().startswith(word.lower()): return round(t + w['t0'] - s0, 3)
    raise SystemExit(word)
C = {n: t for n, a, b, t in CL}; E = {n: t + b - a for n, a, b, t in CL}
TK = dict(C, **{n + '_end': v for n, v in E.items()})
TK.update(qan=tw('qanındakı', 426, 428), demir0=tw('dəmir', 427, 428.5), ulduzun=tw('ulduzun', 430, 431), ureyinde=tw('ürəyində', 431, 432), ondord=tw('on', 0, 4.5), kitab=tw('kitab', 0, 4.5), mikro=tw('mikroskop', 5, 10), tele=tw('teleskop', 5, 10),
  yeddi=tw('yeddi', 33, 38), acacagiq=tw('açacağıq', 33, 38),
  barmaq=tw('barmaq', 511, 513), deniz=tw('qarışmayan', 513, 515), ari=tw('bal', 515, 516.5), imper=tw('bir', 516.5, 518),
  firon=tw('bir', 518.8, 520), demir=tw('ulduzlardan', 520, 522), herfler=tw('və', 522.9, 523.5), amma=C['c6'] + 47.93 - 47.87,
  sonuncu=tw('sonuncu', 49, 51), cunki=tw('çünki', 51, 53), sual=tw('sualdır', 53, 56))
TK['_total'] = TOTAL
json.dump({k: [v] for k, v in TK.items()} | {'_total': TOTAL}, open('T.json', 'w'))
open('timeline.js', 'w').write('const KT = ' + json.dumps({k: v for k, v in TK.items() if k != '_total'}) + f';\nconst TOTAL2 = {TOTAL};\nconst TL = {{ _total: TOTAL2 }};\n')
print(TK)
