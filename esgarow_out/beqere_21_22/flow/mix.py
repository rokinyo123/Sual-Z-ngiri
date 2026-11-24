import json, subprocess, numpy as np, soundfile as sf, librosa, os
W='/tmp/claude-0/-home-user-Sual-Z-ngiri/082ffc7a-b076-5133-a44d-2027c5a445c7/scratchpad/b2122'
SR=48000; DUR=168.5; N=int(DUR*SR)
segs=json.load(open(f'{W}/segs.json'))
MUSIC={f'k{i:02d}' for i in range(1,19)}
os.makedirs(f'{W}/nat',exist_ok=True)
def nat(k):
    p=f'{W}/nat/{k}.wav'
    if os.path.exists(p): return p
    src=f'{W}/clips/{k}.mp4' if not os.path.exists(f'{W}/clips/{k}_orig.mp4') else f'{W}/clips/{k}_orig.mp4'
    y=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',src,'-vn','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True,check=True).stdout,np.float32).astype(float)
    if k in MUSIC:
        S=librosa.stft(y,n_fft=4096,hop_length=512)
        H,P=librosa.decompose.hpss(S,kernel_size=(61,31),margin=(3.0,1.0))
        y=librosa.istft(S-H,hop_length=512,length=len(y))
    sf.write(p,y,SR); return p
def atempo(sp):
    f=[]
    while sp<0.5: f.append('atempo=0.5'); sp/=0.5
    while sp>2: f.append('atempo=2'); sp/=2
    f.append(f'atempo={sp:.5f}'); return ','.join(f)
bed=np.zeros(N); PAD=0.25
for c,a,b,t0,t1 in segs:
    r=(t1-t0)/(b-a); pa=min(PAD/r,a); pb=max(0,min(PAD/r,10.0-b)); sa,sb=a-pa,b+pb
    out=subprocess.run(['ffmpeg','-v','error','-ss',f'{sa:.3f}','-to',f'{sb:.3f}','-i',nat(c),'-af',atempo(1/r),'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True,check=True).stdout
    x=np.frombuffer(out,np.float32).astype(float)
    rm=np.sqrt(np.mean(x**2))+1e-9; x=x*min(10**(4/20),10**(-28/20)/rm,0.6/(np.abs(x).max()+1e-9))
    st=int((t0-pa*r)*SR); n=len(x); fd=int(0.25*SR)
    env=np.ones(n); env[:fd]=np.linspace(0,1,fd)**0.5; env[-fd:]=np.linspace(1,0,fd)**0.5
    e=min(N,st+n); bed[st:e]+=(x*env)[:e-st]
# --- synthesized SFX ---
rng=np.random.default_rng(7)
def tt(d): return np.arange(int(d*SR))/SR
def bp(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X[(f<lo)|(f>hi)]=0; return np.fft.irfft(X,len(x))
def norm(x,pk): return x/(np.abs(x).max()+1e-9)*pk
def clink(d=0.5,fs=(2350,3870,5610),dec=9):
    t=tt(d); return norm(sum(np.sin(2*np.pi*f*t+rng.random()*6)*np.exp(-t*dec*(1+i*0.6)) for i,f in enumerate(fs)),1)
def ring(): t=tt(1.6); return norm(sum(np.sin(2*np.pi*f*t*(1+0.002*np.sin(2*np.pi*7*t)))*np.exp(-t*(2.2+i)) for i,f in enumerate((2950,4630,7120))),1)
def noise(d): return rng.standard_normal(int(d*SR))
def pop(): t=tt(0.18); return norm(bp(noise(0.18),300,2500)*np.exp(-t*40)+0.8*np.sin(2*np.pi*170*t)*np.exp(-t*30),1)
def rustle(d=0.9): t=tt(d); env=np.convolve((rng.random(len(t))<0.004).astype(float),np.exp(-np.arange(600)/120),'same'); return norm(bp(noise(d),1500,7000)*(0.25+env)*np.sin(np.pi*t/d),1)
def swish(d=1.0,lo=150,hi=1800): t=tt(d); return norm(bp(noise(d),lo,hi)*np.sin(np.pi*t/d)**2,1)
def scrape(d=0.7): t=tt(d); return norm(bp(noise(d),700,2200)*(0.6+0.4*np.sin(2*np.pi*23*t))*np.sin(np.pi*t/d),1)
def roll(d=1.2): t=tt(d); return norm(bp(noise(d),120,900)*(0.7+0.3*np.sin(2*np.pi*31*t))*np.minimum(1,t*8)*np.minimum(1,(d-t)*6),1)
def shimmer(d=1.6):
    x=np.zeros(int(d*SR))
    for _ in range(40):
        s=int(rng.random()*(len(x)-SR*0.3)); c=clink(0.25,(rng.uniform(5000,9000),),dec=18); x[s:s+len(c)]+=c*rng.uniform(.2,.6)
    t=tt(d); return norm(x*np.sin(np.pi*t/d)+0.3*norm(bp(noise(d),5000,11000),1)*np.sin(np.pi*t/d),1)
def rain(d):
    x=bp(noise(d),900,9000)*0.5
    drops=(rng.random(len(x))<0.0009).astype(float); x+=np.convolve(drops,np.exp(-np.arange(300)/40)*np.sin(np.arange(300)*0.9),'same')*1.2
    t=tt(d); return norm(x*np.minimum(1,np.minimum(t,d-t)/1.0),1)
def wav(n): y,_=librosa.load(f'{W}/build/public/sfx/{n}.wav',sr=SR); return norm(y,1)
sfx=np.zeros(N)
def put(x,at,db):
    s=int(at*SR); e=min(N,s+len(x)); sfx[s:e]+=x[:e-s]*10**(db/20)
def sand(d=1.2): t=tt(d); return norm(bp(noise(d),2000,9000)*np.exp(-t*2.5)*np.minimum(1,t*20),1)
def thud(): t=tt(0.35); return norm(np.sin(2*np.pi*90*t)*np.exp(-t*14)+0.3*bp(noise(0.35),100,600)*np.exp(-t*18),1)
def crackle(d=1.4):
    x=np.zeros(int(d*SR)); n=len(x)
    for _ in range(60): s_=int(rng.random()*(n-400)); x[s_:s_+400]+=bp(noise(400/SR),1500,8000)*np.exp(-np.arange(400)/60)*rng.uniform(.3,1)
    t=tt(d); return norm(x*np.exp(-t*1.2)+0.5*norm(swish(d,300,3000),1),1)
def puff(): t=tt(0.4); return norm(bp(noise(0.4),200,2500)*np.sin(np.pi*t/0.4)**2,1)
def ignite(): t=tt(0.5); return norm(bp(noise(0.5),400,4000)*np.exp(-t*7)*np.minimum(1,t*60),1)
put(shimmer(2.0),9.8,-24); put(wav('whoosh'),13.6,-24); put(wav('boom'),14.4,-24)        # particles -> Quran
put(rustle(1.0),17.6,-20)                                         # Quran opens
pass                                    # gentle sparkle during recitation
for at in (49.6,51.3,53.0,54.6): put(sand(0.9),at,-24); put(thud(),at+0.1,-26)              # generations rise
put(swish(1.2,300,4000),55.9,-22); put(sand(1.5),56.0,-26)                                # sand -> grass
put(shimmer(2.0),57.3,-22); put(wav('whoosh'),57.4,-24)                                   # dome
put(rain(6.5),58.7,-26)                                                                   # rain (clip quiet)
put(rustle(1.6),60.0,-22); put(rustle(1.2),61.4,-24)                                      # tree grows
for at in (62.9,63.3,63.8): put(thud(),at,-22)                                            # fruits into basket
put(clink(0.5),65.6,-24)                                                                  # coins on the pan
for i,at in enumerate(np.arange(67.5,74.0,0.55)): put(ignite(),at+rng.uniform(-.1,.1),-30+(i%3)*-2)   # lanterns light
put(swish(1.4,120,1500),75.4,-20)                                                         # rug unrolls
put(swish(1.0,200,3000),84.4,-28); put(rain(1.4),87.6,-26); put(rustle(1.2),89.0,-26)     # reprise
put(crackle(1.6),99.2,-20); put(crackle(1.4),100.8,-22); put(crackle(1.4),103.2,-20); put(crackle(1.2),104.6,-22)   # meteors burn
put(wav('boom'),106.3,-18)                                                                # sunrise
put(wav('boom'),119.9,-16); put(sand(1.2),120.0,-22)                                      # idols rise
put(wav('crack'),123.4,-16); put(sand(1.6),123.6,-20)                                     # idols crumble
put(puff(),136.5,-16)                                                                     # candle goes out
put(clink(0.6),143.2,-22); put(clink(0.6,(1900,3100,4700)),145.0,-22)                     # phone / crown on the pan
put(wav('crack'),153.3,-18); put(sand(1.6),153.5,-20)                                     # objects crumble
put(wav('boom'),154.2,-18); put(shimmer(2.5),154.3,-20)                                   # light fills
put(pop(),165.7,-24)                                                                      # ink drop
put(wav('boom'),165.55,-16)                                                               # end card
# --- ducking under voice ---
v,_=librosa.load(f'{W}/ses.mp3',sr=SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]
hop=480; rms=np.sqrt(np.convolve(v**2,np.ones(hop*4)/(hop*4),'same'))[::hop]
act=(rms>0.012).astype(float)
g=np.zeros_like(act); a=0
for i,x in enumerate(act): a=a+(x-a)*(0.5 if x>a else 0.04); g[i]=a      # fast attack, ~0.25 s release
duck=np.interp(np.arange(N),np.arange(len(g))*hop,1-0.78*g)               # ~ -11 dB under speech
def lufs_like(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
bed=bed/ (np.percentile(np.abs(bed),99.5)+1e-9)*0.6
# mosque reverb on Arabic parts
ir_t=tt(2.6); ir=bp(noise(2.6),200,7000)*np.exp(-ir_t*2.6); ir[:int(0.03*SR)]=0; ir=ir/np.sqrt(np.sum(ir**2))
from scipy.signal import fftconvolve
wet=np.zeros(N)
wg=np.zeros(N)
for a_,b_ in [(0.0,2.6),(15.6,48.4),(92.6,96.2)]:
    i0,i1=int(a_*SR),int((b_+1.2)*SR); r_=np.ones(i1-i0); f_=int(0.4*SR); r_[:f_]=np.linspace(0,1,f_); r_[-int(1.2*SR):]=np.linspace(1,0,int(1.2*SR)); wg[i0:i1]=np.maximum(wg[i0:i1],r_)
v=v  # no reverb (user: no hiss on the voice)
mix=v*1.0 + bed*duck + sfx*0.95*np.maximum(duck,0.55)
fo=np.ones(N); fs=int(1.2*SR); fo[-fs:]=np.linspace(1,0,fs)
mix*=fo
print('voice rms',lufs_like(v),'bed rms',lufs_like(bed*duck),'sfx rms',lufs_like(sfx),'peak',np.abs(mix).max())
sf.write(f'{W}/mix.wav',np.stack([mix,mix],1),SR,subtype='PCM_24')
