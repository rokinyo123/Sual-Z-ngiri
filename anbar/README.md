# Təchizat və Anbar Nəzarət Sistemi — quraşdırma

Yeni sistem **eyni Supabase layihəsində**, amma ayrıca **`anbar`** sxemində qurulur.
Mövcud "Sual Zənciri" proqramına (`public` sxemi, kökdəki `index.html`) **toxunulmur**.

## Mərhələ 0 — hazırlıq

### 0.1 Ehtiyat nüsxə
Supabase → **Database → Backups**. Plan icazə verirsə, ən son nüsxənin olduğunu yoxlayın.
Pulsuz planda: **Table Editor**-də `questions`, `comments`, `messages`, `profiles`
cədvəllərini bir-bir açıb **Export → CSV** edin və kompüterdə saxlayın.

### 0.2 Mövcud bazanın yoxlanması
**SQL Editor → New query** → [`sql/00_yoxlama.sql`](sql/00_yoxlama.sql) faylının
bloklarını bir-bir işlədin. Heç nəyi dəyişmir, yalnız oxuyur.
Nəticələri (xüsusilə 2, 3, 6, 7, 8-ci bloklar) Claude-a göndərin.

## Mərhələ 1 — təməl

### 1.1 Cədvəllər
SQL Editor → [`sql/01_temel.sql`](sql/01_temel.sql) faylının **hamısını** yapışdırıb **Run**.
Yaradılır: `departments`, `warehouses`, `employees`, `suppliers` (12 firma), `products` (boş), `events` (tarixçə).
Təkrar işlətmək təhlükəsizdir.

### 1.2 Sxemi API-yə açmaq
**Project Settings → Data API → Exposed schemas** → `anbar` əlavə edin → Save.
(`public` siyahıda qalmalıdır — köhnə proqram ondan istifadə edir.)

### 1.3 İlk Admin
1. **Authentication → Users → Add user → Create new user**
   - E-poçt: `admin@almond.local` · Parol: ən az 6 simvol · **Auto Confirm User** ✓
2. SQL Editor:
   ```sql
   select anbar.admin_add_employee('admin@almond.local', 'Adınız Soyadınız', 'admin', 'admin', 'admin');
   ```

### 1.4 İşçilər
Hər işçi üçün eyni qayda: əvvəl **Add user** (`istifadəçiadı@almond.local`), sonra:
```sql
select anbar.admin_add_employee('aysel@almond.local', 'Aysel Məmmədova', 'aysel', 'satinalma');
-- şöbə kodları: anbar, inqilab, satinalma, keyfiyyet, texnoloq, istehsalat, cesidleme, satis, rehberlik, admin
-- rol (5-ci parametr, istəyə görə): isci (standart) | rehber | admin
```
İşçi proqrama **istifadəçi adı** (`aysel`) və **parol** ilə girəcək.

### 1.5 Yoxlama
[`sql/02_yoxla.sql`](sql/02_yoxla.sql) — hamısı qaydasındadırsa:
6 cədvəl, hamısında RLS `true`, `anon` üçün icazə **yoxdur**, `authenticated` yalnız `SELECT`,
Sual Zəncirinin sətir sayları dəyişməyib.

## Mərhələ 2 — sifariş və Satınalma

SQL Editor → [`sql/03_sifaris.sql`](sql/03_sifaris.sql) → **Run** (01-dən sonra).

Yaradılır: `orders`, `order_items` (hər mal ayrıca), `cancellations`, `tasks`, `settings`.

| Kim | Funksiya | Nə edir |
|---|---|---|
| Anbar / İnqilab | `anbar.create_order(növ, mallar, qeyd)` | Sifariş yazır. Müddət avtomatik: gündəlik → sabah, həftəlik → növbəti çərşənbə (bazar → çərşənbə). Kataloqda olmayan ad "yeni" mal kimi əlavə olunur |
| Anbar / İnqilab | `anbar.add_items(sifariş, mallar)` | Yalnız həmin gün, yalnız öz sifarişinə; yeni mal yenə Satınalmaya düşür |
| Satınalma | `anbar.plan_items(sətirlər)` | Hər mal üçün **kimdən** (firma/sürücü), **nə vaxt**, **kim məsul** |
| Satınalma | `anbar.add_supplier(ad, 'firma'/'surucu')` | Yeni firma və ya sürücü |
| Satınalma | `anbar.replan_item(...)` | Tarixi/təchizatçını dəyişir; tarix gec çəkilirsə **səbəb mütləqdir** |
| Satınalma / Rəhbərlik | `anbar.cancel_remaining(sətir, səbəb)` | Qalığı yalnız **səbəblə** bağlayır — mal səssizcə itmir |
| Hamı | `anbar.claim_task(tapşırıq)` | Şöbənin tapşırığını üzərinə götürür (məsul olur) |

Kim nəyi görür: Anbar → öz sifarişləri; İnqilab → öz sifarişləri; Satınalma, Rəhbərlik, Admin → hamısı;
Keyfiyyət, Texnoloq, İstehsalat → Anbarın sifarişləri. Yeni sifariş Satınalmaya "qəbul et" tapşırığı açır
(standart 4 saat — `anbar.admin_set_setting('satinalma_qebul_saat','4')`).

## Mərhələ 2b — sürücülər

SQL Editor → [`sql/04_surucu.sql`](sql/04_surucu.sql) → **Run**.

Sürücü üçün: **Add user** (`elvin@almond.local`), sonra:
```sql
select anbar.admin_add_employee('elvin@almond.local', 'Elvin Məmmədov', 'elvin', 'surucu');
select anbar.admin_link_driver((select id from anbar.employees where username = 'elvin'));
```
Satınalma malı sürücüyə verəndə sürücü onu öz siyahısında görür və `anbar.driver_bought(mal, miqdar, qeyd)`
ilə "Aldım" yazır (az alıbsa — səbəb mütləqdir). Sürücü yalnız ona verilən malları görür.

## Mərhələ 3 — mal qəbulu və Keyfiyyət

SQL Editor → [`sql/05_qebul.sql`](sql/05_qebul.sql) → **Run**.

| Kim | Funksiya | Nə edir |
|---|---|---|
| Anbar / İnqilab | `anbar.mark_arrived(sifariş, sətirlər)` | "📦 Gəldi": gələn miqdarlar. Yazılmayan mal "gəlmədi" sayılır. Anbarda Keyfiyyətə tapşırıq düşür |
| Keyfiyyət | `anbar.qc_line(sətir, true/false, səbəb)` | ✓ keçdi / ✗ blok — blokda **səbəb mütləqdir** |
| Keyfiyyət | `anbar.qc_finish(qəbul)` | Gələn bütün mallara baxılmayınca bitmir |
| Anbar / İnqilab | `anbar.close_delivery(qəbul)` | Anbarda Keyfiyyət bitirməmiş **bağlanmır**. Qəbul olunan miqdar mala yazılır; qalıq varsa mal "problem" olur və məsul Satınalma işçisinə tapşırıq düşür |
| Satınalma | `anbar.answer_problem(mal, yeni tarix, səbəb)` | Problemli mal yenə gözlənilir (səbəb mütləq) |
| Satınalma | `anbar.cancel_remaining(mal, səbəb)` | Qalığı səbəblə bağlamaq |

Bir mal bir neçə dəfə, hissə-hissə gələ bilər; hər gəliş ayrıca qeyd olunur (`deliveries`, `delivery_lines`).

## Mərhələ 4 — Texnoloq və alternativ mallar

SQL Editor → [`sql/06_texnoloq.sql`](sql/06_texnoloq.sql) → **Run**.

Texnoloqa düşən mallar: kataloqda **Texnoloq tələb edir** işarəli mal, Satınalmanın "Texnoloq baxsın" dediyi mal,
və hər **əvəzedici (alternativ)** mal. Belə mal qəbul olunanda Texnoloqa tapşırıq düşür; Texnoloq təsdiq edənə qədər
mal **bağlanmır** (istifadəyə buraxılmır).

| Kim | Funksiya | Nə edir |
|---|---|---|
| Satınalma | `anbar.request_tech(mal, qeyd)` | Gəlişdən əvvəl "Texnoloq baxsın" |
| Satınalma | `anbar.substitute_item(mal, əvəzedici_id, miqdar, ölçü, təchizatçı, tarix, səbəb, əvəzedici_adı)` | Əvəzedici mal: əslinin qalığı səbəblə bağlanır, yeni sətir Texnoloq təsdiqi ilə gəlir. Kataloqda yoxdursa adı yazılır. Bir dəfə təsdiqlənmiş cüt sonra Texnoloqsuz keçir |
| Texnoloq | `anbar.tech_set_due(yoxlama, gün)` | Əvvəl cavab gününü təyin edir |
| Texnoloq | `anbar.tech_decide(yoxlama, 'tesdiq' / 'redd' / 'lazim_deyil', qeyd)` | Rədddə **səbəb mütləqdir**; mal qəbul sayılmır, Satınalmaya "cavab ver" düşür |
| Admin | `anbar.admin_product_status(məhsul, 'bloklu'/'aktiv', texnoloq_lazımdır)` | Bloklanmış məhsulu sifariş etmək olmur |

## Mərhələ 5 — bildirişlər və gecikmələr

1. **Database → Extensions → `pg_cron`** → Enable (gecikmə yoxlaması üçün).
2. SQL Editor → [`sql/07_bildiris.sql`](sql/07_bildiris.sql) → **Run**.
   Sonda "pg_cron: anbar-gecikme hər 15 dəqiqədən bir işləyəcək" yazısı görünməlidir.

Avtomatik bildirişlər (`anbar.notifications`, hər işçinin öz siyahısı, proqrama Realtime ilə dərhal gəlir):

| Nə oldu | Kimə |
|---|---|
| Yeni tapşırıq | məsul işçiyə (məsul yoxdursa şöbənin hamısına) |
| ⛔ Keyfiyyət blokladı | Satınalma + həmin anbar + Rəhbərlik — **dərhal** |
| ✗ Texnoloq qəbul etmədi | Satınalma + anbar + Rəhbərlik |
| ⚠ Mal az gəldi / gəlmədi | Rəhbərlik (Satınalmaya tapşırıq artıq düşür) |
| ⏰ Vəd edilən gün keçdi, mal gəlməyib | Məsul Satınalma işçisinə **"gecikmə səbəbi"** tapşırığı + Rəhbərlik |
| 📅 Sifarişin son günü keçdi | Rəhbərlik + anbar |
| ⌛ Tapşırığın vaxtı keçdi | məsula + Rəhbərlik |

Eyni xəbər bir nəfərə **bir dəfə** gedir. Satınalma yeni tarix (`replan_item`) və ya səbəb
(`anbar.set_delay_reason(mal, səbəb)`) yazanda gecikmə tapşırığı özü bağlanır.
Oxundu: `anbar.mark_read()` (hamısı) və ya `anbar.mark_read(array[id,...])`.

Rəhbərlik üçün canlı siyahı: `select * from anbar.v_problemler;` — gecikən, problemli, Texnoloqda gözləyən
və vaxtında planlanmamış bütün mallar, gecikmə günü və səbəbi ilə.

Telefona push bildiriş (`anbar.push_subscriptions`) proqram bazaya qoşulanda işə düşəcək.

## Mərhələ 6 — proqram (işçilər üçün)

1. SQL Editor → [`sql/08_proqram.sql`](sql/08_proqram.sql) → **Run**.
2. Proqram: [`app/index.html`](../app/index.html) — sayt yerləşən yerdə `/app/` ünvanında açılır
   (demo `/demo/`-da olduğu kimi). Telefonda **"Ana ekrana əlavə et"** — proqram kimi açılır.
3. Hər işçi öz **istifadəçi adı** (`aysel`) və **parolu** ilə girir. Hər kəs yalnız öz işini görür:

| Şöbə | Ekranlar |
|---|---|
| Anbar / İnqilab | **Bu gün**: gələcək mallar (firma üzrə) → "📦 Gəldi", qəbulu bitirmək · **Sifariş** yazmaq · **Sifarişlər** (həmin gün mal əlavə etmək) |
| Satınalma | **Bu gün**: yeni mallar — kimdən / nə vaxt / kim məsul, "Texnoloq baxsın", gecikənlər · **Problemlər**: yeni tarix, əvəzedici, ləğv |
| Keyfiyyət | **Yoxla**: ✓ Uyğun / ✗ Uyğun deyil (səbəb) → bitir |
| Texnoloq | cavab günü → ✓ qəbul / ✗ rədd (səbəb) |
| Sürücü | **Alınacaqlar** → "🛒 Aldım" |
| Rəhbərlik | **Problemlər** (gecikən, problemli, planlanmamış, Texnoloqda) · bütün sifarişlər və tapşırıqlar |
| Satış, Çeşidləmə, İstehsalat | **Nə vaxt?** — mal adını yazır, harada olduğunu və nə vaxt gələcəyini görür |
| Admin | Kataloq, təchizatçılar, ayarlar, işçilər |

🔔 — işçinin bildirişləri. Məlumat hər 30 saniyədən bir və proqram açılanda yenilənir.

"📦 Gəldi" yalnız seçilən firmanın malları üçündür: başqa firmanın sonra gələcək malı "gəlmədi" sayılmır.
Gəlməyən malın miqdarına **0** yazılır.

> **Diqqət:** faylları sıra ilə işlədin: 01 → 03 → 04 → 05 → 06 → 07 → 08.
> Hansısa faylı yenidən işlətsəniz, ondan sonrakıları da sıra ilə yenidən işlədin.

## Təhlükəsizlik qaydaları (01_temel.sql-də)
- Cədvəlləri yalnız **aktiv işçi** oxuya bilər; giriş etməmiş (`anon`) heç nə görmür.
- Cədvəllərə birbaşa yazmaq **bağlıdır** — yalnız yoxlama aparan funksiyalarla (`anbar.admin_*` və s.).
- Hər dəyişiklik `anbar.events`-ə avtomatik yazılır; tarixçəni **heç kim** dəyişə/silə bilməz.
- Tarixçəni yalnız Rəhbərlik və Admin görür.
- Admin öz Admin hüququnu təsadüfən ləğv edə bilməz.

## Geri almaq
[`sql/99_geri_al.sql`](sql/99_geri_al.sql) — yalnız `anbar` sxemini silir (Sual Zəncirinə toxunmur).

## Növbəti mərhələlər
7. Telefona push bildiriş, Excel/şəkil idxalı, şəkil (Keyfiyyət), domen · 8. Sınaq həftəsi
