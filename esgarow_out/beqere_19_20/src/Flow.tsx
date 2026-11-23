import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import SEGS from "./segs.json";

export const FPS4 = 60;
export const DUR4 = 168.8;
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
  { a: 4.0, b: 6.95, y: 250, th: "d", lines: [{ t: "ŞİMŞƏK", size: 150, serif: true, red: true }, { t: "az qala gözlərini aparacaq", size: 50, serif: true, italic: true, w: 500, d: 0.7 }] },
  { a: 7.35, b: 12.45, y: 250, th: "d", lines: [{ t: "ildırımdan qorxub", size: 36, caps: true }, { t: "barmaqlarını", size: 84, serif: true, d: 2.2 }, { t: "qulaqlarına tıxayırlar", size: 60, serif: true, italic: true, w: 600, d: 3.1 }] },
  { a: 12.7, b: 16.85, y: 250, th: "d", lines: [{ t: "qorxudan ildırım deyil…", size: 54, serif: true, italic: true, w: 500 }, { t: "YAĞIŞIN", size: 130, serif: true, red: true, d: 2.7 }, { t: "ÖZÜDÜR", size: 130, serif: true, red: true, d: 3.0 }] },
  { a: 17.1, b: 20.85, y: 230, th: "d", src: "BƏQƏRƏ 2:19–20", lines: [{ t: "münafiqlər üçün", size: 36, caps: true }, { t: "İKİNCİ MƏSƏL", size: 104, serif: true, d: 1.2 }] },
  { a: 52.56, b: 59.7, y: 240, th: "d", lines: [{ t: "mənası", size: 36, caps: true }, { t: "leysan", size: 90, serif: true, d: 1.6 }, { t: "qaranlıq · ildırım · şimşək", size: 50, serif: true, italic: true, w: 500, d: 3.2 }] },
  { a: 60.0, b: 63.15, y: 250, th: "d", lines: [{ t: "ölüm qorxusundan", size: 36, caps: true }, { t: "barmaqlar qulaqda", size: 82, serif: true, d: 0.9 }] },
  { a: 63.33, b: 65.85, y: 250, th: "d", lines: [{ t: "şimşək", size: 36, caps: true }, { t: "gözləri aparır", size: 88, serif: true, red: true, d: 0.6 }] },
  { a: 66.0, b: 70.5, y: 240, th: "d", lines: [{ t: "işıq saçanda", size: 34, caps: true }, { t: "YERİYİRLƏR", size: 96, serif: true, d: 0.5 }, { t: "qaranlıq çökəndə", size: 34, caps: true, d: 2.0 }, { t: "DAYANIRLAR", size: 96, serif: true, red: true, d: 2.6 }] },
  { a: 70.7, b: 75.1, y: 270, th: "d", lines: [{ t: "Allah istəsəydi", size: 80, serif: true, italic: true, w: 600 }, { t: "eşitməsini də, görməsini də", size: 34, caps: true, d: 1.5 }] },
  { a: 75.26, b: 78.25, y: 270, th: "d", lines: [{ t: "hər şeyə", size: 40, caps: true }, { t: "QADİRDİR", size: 130, serif: true, red: true, d: 0.9 }] },
  { a: 78.42, b: 79.7, y: 280, th: "d", lines: [{ t: "gəl xırdalayaq", size: 86, serif: true, italic: true, w: 600 }] },
  { a: 79.84, b: 86.95, y: 230, th: "d", src: "İBN KƏSİR · ƏT-TƏBƏRİ", lines: [{ t: "bu yağış", size: 38, caps: true }, { t: "QURANDIR", size: 140, serif: true, red: true, d: 1.4 }, { t: "torpağa həyat — qəlbə həyat", size: 50, serif: true, italic: true, w: 500, d: 3.3 }] },
  { a: 87.19, b: 92.55, y: 230, th: "d", lines: [{ t: "ildırım", size: 34, caps: true }, { t: "xəbərdarlıq", size: 86, serif: true, d: 0.4 }, { t: "şimşək", size: 34, caps: true, d: 2.3 }, { t: "gözqamaşdıran həqiqət", size: 64, serif: true, red: true, d: 2.7 }] },
  { a: 92.75, b: 98.3, y: 240, th: "d", lines: [{ t: "münafiq", size: 36, caps: true }, { t: "RƏHMƏTİ GÖRMÜR", size: 92, serif: true, red: true, d: 0.6 }, { t: "yalnız gurultunu eşidir… və qaçır", size: 46, serif: true, italic: true, w: 500, d: 2.6 }] },
  { a: 98.54, b: 103.5, y: 230, th: "d", src: "ƏZ-ZƏMƏXŞƏRİ · ƏL-KƏŞŞAF", lines: [{ t: "ikinci incəlik", size: 34, caps: true }, { t: "barmaq ucu yox —", size: 64, serif: true, italic: true, w: 500, d: 1.6 }, { t: "BARMAQ", size: 140, serif: true, red: true, d: 3.6 }] },
  { a: 103.66, b: 105.6, y: 260, th: "d", lines: [{ t: "qorxunun", size: 38, caps: true }, { t: "SON HƏDDİ", size: 120, serif: true, red: true, d: 0.3 }] },
  { a: 105.8, b: 111.95, y: 190, th: "d", lines: [{ t: "Allah onları", size: 36, caps: true }, { t: "hər tərəfdən əhatə edib", size: 70, serif: true, d: 0.5 }, { t: "qulaq tıxamaqla qaçmaq olmur", size: 46, serif: true, italic: true, w: 500, d: 3.6 }] },
  { a: 112.12, b: 116.0, y: 240, th: "d", lines: [{ t: "üçüncü incəlik", size: 34, caps: true }, { t: "işıq olanda", size: 64, serif: true, italic: true, w: 500, d: 1.9 }, { t: "YERİYİRLƏR", size: 104, serif: true, d: 2.6 }] },
  { a: 116.14, b: 118.2, y: 250, th: "d", lines: [{ t: "qaranlıq olanda", size: 64, serif: true, italic: true, w: 500 }, { t: "DAYANIRLAR", size: 104, serif: true, red: true, d: 0.6 }] },
  { a: 118.34, b: 124.55, y: 240, th: "d", src: "FƏTH 48:15 · TÖVBƏ 9:42", lines: [{ t: "qənimət olanda", size: 38, caps: true, d: 3.0 }, { t: "ƏN ÖNDƏ", size: 130, serif: true, d: 4.4 }] },
  { a: 124.68, b: 127.25, y: 250, th: "d", lines: [{ t: "çətinlik gələndə", size: 38, caps: true }, { t: "BƏHANƏ", size: 140, serif: true, red: true, d: 0.9 }] },
  { a: 127.42, b: 130.25, y: 260, th: "d", lines: [{ t: "Həcc surəsi", size: 96, serif: true }, { t: "22:11", size: 40, caps: true, d: 0.6 }] },
  { a: 134.22, b: 138.6, y: 230, th: "d", lines: [{ t: "Allaha", size: 38, caps: true }, { t: "KƏNARDA DURUB", size: 92, serif: true, red: true, d: 1.3 }, { t: "ibadət edir", size: 60, serif: true, italic: true, w: 500, d: 2.8 }] },
  { a: 138.74, b: 142.45, y: 240, th: "d", lines: [{ t: "xeyir gəlsə — rahatlanır", size: 54, serif: true, italic: true, w: 500 }, { t: "bəla gəlsə", size: 38, caps: true, d: 1.8 }, { t: "ÜZ DÖNDƏRİR", size: 104, serif: true, red: true, d: 2.2 }] },
  { a: 142.58, b: 143.45, y: 290, th: "d", lines: [{ t: "Bəs biz?", size: 140, serif: true, italic: true, w: 700 }] },
  { a: 143.55, b: 149.8, y: 240, th: "d", lines: [{ t: "iş yaxşı gedəndə", size: 36, caps: true }, { t: "namaz yerində", size: 70, serif: true, italic: true, w: 500, d: 0.9 }, { t: "sınaq gələndə", size: 36, caps: true, d: 2.95 }, { t: "ilk tərk etdiyin nə?", size: 76, serif: true, red: true, d: 3.6 }] },
  { a: 149.98, b: 152.5, y: 260, th: "d", lines: [{ t: "iman yalnız", size: 38, caps: true }, { t: "işıqda yeriməkdirmi?", size: 76, serif: true, d: 0.4 }] },
  { a: 152.71, b: 157.9, y: 240, th: "d", lines: [{ t: "həm işıqda,", size: 84, serif: true }, { t: "həm qaranlıqda", size: 84, serif: true, italic: true, w: 600, d: 1.1 }, { t: "Onun yolunda", size: 38, caps: true, red: true, d: 2.6 }] },
  { a: 158.07, b: 160.6, y: 250, th: "d", lines: [{ t: "şərhə yaz", size: 40, caps: true }, { t: "AMİN", size: 170, serif: true, red: true, d: 0.4 }] },
  { a: 160.85, b: 166.2, y: 200, th: "d", src: "BƏQƏRƏ 2:21", lines: [{ t: "növbəti video", size: 36, caps: true }, { t: "«Ey insanlar!»", size: 96, serif: true, italic: true, w: 700, d: 3.0 }] },
  { a: 166.36, b: 999, y: 240, th: "d", lines: [{ t: "ABUNƏ OL", size: 130, serif: true, red: true }, { t: "Ayənin sirri · Bəqərə", size: 40, caps: true, d: 0.5 }] },
];

// ---------- Arabic (pre-rendered PNG, real shaping) ----------
type Ar = { a: number; b: number; img: string; y: number; label?: string };
const ARS: Ar[] = [
  { a: 0.05, b: 3.85, img: "hook", y: 250, label: "BƏQƏRƏ 2:20" },
  { a: 20.95, b: 26.0, img: "a1", y: 200, label: "BƏQƏRƏ 2:19" },
  { a: 26.0, b: 32.15, img: "a2", y: 200, label: "BƏQƏRƏ 2:19" },
  { a: 32.15, b: 35.35, img: "a3", y: 240, label: "BƏQƏRƏ 2:19" },
  { a: 35.35, b: 38.7, img: "a4", y: 240, label: "BƏQƏRƏ 2:20" },
  { a: 38.7, b: 41.75, img: "a5", y: 240, label: "BƏQƏRƏ 2:20" },
  { a: 41.75, b: 44.7, img: "a6", y: 240, label: "BƏQƏRƏ 2:20" },
  { a: 44.7, b: 48.9, img: "a7", y: 200, label: "BƏQƏRƏ 2:20" },
  { a: 48.9, b: 52.4, img: "a8", y: 240, label: "BƏQƏRƏ 2:20" },
  { a: 130.3, b: 134.0, img: "hacc", y: 250, label: "HƏCC 22:11" },
];
const ArV: React.FC<{ c: Ar; t: number; prevSame: boolean }> = ({ c, t, prevSame }) => {
  if (t < c.a - 0.05 || t > c.b + 0.35) return null;
  const k = Math.min(lerp(t, c.a, c.a + 0.5, 0, 1), lerp(t, c.b - 0.05, c.b + 0.3, 1, 0));
  const glow = lerp(t, c.a, c.a + 0.9, 1.6, 1);
  return (
    <>
      <Img src={staticFile(`ar/${c.img}.png`)} style={{ position: "absolute", left: 50, top: c.y, width: 980, opacity: k,
        filter: `blur(${(1 - Math.min(1, lerp(t, c.a, c.a + 0.5, 0, 1))) * 6}px) brightness(${glow})`, transform: `translateY(${(1 - k) * 14}px)` }} />
      {c.label && <div style={{ position: "absolute", left: 0, right: 0, top: c.y - 34, textAlign: "center", fontFamily: "Inter", fontSize: 26, fontWeight: 600,
        letterSpacing: 4, color: "rgba(255,255,255,0.78)", opacity: prevSame ? Math.min(1, lerp(t, c.b - 0.05, c.b + 0.3, 1, 0)) * 0.9 : k * 0.9 }}>{c.label}</div>}
    </>
  );
};

const Scrim: React.FC<{ t: number }> = ({ t }) => {
  // soft top gradient, only while a cue is on screen; colour follows the footage
  let l = 0, d = 0;
  for (const c of CUES) {
    const k = Math.min(lerp(t, c.a - 0.2, c.a + 0.3, 0, 1), c.b >= 999 ? 1 : lerp(t, c.b - 0.1, c.b + 0.4, 1, 0));
    if (c.th === "l") l = Math.max(l, k); else d = Math.max(d, k);
  }
  for (const c of ARS) d = Math.max(d, Math.min(lerp(t, c.a - 0.2, c.a + 0.3, 0, 1), lerp(t, c.b - 0.1, c.b + 0.4, 1, 0)));
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
        const yy = y + ln.size * 0.55; y += ln.size * (ln.caps ? 2.0 : 1.42);
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
        {ARS.map((c, i) => <ArV key={"a" + i} c={c} t={t} prevSame={i > 0 && ARS[i - 1].label === c.label && ARS[i - 1].b === c.a} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1585, textAlign: "center", fontFamily: "Inter", fontWeight: 700,
          fontSize: 34, letterSpacing: 3, color: "rgba(255,255,255,0.88)", opacity: interpolate(t, [0.3, 1.2], [0, 1], clamp),
          textShadow: "0 1px 3px rgba(0,0,0,0.55), 0 0 14px rgba(0,0,0,0.35)" }}>@esgarow</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
