import json, subprocess, sys
S, OUT, IDX = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(',')]
segs = json.load(open(S + '/segs.json')); PAD = 0.25; meta = []
for i, (c, a, b, t0, t1) in enumerate(segs):
    r = (t1 - t0) / (b - a); pa = min(PAD / r, a); pb = min(PAD / r, 10.03 - b); sa, sb = a - pa, b + pb
    if i in IDX:
        vf = (f"setpts=(PTS-STARTPTS)*{r:.6f},minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,"
              "scale=1080:1920:flags=lanczos,unsharp=5:5:0.45:5:5:0,format=yuv420p")
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{sa:.3f}','-to',f'{sb:.3f}','-i',f'{S}/clips/{c}.mp4','-an','-vf',vf,
                        '-c:v','libx264','-preset','medium','-crf','15',f'{OUT}/s{i:02d}.mp4'], check=True)
    meta.append(dict(file=f'seg/s{i:02d}.mp4', start=round(t0 - pa * r, 4), t0=t0, t1=t1, end=round(t1 + pb * r, 4)))
json.dump(meta, open(OUT + '/../../src/segs.json', 'w'), indent=1); print('ok', len(meta))
