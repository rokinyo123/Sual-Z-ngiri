import sys,subprocess,numpy as np
src,sil,out=sys.argv[1:4]
CAP=float(sys.argv[4]) if len(sys.argv)>4 else 0.36
sr=44100
raw=subprocess.run(['ffmpeg','-v','error','-i',src,'-f','f32le','-ac','1','-ar',str(sr),'-'],capture_output=True).stdout
a=np.frombuffer(raw,np.float32)
gaps=[tuple(map(float,l.split())) for l in open(sil) if len(l.split())==2]
keep={}  # dramatic pause after Firon question
segs=[];pos=0
for s,e in gaps:
    d=e-s; tgt=keep.get(round(s,2),min(d,CAP)) if d>CAP or round(s,2) in keep else d
    if s<0.05: s0=0; segs.append(a[int(pos*sr):int(pos*sr)]); pos=max(e-0.08,0); continue
    if d>tgt:
        cut=d-tgt; mid=(s+e)/2
        a1=int((mid-cut/2)*sr); a2=int((mid+cut/2)*sr)
        segs.append(a[int(pos*sr):a1]); pos=a2/sr
segs.append(a[int(pos*sr):])
# 8ms crossfade-free joins are in silence, fine
y=np.concatenate(segs)
p=subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','1','-i','-',out],input=y.tobytes())
print('new dur %.2f'%(len(y)/sr))
