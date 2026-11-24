import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import SEGS from "./segsq.json";
import { continueRender, delayRender } from "remotion";
const _fh = delayRender("fonts");
Promise.all([
  ["Amiri", "fonts/Amiri-Bold.ttf", "700", "normal"], ["Playfair", "fonts/PlayfairDisplay.ttf", "400 900", "normal"],
  ["Playfair", "fonts/PlayfairDisplay-Italic.ttf", "400 900", "italic"], ["Inter", "fonts/Inter.ttf", "100 900", "normal"],
].map(([n, f, w, st]) => new FontFace(n, `url(${staticFile(f)})`, { weight: w, style: st }).load().then((ff) => { (document.fonts as any).add(ff); })))
  .then(() => continueRender(_fh)).catch(() => continueRender(_fh));

export const FPS4 = 60;
export const DUR4 = 168.5;
const F = (s: number) => Math.round(s * FPS4);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lerp = (x: number, a: number, b: number, p: number, q: number) => interpolate(x, [a, b], [p, q], { ...clamp, easing: ease });

const INK = "#1A1A1A", RED_L = "#E62E2D", RED_D = "#FF3B3B";
const FontFaces = () => (
  <style>{`
@font-face{font-family:Playfair;src:url(${staticFile("fonts/PlayfairDisplay.ttf")});font-weight:400 900}
@font-face{font-family:Playfair;font-style:italic;src:url(${staticFile("fonts/PlayfairDisplay-Italic.ttf")});font-weight:400 900}
@font-face{font-family:Amiri;src:url(${staticFile("fonts/Amiri-Bold.ttf")});font-weight:700}
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
  { a: 3.04, b: 4.6, y: 300, th: "d", lines: [{ t: "Ey insanlar!", size: 120, serif: true, italic: true, w: 700 }] },
  { a: 5.05, b: 8.6, y: 260, th: "d", lines: [{ t: "Allah ilk dəfə", size: 38, caps: true }, { t: "bütün insanlığa", size: 92, serif: true, d: 1.5 }, { t: "üz tutur", size: 56, serif: true, italic: true, w: 500, d: 2.6 }] },
  { a: 8.95, b: 11.5, y: 280, th: "d", lines: [{ t: "və ilk sözü…", size: 60, serif: true, italic: true, w: 500 }, { t: "BİR ƏMR", size: 140, serif: true, red: true, d: 1.4 }] },
  { a: 11.76, b: 15.45, y: 250, th: "d", src: "BƏQƏRƏ 2:21–22", lines: [{ t: "bütün insanlara", size: 38, caps: true }, { t: "İLK ÇAĞIRIŞ", size: 118, serif: true, d: 1.6 }] },
  { a: 48.5, b: 55.9, y: 230, th: "d", lines: [{ t: "mənası", size: 36, caps: true }, { t: "sizi və sizdən əvvəlkiləri", size: 56, serif: true, italic: true, w: 500, d: 1.0 }, { t: "yaradan Rəbbinizə", size: 74, serif: true, d: 2.4 }, { t: "İBADƏT EDİN", size: 74, serif: true, red: true, d: 3.4 }] },
  { a: 56.0, b: 58.6, y: 260, th: "d", lines: [{ t: "YER — DÖŞƏK", size: 96, serif: true }, { t: "GÖY — TAVAN", size: 96, serif: true, red: true, d: 1.3 }] },
  { a: 58.76, b: 62.45, y: 260, th: "d", lines: [{ t: "göydən su", size: 92, serif: true }, { t: "ruzi olaraq meyvələr", size: 60, serif: true, italic: true, w: 500, d: 1.2 }] },
  { a: 62.6, b: 65.35, y: 270, th: "d", lines: [{ t: "bilə-bilə", size: 40, caps: true }, { t: "Allaha TAY qoşmayın", size: 80, serif: true, red: true, d: 0.7 }] },
  { a: 65.52, b: 66.85, y: 300, th: "d", lines: [{ t: "gəl xırdalayaq", size: 88, serif: true, italic: true, w: 600 }] },
  { a: 67.06, b: 71.45, y: 230, th: "d", lines: [{ t: "birinci incəlik", size: 34, caps: true }, { t: "«Ey möminlər» yox —", size: 64, serif: true, italic: true, w: 500, d: 1.7 }, { t: "«EY İNSANLAR»", size: 104, serif: true, red: true, d: 3.2 }] },
  { a: 71.58, b: 74.7, y: 260, th: "d", lines: [{ t: "müsəlmana da, kafirə də,", size: 58, serif: true, italic: true, w: 500 }, { t: "sənə də, mənə də", size: 86, serif: true, d: 1.6 }] },
  { a: 74.99, b: 76.45, y: 270, th: "d", lines: [{ t: "ilk əmr", size: 40, caps: true }, { t: "İBADƏT EDİN", size: 120, serif: true, red: true, d: 0.3 }] },
  { a: 76.58, b: 80.55, y: 260, th: "d", lines: [{ t: "əmr edib keçmir —", size: 58, serif: true, italic: true, w: 500 }, { t: "çünki sizi O yaradıb", size: 82, serif: true, d: 2.3 }] },
  { a: 80.88, b: 84.2, y: 260, th: "d", lines: [{ t: "ikinci incəlik", size: 34, caps: true }, { t: "dəlil uzaqda deyil", size: 86, serif: true, d: 1.2 }] },
  { a: 84.37, b: 90.55, y: 200, th: "d", lines: [{ t: "ayağının altında — YER", size: 62, serif: true }, { t: "başının üstündə — GÖY", size: 62, serif: true, d: 1.6 }, { t: "YAĞIŞ", size: 62, serif: true, d: 3.4 }, { t: "süfrəndə — MEYVƏ", size: 62, serif: true, red: true, d: 4.4 }] },
  { a: 90.82, b: 92.55, y: 290, th: "d", lines: [{ t: "Ənbiya surəsi", size: 96, serif: true }, { t: "21:32", size: 40, caps: true, d: 0.5 }] },
  { a: 96.4, b: 98.6, y: 270, th: "d", lines: [{ t: "«göyü qorunan", size: 80, serif: true, italic: true, w: 600 }, { t: "bir tavan etdik»", size: 80, serif: true, italic: true, w: 600, d: 0.5 }] },
  { a: 98.76, b: 105.85, y: 230, th: "d", src: "NASA: GÜNDƏ ~25–100 TON METEOR MATERİALI", lines: [{ t: "atmosfer hər gün", size: 38, caps: true }, { t: "TONLARLA", size: 130, serif: true, red: true, d: 1.0 }, { t: "kosmik daşı yandırır", size: 60, serif: true, italic: true, w: 500, d: 2.2 }, { t: "zərərli şüaları saxlayır", size: 46, serif: true, italic: true, w: 500, d: 4.6 }] },
  { a: 106.08, b: 109.45, y: 250, th: "d", lines: [{ t: "başımızın üstündəki tavan", size: 54, serif: true, italic: true, w: 500 }, { t: "HƏR SANİYƏ", size: 110, serif: true, red: true, d: 1.6 }, { t: "qoruyur", size: 40, caps: true, d: 2.2 }] },
  { a: 109.85, b: 114.15, y: 230, th: "d", lines: [{ t: "üçüncü incəlik", size: 34, caps: true }, { t: "«Və əntum tə'ləmun»", size: 66, serif: true, italic: true, w: 600, d: 1.9 }, { t: "SİZ BİLƏ-BİLƏ", size: 96, serif: true, red: true, d: 3.2 }] },
  { a: 114.42, b: 119.65, y: 250, th: "d", src: "ƏNKƏBUT 29:61", lines: [{ t: "Məkkə müşrikləri", size: 40, caps: true }, { t: "Allahın yaratdığını", size: 70, serif: true, d: 1.2 }, { t: "BİLİRDİLƏR", size: 110, serif: true, red: true, d: 3.0 }] },
  { a: 119.86, b: 123.1, y: 260, th: "d", lines: [{ t: "problem bilməməkdə deyildi", size: 54, serif: true, italic: true, w: 500 }, { t: "TAY QOŞMAQDA İDİ", size: 92, serif: true, red: true, d: 1.9 }] },
  { a: 123.23, b: 129.95, y: 230, th: "d", src: "İBN KƏSİR · BƏQƏRƏ 2:22 TƏFSİRİ", lines: [{ t: "İbn Abbas", size: 40, caps: true }, { t: "qaranlıq gecədə", size: 62, serif: true, italic: true, w: 500, d: 2.6 }, { t: "qara daşda", size: 84, serif: true, d: 3.8 }, { t: "QARA QARIŞQA", size: 96, serif: true, red: true, d: 4.6 }] },
  { a: 130.3, b: 136.55, y: 270, th: "d", src: "ƏHMƏD, MÜSNƏD · NƏSAİ", lines: [{ t: "bir nəfər dedi:", size: 38, caps: true, d: 2.5 }, { t: "«Allah və sən istədin»", size: 72, serif: true, italic: true, w: 600, d: 3.6 }] },
  { a: 136.78, b: 141.0, y: 240, th: "d", lines: [{ t: "«Məni Allaha", size: 70, serif: true, italic: true, w: 600 }, { t: "tay tutdunmu?»", size: 70, serif: true, italic: true, w: 600, d: 0.6 }, { t: "YALNIZ ALLAH İSTƏDİ", size: 72, serif: true, red: true, d: 2.2 }] },
  { a: 141.31, b: 142.1, y: 300, th: "d", lines: [{ t: "Bəs biz?", size: 140, serif: true, italic: true, w: 700 }] },
  { a: 142.4, b: 146.75, y: 250, th: "d", lines: [{ t: "«Bu iş olmasa, ac qalaram»", size: 60, serif: true, italic: true, w: 500 }, { t: "«Filankəs olmasa…»", size: 60, serif: true, italic: true, w: 500, d: 2.2 }] },
  { a: 147.04, b: 150.75, y: 250, th: "d", lines: [{ t: "ruzini", size: 38, caps: true }, { t: "yağışı endirəndən yox —", size: 58, serif: true, italic: true, w: 500, d: 0.4 }, { t: "BAŞQASINDAN", size: 104, serif: true, red: true, d: 2.2 }] },
  { a: 151.12, b: 153.75, y: 260, th: "d", lines: [{ t: "qəlbində", size: 38, caps: true }, { t: "Allaha tay tutduğun", size: 74, serif: true, d: 0.4 }, { t: "nə var?", size: 110, serif: true, red: true, d: 1.4 }] },
  { a: 154.16, b: 156.55, y: 270, th: "d", lines: [{ t: "Allah bizi", size: 40, caps: true }, { t: "gizli şirkdən qorusun", size: 76, serif: true, d: 0.5 }] },
  { a: 156.86, b: 159.2, y: 260, th: "d", lines: [{ t: "şərhə yaz", size: 40, caps: true }, { t: "AMİN", size: 170, serif: true, red: true, d: 0.4 }] },
  { a: 159.49, b: 165.2, y: 220, th: "d", src: "BƏQƏRƏ 2:23", lines: [{ t: "növbəti video", size: 36, caps: true }, { t: "Quranın meydan oxuması", size: 74, serif: true, d: 1.4 }, { t: "«Onun bənzəri bir surə gətirin!»", size: 52, serif: true, italic: true, w: 600, red: true, d: 3.4 }] },
  { a: 165.59, b: 999, y: 270, th: "d", lines: [{ t: "ABUNƏ OL", size: 130, serif: true, red: true }, { t: "Ayənin sirri · Bəqərə", size: 40, caps: true, d: 0.5 }] },
];

// ---------- Qiraət: glass card, word-by-word golden light, ayah medallion ----------
type QW = { w: string; t: number };
type QP = { a: number; b: number; words: QW[]; end?: string; endT?: number; mean: string; label?: string };
type QB = { a: number; b: number; y: number; label: string; size: number; pages: QP[] };
const QB_: QB[] = [] as QB[];
const _QB_OLD: QB[] = [
  { a: 0.0, b: 2.6, y: 150, label: "BƏQƏRƏ · 21", size: 84, pages: [
    { a: 0.0, b: 2.6, mean: "Ey insanlar!", words: [{ w: "يَا", t: 0.13 }, { w: "أَيُّهَا", t: 0.39 }, { w: "النَّاسُ", t: 1.50 }] }] },
  { a: 92.55, b: 96.3, y: 150, label: "ƏNBİYA · 32", size: 72, pages: [
    { a: 92.55, b: 96.3, end: "﴿٣٢﴾", endT: 95.85, mean: "Göyü qorunan bir tavan etdik.", words: [{ w: "وَجَعَلْنَا", t: 92.68 }, { w: "السَّمَاءَ", t: 93.53 }, { w: "سَقْفًا", t: 94.39 }, { w: "مَّحْفُوظًا", t: 94.82 }] }] },
];
const GOLD = "#F4E3B5", GOLD_HI = "#FFE7A3";
const QWord: React.FC<{ q: QW; t: number; size: number }> = ({ q, t, size }) => {
  const on = lerp(t, q.t - 0.05, q.t + 0.18, 0, 1);
  const bump = Math.max(0, 1 - Math.abs(t - (q.t + 0.25)) / 0.9);
  return (
    <span style={{ display: "inline-block", margin: `0 ${size * 0.16}px`, color: on > 0.5 ? GOLD_HI : GOLD, opacity: 0.32 + 0.68 * on,
      transform: `scale(${1 + 0.07 * bump}) translateY(${-6 * bump}px)`,
      textShadow: `0 0 ${10 + 26 * bump}px rgba(255,196,80,${0.25 + 0.6 * bump * on}), 0 2px 8px rgba(0,0,0,0.7)` }}>{q.w}</span>
  );
};
const QPage: React.FC<{ p: QP; t: number; size: number; first: boolean; last: boolean; label: string }> = ({ p, t, size, first, last, label }) => {
  if (t < p.a - 0.05 || t > p.b + 0.35) return null;
  const kin = first ? 1 : lerp(t, p.a, p.a + 0.35, 0, 1);
  const kout = last ? 1 : lerp(t, p.b - 0.05, p.b + 0.3, 1, 0);
  const k = Math.min(kin, kout);
  const mk = lerp(t, p.a + 0.5, p.a + 1.2, 0, 1);
  const eb = p.endT ? lerp(t, p.endT, p.endT + 0.5, 0, 1) : 0;
  const ebump = p.endT ? Math.max(0, 1 - Math.abs(t - (p.endT + 0.35)) / 1.0) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: k, filter: `blur(${(1 - k) * 5}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -40, textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: 24, letterSpacing: 6, color: "rgba(244,227,181,0.85)" }}>✦ {p.label ?? label} ✦</div>
      <div style={{ direction: "rtl", textAlign: "center", fontFamily: "Amiri", fontWeight: 700, fontSize: size, lineHeight: 1.8, padding: "0 30px" }}>
        {p.words.map((q, i) => <QWord key={i} q={q} t={t} size={size} />)}
        {p.end && eb > 0 && <span style={{ display: "inline-block", margin: `0 ${size * 0.16}px`, color: GOLD_HI, opacity: eb,
          transform: `scale(${0.6 + 0.4 * eb + 0.15 * ebump}) rotate(${(1 - eb) * -40}deg)`,
          textShadow: `0 0 ${14 + 30 * ebump}px rgba(255,196,80,0.9)` }}>{p.end}</span>}
      </div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: "Playfair", fontStyle: "italic", fontWeight: 500, fontSize: 34, lineHeight: 1.3,
        color: "rgba(255,255,255,0.86)", opacity: mk, padding: "0 40px", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{p.mean}</div>
    </div>
  );
};
const QBlock: React.FC<{ q: QB; t: number }> = ({ q, t }) => {
  if (t < q.a - 0.05 || t > q.b + 0.45) return null;
  const k = Math.min(lerp(t, q.a, q.a + 0.45, 0, 1), lerp(t, q.b - 0.05, q.b + 0.4, 1, 0));
  // light sweep at each page start (right → left, like the reading direction)
  let sweep = -1;
  for (const p of q.pages) { const s = (t - p.a) / 1.1; if (s >= 0 && s <= 1) sweep = s; }
  const lines = q.pages.length > 1 ? 2 : 1;
  const h = 62 + lines * q.size * 1.8 + 80;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: q.y, height: h, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(180deg, rgba(14,12,8,0.62), rgba(14,12,8,0.42))",
        backdropFilter: "blur(14px)", border: "1.5px solid rgba(244,227,181,0.28)", boxShadow: "0 10px 50px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,200,90,0.06)", overflow: "hidden" }}>
        {sweep >= 0 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: `${(1 - sweep) * 120 - 20}%`,
          background: "linear-gradient(90deg, rgba(255,215,120,0), rgba(255,215,120,0.18), rgba(255,215,120,0))", transform: "skewX(-18deg)" }} />}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 62 }}>
        {q.pages.map((p, i) => <QPage key={i} p={p} t={t} size={q.size} first={i === 0} last={i === q.pages.length - 1} label={q.label} />)}
      </div>
    </div>
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


// ---------- Arabic phrases (pre-rendered PNG), synced to the pauses of the recitation ----------
type Ar = { a: number; b: number; img: string; y: number; label?: string };
const ARS: Ar[] = [
  { a: 15.7, b: 22.75, img: "r1", y: 90, label: "BƏQƏRƏ 2:21" },
  { a: 22.75, b: 25.2, img: "r2", y: 150, label: "BƏQƏRƏ 2:21" },
  { a: 25.2, b: 30.25, img: "r3", y: 150, label: "BƏQƏRƏ 2:21" },
  { a: 30.3, b: 36.6, img: "r4", y: 90, label: "BƏQƏRƏ 2:22" },
  { a: 36.6, b: 44.35, img: "r5", y: 90, label: "BƏQƏRƏ 2:22" },
  { a: 44.35, b: 48.45, img: "r6", y: 90, label: "BƏQƏRƏ 2:22" },
  { a: 92.65, b: 96.25, img: "anb", y: 150, label: "ƏNBİYA 21:32" },
];
const ArV: React.FC<{ c: Ar; t: number; prevSame: boolean }> = ({ c, t, prevSame }) => {
  if (t < c.a - 0.05 || t > c.b + 0.35) return null;
  const k = Math.min(lerp(t, c.a, c.a + 0.4, 0, 1), lerp(t, c.b - 0.05, c.b + 0.3, 1, 0));
  const glow = lerp(t, c.a, c.a + 0.9, 1.5, 1);
  return (
    <>
      <Img src={staticFile(`ar/${c.img}.png`)} style={{ position: "absolute", left: 50, top: c.y, width: 980, opacity: k,
        filter: `blur(${(1 - Math.min(1, lerp(t, c.a, c.a + 0.4, 0, 1))) * 6}px) brightness(${glow})`, transform: `translateY(${(1 - k) * 14}px)` }} />
      {c.label && <div style={{ position: "absolute", left: 0, right: 0, top: c.y - 30, textAlign: "center", fontFamily: "Inter", fontSize: 26, fontWeight: 600,
        letterSpacing: 4, color: "rgba(255,255,255,0.8)", opacity: prevSame ? Math.min(1, lerp(t, c.b - 0.05, c.b + 0.3, 1, 0)) * 0.9 : k * 0.9 }}>{c.label}</div>}
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
