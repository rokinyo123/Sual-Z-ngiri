import cv2, numpy as np, subprocess, sys
src, dst, clip = sys.argv[1], sys.argv[2], sys.argv[3]
cap = cv2.VideoCapture(src); fps = cap.get(5); W = int(cap.get(3)); H = int(cap.get(4))
p = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(fps),'-i','-',
                      '-c:v','libx264','-crf','12','-preset','medium','-pix_fmt','yuv420p',dst], stdin=subprocess.PIPE)
ys = np.arange(H)[:, None, None] / H
def params(t):
    # (mask top fraction, strength 0..1)
    if clip == 'k04': return 0.24, np.clip((t - 2.0) / 1.2, 0, 1)
    if clip == 'k05': return 0.25, 1.0
    if clip == 'k06': return 0.30 + 0.25 * np.clip((t - 3) / 2, 0, 1), 1.0 - np.clip((t - 6) / 2, 0, 1) * 0.6
i = 0
while True:
    ok, f = cap.read()
    if not ok: break
    t = i / fps; top, s = params(t)
    b = cv2.GaussianBlur(f, (0, 0), 5.2)
    m = np.clip((ys - top) / 0.08, 0, 1) * s
    o = (f * (1 - m) + b * m).astype(np.uint8)
    p.stdin.write(o.tobytes()); i += 1
p.stdin.close(); p.wait(); print(clip, i)
