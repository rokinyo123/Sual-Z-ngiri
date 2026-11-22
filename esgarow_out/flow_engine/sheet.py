import sys, glob
from PIL import Image, ImageDraw
d = sys.argv[1]; fs = sorted(glob.glob(d + '/t*.png')); W, H = 216, 384; c = 10
s = Image.new('RGB', (W * c, H * ((len(fs) + c - 1) // c)), 'gray'); dr = ImageDraw.Draw(s)
for k, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((W, H)); s.paste(im, ((k % c) * W, (k // c) * H))
    dr.text(((k % c) * W + 4, (k // c) * H + 4), f.split('/t')[-1][:-4], fill='lime')
s.save(sys.argv[2], quality=85)
