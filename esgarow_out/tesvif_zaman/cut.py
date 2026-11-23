import sys, glob, numpy as np
from PIL import Image, ImageFilter
from rembg import remove, new_session
D=sys.argv[1]
M={'White_calendar':1,'Silver_pocket':2,'Anatomical':3,'Porcelain':4,'Cast_iron':5,'Leather':6,'Glass_hourglass':7,'Melting_ice':8,'Silver_mechanical':9,'Matte_black':10}
sess=new_session('isnet-general-use')
for f in sorted(glob.glob(D+'/src/*.jpg')):
    n=[v for k,v in M.items() if k in f][0]
    im=Image.open(f).convert('RGB')
    m=np.asarray(remove(im,session=sess,only_mask=True)).astype(np.float32)/255
    rgb=np.asarray(im).astype(np.float32)
    # luminance: near-paper pixels -> fully clear (kills the white rim / square)
    bg=np.median(np.concatenate([rgb[:8].reshape(-1,3),rgb[-8:].reshape(-1,3)]),0)
    dist=np.sqrt(((rgb-bg)**2).sum(2))
    lum=np.clip((dist-6)/22,0,1)
    a=np.minimum(m, np.maximum(lum, (m>0.98)*m))   # inside solid object keep; at edges require colour difference
    a=np.asarray(Image.fromarray((a*255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32)/255
    a[a<0.04]=0
    # decontaminate: remove the white paper mixed into edge pixels
    af=np.maximum(a,1e-3)[...,None]
    c=np.clip((rgb-(1-af)*bg)/af,0,255)
    out=np.dstack([c,a*255]).astype(np.uint8)
    o=Image.fromarray(out,'RGBA'); bb=o.getbbox(); o=o.crop((max(0,bb[0]-6),max(0,bb[1]-6),min(o.width,bb[2]+6),min(o.height,bb[3]+6)))
    o.save(f'{D}/proj/public/icons/obj{n}.png'); print(n,o.size)
