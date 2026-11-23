# Bəqərə 2:19–20 — YENİ RENDER (yeni söhbət üçün)

Yeni söhbətdə yaz: **"Bəqərə 19–20 yeni render"**. Claude bu faylı oxuyub videonu sıfırdan qurur. Skill: `.claude/skills/esgarow-flow` (★ Surə təfsiri bölməsi).

## Hazır olanlar (hamısı bu qovluqda)
- `clips/k01–k18.mp4` — Flow klipləri, zəncir sırası ilə, **orijinal** (Veo səsi ilə).
- `ses.mp3` — ElevenLabs səsi (2:47.8). `mix.m4a` — hazır son səs miksi (diktor + kliplərin musiqisiz səsi + SFX).
- `flow/segs.json` — 26 seqment `[klip, src_in, src_out, out_t0, out_t1]` (k12 üç hissəyə bölünüb: tıxac yarıda "ucunu", tam "barmaqlarını", mum "son həddi").
- `src/Flow.tsx` — ekran yazıları (CUES), ərəbcə ayələr (ARS), DUR4=168.8. `public/ar/*.png` ərəbcə ayə şəkilləri, `public/fonts/Amiri-*`.
- `flow/al.json` cümlə vaxtları, `flow/phrases.txt`, `flow/sil2.txt`.
- `flow/mix.py` səs miksi, `flow/blurpages.py` Quran səhifələrinin bulanıqlaşdırılması.

## Addımlar
1. `cp -r esgarow_out/flow_engine/{src,public,stills.mjs,sheet.py,package.json,tsconfig.json,tools} $BUILD/` → `npm install --silent`.
2. `$W/clips` ← `clips/*` ; k04, k05, k06 üçün: `mv kNN.mp4 kNN_orig.mp4; python3 flow/blurpages.py clips/kNN_orig.mp4 clips/kNN.mp4 kNN` (uydurma ərəb yazısı oxunmasın).
3. `$W/segs.json` ← `flow/segs.json`; `python3 tools/mkseg.py $W public/seg` (~45 dəq, arxa fonda).
4. `src/Flow.tsx` ← bu qovluqdakı (import `./segs.json`), `public/ar`, `public/fonts/Amiri-*` köçür.
5. Səs: `mix.m4a` hazırdır (və ya `flow/mix.py`-dakı W yolunu dəyişib yenidən qur: librosa lazımdır).
6. `npx remotion render src/index.ts Final out/final_raw.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4 --codec=h264 --crf=17 --muted`
7. `ffmpeg -i out/final_raw.mp4 -i mix.m4a -map 0:v -map 1:a -c:v copy -c:a copy -shortest -movflags +faststart out/final.mp4`
8. Repoya yazmaq üçün ≤95 MB: `ffmpeg -i out/final.mp4 -c:v libx264 -preset slow -crf 23 -c:a copy -movflags +faststart beqere_19_20_final.mp4` (crf 21 = 109 MB, çox böyük).
9. Yoxla: ffprobe 1080×1920 60/1, max_volume ≤ −1 dB, kontakt vərəqi.
