# Sual Zənciri

Şirkət daxili sual-cavab sistemi. Bir şöbə sual yazır, sual seçilmiş şöbələrin zənciri ilə ardıcıl gedir, növbədəki şöbə cavab verir və ya növbəti şöbəyə ötürür.

## Struktur

- `index.html` — bütün tətbiq (HTML + CSS + JS bir faylda). Backend: Supabase (auth, `questions`, `comments`, `messages`, `profiles` cədvəlləri, `sual-fayllar` storage bucket, realtime).
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — PWA quraşdırılması.
- `logo.jpg` — başlıqdakı loqo.
- Build addımı yoxdur; statik fayllar olduğu kimi yayımlanır. Bütün yollar nisbi olmalıdır (GitHub Pages alt-qovluğunda işləyir).

## Şöbələr

Anbar, Anbar (İnqilab), Satınalma, Texnoloq, Keyfiyyət, İstehsalat, Satış, Rəhbərlik.

Hər şöbənin bir hesabı var: `<slug>@sual.local` (məs. `anbar-inqilab@sual.local`). Şöbə `profiles.dept` sahəsindən oxunur. Siyahı `index.html`-də `DEPTS` və `SLUGS` sabitlərindədir — şöbə əlavə edəndə hər ikisini yenilə.

## Statuslar

- `status = "open"` — sual zəncirdədir, `chain[step]` şöbəsinin növbəsidir.
- `status = "answered"` — cavab verilib (`answer`, `answered_by`, istəyə görə `expected_date` — gözlənilən gəliş tarixi).
- `confirmed = true` — Rəhbərlik cavabı təsdiqləyib (`confirmed_by`, `confirmed_at`).
- `arrived = true` — məhsul gəlib (`arrived_at`); yalnız Anbar, Anbar (İnqilab) və Rəhbərlik qeyd edə bilər, gəliş tarixi çatandan sonra.
- `confirmed` və ya `arrived` olan suallar "Arxiv" tabında görünür.

## Əsas qaydalar

- Yalnız növbədəki şöbə (`holder(q)`) cavab verə və ya ötürə bilər.
- Müddət (`deadline_h`, 4 və ya 24 saat) `last_move`-dan sonra keçibsə, sual gecikmiş sayılır və növbə avtomatik Rəhbərliyə keçir; gecikmiş sual ötürülə bilməz.
- Hər hərəkət `log` (JSON massivi) sahəsinə yazılır; ötürmə və cavab `last_move`-u yeniləyir, fayl əlavə etmək yeniləmir.
- "Söhbət" tabı — bütün şöbələrin gördüyü ümumi çat (`messages` cədvəli).

## Təhlükəsizlik və iş qaydaları

- `SUPABASE_URL` və `SUPABASE_ANON_KEY` dəyişdirilməməli və başqa yerə köçürülməməlidir. `service_role` açarı heç vaxt repository-yə düşməməlidir.
- Qaydaların əsl qoruması Supabase RLS siyasətlərində olmalıdır; klient yoxlamaları yalnız UI üçündür.
- Verilənlər bazası sxemi dəyişikliyi ayrıca `.sql` faylında yazılır və əl ilə işlədilir — agent özü işlətmir.
- Dəyişikliklər `main`-də yox, ayrı branch-də edilir.
- İstifadəçi interfeysi və mesajlar Azərbaycan dilindədir.
