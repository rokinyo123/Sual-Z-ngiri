---
name: esgarow-video
description: Makes videos for the @esgarow channel (Azerbaijani Islamic explainer shorts and long videos, "Ayənin sirri" series) in the house standard set by episode 5 (İhdinəs-sıratəl-mustəqim). Use whenever the user wants a new @esgarow video, a script/hook, image prompts, voice processing, montage, ASMR, or titles for TikTok/YouTube/Instagram.
---

# @esgarow video standard

Episode 5 ("İhdinəs-sıratəl-mustəqim", `esgarow_out/ep5/ihdina_final.mp4`) is the user's favourite.
Every new video must be **at least this good**. When something new works, add it to this file (section "Changelog").

Talk to the user in Azerbaijani, "sən" form. Discuss first, then produce: **text → approval → voice → image prompts → montage**.

## 1. Content rules
- Audience: Azerbaijani Muslims; tone: təbliğ + nəsihət + "vay" fact. Facts exact, never exaggerated; hadith numbers checked.
- Sources are shown **only on screen**, never read aloud. No parentheses with sources in the voice text.
- Write "ədəb" not "adəb"; avoid grammar terms ("fel") in narration.
- Sensitive topics (e.g. pir, ağaca lent, qəbirdən istəmək) without insulting viewers: "bilmədən", plus the balancing truth (qəbir ziyarəti sünnədir).

## 2. Script template (short: 1:45–1:55, ~240–255 words)
1. **Hook (0–3 s)**: self-contained, starts with a concrete, checkable place + number: "Quranın … ayəsi cəmi N sözdür…". Then a question ("…amma mənasını bilirsənmi?"). Never start "from the middle" (as an answer to the last teaser). The number must belong to the topic (114 surə, 17 rükət).
2. Ayah in Arabic + one-line meaning.
3. **Birinci sir / İkinci sir / Üçüncü sir** — numbered. At least one is a visual proof (hadith drawing, table, count).
4. **Söz-söz məna** of the ayah's words (viewers ask for it) — short in video, full in the pinned comment.
5. Hadis-qüdsi / Quranic payoff.
6. **Comment question** answerable in one word, personal ("Səni ən çox yoldan çıxaran nədir? Şərhdə bir sözlə yaz.").
7. Teaser for the next ayah + "Abunə olmağı unutma."
- Never longer than ~2:00 for shorts (2:42 episode underperformed).
- Long videos (16:9 or 9:16, 8–10 min): chapters, a mini re-hook every 45–60 s, 2–3 signature effects per chapter, voice recorded per chapter.

## 3. Voice
- Preferred: user records in ElevenLabs — "Seyfullah Kartal – Deep and Muffled", Eleven v4. Give them the tagged text (`[serious]`, `[pause]`, `[softly]`) in one copyable block plus a clean version.
- Fallback: Gemini TTS via Zapier (`GoogleMakerSuiteCLIAPI` → `generate_audio`, model `gemini-2.5-flash-preview-tts`, voice **Charon**). Instruction line (do not quote the script in it): "Speak as a native speaker of Azerbaijani from Baku… no Turkish/Russian accent… a little faster". Free tier = 10 requests/day; split text into ~3 parts (Zapier 60 s timeout); download from the returned S3 URL.
- Processing: `tighten.py` (pauses ≤0.40 s) → `silencedetect -36dB d=0.12` → `align.py` (sentence DP; every sentence 3–7 syllables/s) → fine gaps (`-30dB d=0.06`) for word-level key times → `timeline.js` `KT`.

## 4. Images (user makes them in Nano Banana; ask for a ZIP of files, not pasted images)
Give **all prompts in one copyable block**, each headed with its file name.
- ~5 backgrounds, 768×1376 (9:16), empty top 35–40 % for text, photoreal, film grain, no text, faces not shown.
- 3–4 elements, 1024×1024 on **solid green #00FF00**: single objects or **icon sheets (5 icons in one row, not touching)**. `key.py` keys the green and splits sheets automatically.
- Everything else (Arabic calligraphy, numbers, cards, lines, stamps, ✓/✗) is drawn in code — list these too so the user knows nothing is missing.
- Never depict prophets; symbolize shayatin (red embers), not draw them.

## 5. Montage (code in `esgarow_out/engine/` + `esgarow_out/ref_ep5_ihdina/`)
Copy `engine/*` into a build dir, add `timeline.js` + `part_main.js` (start from `ref_ep5_ihdina/part_main.js`), images in `img/`, SFX in `sfx/`.
`python3 -m http.server <PORT>` in the build dir, then `PORT=<PORT> node engine/render.mjs stills <dir> t1 t2…` / `video <out.mp4> <dur>` (1080×1920, 30 fps).
- **No subtitles.** Only key words on screen: `fly3d` + "gup" + light shake (`IMPACTS`).
- Signature effects (keep using, rotate per scene): `fracture` (hook assembles from 25 shards), `drawStroke` (line drawn in sand/xətt), `lens` (Liquid Glass magnifier over a word), `glitchTx`, `frameBreak` (scene shatters into the next), `stamp`, `sprite/popSprite` (green-screen props), counters (rükət 1→17), `bgImage` (slow camera + readability gradients), `wipe`, `sirrCard`, `cardFlip`, `endCard`.
- ~10–12 s per background image; motion comes from effects. Images can repeat with mirror/filter/different crop.
- Ideas library: `rokinyo123/video-shotcraft` (145 shot recipes) and `rokinyo123/video-effects-skill` (21 effects) — Remotion; port the idea to our Canvas engine, don't switch engines.
- Always render check stills (contact sheets) and look at them before the full render; fix overlaps, unreadable red-on-red, emoji typed letter by letter, text below y≈1650 (platform UI).

## 6. Audio
- **No background music.** Voice + ASMR only.
- SFX: `engine/sfx/*.mp3` (whoosh, hit, crack, shatter, stamp, riser, reveal, chime, typing, click, bubble, whip, cascade) via `ref_ep5_ihdina/sfx5.py`, plus synthesized textures from `sfx_lib.py` (scratch, tones). Every visual event gets a sound.
- Mix: `mix5.py voice.wav silence.wav sfx.wav out.m4a .` → −14 LUFS, voice ≥12 dB above SFX while speaking (heavy samples scaled by `HEAVY`).

## 7. Delivery
- Final MP4 to the user (SendUserFile) + commit to `esgarow_out/epN/`. Files >100 MB: send, don't commit.
- Then titles: YouTube (title + description with sources and hashtags), TikTok (short caption + on-screen text tip + cover frame), Instagram (caption + cover), and the **pinned comment** with word-by-word meaning + a bonus fact.

## 8. Series status
1 Bismillah · 2 Əlhəmdülillah · 3 Maliki yəvmiddin · 4 İyyakə nəbudu · 5 İhdinəs-sıratəl-mustəqim (best).
**Next: Fatihə 1:7** — teaser promised "Üç qrup insan… sən hansındasan?" (Nisa 4:69; close the Fatihə series with "Amin", Buxari 780). Separate episode, not merged.

## 9. Environment notes
Blocked: Openverse, TikTok, Pexels, HuggingFace. Open: Google Fonts, GitHub, PyPI, npm, Zapier S3. Chromium + Playwright preinstalled.

## Hard rule (from "Qurandakı 7 sirr", user lost 4 render rounds to sync delays)
Before building any long video: get the full narration text AND real word timestamps first (ElevenLabs Scribe, or the user's SRT). If they are not available, stop and ask — do not build on estimated times. A 1-minute test is NOT enough: the first minute is usually fine and the drift shows up later. So for long videos: (1) the user records the voice **per chapter** (intro, each sirr, ending = separate files) so every chapter starts at 0 and timing errors cannot pile up; (2) align and build each chapter separately and check sync at the start, middle and end of every chapter; (3) render and send chapter by chapter, join only at the end.

## Changelog
- Long video "Qurandakı 7 sirr" (YouTube 16:9, 9:24, `esgarow_out/sirr7/`): engine switched to 1920×1080 (W/H in common.js, index.html, render.mjs); data-driven background track `SH` (shot list with side-aware shading L/R/T/C) + section functions `sec(a,b,fn)`; **7-secret tracker** top-right for retention; chapter `sirrCard` with the secret's green-screen icon; schematic diagrams in code (Gibraltar cross-section with flows, empire map with spreading territory + campaign path drawn by `drawStroke`, 28-letter alphabet with the 14 muqatta'at letters lit); `kt.py` turns a sentence table (`cumleler.json`) into key times by word position; parallel render in 4 chunks (`START=… node render.mjs video`) then concat (~10 min for 9.5 min). Lesson from the failed first attempt: never put the spoken word as text on screen — show the object/diagram instead. **Sync lesson:** never time visuals as `cue start + guessed seconds` or by character position in a truncated line — the user saw delays everywhere. Get the full text, align words to the audio (`sirr7/align7c.py`: cue anchors at real pauses → word/segment DP over fine silences → syllable split), key every visual to its own word (`wordkeys.py`, 0.08 s lead), then check stills at word+0.3 s. ElevenLabs Scribe (word timestamps) is preferred when its free queue is not busy.
- Ep5: fracture hook, "Quranın … ayəsi cəmi N sözdür" hook, word-meaning cards with glass lens, real SFX samples, no music, green-screen props.
