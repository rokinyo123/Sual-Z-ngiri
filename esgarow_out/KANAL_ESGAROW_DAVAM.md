# @esgarow — davam faylı (yeni söhbət üçün)

Bu repo ilə yeni söhbət aç (skill: `.claude/skills/esgarow-video`, mühərrik: `esgarow_out/engine`, istinad: `esgarow_out/ref_ep5_ihdina`) və yaz:
"Bu fayla əsasən Ayənin sirri seriyasına davam edək."

## Kanal
- @esgarow (TikTok, YouTube, Instagram). İslam + elm + hekayə + nəsihət + düşündürən sual. Azərbaycan dili, "sən" müraciəti.
- Loqo küncdə, sonda abunə kartı.

## Seriya: "Ayənin sirri" (Fatihə ayə-ayə)
| # | Ayə | Qeyd |
|---|-----|------|
| 1 | Bismillah 1:1 | 35k izlənmə, ən güclü fakt-tapmaca (114, 113+1) |
| 2 | Əlhəmdülillah 1:2 | 2:42 — uzun, zəif |
| 3 | Maliki yəvmiddin 1:4 | 1:52 (1:3 atlanıb) |
| 4 | İyyakə nəbudu 1:5 | ağaca lent / qəbirdən istəmək — tövhid, mübahisə yaradan komment sualı |
| 5 | İhdinəs-sıratəl-mustəqim 1:6 | **İSTİFADƏÇİYƏ GÖRƏ ƏN SUPER VİDEO** — qəlib budur |
| 6 | **NÖVBƏTİ: 1:7** Sıratəllə­zinə ən'amtə… | Tizer: "Üç qrup insan… sən hansındasan?" Ayrıca bölüm (birləşdirmə yox). Fikirlər: Nisa 4:69 (ne'mət verilənlər), "Amin" + Buxari 780 ilə seriyanı bağlamaq |

## QƏLİB (5-ci bölümdən)
1. **Hook (0–3 san):** "Quranın … ayəsi cəmi N sözdür" — yer + rəqəm + sual. Mövzuya aid yoxlanan rəqəm (114, 17 rükət). Hook öz-özünə tam olmalı (tizerə cavab kimi "ortadan" başlamasın).
2. Bir/iki cümlə ayə + tərcümə.
3. **3 nömrəli sir** ("Birinci sir…"). Ən azı biri vizual sübutlu fakt/hekayə (hədis xətti, cədvəl).
4. Sözlərin **söz-söz mənası** (izləyicilər istəyir) — videoda kart + bərkidilmiş kommentdə tam.
5. Hədisi-qüdsi (Müslim 395) cavabı.
6. **Komment sualı** — bir sözlə cavab verilə bilən, şəxsi (məs. "səni ən çox yoldan çıxaran nədir?").
7. Növbəti ayənin tizeri + abunə.
- Uzunluq 1:45–1:55 (~240–255 söz). 2:00-dan uzun olmasın.
- Mənbələr yalnız ekranda; şişirtmə yox; hədislər dəqiq.

## İş axını
Mətn → təsdiq → səs → şəkil promptları (hamısı bir blokda, kopyalamaq üçün) → montaj.
- **Səs:** ElevenLabs "Seyfullah Kartal – Deep and Muffled", v4 (istifadəçi özü yazır). Alternativ: Gemini TTS (Zapier, gemini-2.5-flash-preview-tts, **Charon**, təlimat: "native Azerbaijani from Baku, no Turkish/Russian accent, a little faster"). Gündə 10 sorğu; uzun mətni 3 hissəyə böl (60 san Zapier limiti).
- **Şəkillər:** ~5 fon (768×1376) + 3–4 element (1024², tam yaşıl #00FF00 fon → `key.py` ilə kəsilir, ikon vərəqləri avtomatik bölünür). Zip ilə göndərilir; mesaja yapışdırılan şəkil diskə düşməyə bilər — fayl kimi istə.
- **Fon musiqisi YOX.** Yalnız diktor + ASMR. SFX: `rokinyo123/video-effects-skill/public/sfx/*.mp3` (whoosh, hit, crack, shatter, stamp, riser, reveal, chime, typing, click, bubble, whip, cascade) + `sfx_lib.py` sintezi (scratch, tone).
- Altyazı YOX; ekranda yalnız açar sözlər, fly3d + "gup" + yüngül titrəmə.

## Effektlər (ref_ep5_ihdina/part_main.js)
`fracture` (25 qırıqdan yığılma), `drawStroke` (qumda xətt + yan yollar + köz), `lens` (Liquid Glass böyüdücü), `glitchTx` (RGB titrəmə), `frameBreak` (kadr şüşə kimi dağılır), `stamp`, `sprite/popSprite` (kəsilmiş elementlər), rükət sayğacı, `bgImage` (Ken Burns + oxunaqlıq qradiyenti).
İdeya mənbələri: `rokinyo123/video-shotcraft` (145 kadr resepti, Apache-2.0) və `rokinyo123/video-effects-skill` (21 effekt, MIT) — Remotion-dur, effektləri Canvas mühərrikimizə köçürürük.

## Texniki
- Mühərrik: toolkit `engine/*.js` + `ref_ep5_ihdina/part_main.js`, `render.mjs` (Playwright, port), `python3 -m http.server`.
- Səs: `tighten.py` (fasilə ≤0.40 san) → silencedetect → `align.py` (cümlə DP, 3–7 heca/san) → incə fasilələrlə söz vaxtları → `timeline.js` KT.
- Miks: `mix5.py voice silence.wav sfx.wav out.m4a` (−14 LUFS, diktor üstdə).
- Şəbəkə: Openverse, TikTok, Pexels, HuggingFace bloklu; Google Fonts, GitHub, PyPI, npm, zapier s3 açıq.
