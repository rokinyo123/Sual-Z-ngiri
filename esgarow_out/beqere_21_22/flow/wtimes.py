import re,subprocess,json,sys
V=set('aıoueəiöüAIOUEƏİÖÜ')
def speech(a,b,th=-35,d=0.10):
    L=subprocess.run(['ffmpeg','-ss',str(a),'-to',str(b),'-i','ses.mp3','-af',f'silencedetect=n={th}dB:d={d}','-f','null','-'],capture_output=True,text=True).stderr
    s=[float(x)+a for x in re.findall(r'silence_start: ([\d.]+)',L)];e=[float(x)+a for x in re.findall(r'silence_end: ([\d.]+)',L)]
    out=[];p=a
    for x,y in zip(s,e):
        if x-p>0.04: out.append((p,x))
        p=y
    if b-p>0.04: out.append((p,b))
    return out
def times(tokens,a,b,lead=0.0):
    segs=speech(a,b); w=[max(1,sum(c in V for c in t)) for t in tokens]; W=sum(w)
    T=sum(y-x for x,y in segs)
    def at(frac):  # speech-time fraction -> absolute time
        r=frac*T
        for x,y in segs:
            if r<=y-x+1e-9: return x+r
            r-=y-x
        return segs[-1][1]
    res=[];c=0
    for t,ww in zip(tokens,w):
        st=at(c/W); 
        # snap to a speech onset if one is within 0.25 s
        for x,y in segs:
            if abs(x-st)<0.25: st=x
        res.append(round(st-lead,2)); c+=ww
    return res,segs
A21=['Yə','əyyuhə','n-naasu','\'buduu','rabbəkumu','lləzii','xaləqakum','vəlləziinə','min','qablikum','ləalləkum','təttəquun']
A22=['Əlləzii','cəələ','ləkumu','l-ərdə','firaaşəv','vəs-səmaa-ə','binaa-ə','və ənzələ','minə','s-səmaai','maa-ən','fə-əxracə','bihii','minə','s-saməraati','rizqal','ləkum','fəlaa','təc\'əluu','lillaahi','əndaadəv','və əntum','tə\'ləmuun']
t21,s21=times(A21,15.7,30.2); t22,s22=times(A22,30.3,48.3)
print('2:21 segs',[(round(x,2),round(y,2)) for x,y in s21]); print(list(zip(A21,t21)))
print('2:22 segs',[(round(x,2),round(y,2)) for x,y in s22]); print(list(zip(A22,t22)))
AN=['Və','cəalnəs-','səmaa-ə','saqfəm-','məhfuuzaa']
tan,_=times(AN,92.6,96.2); print(list(zip(AN,tan)))
HK=['Yə','əyyuhən-','naas']; th,_=times(HK,0,2.5); print(list(zip(HK,th)))
json.dump(dict(a21=t21,a22=t22,an=tan,hk=th),open('wt.json','w'))
print('--- per clause (commas = the long pauses)')
c1,_=times(A21[:10],15.7,24.9); c2,_=times(A21[10:],25.2,30.1)
d1,_=times(A22[:7],30.3,36.5); d2,_=times(A22[7:17],36.6,44.2); d3,_=times(A22[17:],44.4,48.3)
t21=c1+c2; t22=d1+d2+d3
print(list(zip(A21,t21))); print(list(zip(A22,t22)))
json.dump(dict(a21=t21,a22=t22,an=tan,hk=th),open('wt.json','w'))
