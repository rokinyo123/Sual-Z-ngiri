import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, Easing,
} from "remotion";

export const FPS = 60;
export const DUR_S = 88.6;
const F = (s: number) => Math.round(s * FPS);

// ---------- palette ----------
const CREAM = "#F7F5F0", INK = "#1A1A1A", RED_L = "#E62E2D", RED_D = "#FF2A2A";
const SERIF = "Playfair", SANS = "Inter", AR = "Amiri";

const FontFaces = () => (
  <style>{`
@font-face{font-family:Playfair;src:url(${staticFile("fonts/PlayfairDisplay.ttf")});font-weight:400 900}
@font-face{font-family:Playfair;font-style:italic;src:url(${staticFile("fonts/PlayfairDisplay-Italic.ttf")});font-weight:400 900}
@font-face{font-family:Inter;src:url(${staticFile("fonts/Inter.ttf")});font-weight:100 900}
@font-face{font-family:Amiri;src:url(${staticFile("fonts/Amiri.ttf")})}
`}</style>
);

// ---------- helpers ----------
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: e });
const useT = () => useCurrentFrame() / FPS; // seconds inside the current Sequence

// appear/disappear envelope in seconds (local)
const env = (t: number, a: number, b: number, fi = 0.35, fo = 0.3) =>
  Math.min(lerp(t, a, a + fi, 0, 1), b >= 999 ? 1 : lerp(t, b - fo, b, 1, 0));

// impacts → camera shake (absolute seconds)
const IMPACTS = [4.3, 25.0, 32.95, 61.6, 66.62, 84.05];
const Shake: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useCurrentFrame() / FPS;
  let x = 0, y = 0, r = 0;
  for (const i of IMPACTS) {
    const d = t - i;
    if (d >= 0 && d < 0.5) {
      const k = Math.exp(-d * 9) * 18;
      x += Math.sin(d * 95) * k; y += Math.cos(d * 83) * k * 0.8; r += Math.sin(d * 70) * k * 0.02;
    }
  }
  return <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) rotate(${r}deg)` }}>{children}</AbsoluteFill>;
};

// ---------- backgrounds ----------
const Dark: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 48%, rgba(255,255,255,0.06), rgba(0,0,0,0) 70%)" }} />
  </AbsoluteFill>
);
const Paper: React.FC = () => (
  <AbsoluteFill style={{
    background: CREAM,
    backgroundImage:
      "linear-gradient(rgba(26,26,26,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.045) 1px, transparent 1px)",
    backgroundSize: "72px 72px", backgroundPosition: "36px 36px",
  }}>
    <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 50%, rgba(247,245,240,0) 55%, rgba(120,110,95,0.12) 100%)" }} />
  </AbsoluteFill>
);

// film grain (cheap, deterministic)
const Grain: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: dark ? 0.07 : 0.05, mixBlendMode: dark ? "screen" : "multiply" }}>
      <svg width="1080" height="1920">
        <filter id={`g${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#g${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- objects ----------
type ObjP = { n: number; w: number; x?: number; y?: number; r?: number; s?: number; o?: number; dark?: boolean; clip?: string; blur?: number; extra?: React.CSSProperties };
const Obj: React.FC<ObjP> = ({ n, w, x = 0, y = 0, r = 0, s = 1, o = 1, dark, clip, blur = 0, extra }) => (
  <div style={{
    position: "absolute", left: 540 + x, top: 960 + y, width: w,
    transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`, opacity: o,
    filter: (dark
      ? "drop-shadow(0 0 40px rgba(255,255,255,0.10)) drop-shadow(0 30px 40px rgba(0,0,0,0.9))"
      : "drop-shadow(0 28px 30px rgba(26,26,26,0.22)) drop-shadow(0 6px 8px rgba(26,26,26,0.15))") + (blur ? ` blur(${blur}px)` : ""),
    ...extra,
  }}>
    <Img src={staticFile(`icons/obj${n}.png`)} style={{ width: "100%", display: "block", clipPath: clip }} />
  </div>
);
// image aspect ratios (h/w) of the cut PNGs
const AR_ = { 1: 601 / 498, 2: 826 / 613, 3: 558 / 631, 4: 615 / 435, 5: 668 / 552, 6: 962 / 529, 7: 1009 / 490, 8: 378 / 383, 9: 563 / 414, 10: 770 / 499, 11: 577 / 569, 12: 761 / 476, 13: 495 / 565, 14: 1176 / 230, 15: 1122 / 227 } as Record<number, number>;

// ---------- typography ----------
type TxP = { t: number; a: number; b?: number; y: number; size: number; dark?: boolean; red?: boolean; serif?: boolean; italic?: boolean; weight?: number; caps?: boolean; spacing?: number; glow?: boolean; children: React.ReactNode; maxW?: number; punch?: boolean };
const Tx: React.FC<TxP> = ({ t, a, b = 999, y, size, dark, red, serif, italic, weight, caps, spacing, glow, children, maxW = 940, punch }) => {
  const e = env(t, a, b, punch ? 0.18 : 0.45, 0.25);
  if (e <= 0) return null;
  const k = lerp(t, a, a + (punch ? 0.22 : 0.6), 0, 1);
  const color = red ? (dark ? RED_D : RED_L) : dark ? "#FFFFFF" : INK;
  const sc = punch ? interpolate(k, [0, 0.55, 1], [1.35, 0.96, 1]) : 1;
  const shadow = dark && glow
    ? `0 0 18px ${red ? "rgba(255,42,42,0.75)" : "rgba(255,255,255,0.55)"}, 0 0 60px ${red ? "rgba(255,42,42,0.45)" : "rgba(255,255,255,0.25)"}`
    : dark ? "0 0 14px rgba(255,255,255,0.18)" : "none";
  return (
    <div style={{
      position: "absolute", left: 540, top: y, width: maxW, transform: `translate(-50%,-50%) translateY(${(1 - k) * (punch ? 0 : 26)}px) scale(${sc})`,
      textAlign: "center", opacity: e, filter: `blur(${(1 - k) * 10}px)`,
      fontFamily: serif ? SERIF : SANS, fontStyle: italic ? "italic" : "normal",
      fontWeight: weight ?? (serif ? 800 : 700), fontSize: size, lineHeight: 1.08, color,
      letterSpacing: spacing ?? (caps ? size * 0.06 : 0), textTransform: caps ? "uppercase" : "none", textShadow: shadow,
    }}>{children}</div>
  );
};
const R: React.FC<{ dark?: boolean; children: React.ReactNode }> = ({ dark, children }) =>
  <span style={{ color: dark ? RED_D : RED_L }}>{children}</span>;
const Rule: React.FC<{ t: number; a: number; b?: number; y: number; w?: number; dark?: boolean }> = ({ t, a, b = 999, y, w = 120, dark }) => {
  const k = lerp(t, a, a + 0.5, 0, 1) * env(t, a, b, 0.01, 0.25);
  return <div style={{ position: "absolute", left: 540 - (w * k) / 2, top: y, width: w * k, height: 4, background: dark ? RED_D : RED_L }} />;
};
const Source: React.FC<{ t: number; a: number; b?: number; dark?: boolean; children: React.ReactNode }> = ({ t, a, b = 999, dark, children }) => (
  <div style={{
    position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", opacity: env(t, a, b, 0.5, 0.3) * 0.75,
    fontFamily: SANS, fontSize: 26, fontWeight: 500, letterSpacing: 2, color: dark ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.62)",
  }}>{children}</div>
);
// strike line across a line of text
const Strike: React.FC<{ t: number; a: number; y: number; w: number; dark?: boolean }> = ({ t, a, y, w, dark }) => {
  const k = lerp(t, a, a + 0.35, 0, 1);
  return <div style={{ position: "absolute", left: 540 - w / 2, top: y, width: w * k, height: 7, background: dark ? RED_D : RED_L, boxShadow: dark ? "0 0 16px rgba(255,42,42,0.7)" : "none", transform: "rotate(-2deg)" }} />;
};

// ================= SCENES (local seconds = absolute - start) =================

// Mechanic 1 · 0.00–6.75 · calendar spins in, lands on rising weight
const S1: React.FC = () => {
  const t = useT();
  const cw = 430, ww = 560;
  const cin = lerp(t, 0.05, 1.0, 0, 1);
  let cx = (1 - cin) * 900, cy = -250 + Math.sin(t * 2.2) * 10, cr = (1 - cin) * 540 - 7;
  const fall = lerp(t, 2.95, 4.3, 0, 1, Easing.in(Easing.quad));
  const wy0 = 1300, wyTop = 360;
  const rise = lerp(t, 2.93, 4.05, 0, 1);
  const land = t >= 4.3 ? Math.exp(-(t - 4.3) * 5) : 0;
  const settle = lerp(t, 4.3, 4.9, 0, 1, Easing.out(Easing.back(2)));
  const wy = wy0 + (wyTop - wy0) * rise + settle * 55;
  const wTop = wy - (ww * AR_[5]) / 2;
  const cLand = wTop - (cw * AR_[1]) / 2 + 70;
  if (t > 2.95) { cy = -250 + (cLand - -250) * fall + settle * 55; cr = -7 + fall * 4; }
  const squash = 1 - land * 0.07;
  return (
    <AbsoluteFill>
      <Dark />
      <Tx t={t} a={0.2} b={2.9} y={250} size={84} dark serif italic weight={600} glow>“Sabah başlayaram”</Tx>
      <Tx t={t} a={1.2} b={2.9} y={355} size={44} dark red caps glow>dedinsə…</Tx>
      <Obj n={5} w={ww} y={wy} dark extra={{ transform: `translate(-50%,-50%) scale(${1 + land * 0.05},${squash})` }} />
      <Obj n={1} w={cw} x={cx} y={cy} r={cr} dark />
      {t > 4.85 && (() => {
        const k = lerp(t, 4.9, 6.3, 0, 1, Easing.inOut(Easing.sin));
        const lx = 820 * (1 - k) + Math.sin(k * Math.PI * 2.2) * 70 * (1 - k) - 20;
        const ly = -620 + (cy - 150 - -620) * k;
        const lr = 160 * (1 - k) + Math.sin(k * 9) * 18 * (1 - k) + 12;
        return <Obj n={11} w={250} x={lx} y={ly} r={lr} dark />;
      })()}
      <Tx t={t} a={3.05} b={6.75} y={300} size={40} dark caps spacing={8}>həyatının</Tx>
      <Tx t={t} a={3.4} b={6.75} y={400} size={128} dark red serif glow>SON 10 İLİ</Tx>
      <Tx t={t} a={4.9} b={6.75} y={510} size={42} dark serif italic weight={500}>artıq indidən bilirsən</Tx>
    </AbsoluteFill>
  );
};

// transition · "Qulaq as" punches
const T1: React.FC = () => {
  const t = useT(); // starts 6.75
  return (
    <AbsoluteFill>
      <Dark />
      <Tx t={t} a={0.17} b={1.0} y={940} size={150} dark serif punch glow>Qulaq as.</Tx>
      <Tx t={t} a={1.0} b={3.25} y={860} size={64} dark caps spacing={6} punch>bu</Tx>
      <Tx t={t} a={1.15} b={3.25} y={980} size={170} dark red serif punch glow>SƏNİN</Tx>
      <Tx t={t} a={1.45} b={3.25} y={1110} size={58} dark serif italic weight={500}>də başına gəlir</Tx>
    </AbsoluteFill>
  );
};

// Mechanic 2 · 10.00–27.95 · pocket watch → edge-crop; brain opens; mask separates
const S2: React.FC = () => {
  const t = useT(); const T0 = 10.0; const A = (s: number) => s - T0;
  const pw = 520, ph = pw * AR_[2];
  const win = lerp(t, A(10.11), A(11.1), 0, 1);
  const up = lerp(t, A(14.63), A(15.5), 0, 1);
  const wy0 = 150, wyTop = -960 - ph * 0.25;      // only bottom 25 % visible
  const wx = (1 - win) * -1100;
  const wy = wy0 + (wyTop - wy0) * up;
  const wr = (1 - win) * -60 + Math.sin(t * 1.6) * 2;
  const bOpen = spring({ frame: Math.max(0, t - A(15.0)) * FPS, fps: FPS, config: { damping: 14, mass: 0.8 } });
  const sep = lerp(t, A(21.9), A(23.0), 0, 1);
  const toL = lerp(t, A(15.2), A(15.9), 0, 1) * (1 - lerp(t, A(19.3), A(20.1), 0, 1));
  const mri = toL;
  const bx = -190 * toL - 200 * sep, by = 220;
  const mx = 230 * sep, my = 220 + -30 * sep, ms = 0.35 + 0.65 * sep, mr = 14 * sep;
  const drop = lerp(t, A(24.15), A(25.0), 0, 1, Easing.in(Easing.quad));
  const wtY = -1300 + (my - 230 - -1300) * drop;
  const land = t >= A(25.0) ? Math.exp(-(t - A(25.0)) * 6) : 0;
  return (
    <AbsoluteFill>
      <Paper />
      <Obj n={2} w={pw} x={wx} y={wy} r={wr} />
      <Tx t={t} a={A(10.3)} b={A(14.6)} y={1250 + 260} size={36} caps spacing={8}>müasir neyrobiologiya</Tx>
      <Tx t={t} a={A(10.9)} b={A(14.6)} y={330} size={96} serif>Gələcək Mənlik</Tx>
      <Tx t={t} a={A(11.6)} b={A(14.6)} y={445} size={96} serif red italic>İllüziyası</Tx>
      <Source t={t} a={A(11)} b={A(14.6)}>HERSHFIELD və b., 2009 · fMRI</Source>

      {t > A(14.9) && <Obj n={3} w={560} x={bx} y={by} s={0.3 + 0.7 * bOpen} o={Math.min(1, bOpen * 1.5)} />}
      {t > A(15.3) && t < A(20.2) && (
        <Obj n={12} w={300} x={-20 + 250 * mri} y={210} r={4 * mri} s={0.7 + 0.3 * mri} o={mri}
          extra={{ filter: `drop-shadow(0 0 ${20 + 30 * mri}px rgba(140,200,255,${0.55 * mri})) drop-shadow(0 20px 26px rgba(26,26,26,0.25))` }} />
      )}
      {t > A(21.8) && <Obj n={4} w={330} x={mx} y={my} s={ms} r={mr} o={Math.min(1, sep * 3)} />}
      {t > A(24.1) && <Obj n={5} w={260} x={mx} y={wtY} extra={{ transform: `translate(-50%,-50%) scale(${1 + land * 0.06},${1 - land * 0.08})` }} />}

      <Tx t={t} a={A(14.9)} b={A(19.4)} y={420} size={40} caps spacing={6}>beyin MRT-si göstərir</Tx>
      <Tx t={t} a={A(15.9)} b={A(19.4)} y={530} size={80} serif italic weight={600}>“sabah edərəm”</Tx>
      <Tx t={t} a={A(19.51)} b={A(21.85)} y={420} size={44} caps spacing={6}>sabahkı sən</Tx>
      <Tx t={t} a={A(19.9)} b={A(21.85)} y={530} size={90} serif>özün <R>deyil</R></Tx>
      <Tx t={t} a={A(21.9)} b={A(24.1)} y={470} size={120} serif red>YAD BİR İNSAN</Tx>
      <Tx t={t} a={A(24.15)} b={A(27.95)} y={380} size={44} caps spacing={6}>bu günün yükü</Tx>
      <Tx t={t} a={A(25.0)} b={A(27.95)} y={490} size={92} serif>onun <R>belinə</R></Tx>
      <Grain />
    </AbsoluteFill>
  );
};

// Mechanic 3 · 27.95–47.50 · book rises → TƏSVİF → book sinks (top 25 %) → "And olsun əsrə"
const S3: React.FC = () => {
  const t = useT(); const T0 = 27.95; const A = (s: number) => s - T0;
  const bw = 470, bh = bw * AR_[6];
  const rise = lerp(t, A(28.4), A(32.6), 0, 1, Easing.bezier(0.33, 0, 0.15, 1));
  const sink = lerp(t, A(41.41), A(42.6), 0, 1);
  const by0 = 960 + bh / 2 + 40, byC = 230, byLow = 960 + bh * 0.25; // top 25 % visible
  const by = by0 + (byC - by0) * rise + (byLow - byC) * sink;
  const glowK = lerp(t, A(32.95), A(33.4), 0, 1) * env(t, A(32.95), A(37.6), 0.01, 0.5);
  const live = lerp(t, A(29.5), A(31.5), 0, 1) * (1 - sink);
  const zoom = 1 + 0.12 * lerp(t, A(30), A(41.3), 0, 1, Easing.inOut(Easing.sin)) * (1 - sink);
  const breath = 1 + Math.sin(t * 2.1) * 0.018 * live;
  const ry = Math.sin(t * 0.9) * 9 * live, rx = Math.cos(t * 0.7) * 4 * live;
  const ink = lerp(t, A(37.6), A(38.55), 0, 1, Easing.out(Easing.cubic));
  const inkOut = lerp(t, A(40.9), A(41.5), 0, 1);
  const bookTop = by - (bh * zoom) / 2;
  return (
    <AbsoluteFill>
      <Dark />
      <AbsoluteFill style={{ opacity: glowK, background: "radial-gradient(40% 30% at 50% 40%, rgba(255,42,42,0.22), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
        <Obj n={6} w={bw} y={by} dark extra={{
          transform: `translate(-50%,-50%) rotateY(${ry}deg) rotateX(${rx}deg) scale(${zoom * breath})`,
          filter: `drop-shadow(0 0 ${30 + 50 * glowK}px rgba(255,190,120,${0.12 + 0.25 * glowK})) drop-shadow(0 30px 40px rgba(0,0,0,0.9))` }} />
      </div>
      {t > A(37.6) && t < A(41.5) && (
        <Obj n={13} w={390} x={150} y={-1250 + (bookTop + 30 - -1250) * ink - 600 * inkOut} r={-8 + 8 * ink} o={1 - inkOut} dark />
      )}
      <Tx t={t} a={A(28.27)} b={A(32.8)} y={300} size={40} dark caps spacing={10}>min il əvvəl</Tx>
      <Tx t={t} a={A(28.9)} b={A(32.8)} y={400} size={72} dark serif italic weight={500}>İslam alimləri adını qoydu</Tx>
      <Tx t={t} a={A(32.95)} b={A(37.6)} y={330} size={190} dark red serif glow punch>TƏSVİF</Tx>
      <Rule t={t} a={A(33.4)} b={A(37.6)} y={455} w={160} dark />
      <Tx t={t} a={A(33.8)} b={A(37.6)} y={540} size={54} dark serif italic weight={500}>“edəcəyəm” deyib</Tx>
      <Tx t={t} a={A(35.0)} b={A(37.6)} y={620} size={54} dark serif italic weight={500}>özünü ovutmaq</Tx>
      <Tx t={t} a={A(37.7)} b={A(41.3)} y={310} size={38} dark caps spacing={8}>böyük müfəssir</Tx>
      <Tx t={t} a={A(38.2)} b={A(41.3)} y={410} size={84} dark serif glow>Fəxrəddin ər-Razi</Tx>
      <Tx t={t} a={A(41.6)} b={999} y={560} size={104} dark serif glow>And olsun <R dark>əsrə</R></Tx>
      <Tx t={t} a={A(42.2)} b={999} y={690} size={60} dark serif italic weight={500}>(zamana)</Tx>
      <Tx t={t} a={A(43.9)} b={999} y={860} size={62} dark red serif italic glow>insan ziyan içindədir</Tx>
      <Source t={t} a={A(42.5)} dark>ƏSR SURƏSİ 103:1–2 · ƏR-RAZİ, MƏFATİHUL-ĞEYB</Source>
      <Grain dark />
    </AbsoluteFill>
  );
};

// Mechanic 4 · 47.50–60.90 · hourglass → ice merchant, ice melts top-down
const S4: React.FC = () => {
  const t = useT(); const T0 = 47.5; const A = (s: number) => s - T0;
  const hOpen = spring({ frame: Math.max(0, t - A(47.76)) * FPS, fps: FPS, config: { damping: 15 } });
  const side = lerp(t, A(49.4), A(50.2), 0, 1);
  const thIn = lerp(t, A(49.7), A(50.6), 0, 1, Easing.out(Easing.back(1.3)));
  const merc = lerp(t, A(50.6), A(55.4), 0.66, 0.11, Easing.inOut(Easing.quad));   // inset-top fraction of the red column
  const iceIn = lerp(t, A(49.7), A(50.6), 0, 1, Easing.out(Easing.back(1.4)));
  const melt = lerp(t, A(51.4), A(55.4), 0, 0.86, Easing.in(Easing.quad));
  const iw = 380, ih = iw * AR_[8];
  const iceY = 260 + (1 - iceIn) * -1300;
  const puddle = lerp(t, A(52.3), A(55.6), 0, 1);
  return (
    <AbsoluteFill>
      <Paper />
      {t < A(50.3) && <Obj n={7} w={300} x={-120 * side} y={120 + 60 * side} s={(0.2 + 0.8 * hOpen) * (1 - 0.6 * side)} o={Math.min(1, hOpen * 1.6) * (1 - side)} />}
      {t > A(49.6) && (
        <div style={{ position: "absolute", left: 540 - 250, top: 960 + 230 + (1 - thIn) * 900, width: 132, transform: "translate(-50%,-50%)",
          filter: "drop-shadow(0 24px 26px rgba(26,26,26,0.22))" }}>
          <Img src={staticFile("icons/obj14_empty.png")} style={{ width: "100%", display: "block" }} />
          <Img src={staticFile("icons/obj14.png")} style={{ position: "absolute", left: 0, top: 0, width: "100%", display: "block", clipPath: `inset(${merc * 100}% 0 0 0)` }} />
        </div>
      )}
      {/* puddle */}
      <div style={{
        position: "absolute", left: 540 + 170 - 170 * (0.6 + puddle), top: 960 + iceY + ih / 2 - 30, width: 340 * (0.6 + puddle), height: 46 * (0.6 + puddle),
        borderRadius: "50%", background: "radial-gradient(rgba(150,190,215,0.35), rgba(150,190,215,0) 70%)", opacity: puddle,
      }} />
      {t > A(49.6) && (
        <div style={{ position: "absolute", left: 540 + 170, top: 960 + iceY, width: iw, transform: "translate(-50%,-50%)" }}>
          <Img src={staticFile("icons/obj8.png")} style={{
            width: "100%", display: "block",
            clipPath: `inset(${melt * 100}% 0 0 0)`,
            filter: `drop-shadow(0 22px 24px rgba(26,26,26,0.2)) blur(${melt * 1.5}px)`,
          }} />
        </div>
      )}
      <Tx t={t} a={A(47.76)} b={A(49.5)} y={380} size={44} caps spacing={6}>isti yay günü · bazar</Tx>
      <Tx t={t} a={A(49.6)} b={A(52.0)} y={330} size={40} caps spacing={8}>insan</Tx>
      <Tx t={t} a={A(49.9)} b={A(52.0)} y={450} size={104} serif>buz satan <R>tacir</R></Tx>
      <Tx t={t} a={A(52.14)} b={A(55.5)} y={330} size={56} serif italic weight={500}>müştəri gəlsə də —</Tx>
      <Tx t={t} a={A(52.9)} b={A(55.5)} y={430} size={92} serif red>ƏRİYİR</Tx>
      <Tx t={t} a={A(53.98)} b={A(55.5)} y={540} size={56} serif italic weight={500}>gəlməsə də — <R>ƏRİYİR</R></Tx>
      <Tx t={t} a={A(55.6)} b={A(57.85)} y={420} size={210} serif red punch>24</Tx>
      <Tx t={t} a={A(55.9)} b={A(57.85)} y={560} size={48} caps spacing={14}>saat</Tx>
      <Tx t={t} a={A(57.92)} b={A(60.9)} y={360} size={58} serif italic weight={500}>işlətsən də</Tx>
      <Tx t={t} a={A(58.3)} b={A(60.9)} y={460} size={100} serif red>BİTİR</Tx>
      <Tx t={t} a={A(59.2)} b={A(60.9)} y={570} size={58} serif italic weight={500}>gözləsən də <R>BİTİR</R></Tx>
      <Grain />
    </AbsoluteFill>
  );
};

// transition · typographic punches (61.15 / 63.16)
const T3: React.FC = () => {
  const t = useT(); const T0 = 60.9; const A = (s: number) => s - T0;
  return (
    <AbsoluteFill>
      <Dark />
      <Tx t={t} a={A(60.92)} b={A(63.05)} y={820} size={96} dark serif glow punch>Bəs bu dairəni</Tx>
      <Tx t={t} a={A(60.98)} b={A(63.05)} y={930} size={96} dark serif glow punch>necə</Tx>
      <Tx t={t} a={A(61.6)} b={A(63.05)} y={1075} size={170} dark red serif punch glow>qırmalı?</Tx>
      <Tx t={t} a={A(63.16)} b={A(66.45)} y={820} size={86} dark serif punch>İSLAM</Tx>
      <Tx t={t} a={A(63.6)} b={A(66.45)} y={920} size={64} dark red serif punch glow>+</Tx>
      <Tx t={t} a={A(63.9)} b={A(66.45)} y={1020} size={86} dark serif punch>PSİXOLOGİYA</Tx>
      <Tx t={t} a={A(65.1)} b={A(66.45)} y={1150} size={46} dark caps spacing={8}>ortaq məsləhət: <R dark>bir</R></Tx>
    </AbsoluteFill>
  );
};

// Mechanic 5 · 66.40–88.60 · stopwatch slam → list → padlock splits → ELƏ İNDİ BAŞLA
const S5: React.FC = () => {
  const t = useT(); const T0 = 66.4; const A = (s: number) => s - T0;
  const slam = lerp(t, A(66.5), A(66.62), 0, 1, Easing.in(Easing.quad));
  const bounce = t > A(66.62) ? Math.exp(-(t - A(66.62)) * 7) * Math.sin((t - A(66.62)) * 30) * 40 : 0;
  const corner = lerp(t, A(68.98), A(69.7), 0, 1);
  const swH = 470 * AR_[9];
  const sx = (1 - slam) * 1100 + bounce, ss = 1 + 0.22 * corner;
  const sy = 130 + (-960 - swH * ss * 0.5 + swH * ss * 0.42 - 130) * corner;   // pushed to the top edge, lower 34 % visible
  const bead = spring({ frame: Math.max(0, t - A(71.9)) * FPS, fps: FPS, config: { damping: 16, mass: 1.1 } });
  const beadOut = lerp(t, A(77.0), A(77.6), 0, 1);
  const lockArr = spring({ frame: Math.max(0, t - A(77.6)) * FPS, fps: FPS, config: { damping: 11 } });
  const tremble = lerp(t, A(82.4), A(84.0), 0, 1) * (t < A(84.02) ? 1 : 0);
  const hit = t > A(83.9) && t < A(84.02) ? 1 - (A(84.02) - t) / 0.12 : 0;
  const lockIn = lockArr;
  const open = lerp(t, A(84.02), A(84.75), 0, 1, Easing.out(Easing.cubic));
  const flash = t > A(84.02) ? Math.exp(-(t - A(84.02)) * 5) : 0;
  const lw = 420, out = lerp(t, A(87.9), A(88.6), 1, 0);
  const lockY = 230 + Math.sin(t * 2.4) * 14 * (1 - open);
  const jx = Math.sin(t * 90) * 7 * tremble, jr = Math.sin(t * 70) * 3 * tremble + Math.sin(t * 1.7) * 3 * (1 - open);
  const list = [["TÖVBƏ", 70.6], ["KİTAB", 71.35], ["NAMAZ", 72.0], ["YARIMÇIQ İŞ", 72.8]] as const;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Dark />
      {t < A(75.5) && <Obj n={9} w={470} x={sx} y={sy} s={ss} r={(1 - slam) * 25} dark />}
      <Tx t={t} a={A(66.62)} b={A(68.9)} y={330} size={170} dark red serif punch glow>5 DƏQİQƏ</Tx>
      <Tx t={t} a={A(67.2)} b={A(68.9)} y={470} size={50} dark caps spacing={8}>və <b>indi</b> qanunu</Tx>
      <Tx t={t} a={A(68.98)} b={A(70.5)} y={900} size={84} dark serif>Böyük planlar</Tx>
      <Tx t={t} a={A(69.3)} b={A(70.5)} y={1000} size={84} dark serif>qurma</Tx>
      {t > A(69.6) && t < A(70.5) && <Strike t={t} a={A(69.6)} y={895} w={620} dark />}
      {list.map(([w, s], i) => (
        <Tx key={w} t={t} a={A(s)} b={A(75.45)} y={420 + i * 105} size={78} dark serif punch glow={i === 3}>{w}</Tx>
      ))}
      <Tx t={t} a={A(74.0)} b={A(75.45)} y={850} size={54} dark red serif italic glow>sabaha saxlama</Tx>
      {t > A(74.2) && t < A(75.45) && <Strike t={t} a={A(74.2)} y={850} w={460} dark />}
      {t > A(71.85) && t < A(77.7) && (
        <Obj n={15} w={150} y={330 + (1 - bead) * 500} r={(1 - bead) * 540 + Math.sin(t * 1.8) * 6} s={0.3 + 0.7 * bead} o={Math.min(1, bead * 2) * (1 - beadOut)} dark
          extra={{ filter: "drop-shadow(0 0 30px rgba(255,170,60,0.35)) drop-shadow(0 20px 30px rgba(0,0,0,0.9))" }} />
      )}

      {/* padlock: two halves */}
      {t > A(77.55) && (
        <>
          <Obj n={10} w={lw} x={jx - open * 300} y={lockY - (1 - lockIn) * 900 + open * 60} r={jr - open * 24} s={(0.6 + 0.4 * lockIn) * (1 - hit * 0.06)} o={Math.min(1, lockIn * 2)} dark clip="inset(0 50% 0 0)" />
          <Obj n={10} w={lw} x={jx + open * 300} y={lockY - (1 - lockIn) * 900 + open * 60} r={jr + open * 24} s={(0.6 + 0.4 * lockIn) * (1 - hit * 0.06)} o={Math.min(1, lockIn * 2)} dark clip="inset(0 0 0 50%)" />
        </>
      )}
      <AbsoluteFill style={{ opacity: flash * 0.9, background: "radial-gradient(35% 25% at 50% 62%, rgba(255,255,255,0.95), rgba(255,42,42,0.35) 45%, rgba(0,0,0,0) 75%)" }} />
      <Tx t={t} a={A(75.54)} b={A(79.7)} y={330} size={46} dark caps spacing={6}>bu video bitən kimi</Tx>
      <Tx t={t} a={A(76.9)} b={A(79.7)} y={450} size={80} dark serif>5 dəqiqəlik <R dark>ilk addım</R></Tx>
      <Tx t={t} a={A(79.83)} b={A(83.95)} y={300} size={60} dark serif italic weight={500}>cənnət də, uğur da</Tx>
      <Tx t={t} a={A(80.9)} b={A(83.95)} y={420} size={52} dark serif weight={500}>“sabah edəcəyəm” deyənlərin</Tx>
      {t > A(82.7) && t < A(83.95) && <Strike t={t} a={A(82.7)} y={420} w={760} dark />}
      <Tx t={t} a={A(84.1)} b={999} y={1050} size={46} dark caps spacing={14} glow>elə indi</Tx>
      <Tx t={t} a={A(84.35)} b={999} y={1185} size={150} dark red serif glow punch>BAŞLA</Tx>
      <Grain dark />
    </AbsoluteFill>
  );
};

// ---------- audio ----------
const SFX: [string, number][] = [
  ["whoosh", 0.05], ["whoosh", 2.93], ["boom", 4.3], ["whoosh", 4.9], ["click", 6.25], ["whoosh", 6.9], ["whoosh", 7.76],
  ["whoosh", 10.11], ["clock", 10.4], ["whoosh", 14.63], ["whoosh", 15.3], ["click", 15.9], ["whoosh", 21.9], ["whoosh", 24.2], ["boom", 25.0],
  ["whoosh", 28.27], ["boom", 32.95], ["whoosh", 37.6], ["click", 38.5], ["whoosh", 41.41],
  ["whoosh", 47.76], ["whoosh", 49.6], ["click", 50.55], ["melt", 51.4], ["clock", 55.6],
  ["whoosh", 60.92], ["boom", 61.6], ["whoosh", 63.16],
  ["whoosh", 66.45], ["boom", 66.62], ["clock", 66.9], ["whoosh", 68.98], ["whoosh", 71.9], ["click", 72.6], ["whoosh", 75.54], ["whoosh", 77.6], ["click", 78.05],
  ["riser", 81.0], ["lock", 84.0], ["boom", 84.05],
];
const SFX_LEN: Record<string, number> = { whoosh: 1.0, boom: 1.6, clock: 2.3, lock: 1.2, riser: 3.05, click: 0.6, melt: 4.0 };

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const scenes: [React.FC, number, number][] = [
    [S1, 0, 6.75], [T1, 6.75, 10.0], [S2, 10.0, 27.95], [S3, 27.95, 47.5], [S4, 47.5, 60.9], [T3, 60.9, 66.4], [S5, 66.4, DUR_S],
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontFaces />
      <Shake>
        {scenes.map(([C, a, b], i) => (
          <Sequence key={i} from={F(a)} durationInFrames={F(b) - F(a)}><C /></Sequence>
        ))}
      </Shake>
      <Audio src={staticFile("ses.mp3")} volume={1.0} />
      <Audio src={staticFile("sfx/music.wav")} volume={(f) => interpolate(f / FPS, [0, 1.0, 86.3, 87.0, 88.0, DUR_S], [0, 0.14, 0.14, 0.3, 0.3, 0], clamp)} />
      {SFX.map(([n, s], i) => (
        <Sequence key={"s" + i} from={F(s)} durationInFrames={F(SFX_LEN[n])}>
          <Audio src={staticFile(`sfx/${n}.wav`)} volume={0.95} />
        </Sequence>
      ))}
      <div style={{ display: "none" }}>{frame}</div>
    </AbsoluteFill>
  );
};
