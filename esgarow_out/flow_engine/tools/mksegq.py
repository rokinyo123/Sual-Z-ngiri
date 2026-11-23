import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
S, OUT = sys.argv[1], sys.argv[2]
segs = json.load(open(S + '/segs.json')); PAD = 0.25; meta = []
def job(i):
    c, a, b, t0, t1 = segs[i]; r = (t1 - t0) / (b - a)          # output seconds per source second
    pa = min(PAD / r, a); pb = min(PAD / r, 10.03 - b)           # extra source on both sides (for cross-fades)
    sa, sb = a - pa, b + pb
    out = f'{OUT}/s{i:02d}.mp4'
    vf = (f"setpts=(PTS-STARTPTS)*{r:.6f},fps=60,"
          "scale=1080:1920:flags=lanczos,unsharp=5:5:0.45:5:5:0,format=yuv420p")
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{sa:.3f}','-to',f'{sb:.3f}','-i',f'{S}/clips/{c}.mp4','-an','-vf',vf,
                    '-c:v','libx264','-preset','ultrafast','-crf','23',out], check=True)
    return dict(file=f'segq/s{i:02d}.mp4', start=round(t0 - pa * r, 4), t0=t0, t1=t1, end=round(t1 + pb * r, 4))
with ThreadPoolExecutor(4) as ex: meta = list(ex.map(job, range(len(segs))))
json.dump(meta, open(OUT + '/../../src/segsq.json', 'w'), indent=1); print('ok', len(meta))
