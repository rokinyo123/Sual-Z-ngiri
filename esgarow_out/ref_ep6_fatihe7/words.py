import json
V=set('aıoueəiöüâAIOUEƏİÖÜÂ')
al=json.load(open('align.json'));gaps=[tuple(map(float,l.split())) for l in open('sil_fine.txt') if len(l.split())==2]
out=[]
for s in al:
    a,b=s['t0'],s['t1']
    # speech chunks inside
    ch=[];p=a
    for g0,g1 in gaps:
        if g1<=a or g0>=b: continue
        if g0-p>0.03: ch.append((p,g0))
        p=max(p,g1)
    if b-p>0.03: ch.append((p,b))
    words=s['text'].split(); syl=[max(1,sum(c in V for c in w)) for w in words]; tot=sum(syl)
    sp=sum(e-s0 for s0,e in ch)
    def at(x): # x seconds of speech -> time
        for s0,e in ch:
            if x<=e-s0: return s0+x
            x-=e-s0
        return b
    cum=0;row=[]
    for w,n in zip(words,syl):
        row.append('%s@%.2f'%(w,at(cum/tot*sp))); cum+=n
    print(' '.join(row)); print('   chunks:',' '.join('%.2f-%.2f'%c for c in ch))
