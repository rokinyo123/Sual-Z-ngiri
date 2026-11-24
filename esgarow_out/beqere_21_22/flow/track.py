import cv2, numpy as np, json, sys
def read(path):
    cap=cv2.VideoCapture(path); fr=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        fr.append(f)
    return fr
def track(frames, ref, quads, start=0, end=None):
    """quads: dict name->4x2 at frame ref. returns dict name->list of 4x2 (None outside [start,end))"""
    n=len(frames); end=n if end is None else end
    gray=[cv2.cvtColor(f,cv2.COLOR_BGR2GRAY) for f in frames]
    out={k:[None]*n for k in quads}
    for k,q in quads.items(): out[k][ref]=np.float32(q)
    for direction in (1,-1):
        cur={k:np.float32(q) for k,q in quads.items()}
        f=ref
        while True:
            g=f+direction
            if g<start or g>=end: break
            for k in cur:
                m=np.zeros(gray[f].shape,np.uint8); cv2.fillConvexPoly(m,np.int32(cur[k]),255)
                m=cv2.erode(m,np.ones((15,15),np.uint8))
                p=cv2.goodFeaturesToTrack(gray[f],400,0.01,6,mask=m)
                if p is None or len(p)<12: out[k][g]=cur[k]; continue
                p2,st,_=cv2.calcOpticalFlowPyrLK(gray[f],gray[g],p,None,winSize=(21,21),maxLevel=3)
                pb,st2,_=cv2.calcOpticalFlowPyrLK(gray[g],gray[f],p2,None,winSize=(21,21),maxLevel=3)
                good=(st[:,0]==1)&(st2[:,0]==1)&(np.linalg.norm(pb-p,axis=2)[:,0]<1.0)
                if good.sum()<10: out[k][g]=cur[k]; continue
                H,_=cv2.findHomography(p[good],p2[good],cv2.RANSAC,2.0)
                if H is None: out[k][g]=cur[k]; continue
                cur[k]=cv2.perspectiveTransform(cur[k].reshape(-1,1,2),H).reshape(-1,2)
                out[k][g]=cur[k]
            f=g
    return out
if __name__=='__main__':
    clip,ref,qj,outj=sys.argv[1],int(sys.argv[2]),sys.argv[3],sys.argv[4]
    start=int(sys.argv[5]) if len(sys.argv)>5 else 0
    fr=read(clip); qs=json.loads(qj)
    o=track(fr,ref,qs,start)
    json.dump({k:[None if v is None else v.tolist() for v in vs] for k,vs in o.items()},open(outj,'w'))
    # visual check
    tiles=[]
    for i in range(0,len(fr),24):
        im=fr[i].copy()
        for k,vs in o.items():
            if vs[i] is not None: cv2.polylines(im,[np.int32(vs[i])],True,(0,0,255),3)
        cv2.putText(im,str(i),(10,40),0,1.2,(0,255,0),2); tiles.append(cv2.resize(im,(144,256)))
    cv2.imwrite(outj.replace('.json','.jpg'),np.hstack(tiles))
