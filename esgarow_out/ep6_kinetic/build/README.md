# Ep6 · Fatihə 1:7 — kinetic typography sample (first ~35 s)

Only new files are committed here. To rebuild, copy the shared engine and ep5 audio tools in first:

    cp -n ../../engine/* . ; cp -rn ../../engine/sfx ../../engine/fonts . ; cp ../../ref_ep5_ihdina/{tighten.py,align.py,sfx_lib.py,mix5.py} .
    python3 -m http.server 8811 &
    PORT=8811 node render.mjs video video.mp4 35.6
    python3 sfx6.py tl.json sfx_lib.py sfx.wav sfx && python3 mix5.py vo/voice_pad.wav silence.wav sfx.wav mix.m4a .

Voice: ElevenLabs v4, "Seyfullah Kartal" (vo/take1.mp3) → tighten (0.36 s) → align.py → words.py → timeline.js.
Fonts: Poppins (OFL, via @fontsource/poppins) in fonts/P*.woff2.
