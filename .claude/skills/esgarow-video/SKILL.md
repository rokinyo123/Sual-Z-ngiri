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
- Fallback: Gemini TTS via Zapier (`GoogleMakerSuiteCLIAPI` → `generate_audio`, model `gemini-2.5-flash-preview-tts`, voice **Charon**). Instruction line (do not quote the script in it): "Speak as a native speaker of Azerbaijani from Baku… no Turkish/Russian accent… calm, unhurried pace". Free tier = 10 requests/day; split text into ~3 parts (Zapier 60 s timeout); download from the returned S3 URL.
- Processing: **do NOT run `tighten.py` / do not shorten pauses** — the pauses carry the intonation (see section 5a). `silencedetect -36dB d=0.12` → `align.py` (sentence DP) → **measured** word times (fine gaps `-30dB d=0.06`, or a word-timestamp transcription); never spread words over a sentence by syllable share → `timeline.js` `KT`.

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

## 5a. Pacing and sync — user rule after ep6 (the user lost an hour fixing sync in CapCut)
"İslamda tələsmirik: aram-aram, yavaş-yavaş. Əsas odur ki, mənanı başa düşsünlər."
- **Keep the voice's own pauses and intonation.** Every silence between phrases stays as recorded; the visuals hold (the current word/scene stays still) during the pause instead of the timeline being squeezed.
- **Sync to measured times only.** Each on-screen word is keyed to the real start of that spoken word (measured), and its entrance starts ~0.15 s *before* it so it is fully readable when heard. Before delivery, render a sync-check (click on every keyed word) and fix any word off by more than 0.1 s. The user must not have to re-time anything.
- **Calm intro.** Hook (first ~7 s) = **one scene, no cuts**; the number and question build up inside it. No scene shorter than ~4 s anywhere; transitions soft and ≥0.6 s (fade / slow slide), no rapid circle/bar/flash chains.
- **Readable on screen.** Every key word/pill stays ≥1.5 s; at most 2 new text elements per second; the Arabic ayah stays on screen long enough to read after the recitation ends.
- Calm motion over flashy: fewer shakes/impacts (only on the 2–3 real "vay" moments), slower easing.

## 6. Audio
- **Background music: calm Islamic ambient** (user request from ep7), synthesized by `esgarow_out/ep7_beqere/build/music7.py` (D Hijaz drone + slow pads + sparse soft bells, no percussion). Always far under the voice: `mix7.py` keeps music+SFX ≥16 dB (median ~25 dB) below speech; it is heard mainly in the pauses.
- SFX: `engine/sfx/*.mp3` (whoosh, hit, crack, shatter, stamp, riser, reveal, chime, typing, click, bubble, whip, cascade) via `ref_ep5_ihdina/sfx5.py`, plus synthesized textures from `sfx_lib.py` (scratch, tones). Every visual event gets a sound.
- Mix: `mix7.py voice.wav music.wav sfx.wav out.m4a .` → −14 LUFS (MUSIC_GAIN 0.22, GAP_SPEECH 17 dB). ASMR in ep7: page rustle on transitions, qalam scratch, soft rain bed, clock ticks, soft chimes on Arabic letters.

## 7. Delivery
- Final MP4 to the user (SendUserFile) + commit to `esgarow_out/epN/`. Files >100 MB: send, don't commit.
- Then titles: YouTube (title + description with sources and hashtags), TikTok (short caption + on-screen text tip + cover frame), Instagram (caption + cover), and the **pinned comment** with word-by-word meaning + a bonus fact.

## 8. Series status
1 Bismillah · 2 Əlhəmdülillah · 3 Maliki yəvmiddin · 4 İyyakə nəbudu · 5 İhdinəs-sıratəl-mustəqim (best) · 6 Fatihə 1:7 (kinetic format, posted; user re-timed it in CapCut).
**Fatihə surəsi tamamlandı.** 7 Bəqərə 2:1–2 (Əlif-Lam-Mim, 3 sirr + müjdə; `esgarow_out/ep7_beqere/`). **Next: Bəqərə 2:3–5** — teaser promised "Müttəqi kimdir? Quran onun beş əlamətini sayır".

## 9. Environment notes
Blocked: Openverse, TikTok, Pexels, HuggingFace. Open: Google Fonts, GitHub, PyPI, npm, Zapier S3. Chromium + Playwright preinstalled.

## Changelog
- Ep5: fracture hook, "Quranın … ayəsi cəmi N sözdür" hook, word-meaning cards with glass lens, real SFX samples, no music, green-screen props.
- Ep6: kinetic-typography format (`esgarow_out/ep6_kinetic/build/kin_main.js`, `kin_icons.js`: flying words, highlighter pills, code-drawn 3D props, white/black scenes, Poppins). Worked visually, but **sync failed**: pauses were tightened to 0.36 s and word times were estimated by syllables, and the intro cut 3 times in 7 s → user re-timed in CapCut. Rules in section 5a fix this. Shorts cover drawn in code (`cover2.js`, white style matching the video) was accepted.
- Ep7: first video on the calm rules (5a). Word times MEASURED by `ep7_beqere/build/walign.py` (phrases→pauses DP, words→syllable-energy peaks; Whisper/HF are blocked here), `mk_timeline.py` → `timeline.js`. LEAD = 0.4 s with 0.5 s fade so each word is ~90 % visible when spoken (0.15 s was too late). Verified with stills at 12 word onsets. One-scene 15 s hook, 0.9 s dissolves, Nano Banana photos + keyed icons + code-drawn Arabic (alphabet grid with the 14 muqattaʿat letters lit, custom ۛ marks + lens, +10 savab counters). User's "sirr" rule: a hadith about reward is a *müjdə*, not a sirr — sirr = something hidden/surprising.
