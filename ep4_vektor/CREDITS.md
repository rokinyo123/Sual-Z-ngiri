# Mənbələr və səslər

- **İllüstrasiyalar və animasiya:** hamısı `anim.js` içində kodla çəkilib (Canvas 2D vektor yolları). Xarici şəkil və ya hazır ikon istifadə olunmayıb.
- **Şriftlər:** Montserrat (Google Fonts, SIL Open Font License), Amiri (SIL Open Font License).
- **Səs effektləri:** hamısı `sfx.py` ilə sintez olunub. Openverse API bu mühitin şəbəkəsində bloklandığı üçün (proxy 403) CC0 səs faylı endirilmədi və istifadə olunmadı.
- **Fon musiqisi:** yoxdur (konfiqurasiyada söndürülüb).

## Yenidən render
    python3 -m http.server 8797 --bind 127.0.0.1   # bu qovluqda
    node render.mjs video out/video_noaudio.mp4
    python3 sfx.py out/sfx.wav
    ffmpeg -i out/video_noaudio.mp4 -i out/sfx.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af loudnorm=I=-16:TP=-1.5 -shortest -movflags +faststart out/final.mp4
