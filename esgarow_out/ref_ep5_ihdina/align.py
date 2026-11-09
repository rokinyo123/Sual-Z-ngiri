import sys,json,re,subprocess
sil=[tuple(map(float,l.split())) for l in open(sys.argv[1]) if len(l.split())==2]
sents=[l.strip() for l in open(sys.argv[2]) if l.strip()]
dur=float(sys.argv[3])
V=set('aıoueəiöüâAIOUEƏİÖÜÂ')
syl=[sum(c in V for c in s) for s in sents]
# speech segments
segs=[];p=0
for s,e in sil:
    if s-p>0.05: segs.append((p,s))
    p=e
if dur-p>0.05: segs.append((p,dur))
N,M=len(sents),len(segs)
tot=sum(syl); sp=sum(e-s for s,e in segs); R=tot/sp
INF=1e18
import math
# dp[i][j]: first i sentences use first j segments
dp=[[INF]*(M+1) for _ in range(N+1)];bk=[[0]*(M+1) for _ in range(N+1)];dp[0][0]=0
for i in range(1,N+1):
    for j in range(i,M+1):
        for k in range(i-1,j):
            if dp[i-1][k]>=INF: continue
            t=segs[j-1][1]-segs[k][0]; r=syl[i-1]/t
            c=dp[i-1][k]+ (math.log(r/R))**2*syl[i-1]
            if c<dp[i][j]: dp[i][j]=c;bk[i][j]=k
out=[];j=M
for i in range(N,0,-1):
    k=bk[i][j]; out.append((segs[k][0],segs[j-1][1])); j=k
out.reverse()
res=[]
for (a,b),s,n in zip(out,sents,syl):
    r=n/(b-a); res.append({'t0':round(a,2),'t1':round(b,2),'rate':round(r,2),'text':s})
    print('%6.2f %6.2f %4.1f %s %s'%(a,b,r,'!!' if not 3<=r<=7 else '  ',s[:60]))
json.dump(res,open(sys.argv[4],'w'),ensure_ascii=False,indent=1)
print('mean rate',round(R,2),'segs',M)
