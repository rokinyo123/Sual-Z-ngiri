import json, wave, sys
import numpy as np

T = json.load(open(sys.argv[1]))
SR = 44100
DUR = T["_total"]
out = np.zeros(int(SR * (DUR + 1)))
rng = np.random.default_rng(5)

def add(sig, t, g=1.0):
    i = int(t * SR); n = min(len(sig), len(out) - i)
    if n > 0 and i >= 0: out[i:i + n] += sig[:n] * g
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.002, dec=0.05):
    x = tt(d); return np.minimum(1, x / a) * np.exp(-x / dec)
def tone(f, d, dec, a=0.002): x = tt(d); return np.sin(2 * np.pi * f * x) * env(d, a, dec)
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, a):
    # one-pole lowpass, vectorised via cumulative filter approximation
    from math import exp
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y
def bp(x, lo, hi): return lp(x, hi) - lp(x, lo)

# precomputed building blocks
thump = (tone(55, 0.35, 0.09) + 0.6 * tone(95, 0.35, 0.06))
lub = tone(48, 0.25, 0.07, 0.006) + 0.5 * tone(80, 0.25, 0.05, 0.006)
dub = 0.7 * (tone(62, 0.22, 0.06, 0.005) + 0.4 * tone(100, 0.22, 0.04, 0.005))
click = bp(noise(0.03), 0.15, 0.9) * env(0.03, 0.0005, 0.005)
tick = tone(3200, 0.03, 0.004) * 0.6 + click * 0.4

def heartbeat(a, b, g=1.0, bpm=72):
    per = 60 / bpm; n = int(a / per) - 1
    while True:
        t1 = (n + 0.05) * per; t2 = (n + 0.25) * per
        if t1 > b: break
        if t1 >= a: add(lub, t1, g)
        if a <= t2 <= b: add(dub, t2, g)
        n += 1



def whoosh(d, a=0.06): return lp(noise(d), a) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 2
def pop(f=880): return tone(f, 0.12, 0.03) * 0.8 + tone(f * 1.5, 0.12, 0.02) * 0.4
def plop(f0=300, f1=1200, d=0.12, dec=0.04):
    n = int(d * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR) * np.exp(-x / dec)
def water(d, lo=0.05, hi=0.5, mod=6):
    x = tt(d); return bp(noise(d), lo, hi) * (0.7 + 0.3 * np.sin(2 * np.pi * mod * x + rng.random() * 6)) * np.minimum(1, x / 0.3) * np.minimum(1, (d - x) / 0.4)
def bubbles(a, b, rate=6, g=0.12):
    t = a
    while t < b:
        add(plop(rng.uniform(400, 900), rng.uniform(1200, 2400), 0.06, 0.02), t, g * rng.uniform(0.5, 1)); t += rng.exponential(1 / rate)
def counter(a, b, g=0.14):
    t = a
    while t < b:
        u = (t - a) / max(0.01, b - a); add(tick, t, g); t += 0.035 + 0.1 * u * u

def chime(f=880, d=2.5):
    return sum(tone(f * m, d, d / (2 + m)) * g for m, g in [(1, 0.6), (2.01, 0.3), (3.02, 0.15)])
def swoosh(t, d=0.7, g=0.18, a=0.06): add(whoosh(d, a), t - d * 0.6, g)
def chirp(f0, f1, d):
    n = int(d * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR) * np.sin(np.linspace(0, np.pi, n)) ** 2
def birds(a, b, g=0.06):
    t = a
    while t < b:
        f = rng.uniform(2600, 4200)
        for k in range(rng.integers(2, 5)): add(chirp(f, f * rng.uniform(1.2, 1.6), 0.07), t + k * 0.11, g * rng.uniform(0.5, 1))
        t += rng.uniform(0.6, 1.6)
def breeze(a, b, g=0.08):
    d = b - a; x = tt(d); add(lp(noise(d), 0.01) * 3 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.2 * x)) * np.minimum(1, x / 1) * np.minimum(1, (d - x) / 1), a, g)
def buzz(a, b, g=0.12):
    d = b - a; x = tt(d); f = 220 + 15 * np.sin(2 * np.pi * 3 * x)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = (np.sign(np.sin(ph)) * 0.3 + np.sin(2 * ph) * 0.3) * (0.7 + 0.3 * np.sin(2 * np.pi * 37 * x))
    env = np.minimum(1, x / (d * 0.7)) * np.minimum(1, (d - x) / 0.3)
    add(lp(sig, 0.25) * env, a, g)
def shimmer(t0, d=1.2, g=0.1):
    n = int(d * SR); x = np.arange(n) / SR; out_ = np.zeros(n)
    for k in range(14):
        f = 1500 * 2 ** (k / 6); s0 = k / 14 * d * 0.6; i = int(s0 * SR)
        out_[i:] += np.sin(2 * np.pi * f * x[: n - i]) * np.exp(-x[: n - i] / 0.25) * 0.2
    add(out_, t0, g)
def hiss(t0, d=1.0, g=0.12):
    add((noise(d) - lp(noise(d), 0.3)) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 0.5, t0, g)
def rumble(a, b, g=0.5):
    d = b - a; x = tt(d)
    sig = (np.sin(2 * np.pi * 32 * x) + 0.5 * np.sin(2 * np.pi * 64 * x + np.sin(2 * np.pi * 0.7 * x))) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * x))
    add(sig * np.minimum(1, x / 1.2) * np.minimum(1, (d - x) / 1.2), a, g)
def blips(a, b, g=0.06):
    t = a
    while t < b:
        add(tone(rng.choice([1200, 1600, 2000, 2400, 3000]), 0.06, 0.02), t, g); t += rng.uniform(0.08, 0.35)
def static(a, b, g=0.03):
    d = b - a; x = tt(d); add(bp(noise(d), 0.2, 0.7) * (0.5 + 0.5 * (np.sin(2 * np.pi * 1.3 * x) > 0)) * np.minimum(1, x / 0.5) * np.minimum(1, (d - x) / 0.5), a, g)
def ticks(a, b, g=0.08):
    t = a
    while t < b: add(tick, t, g); t += 1.0
def crickets(a, b, g=0.03):
    t = a
    while t < b:
        x = tt(0.18); add(np.sin(2 * np.pi * 4500 * x) * (np.sin(2 * np.pi * 30 * x) > 0) * np.sin(np.pi * x / 0.18), t, g); t += rng.uniform(0.35, 0.7)
def vibrate(t0, g=0.25):
    x = tt(0.5); add(np.sin(2 * np.pi * 150 * x) * (np.sin(2 * np.pi * 8 * x) > 0) * 0.6, t0, g)
def scratch(a, d, g=0.06):
    n=int(d*SR); x=np.arange(n)/SR
    sig=bp(noise(d),0.08,0.6)*(0.5+0.5*np.abs(np.sin(2*np.pi*7*x+np.sin(2*np.pi*1.3*x)*3)))
    add(sig*np.minimum(1,x/0.05)*np.minimum(1,(d-x)/0.1),a,g)
def pageflip(t0,g=0.25):
    d=0.35; x=tt(d); add(bp(noise(d),0.05,0.5)*np.exp(-x/0.12)*np.minimum(1,x/0.02),t0,g)
def typing(a,b,cps,g=0.05):
    t=a
    while t<b: add(click,t,g*rng.uniform(0.6,1)); t+=1/cps*rng.uniform(0.7,1.3)
def water(a,b,g=0.08):
    d=b-a; x=tt(d); add(bp(noise(d),0.03,0.25)*(0.7+0.3*np.sin(2*np.pi*3*x))*np.minimum(1,x/0.6)*np.minimum(1,(d-x)/0.6),a,g)
def rain(a,b,g=0.1):
    d=b-a; x=tt(d); add((noise(d)-lp(noise(d),0.2))*0.6*np.minimum(1,x/0.8)*np.minimum(1,(d-x)/0.8),a,g)
    t=a
    while t<b: add(plop(1500,3000,0.03,0.008),t,0.03*rng.uniform(0.3,1)); t+=rng.exponential(0.05)
def zap(t0,g=0.15):
    d=0.3; x=tt(d); add(np.sign(np.sin(2*np.pi*(80+400*x)*x*20))*np.exp(-x/0.1)*0.5+noise(d)*np.exp(-x/0.05)*0.3,t0,g)
