import numpy as np, subprocess, sys, wave
P=sys.argv[1]; SR=48000; rng=np.random.default_rng(3)
def load(f):
    raw=subprocess.run(["ffmpeg","-loglevel","error","-i",f,"-ac","1","-ar",str(SR),"-f","s16le","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768
def save(f,x):
    x=x/ max(1e-6,np.abs(x).max())*0.95
    with wave.open(f,'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
def t(d): return np.arange(int(d*SR))/SR
E='/home/user/Sual-Z-ngiri/esgarow_out/engine/sfx/'
def lp(x,a):  # one-pole lowpass
    y=np.zeros_like(x); s=0.
    for i,v in enumerate(x): s+= a*(v-s); y[i]=s
    return y
# whoosh: sample
save(P+'/whoosh.wav', load(E+'whoosh.mp3'))
# boom: hit + sub drop + rumble
tt=t(1.6); f=55*np.exp(-tt*0.9)+30; sub=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*2.6)
rum=lp(rng.standard_normal(len(tt)).astype(np.float32),0.02)*np.exp(-tt*3.5)*3
h=load(E+'hit.mp3'); b=sub*1.0+rum; b[:len(h)]+=h*0.9
save(P+'/boom.wav', b)
# clock: tick-tock 1 per 0.5 s, 6 s
tt=t(6.0); c=np.zeros(len(tt))
for k in range(12):
    i=int(k*0.5*SR); n=int(0.04*SR); tk=t(0.04)
    fr=3200 if k%2==0 else 2400
    c[i:i+n]+= (np.sin(2*np.pi*fr*tk)+0.6*rng.standard_normal(n))*np.exp(-tk*160)
save(P+'/clock.wav', c)
# lock: click + metallic clank + shackle release
tt=t(1.0); m=sum(np.sin(2*np.pi*fq*tt)*np.exp(-tt*dk)*a for fq,dk,a in [(1180,9,1),(1735,12,.7),(2460,16,.5),(3310,22,.35),(690,7,.6)])
cl=load(E+'click.mp3'); k=load(E+'crack.mp3')
L=np.zeros(int(1.2*SR)); L[:len(cl)]+=cl*1.2; o=int(0.07*SR); L[o:o+len(m)]+=m*0.8; o2=int(0.05*SR); L[o2:o2+len(k)]+=k*0.7
save(P+'/lock.wav', L)
# riser
save(P+'/riser.wav', load(E+'riser.mp3'))
# music: dark, warm pad (Am F C G), 90 s, with final swell
D=90; tt=t(D); mus=np.zeros(len(tt))
ch=[[57,60,64],[53,57,60],[48,55,64],[55,59,62]]
def hz(n): return 440*2**((n-69)/12)
seg=8.0
for i in range(int(D/seg)+1):
    s=i*seg; notes=ch[i%4]; n=int((seg+2)*SR); tl=t(seg+2)
    env=np.minimum(1,tl/2.5)*np.minimum(1,np.maximum(0,(seg+2-tl)/2.5))
    v=sum(np.sin(2*np.pi*hz(q)*tl+ph)+0.35*np.sin(2*np.pi*hz(q)*2.003*tl)+0.5*np.sin(2*np.pi*hz(q-12)*tl) for q,ph in zip(notes,[0,1,2]))
    a=int(s*SR); e=min(len(mus),a+n); mus[a:e]+= (v*env)[:e-a]
mus=lp(mus.astype(np.float32),0.08)
mus*= 0.6+0.4*np.sin(2*np.pi*tt/16)**2
save(P+'/music.wav', mus)
print('ok')
