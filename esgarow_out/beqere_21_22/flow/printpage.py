import cv2, numpy as np, json, subprocess, sys
clip, base, trk, out, t0, a_src, r, fade_in = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), float(sys.argv[6]), float(sys.argv[7]), float(sys.argv[8])
T=json.load(open(trk))
LT={'R':[(15.83,18.6),(18.64,21.7),(21.74,24.8),(25.35,29.94)],
    'L':[(30.43,34.2),(34.24,36.4),(36.76,39.4),(39.42,43.0),(43.07,44.05),(44.51,47.0),(47.02,48.2)]}
def load(p): return cv2.imread(p,cv2.IMREAD_UNCHANGED)[...,3].astype(np.float32)/255
M={k:[load(f'lines/{k}_{i}.png') for i in range(len(v))] for k,v in LT.items()}
PW,PH=600,860
src=np.float32([[0,0],[PW,0],[PW,PH],[0,PH]])
INK=np.array([22,30,45],np.float32)        # BGR dark brown-black ink
READ=np.array([30,95,150],np.float32)      # BGR deep gold-brown
GOLD=np.array([40,170,235],np.float32)     # BGR bright gold
cap=cv2.VideoCapture(base); fps=cap.get(5); W=int(cap.get(3)); H=int(cap.get(4))
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(fps),'-i','-',
                    '-c:v','libx264','-crf','12','-preset','medium','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
def lerp(x,a,b): return float(np.clip((x-a)/(b-a),0,1))
i=0
while True:
    ok,f=cap.read()
    if not ok: break
    ts=i/fps; tout=t0+(ts-a_src)*r
    vis=lerp(ts,fade_in,fade_in+0.7) if fade_in>0 else 1.0
    img=f.astype(np.float32)
    if vis>0:
        for k in ('R','L'):
            q=T[k][i] if i<len(T[k]) else None
            if q is None: continue
            q=np.float32(q); Hm=cv2.getPerspectiveTransform(src,q)
            # clean paper inside the quad (slightly shrunk)
            c=q.mean(0); qs=c+(q-c)*0.985
            mk=np.zeros((H,W),np.float32); cv2.fillConvexPoly(mk,np.int32(qs),1.0); mk=cv2.GaussianBlur(mk,(0,0),5)*vis
            paper=cv2.GaussianBlur(img,(0,0),24)
            img=img*(1-mk[...,None])+paper*mk[...,None]
            for j,(a,b) in enumerate(LT[k]):
                al=cv2.warpPerspective(M[k][j],Hm,(W,H))*vis
                act=lerp(tout,a-0.15,a+0.1)*(1-lerp(tout,b+0.1,b+0.5))   # active glow
                read=lerp(tout,a-0.15,a+0.1)
                col=INK*(1-read)+READ*read
                col=col*(1-act)+GOLD*act
                halo=cv2.GaussianBlur(al,(0,0),9)*act*0.55
                img=img+halo[...,None]*np.array([120,210,255],np.float32)*0.9
                img=img*(1-al[...,None]*0.9)+col*al[...,None]*0.9
    p.stdin.write(np.clip(img,0,255).astype(np.uint8).tobytes()); i+=1
p.stdin.close(); p.wait(); print(out,i)
