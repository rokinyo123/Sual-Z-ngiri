import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import SEGS from "./segs.json";

export const FPS4 = 60;
export const DUR4 = 88.66;
const F = (s: number) => Math.round(s * FPS4);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lerp = (x: number, a: number, b: number, p: number, q: number) => interpolate(x, [a, b], [p, q], { ...clamp, easing: ease });

const INK = "#1A1A1A", RED_L = "#E62E2D", RED_D = "#FF3B3B";
const FontFaces = () => (
  <style>{`
@font-face{font-family:Playfair;src:url(${staticFile("fonts/PlayfairDisplay.ttf")});font-weight:400 900}
@font-face{font-family:Playfair;font-style:italic;src:url(${staticFile("fonts/PlayfairDisplay-Italic.ttf")});font-weight:400 900}
@font-face{font-family:Inter;src:url(${staticFile("fonts/Inter.ttf")});font-weight:100 900}
`}</style>
);

// ---------- video bed: segments with 0.25 s cross-fades ----------
type Seg = { file: string; start: number; t0: number; t1: number; end: number };
const Bed: React.FC = () => (
  <>
    {(SEGS as Seg[]).map((s, i) => {
      const from = F(s.start), dur = F(s.end) - F(s.start);
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <SegV s={s} first={i === 0} />
        </Sequence>
      );
    })}
  </>
);
const SegV: React.FC<{ s: Seg; first: boolean }> = ({ s, first }) => {
  const t = useCurrentFrame() / FPS4 + s.start;              // absolute seconds
  // fade in over the pad before t0 (the previous segment stays fully visible underneath)
  const o = first ? 1 : interpolate(t, [s.start, s.t0 + 0.05], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}><OffthreadVideo src={staticFile(s.file)} muted /></AbsoluteFill>;
};

// ---------- text ----------
// theme: "l" = light footage (graphite text, cream scrim) · "d" = warm/bright footage (white text, dark scrim)
type Line = { t: string; size: number; serif?: boolean; italic?: boolean; red?: boolean; caps?: boolean; w?: number; d?: number };
type Cue = { a: number; b: number; y: number; th: "l" | "d"; lines: Line[]; src?: string };
const CUES: Cue[] = [
  { a: 0.25, b: 2.75, y: 330, th: "l", lines: [{ t: "“Sabah başlayaram”", size: 78, serif: true, italic: true, w: 600 }, { t: "dedinsə…", size: 40, caps: true, red: true, d: 0.9 }] },
  { a: 3.0, b: 6.55, y: 330, th: "l", lines: [{ t: "həyatının", size: 36, caps: true }, { t: "SON 10 İLİ", size: 120, serif: true, red: true, d: 0.35 }, { t: "artıq indidən bilirsən", size: 42, serif: true, italic: true, w: 500, d: 1.8 }] },
  { a: 6.92, b: 9.6, y: 330, th: "l", lines: [{ t: "Qulaq as.", size: 110, serif: true }, { t: "bu sənin də başına gəlir", size: 42, serif: true, italic: true, w: 500, d: 0.85 }] },
  { a: 10.15, b: 14.3, y: 320, th: "l", src: "HERSHFIELD və b., 2009 · fMRI", lines: [{ t: "müasir neyrobiologiya", size: 32, caps: true }, { t: "Gələcək Mənlik", size: 92, serif: true, d: 0.4 }, { t: "İllüziyası", size: 92, serif: true, italic: true, red: true, d: 0.9 }] },
  { a: 14.65, b: 19.25, y: 300, th: "l", lines: [{ t: "beyin MRT-si", size: 34, caps: true }, { t: "“sabah edərəm”", size: 80, serif: true, italic: true, w: 600, d: 0.5 }] },
  { a: 19.55, b: 21.75, y: 300, th: "l", lines: [{ t: "sabahkı sən", size: 36, caps: true }, { t: "özün deyilsən", size: 84, serif: true, d: 0.3 }] },
  { a: 21.9, b: 24.0, y: 300, th: "l", lines: [{ t: "YAD BİR İNSAN", size: 110, serif: true, red: true }] },
  { a: 24.15, b: 27.8, y: 300, th: "l", lines: [{ t: "bu günün yükü", size: 36, caps: true }, { t: "onun belinə", size: 92, serif: true, d: 0.7 }] },
  { a: 28.3, b: 32.75, y: 300, th: "l", lines: [{ t: "min il əvvəl", size: 36, caps: true }, { t: "İslam alimləri adını qoydu", size: 62, serif: true, italic: true, w: 500, d: 0.6 }] },
  { a: 32.95, b: 37.3, y: 300, th: "l", lines: [{ t: "TƏSVİF", size: 170, serif: true, red: true }, { t: "“edəcəyəm” deyib özünü ovutmaq", size: 46, serif: true, italic: true, w: 500, d: 0.9 }] },
  { a: 37.7, b: 41.1, y: 300, th: "l", lines: [{ t: "böyük müfəssir", size: 34, caps: true }, { t: "Fəxrəddin ər-Razi", size: 84, serif: true, d: 0.4 }] },
  { a: 41.45, b: 47.3, y: 300, th: "l", src: "ƏSR SURƏSİ 103:1–2 · ƏR-RAZİ, MƏFATİHUL-ĞEYB", lines: [{ t: "And olsun əsrə", size: 88, serif: true }, { t: "(zamana)", size: 46, serif: true, italic: true, w: 500, d: 0.5 }, { t: "insan ziyan içindədir", size: 56, serif: true, italic: true, red: true, d: 2.4 }] },
  { a: 47.8, b: 51.75, y: 300, th: "d", lines: [{ t: "isti yay günü", size: 36, caps: true }, { t: "buz satan tacir", size: 92, serif: true, d: 1.8 }] },
  { a: 52.15, b: 55.25, y: 300, th: "d", lines: [{ t: "müştəri gəlsə də", size: 50, serif: true, italic: true, w: 500 }, { t: "ƏRİYİR", size: 104, serif: true, red: true, d: 0.75 }, { t: "gəlməsə də", size: 50, serif: true, italic: true, w: 500, d: 1.85 }] },
  { a: 55.6, b: 57.6, y: 300, th: "d", lines: [{ t: "24", size: 190, serif: true, red: true }, { t: "saat", size: 42, caps: true, d: 0.3 }] },
  { a: 57.95, b: 60.7, y: 300, th: "d", lines: [{ t: "işlətsən də", size: 50, serif: true, italic: true, w: 500 }, { t: "BİTİR", size: 104, serif: true, red: true, d: 0.4 }, { t: "gözləsən də", size: 50, serif: true, italic: true, w: 500, d: 1.3 }] },
  { a: 61.0, b: 62.75, y: 300, th: "l", lines: [{ t: "Bəs bu dairəni necə", size: 64, serif: true, italic: true, w: 600 }, { t: "qırmalı?", size: 130, serif: true, red: true, d: 0.5 }] },
  { a: 63.2, b: 66.25, y: 300, th: "l", lines: [{ t: "İslam + psixologiya", size: 72, serif: true }, { t: "ortaq məsləhət — bir", size: 40, caps: true, d: 1.2 }] },
  { a: 66.5, b: 68.6, y: 300, th: "l", lines: [{ t: "5 DƏQİQƏ", size: 150, serif: true, red: true }, { t: "və indi qanunu", size: 42, caps: true, d: 0.5 }] },
  { a: 69.0, b: 70.3, y: 300, th: "d", lines: [{ t: "Böyük planlar qurma", size: 70, serif: true }] },
  { a: 70.6, b: 75.2, y: 280, th: "l", lines: [{ t: "Tövbə · Kitab · Namaz", size: 64, serif: true }, { t: "yarımçıq iş", size: 54, serif: true, italic: true, w: 500, d: 1.9 }, { t: "sabaha saxlama", size: 40, caps: true, red: true, d: 3.3 }] },
  { a: 75.55, b: 79.5, y: 230, th: "l", lines: [{ t: "bu video bitən kimi", size: 36, caps: true }, { t: "5 dəqiqəlik", size: 76, serif: true, d: 1.2 }, { t: "ilk addım", size: 76, serif: true, italic: true, red: true, d: 1.6 }] },
  { a: 79.85, b: 83.7, y: 290, th: "l", lines: [{ t: "cənnət də, uğur da", size: 64, serif: true, italic: true, w: 500 }, { t: "“sabah” deyənlərin deyil", size: 44, caps: true, d: 1.4 }] },
  { a: 84.1, b: 999, y: 310, th: "d", lines: [{ t: "elə indi", size: 50, caps: true }, { t: "BAŞLA", size: 170, serif: true, red: true, d: 0.3 }] },
];

const Scrim: React.FC<{ t: number }> = ({ t }) => {
  // soft top gradient, only while a cue is on screen; colour follows the footage
  let l = 0, d = 0;
  for (const c of CUES) {
    const k = Math.min(lerp(t, c.a - 0.2, c.a + 0.3, 0, 1), c.b >= 999 ? 1 : lerp(t, c.b - 0.1, c.b + 0.4, 1, 0));
    if (c.th === "l") l = Math.max(l, k); else d = Math.max(d, k);
  }
  return (
    <>
      <AbsoluteFill style={{ opacity: l * 0.78, background: "linear-gradient(180deg, rgba(240,237,231,0.95) 0%, rgba(240,237,231,0.85) 18%, rgba(240,237,231,0.0) 40%)" }} />
      <AbsoluteFill style={{ opacity: d * 0.9, background: "linear-gradient(180deg, rgba(12,8,4,0.85) 0%, rgba(12,8,4,0.65) 24%, rgba(12,8,4,0.0) 44%)" }} />
    </>
  );
};

const CueV: React.FC<{ c: Cue; t: number }> = ({ c, t }) => {
  if (t < c.a - 0.05 || t > c.b + 0.4) return null;
  const out = c.b >= 999 ? 1 : lerp(t, c.b - 0.05, c.b + 0.3, 1, 0);
  let y = c.y;
  const dark = c.th === "d";
  return (
    <>
      {c.lines.map((ln, i) => {
        const a = c.a + (ln.d || 0);
        const k = lerp(t, a, a + 0.55, 0, 1);
        const yy = y + ln.size * 0.55; y += ln.size * (ln.caps ? 1.75 : 1.32);
        if (k <= 0) return null;
        const color = ln.red ? (dark ? RED_D : RED_L) : dark ? "#FFFFFF" : INK;
        return (
          <div key={i} style={{
            position: "absolute", left: 60, right: 60, top: yy, transform: `translateY(-50%) translateY(${(1 - k) * 18}px)`,
            textAlign: "center", opacity: k * out, filter: `blur(${(1 - k) * 8}px)`,
            fontFamily: ln.serif ? "Playfair" : "Inter", fontStyle: ln.italic ? "italic" : "normal", fontWeight: ln.w ?? (ln.serif ? 800 : 700),
            fontSize: ln.size, lineHeight: 1.05, color, letterSpacing: ln.caps ? ln.size * 0.18 : 0, textTransform: ln.caps ? "uppercase" : "none",
            textShadow: dark ? "0 2px 18px rgba(0,0,0,0.55)" + (ln.red ? ", 0 0 26px rgba(255,59,59,0.45)" : "") : "0 1px 12px rgba(240,237,231,0.6)",
          }}>{ln.t}</div>
        );
      })}
      {c.src && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: lerp(t, c.a + 0.6, c.a + 1.2, 0, 0.7) * out,
          fontFamily: "Inter", fontSize: 24, fontWeight: 600, letterSpacing: 2, color: dark ? "rgba(255,255,255,0.8)" : "rgba(26,26,26,0.6)" }}>{c.src}</div>
      )}
    </>
  );
};

// ---------- audio ----------
const SFX: [string, number, number?][] = [
  ["whoosh", 1.7], ["boom", 8.1],
  ["whoosh", 10.8], ["click", 13.0], ["whoosh", 15.3], ["whoosh", 17.0],
  ["whoosh", 21.9], ["boom", 26.6],
  ["crack", 28.4], ["whoosh", 29.6], ["boom", 32.95],
  ["whoosh", 35.3], ["click", 37.9], ["whoosh", 41.5], ["click", 44.4],
  ["whoosh", 47.6], ["melt", 51.0], ["whoosh", 55.0], ["click", 57.2],
  ["clock", 61.0], ["click", 65.4], ["whoosh", 66.3], ["boom", 67.45],
  ["whoosh", 70.3], ["whoosh", 75.4], ["click", 76.0],
  ["riser", 81.0], ["lock", 84.0], ["boom", 84.02], ["whoosh", 84.6],
];
const SFX_LEN: Record<string, number> = { whoosh: 1.0, boom: 1.6, clock: 4.4, lock: 1.2, riser: 3.05, click: 0.6, melt: 4.0, crack: 0.55 };

export const FlowMain: React.FC = () => {
  const t = useCurrentFrame() / FPS4;
  const fadeOut = interpolate(t, [DUR4 - 0.5, DUR4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontFaces />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <Bed />
        <Scrim t={t} />
        {CUES.map((c, i) => <CueV key={i} c={c} t={t} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1585, textAlign: "center", fontFamily: "Inter", fontWeight: 700,
          fontSize: 34, letterSpacing: 3, color: "rgba(255,255,255,0.88)", opacity: interpolate(t, [0.3, 1.2], [0, 1], clamp),
          textShadow: "0 1px 3px rgba(0,0,0,0.55), 0 0 14px rgba(0,0,0,0.35)" }}>@esgarow</div>
      </AbsoluteFill>
      <Audio src={staticFile("ses.mp3")} volume={1.0} />
      <Audio src={staticFile("sfx/music.wav")} volume={(f) => interpolate(f / FPS4, [0, 1.0, 86.3, 87.0, DUR4 - 0.4, DUR4], [0, 0.14, 0.14, 0.28, 0.28, 0], clamp)} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={"x" + i} from={F(s)} durationInFrames={F(SFX_LEN[n])}>
          <Audio src={staticFile(`sfx/${n}.wav`)} volume={0.95 * (v ?? 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
