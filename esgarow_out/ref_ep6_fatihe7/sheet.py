import sys,glob
from PIL import Image,ImageDraw
fs=sys.argv[2:]; n=len(fs); cols=min(n,5); rows=(n+cols-1)//cols
c=Image.new('RGB',(cols*360,rows*660),(20,20,20)); d=ImageDraw.Draw(c)
for i,f in enumerate(fs):
  im=Image.open(f).resize((360,640)); c.paste(im,((i%cols)*360,(i//cols)*660)); d.text(((i%cols)*360+5,(i//cols)*660+642),f.split('/')[-1],fill='white')
c.save(sys.argv[1])
