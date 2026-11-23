import json, subprocess, numpy as np, soundfile as sf, librosa, os
W='/tmp/claude-0/-home-user-Sual-Z-ngiri/082ffc7a-b076-5133-a44d-2027c5a445c7/scratchpad/b1920'
SR=48000; DUR=168.8; N=int(DUR*SR)
segs=json.load(open(f'{W}/segs.json'))
MUSIC={'k02','k03','k05','k06','k09','k13','k15','k18'}
os.makedirs(f'{W}/nat',exist_ok=True)
def nat(k):
    p=f'{W}/nat/{k}.wav'
    if os.path.exists(p): return p
    src=f'{W}/clips/{k}.mp4' if k not in('k04','k05','k06') else f'{W}/clips/{k}_orig.mp4'
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
    r=(t1-t0)/(b-a); pa=min(PAD/r,a); pb=min(PAD/r,10.0267-b); sa,sb=a-pa,b+pb
    out=subprocess.run(['ffmpeg','-v','error','-ss',f'{sa:.3f}','-to',f'{sb:.3f}','-i',nat(c),'-af',atempo(1/r),'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True,check=True).stdout
    x=np.frombuffer(out,np.float32).astype(float)
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
put(rain(52.6-33.8),33.8,-30)                   # k05-k06 quiet: soft rain bed
put(pop(),11.85,-16); put(wav('whoosh'),21.0,-24)  # cork, Quran rises
put(rustle(1.0),26.2,-22)                        # pages open
put(shimmer(2.0),44.6,-28)                       # particles rise
put(scrape(0.8),96.0,-22)                        # bowl slides away
put(pop(),102.2,-18); put(wav("melt"),103.0,-20)   # cork deeper, wax
put(wav('whoosh'),106.9,-20); put(shimmer(2.5),107.4,-24)   # dome
put(roll(1.0),113.5,-20); put(roll(1.2),114.9,-20)          # marble moves in flashes
put(roll(2.2),120.2,-22); put(clink(0.6),123.3,-24); put(clink(0.6),123.6,-27)  # rush to gold, coins
put(wav('crack'),124.6,-14); put(swish(1.2,200,3000),124.5,-20)   # thorns + wind
put(ring(),131.0,-20)                            # coin stands up
put(clink(0.5),140.45,-18); put(swish(1.0,300,3000),139.9,-22)    # flip + gust
put(swish(1.3,120,1500),146.6,-18); put(swish(1.1,120,1500),148.0,-21)  # rug rolls
put(swish(1.1,120,1500),153.1,-20)               # rug unrolls
put(wav('boom'),160.8,-12); put(wav('boom'),166.35,-15)   # globe, end card
# --- ducking under voice ---
v,_=librosa.load(f'{W}/ses.mp3',sr=SR); v=np.pad(v,(0,max(0,N-len(v))))[:N]
hop=480; rms=np.sqrt(np.convolve(v**2,np.ones(hop*4)/(hop*4),'same'))[::hop]
act=(rms>0.012).astype(float)
g=np.zeros_like(act); a=0
for i,x in enumerate(act): a=a+(x-a)*(0.5 if x>a else 0.04); g[i]=a      # fast attack, ~0.25 s release
duck=np.interp(np.arange(N),np.arange(len(g))*hop,1-0.78*g)               # ~ -11 dB under speech
def lufs_like(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
bed=bed/ (np.percentile(np.abs(bed),99.5)+1e-9)*0.6
mix=v*1.0 + bed*duck + sfx*0.95*np.maximum(duck,0.55)
fo=np.ones(N); fs=int(1.2*SR); fo[-fs:]=np.linspace(1,0,fs)
mix*=fo
print('voice rms',lufs_like(v),'bed rms',lufs_like(bed*duck),'sfx rms',lufs_like(sfx),'peak',np.abs(mix).max())
sf.write(f'{W}/mix.wav',np.stack([mix,mix],1),SR,subtype='PCM_24')
