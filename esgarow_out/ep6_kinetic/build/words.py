import json,sys
al=json.load(open(sys.argv[1])); gaps=[tuple(map(float,x.split('-'))) for x in open(sys.argv[2]).read().split()]
V=set('aıoueəiöüAIOUEƏİÖÜ')
for s in al:
    ws=s['text'].split(); syl=[max(1,sum(c in V for c in w)) for w in ws]; tot=sum(syl); t=s['t0']; out=[]
    for w,n in zip(ws,syl):
        # snap to a fine gap end within 0.18 s
        c=[g[1] for g in gaps if abs(g[1]-t)<0.18 and s['t0']<=g[1]<s['t1']]
        tt=min(c,key=lambda x:abs(x-t)) if c and t>s['t0'] else t
        out.append('%s@%.2f'%(w,tt)); t+= (s['t1']-s['t0'])*n/tot
    print(' '.join(out))
