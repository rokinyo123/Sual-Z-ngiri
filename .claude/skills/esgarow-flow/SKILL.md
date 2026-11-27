---
name: esgarow-flow
description: Makes @esgarow videos in the "Flow one-shot" style the user loves (Təsvif və Zaman Qanunu v4, `esgarow_out/tesvif_zaman/out/final4.mp4`) — a chain of Google Flow (Veo 3.1) AI clips where every object is born from the previous one, cut to the user's ElevenLabs voice, key words only, @esgarow at the bottom. Use whenever the user wants a new video "bu tipdə", "Flow ilə", "final4 kimi", one-shot / seamless 3D object transition, or sends Flow clips.
---

# @esgarow · Flow one-shot videos

Reference video: **`esgarow_out/tesvif_zaman/out/final4.mp4`** (1080×1920, 60 fps, 1:28). The user said: "bu xoşuma gəldi, bu tipdə videolar hazırlayaq". Every new video must be at least this good.
Talk Azerbaijani, "sən" form. The user writes short; read carefully. Also follow the content rules of the `esgarow-video` skill (facts exact, sources only on screen, never depict prophets).

## Why it works (what the user pointed out)
Pinterest style "seamless 3D object transition / one-shot 3D icon animation":
1. **One continuous shot, no cuts** — the camera drifts, the scene grows.
2. **Every object is born from the previous one** (calendar → leaf → weight → pocket watch → brain → mask → sand → book → ink → hourglass → ice → stopwatch → prayer beads → padlock → light). The eye follows one thread.
3. Real physics (falls, thuds, melting, cracking).
4. Narrow calm palette (warm light-gray studio, later golden-hour), nothing tiring to the eyes.
5. Very little text; the words and the objects carry the same idea at the same moment.

## Workflow (order matters)
1. **Text** — user brings the script or we write it (esgarow-video §2). Get approval.
2. **Voice** — user records in ElevenLabs ("Seyfullah Kartal – Deep and Muffled", v4) and sends the mp3.
3. **Chain** — design 8–11 links, one per ~8–10 s of voice. Each link: *what transforms into what* and *which sentence it lands on*. Show the user a table (klip · vaxt · nə olur).
4. **Prompts** — one copyable file (`promptlar.txt`), English, one block per clip, headed `=== KLIP NN · m:ss–m:ss · "sentence" ===`. Template: `esgarow_out/tesvif_zaman/flow/promptlar.txt`.
   - Clip 1: "Frames to Video" with a start frame we compose (object PNG on the studio backdrop, 1080×1920; see `flow/klip01_start.png`).
   - Clips 2+: "Continue the same continuous shot…" for **Extend**.
   - Always: `Vertical 9:16, one continuous shot, no cuts. Photorealistic premium 3D product render on a seamless warm light-gray studio backdrop, soft diffused top light, gentle contact shadows, calm muted palette… Smooth realistic physics, slow and calm motion. No text, no people, no hands.`
   - Explain to the user: labs.google/flow → new project → Veo 3.1, 9:16 → Frames to Video (clip 1) → Add to scene → "+" → **Extend** with the next prompt → repeat → download every clip separately → send (ZIP or files). If Extend is missing: save the last frame and use it as the next start frame.
5. **User sends clips** (often in batches, file names out of order). Put them in chain order yourself, by content (contact sheet of each clip), and confirm the order in a short table. If the user says "əmrimi gözlə", wait.
6. **Before montage, explain the edit plan in detail** (the user asked for this): clip audio removal, retiming to words, upscale/60 fps, text placement, then start.
7. **Preview first** if the user asks ("bir hissəsini ver baxım"): render fast preview segments + a 6-frame preview image, send it, then do the HQ render.
8. **Final render** → send MP4 → commit to `esgarow_out/<topic>/` (MP4 ≤100 MB; GitHub warns above 50 MB, that is fine).

## Montage (engine: `esgarow_out/flow_engine/`)
Copy `flow_engine/` to a scratch build dir, `npm install --silent` (Remotion 4.0.242 + typescript), put the voice at `public/ses.mp3`, clips at `<build>/clips/k01.mp4 … kNN.mp4`.

1. **Align the voice**: `ffmpeg -i ses.mp3 -af silencedetect=n=-33dB:d=0.13` → `tools/align.py sil.txt phrases.txt <dur> al.json` (one phrase per line, pauses at commas/"…"). Gives start/end of every phrase. Expect ~6 syllables/s.
2. **Find the key moment in every clip**: contact sheet with timestamps,
   `ffmpeg -i kNN.mp4 -vf "fps=4,scale=120:-1,drawtext=text='%{pts\:hms}':x=2:y=2:fontsize=12:fontcolor=red,tile=10x4" -frames:v 1 dNN.jpg`
   and note when each transformation happens (e.g. padlock shackle snaps at 3.1 s, book fully formed at 7.9 s).
3. **Write `segs.json`**: `[clip, src_in, src_out, out_t0, out_t1]` per segment. Split a clip into 2 segments when a key moment must hit a word exactly. Trim clip heads that only repeat the previous clip. Keep speed 0.75×–1.5× (wider looks wrong). Example: `esgarow_out/tesvif_zaman/flow/segs.json`.
4. **`tools/mkseg.py <dir with segs.json + clips/> <build>/public/seg`** — retime (setpts), `minterpolate` to 60 fps, lanczos to 1080×1920, unsharp, 0.25 s pads for cross-fades, **no audio** (Veo's own sound is always dropped). Writes `src/segs.json`. Slow (~25 min for 14 segments, 3 parallel): run in background. For a quick preview make `fps=60,scale` + `-preset ultrafast` versions into `public/segq` first.
   Note: mkseg assumes 10.03 s clips (Flow default); change `10.03` if clips differ.
5. **Edit `src/Flow.tsx`**:
   - `DUR4` = voice length + ~0.06.
   - `CUES`: key words only, `y` 230–330 (top 12–28 %), `th: "l"` on light footage (graphite #1A1A1A + red #E62E2D, cream scrim), `th: "d"` on warm/bright footage (white + red #FF3B3B, dark scrim). Lines: `serif` Playfair (headlines), caps Inter (small labels), `d` = delay after cue start. Sources small at y 170 (`src`).
   - `SFX`: `[name, absolute second]` on every visible event (transform → whoosh, landing → boom, open/stop → click, ticking → clock, melt, crack, riser before the climax, lock + boom on the final burst).
   - `@esgarow`: Inter 700, 34 px, white 0.88 with soft shadow, top 1585 — keep it.
6. **Check stills**: `COMP=Final OUTDIR=chk node stills.mjs 1.5 4.5 …` then `python3 sheet.py chk sheet.jpg`; look for overlapping lines, text on top of objects, unreadable red on warm footage.
7. **Render**: `npx remotion render src/index.ts Final out/final_raw.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4 --codec=h264 --crf=17 --audio-codec=aac --audio-bitrate=256k` then
   `ffmpeg -i final_raw.mp4 -c:v copy -af "alimiter=limit=0.89:attack=2:release=60:level=0" -c:a aac -b:a 256k final.mp4` (level=0, otherwise it boosts).
8. **Verify**: ffprobe (1080×1920, 60/1), `volumedetect` max ≤ −1 dB, `blackdetect` (only the closing fade may be black), contact sheet every 4 s.

## Audio rules (user's numbers)
Voice `ses.mp3` volume 1.0 · all SFX 0.95 · music pad (`tools/sfx.py` makes `music.wav`, 8 MB, regenerate) 0.14 under speech, ~0.28 in the last 2 s, fade out. No Veo audio ever.

## Text rules
- Key words only, never full subtitles. Nothing below y≈1650 except `@esgarow`.
- Text must never sit on the object: objects are centre/bottom in Flow clips, so text lives at the top; if a clip's object reaches the top (e.g. close-up), shrink the text and move it to y≈230.
- Words must match the voice exactly (e.g. "artıq indidən bilirsən", not a paraphrase).
- Line spacing in `CueV`: `size*1.32` (caps `1.75`) — tighter overlaps.

## Lessons
- Remotion + flat PNG "3D" (final2/final3) looked like slides; the user preferred AI clips chained with Extend (final4).
- Arabic text in Remotion broke (shaping) — keep Arabic out of the frame unless rendered as an image.
- `scaleY` melting looks like a plate; real melt comes from the AI clip (or `clip-path: inset(top)`).
- Never leave an empty frame when the voice starts a new sentence — the cue appears on the first frame of the sentence.
- `rev` and some `rm` patterns hang/are blocked in this container; write new output dirs instead of deleting.

## ★ Surə təfsiri seriyası — Flow hibrid (Bəqərə 19–20, user: "bu janr superdir, unutma")
The user goes through the Quran ayah by ayah (Bəqərə 15–16 → 17–18 → 19–20 → next **2:21 "Ey insanlar!"**). This is now the main format. Reference: `esgarow_out/beqere_19_20/` (`out/final.mp4`, `src/Flow.tsx`, `flow/segs.json`, `flow/mix.py`, `flow/promptlar.txt`).
- **Script = the user's own format, not the Fatihə "sirr" template** (I got this wrong once). Order: Arabic hook phrase + meaning (0–6 s) → intrigue ("Amma onları qorxudan…") → "Bu, Quranın … məsəlidir" → slow recitation of the ayahs *read by the narrator in transliteration* → "Mənası: …" full translation → "İndi gəl xırdalayaq" + **3 incəlik** (with a related ayah from another surah recited + meaning) → "Bəs biz?" personal question → dua + "Şərhə Amin yaz" → teaser of the next ayah + "Abunə olmağı unutma!". ElevenLabs tags in English brackets: `[deep, serious, slow]`, `[reverent, rhythmic, slow recitation]`, `[intense, engaging]`, `[soft, emotional, intimate]`… Usually the user writes the text; I check facts (full ayah recited? — 2:20 was cut, I added the end), keep it, and add tags. Length ~2:45–3:00 is fine for this series.
- **Chain**: 16–18 clips, one per sentence group. Fixed signature: during recitation the **same green-leather Quran on a walnut rehal opens and its lines glow gold** (3 clips), born from rain/smoke of the previous object.
- **People are shown as objects** (no humans): ear trumpet + cork = plugging ears, upside-down bowl = closed heart, glass marble = walks only in light / runs to gold, coin on an edge = "ʿalā ḥarf", prayer rug rolling away = leaving namaz. On-screen key words tie object ↔ person. The user asked about it and accepted this.
- **Word-level sync for every "incəlik"**: measure gaps (`silencedetect=n=-30dB:d=0.05` on the sentence) and split the clip so each visual step hits its word (cork half-in on "ucunu", fully in on "barmaqlarını", wax on "son həddi"). The user checks this.
- **Check every clip for**: logos (Veo drew a Bitcoin coin), human portraits (Roman emperor coin — user accepted it as "dünya malı"), fake Arabic on Quran pages → `tools/blurpages.py` (gradient-masked Gaussian σ≈5 on the page area). Real Arabic = PNG via `tools/arabic_png.cjs` (Playwright + Amiri Bold, gold #F4E3B5 + glow), shown phrase by phrase in sync with recitation (`ARS` in Flow.tsx), label "BƏQƏRƏ 2:19" above.
- **Audio (overrides the old "no Veo audio" rule, user's request)**: keep the clips' own sounds (rain, thunder, wind), but **remove Veo's music** with HPSS (`librosa` hpss, keep S−H) on clips that have notes (check spectrum for C-major lines). Bed retimed with `atempo`, cross-faded, ducked ≈ −12 dB under the voice (voice ≈14 dB above bed), audible in pauses (~−26 dB). Add synthesized SFX only where the clip is silent (cork pop, page rustle, coin ring, marble roll, rug swish, boom on the final reveal). `tools/mix_template.py`; Remotion renders `--muted`, then mux `mix.m4a`.
- Re-timing one clip after HQ segments exist: rename later `sNN` files and use `tools/mkseg_sub.py <dir> public/seg 12,13,14` (renders only those, rewrites `src/segs.json`). Fast preview: `tools/mksegq.py` → `public/segq` + render `--scale=0.5`.

## ★★ Lessons from Bəqərə 21–22 (4 failed renders — read before every new video)
- **Clip budget = voice length ÷ 10 s.** Never speed a clip above 1.15× (cut it instead); never below ~0.6× except near-static shots. Never reuse a clip out of its scene (a "callback" read as "the sound mixed into another video"). Design the chain so each sentence group gets ~10 s of natural-speed footage; enumerations ("yer, göy, yağış, meyvə") need ONE clip that shows all, not five 2-second cuts.
- **Timing.** No reliable word timestamps here (ElevenLabs credits ran out; Gemini transcription needs the user's explicit OK — ask up-front). Sentence DP alignment drifted 2–4 s in dense parts and the user saw "gecikmə". Fix at the source: put `[pause]` between every recitation phrase and `[short pause]` between sentences in the ElevenLabs text, then sync only to measured pauses. No word-by-word karaoke without real timestamps.
- **Recitation display** = 19–20 style: Arabic phrase PNGs (Amiri Bold, gold) above the book, one per pause-delimited phrase. The user rejected the glass card and the page-print as too risky once sync slipped.
- **Audio:** no reverb (user heard it as "xışıltı"); clip ambience boost ≤ +4 dB; clip bed only from the scene on screen.
- **Hook:** first spoken line in Azerbaijani (user: "ilk cümləni Ey insanlar ilə başla"), Arabic after.
- **Fallback the user accepts:** a CapCut package (`capcut/`: text-free mixed video, `diktor.mp3`, ayah PNGs, `yazilar.txt`); the user places texts on the waveform in free CapCut.
- **What performs (vidIQ, Nov 2026):** best = "Qəlbinə möhür vurulubmu?" (2:7) 106K YT + 88K TT, 1.1K comments — because the CTA is a dhikr ("Əstəğfirullah yaz"), the hook asks about *your* heart ("sən"), fear → immediate hope, one simple image (black dot), 2:33. 2:10 dua-CTA ("Allahım, qəlbimə şəfa ver") 147K YT. Third-person scholarly hooks ("münafiqlər üçün məsəlin təfsiri") and 2:45+ length underperform. Every new script: "sən" hook, dhikr/dua comment CTA, ≤2:20.

## Files
- Reference project: `esgarow_out/tesvif_zaman/` (`out/final4.mp4`, `src/Flow.tsx`, `src/segs.json`, `flow/segs.json`, `flow/promptlar.txt`, `flow/klip01_start.png`, `flow/mkseg.py`).
- Engine template: `esgarow_out/flow_engine/` (src, fonts, sfx, tools: mkseg.py, align.py, sfx.py, cut.py for transparent PNG cut-outs with rembg).
