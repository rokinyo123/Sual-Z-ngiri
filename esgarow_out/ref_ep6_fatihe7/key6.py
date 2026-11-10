import sys, numpy as np
from PIL import Image
def key(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    gr = g - np.maximum(r, b)
    alpha = np.clip(1 - (gr - 25) / 55, 0, 1)
    g2 = np.minimum(g, np.maximum(r, b) * 1.05)  # despill
    out = np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)
    return out
def save_split(path, prefix, n=None):
    o = key(path); al = o[..., 3] > 40
    if n is None:
        ys, xs = np.where(al); Image.fromarray(o[ys.min():ys.max()+1, xs.min():xs.max()+1]).save(prefix + '.png'); return
    col = al.sum(0) > 3; runs = []; i = 0
    while i < len(col):
        if col[i]:
            j = i
            while j < len(col) and col[j]: j += 1
            runs.append((i, j)); i = j
        else: i += 1
    runs = sorted(runs, key=lambda r: r[1] - r[0], reverse=True)[:n]; runs.sort()
    for k, (x0, x1) in enumerate(runs):
        sub = o[:, x0:x1]; ys = np.where(sub[..., 3].max(1) > 40)[0]
        Image.fromarray(sub[ys.min():ys.max()+1]).save(f'{prefix}_{k+1}.png')
    print(prefix, len(runs), [r[1]-r[0] for r in runs])
d = sys.argv[1]
d = sys.argv[1]
save_split('img/g_kandil.jpg', d + '/kandil')
save_split('img/g_qapi.jpg', d + '/qapi', 3)
save_split('img/g_qapi.jpg', d + '/qapi_all')
save_split('img/g_ikonA.jpg', d + '/A', 5)
save_split('img/g_ikonB.jpg', d + '/B', 5)
save_split('img/g_ikonC.jpg', d + '/C', 5)
