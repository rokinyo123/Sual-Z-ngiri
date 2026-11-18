import sys, glob
from PIL import Image
d, out, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 9
fs = sorted(glob.glob(d + '/*.jpg')); im0 = Image.open(fs[0]); w = 300 if im0.size[1] > im0.size[0] else 480; h = int(w * im0.size[1] / im0.size[0])
rows = (len(fs) + cols - 1) // cols; s = Image.new('RGB', (cols * w, rows * h), 'white')
for i, f in enumerate(fs): s.paste(Image.open(f).resize((w, h)), ((i % cols) * w, (i // cols) * h))
s.save(out)
