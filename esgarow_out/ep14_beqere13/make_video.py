#!/usr/bin/env python3
"""Kinematoqrafik Shorts/Reels montajı (1080x1920, 9:16, 60 fps).

Girişlər (bu qovluqda):
  voice.mp3            — səsləndirmə
  script.txt           — orijinal ssenari (altyazı mətni YALNIZ buradan götürülür)
  scenes/01.png..12.png
  assets/gold_dust.mp4       (varsa: screen blend, 25%)
  assets/subscribe_green.mp4 (varsa: son 12 s, chroma key)
Çıxış: final_beqere_13_14.mp4  (H.264 crf 18, AAC 192k)

Sinxron: əvvəlcə faster-whisper / openai-whisper ilə söz zamanları çıxarılır və ssenarinin
sözlərinə ardıcıllıqla (difflib) bağlanır. Whisper modeli yüklənə bilməsə (şəbəkə bağlıdırsa),
enerji əsaslı forced alignment (walign2.py: ifadə → nitq seqmenti DP, söz → heca nüvələri) işləyir.
"""
import os, re, json, sys, subprocess, difflib, math
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
W, H, FPS = 1080, 1920, 60
OUT = 'final_beqere_13_14.mp4'
FONT = 'fonts/Montserrat.ttf'          # Montserrat ExtraBold (ə ğ ı ö ü ç ş dəstəklənir)
FONT_FALLBACK = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SUB_Y = 1280
GOLD, RED, WHITE = (255, 215, 0), (255, 59, 48), (255, 255, 255)
KEY_RED = ('səfeh', 'ikiüzlü', 'şeytan', 'maska', 'istehza')
KEY_GOLD = ('mələk', 'qəlbimi', 'sabit')
# səhnə → ssenaridə başladığı ifadənin nömrəsi (məna axınına görə)
SCENE_AT = {1: 0, 2: 2, 3: 6, 4: 10, 5: 27, 6: 34, 7: 38, 8: 43, 9: 47, 10: 54, 11: 58, 12: 62}
RECITE = (6, 9)                         # tilavət ifadələri (etiket + dalğa)
XF = 0.3                                # keçid (s)

# ---------------------------------------------------------------- audio
def run(cmd): return subprocess.run(cmd, capture_output=True, check=True)
run(['ffmpeg', '-y', '-v', 'error', '-i', 'voice.mp3', '-ar', '48000', '-ac', '2', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', 'voice_norm.wav'])
DUR = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'voice.mp3']).stdout)
pcm = np.frombuffer(run(['ffmpeg', '-v', 'error', '-i', 'voice.mp3', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']).stdout, np.float32)
ENV = np.array([np.sqrt(np.mean(pcm[int(i * 16000 / FPS):int((i + 1) * 16000 / FPS)] ** 2) + 1e-9) for i in range(int(DUR * FPS) + 2)])
ENV = np.nan_to_num(ENV); ENV = np.clip(ENV / np.percentile(ENV, 98), 0, 1)

# ---------------------------------------------------------------- alignment
def phrases_from_script():
    text = open('script.txt', encoding='utf-8').read().replace('\n', ' ')
    return [p.strip() for p in re.split(r'(?<=[.,:?!])\s+|(?<=[.,:?!]["»])\s+', text) if p.strip()]

def align_whisper():
    words = None
    try:
        from faster_whisper import WhisperModel
        m = WhisperModel('small', device='cpu', compute_type='int8')
        segs, _ = m.transcribe('voice.mp3', language='az', word_timestamps=True)
        words = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    except Exception as e:
        print('faster-whisper işləmədi:', type(e).__name__, str(e)[:120])
        try:
            import whisper
            m = whisper.load_model('small')
            r = m.transcribe('voice.mp3', language='az', word_timestamps=True)
            words = [(w['word'].strip(), w['start'], w['end']) for s in r['segments'] for w in s['words']]
        except Exception as e2:
            print('openai-whisper işləmədi:', type(e2).__name__, str(e2)[:120]); return None
    # ssenari sözlərini whisper sözlərinə ardıcıl bağla
    norm = lambda s: re.sub(r'[^\wəğıöüçş]', '', s.lower())
    out = []
    for p in phrases_from_script():
        out.append({'p': p, 'words': [{'w': w} for w in p.split()]})
    flat = [w for ph in out for w in ph['words']]
    sm = difflib.SequenceMatcher(a=[norm(w['w']) for w in flat], b=[norm(w[0]) for w in words], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): flat[a + k]['t'] = words[b + k][1]
    known = [i for i, w in enumerate(flat) if 't' in w]
    for i, w in enumerate(flat):              # boşluqları xətti doldur
        if 't' in w: continue
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        t0 = flat[lo]['t'] if lo is not None else 0.0; t1 = flat[hi]['t'] if hi is not None else DUR
        a0 = lo if lo is not None else -1; a1 = hi if hi is not None else len(flat)
        w['t'] = t0 + (t1 - t0) * (i - a0) / (a1 - a0)
    for ph in out: ph['t0'] = ph['words'][0]['t']; ph['t1'] = ph['words'][-1]['t'] + 0.4
    return out

def align_energy():
    """walign2.py ilə ölçülmüş forced alignment; fasilə həssaslığı avtomatik seçilir (ən az anomal sürət)."""
    best = None
    for g in (3, 4, 5, 6, 8):
        f = f'.wa_{g}.json'
        subprocess.run([sys.executable, 'walign2.py', 'voice.mp3', 'script.txt', f, str(g)], capture_output=True)
        if not os.path.exists(f): continue
        d = json.load(open(f, encoding='utf-8')); r = np.array([p['rate'] for p in d])
        score = int(((r < 3) | (r > 9.5)).sum()) * 10 + float(r.std())
        print(f'  gap={g}: anomal={int(((r < 3) | (r > 9.5)).sum())} std={r.std():.2f}')
        if best is None or score < best[0]: best = (score, d)
    return best[1]

if os.path.exists('words.json') and os.environ.get('REALIGN') != '1':
    PH = json.load(open('words.json', encoding='utf-8')); print('words.json istifadə olunur')
else:
    PH = align_whisper()
    if PH is None:
        print('Whisper modeli yüklənmədi → enerji əsaslı forced alignment'); PH = align_energy()
    json.dump(PH, open('words.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
WORDS = [(w['w'], w['t'], pi) for pi, p in enumerate(PH) for w in p['words'] if w['w'] not in ('–', '—', '-')]

# ---------------------------------------------------------------- subtitle groups (2–4 söz)
def az_upper(s): return s.replace('i', 'İ').replace('ı', 'I').upper()
def kind(w):
    l = w.lower()
    if any(k in l for k in KEY_RED): return 'red'
    if any(k in l for k in KEY_GOLD): return 'gold'
    return 'w'
GROUPS = []; cur = []
for i, (w, t, pi) in enumerate(WORDS):
    cur.append((w, t))
    nxt = WORDS[i + 1] if i + 1 < len(WORDS) else None
    end_punct = re.search(r'[.,:?!…»"]$', w) is not None
    if len(cur) >= 4 or (end_punct and len(cur) >= 2) or nxt is None or (nxt and nxt[2] != pi and len(cur) >= 2):
        GROUPS.append(cur); cur = []
if cur: GROUPS[-1] += cur
for gi, g in enumerate(GROUPS):
    t_end = GROUPS[gi + 1][0][1] - 0.05 if gi + 1 < len(GROUPS) else DUR
    GROUPS[gi] = {'w': g, 't0': g[0][1] - 0.1, 't1': min(t_end, g[-1][1] + 1.2)}

_fc = {}
def font(sz):
    if sz not in _fc:
        try: _fc[sz] = ImageFont.truetype(FONT, sz)
        except OSError: _fc[sz] = ImageFont.truetype(FONT_FALLBACK, sz)
    return _fc[sz]
_wc = {}
def word_img(txt, col, sz=78, stroke=4):
    key = (txt, col, sz)
    if key in _wc: return _wc[key]
    f = font(sz); x0, y0, x1, y1 = f.getbbox(txt, stroke_width=stroke); pad = 14
    im = Image.new('RGBA', (x1 - x0 + 2 * pad, y1 - y0 + 2 * pad), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((pad - x0 + 4, pad - y0 + 6), txt, font=f, fill=(0, 0, 0, 170), stroke_width=stroke, stroke_fill=(0, 0, 0, 170))
    im = Image.alpha_composite(im, sh); d = ImageDraw.Draw(im)
    d.text((pad - x0, pad - y0), txt, font=f, fill=col + (255,), stroke_width=stroke, stroke_fill=(0, 0, 0, 255))
    a = np.array(im); _wc[key] = a; return a

def blit(frame, rgba, cx, cy, scale=1.0, alpha=1.0):
    if alpha <= 0.01: return
    if abs(scale - 1) > 0.01: rgba = cv2.resize(rgba, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
    h, w = rgba.shape[:2]; x, y = int(cx - w / 2), int(cy - h / 2)
    xa, ya, xb, yb = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if xa >= xb or ya >= yb: return
    src = rgba[ya - y:yb - y, xa - x:xb - x].astype(np.float32); a = src[..., 3:4] / 255.0 * alpha
    dst = frame[ya:yb, xa:xb].astype(np.float32); frame[ya:yb, xa:xb] = (src[..., :3] * a + dst * (1 - a)).astype(np.uint8)

def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def pop(u): u = min(1, max(0, u)); return 0.85 + 0.15 * (1 - (1 - u) ** 3) + 0.06 * math.sin(math.pi * u)

def draw_subs(frame, t):
    g = next((g for g in GROUPS if g['t0'] <= t < g['t1']), None)
    if not g: return
    a = ease((t - g['t0']) / 0.12) * (1 - ease((t - (g['t1'] - 0.1)) / 0.1))
    imgs = []
    for w, tw in g['w']:
        k = kind(w); said = t >= tw - 0.05
        if k != 'w' and said:          # açar söz: deyiləndə rənglənir + pop (0.85 → 1.0)
            im = word_img(az_upper(w), RED if k == 'red' else GOLD, 80); sc = pop((t - tw + 0.05) / 0.22); al = a
        else:                          # adi söz: deyilən tam ağ (yüngül böyümə), qalanı solğun
            im = word_img(az_upper(w), WHITE, 80 if k != 'w' else 74)
            sc = 1.06 if said and t < tw + 0.3 else 1.0; al = a * (1.0 if said else 0.62)
        imgs.append((im, sc, al))
    lines, line, lw, sp = [], [], 0, 28     # 2 sətrə qədər bölmə
    for it in imgs:
        w = it[0].shape[1] - 28
        if line and lw + sp + w > 960: lines.append((line, lw)); line, lw = [], 0
        line.append(it); lw += (sp if len(line) > 1 else 0) + w
    lines.append((line, lw))
    lh = 96; y0 = SUB_Y - (len(lines) - 1) * lh / 2
    for li, (ln, lw) in enumerate(lines):
        x = W / 2 - lw / 2
        for im, sc, al in ln:
            w = im.shape[1] - 28; blit(frame, im, x + w / 2, y0 + li * lh, sc, al); x += w + sp

# ---------------------------------------------------------------- scenes + Ken Burns
P = lambda i: PH[i]['t0']
starts = [0.0] + [P(SCENE_AT[k]) - 0.15 for k in range(2, 13)]
SCN = [(k, starts[k - 1], starts[k] if k < 12 else DUR + 1) for k in range(1, 13)]
IMG = {k: cv2.cvtColor(cv2.imread(f'scenes/{k:02d}.png'), cv2.COLOR_BGR2RGB) for k in range(1, 13)}
MOVES = ['in', 'out', 'pan_up', 'in', 'pan_left', 'out', 'in', 'pan_down', 'out', 'in', 'pan_right', 'in']

def kb(k, t, a, b):
    im = IMG[k]; ih, iw = im.shape[:2]; base = max(W / iw, H / ih)
    u = ease((t - a) / max(0.1, b - a)); mv = MOVES[k - 1]; dx = dy = 0.0
    if b - a > 18:                     # uzun səhnədə iki kamera hərəkəti
        mv = 'in' if u < 0.5 else 'pan_left'; u = (u * 2) % 1 if u < 0.999 else 1
    z = {'in': 1.0 + 0.12 * u, 'out': 1.12 - 0.12 * u}.get(mv, 1.08)
    if mv == 'pan_up': dy = (0.5 - u) * 0.06 * H
    if mv == 'pan_down': dy = (u - 0.5) * 0.06 * H
    if mv == 'pan_left': dx = (0.5 - u) * 0.06 * W
    if mv == 'pan_right': dx = (u - 0.5) * 0.06 * W
    if k == 1 and t < 0.6: z *= 1 + 0.18 * (1 - ease(t / 0.6))      # 0.0 s: kamera zərbəsi (hook)
    s = base * z; M = np.float32([[s, 0, W / 2 - iw * s / 2 + dx], [0, s, H / 2 - ih * s / 2 + dy]])
    return cv2.warpAffine(im, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.55 * np.clip(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.6)) ** 2, 0, 1) ** 1.4)[..., None]
GRAD = np.ones((H, W, 1), np.float32); GRAD[:520] *= np.linspace(0.55, 1, 520)[:, None, None]; GRAD[1150:] *= np.linspace(1, 0.55, H - 1150)[:, None, None]

def grade(f):
    f = f.astype(np.float32); f = (f - 128) * 1.1 + 128 + 4                  # kontrast
    gray = f.mean(2, keepdims=True); f = gray + (f - gray) * 1.06            # yüngül doyma
    return np.clip(f * VIG * GRAD, 0, 255).astype(np.uint8)

# ---------------------------------------------------------------- overlays
def open_vid(p): return cv2.VideoCapture(p) if os.path.exists(p) else None
DUST = open_vid('assets/gold_dust.mp4'); SUBV = open_vid('assets/subscribe_green.mp4')
def read_loop(cap, t, loop=True):
    n = cap.get(cv2.CAP_PROP_FRAME_COUNT) or 1; fps = cap.get(cv2.CAP_PROP_FPS) or 30
    idx = int(t * fps) % int(n) if loop else min(int(t * fps), int(n) - 1)
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx); ok, fr = cap.read(); return cv2.cvtColor(fr, cv2.COLOR_BGR2RGB) if ok else None

LABEL = None
def label_img():
    global LABEL
    if LABEL is None:
        f = font(40); txt = 'BƏQƏRƏ SURƏSİ • 13-14'; x0, y0, x1, y1 = f.getbbox(txt)
        im = Image.new('RGBA', (x1 - x0 + 70, y1 - y0 + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), radius=im.size[1] // 2, fill=(0, 0, 0, 150), outline=(255, 215, 0, 200), width=2)
        d.text((35 - x0, 20 - y0), txt, font=f, fill=(255, 235, 170, 255)); LABEL = np.array(im)
    return LABEL
TITLE = [word_img('İKİÜZLÜ İNSANIN', WHITE, 84, 5), word_img('SİRRİ', GOLD, 120, 6)]

def waveform(frame, t, a):
    i = int(t * FPS); n = 56; bw = 9; gap = 5; x0 = W / 2 - n * (bw + gap) / 2
    ov = frame.copy()
    for k in range(n):
        j = i - abs(k - n // 2) * 2                     # mərkəz = indi, kənarlar = bir az əvvəl
        v = ENV[max(0, min(len(ENV) - 1, j))] * (0.35 + 0.65 * math.cos((k - n / 2) / n * math.pi))
        h = 6 + v * 70; x = int(x0 + k * (bw + gap)); cv2.rectangle(ov, (x, int(1560 - h / 2)), (x + bw, int(1560 + h / 2)), (255, 215, 0), -1)
    cv2.addWeighted(ov, 0.85 * a, frame, 1 - 0.85 * a, 0, frame)

# ---------------------------------------------------------------- frame
def make_frame(t):
    fr = None
    for k, a, b in SCN:
        if not (a - XF <= t < b): continue
        img = kb(k, t, a - XF, b)
        if fr is None: fr = img
        else:                              # 0.3 s yumşaq keçid + yüngül qaranlıq (dark dissolve)
            u = ease((t - (a - XF)) / XF); dip = 1 - 0.35 * math.sin(math.pi * u)
            fr = (cv2.addWeighted(fr, 1 - u, img, u, 0) * dip).astype(np.uint8)
    if t < 0.25: fr = (fr * ease(t / 0.25) + 255 * (1 - ease(t / 0.25)) * 0.25).astype(np.uint8)   # 0.0 s işıq partlayışı
    if DUST is not None:
        d = read_loop(DUST, t)
        if d is not None:
            d = cv2.resize(d, (W, H)).astype(np.float32) / 255; f = fr.astype(np.float32) / 255
            scr = 1 - (1 - f) * (1 - d); fr = ((f * 0.75 + scr * 0.25) * 255).astype(np.uint8)
    fr = grade(fr)
    if t < 4.0:                            # hook başlığı
        a = ease(t / 0.35) * (1 - ease((t - 3.6) / 0.4))
        blit(fr, TITLE[0], W / 2, 300, pop(t / 0.4), a); blit(fr, TITLE[1], W / 2, 410, pop((t - 0.25) / 0.4), a * ease((t - 0.2) / 0.3))
    r0, r1 = PH[RECITE[0]]['t0'] - 0.3, PH[RECITE[1]]['t1'] + 0.3
    if r0 <= t <= r1:
        a = ease((t - r0) / 0.4) * (1 - ease((t - (r1 - 0.4)) / 0.4))
        blit(fr, label_img(), W / 2, 300, 1.0, a); waveform(fr, t, a)
    if SUBV is not None and t > DUR - 12:
        s = read_loop(SUBV, t - (DUR - 12), loop=False)
        if s is not None:
            s = cv2.resize(s, (720, int(720 * s.shape[0] / s.shape[1]))); hsv = cv2.cvtColor(s, cv2.COLOR_RGB2HSV)
            m = cv2.inRange(hsv, (35, 60, 60), (85, 255, 255)); al = cv2.GaussianBlur(255 - m, (5, 5), 0)
            rgba = np.dstack([s, al]); blit(fr, rgba, W / 2, 1640)
    draw_subs(fr, t)
    if t > DUR - 0.4: fr = (fr * (1 - ease((t - (DUR - 0.4)) / 0.4))).astype(np.uint8)
    return fr

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'stills':          # yoxlama kadrları
        os.makedirs('stills', exist_ok=True)
        for t in map(float, sys.argv[2:]): cv2.imwrite(f'stills/f_{t:07.2f}.jpg', cv2.cvtColor(make_frame(t), cv2.COLOR_RGB2BGR))
        sys.exit()
    from moviepy import VideoClip, AudioFileClip
    audio = AudioFileClip('voice_norm.wav')
    clip = VideoClip(make_frame, duration=DUR).with_audio(audio)
    clip.write_videofile(OUT, fps=FPS, codec='libx264', audio_codec='aac', audio_bitrate='192k',
                         ffmpeg_params=['-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'], threads=4, logger='bar')
    print('hazır:', OUT)
