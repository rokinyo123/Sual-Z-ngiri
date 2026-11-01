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

## Təhlükəsizlik qaydaları (01_temel.sql-də)
- Cədvəlləri yalnız **aktiv işçi** oxuya bilər; giriş etməmiş (`anon`) heç nə görmür.
- Cədvəllərə birbaşa yazmaq **bağlıdır** — yalnız yoxlama aparan funksiyalarla (`anbar.admin_*` və s.).
- Hər dəyişiklik `anbar.events`-ə avtomatik yazılır; tarixçəni **heç kim** dəyişə/silə bilməz.
- Tarixçəni yalnız Rəhbərlik və Admin görür.
- Admin öz Admin hüququnu təsadüfən ləğv edə bilməz.

## Geri almaq
[`sql/99_geri_al.sql`](sql/99_geri_al.sql) — yalnız `anbar` sxemini silir (Sual Zəncirinə toxunmur).

## Növbəti mərhələlər
2. Sifariş və Satınalma (`orders`, `order_items`, `tasks`, SLA: gündəlik → sabah, həftəlik bazar → çərşənbə)
3. Qəbul və Keyfiyyət (`deliveries`, `delivery_lines`, qismən çatdırılma, blok)
4. Texnoloq və alternativlər
5. Bildirişlər və gecikmələr (Realtime, pg_cron, Web Push)
6. Rəhbərlik paneli · 7. Excel/şəkil idxalı, domen · 8. Sınaq həftəsi
