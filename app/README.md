# Almond Anbar Zənciri — quraşdırma (sınaq)

Proqram: `app/index.html`. Saytda (`https://rokinyo123.github.io/Sual-Z-ngiri/app/`) açılanda **ortaq bazaya** qoşulur və giriş istəyir.
Claude linkində isə əvvəlki kimi demo rejimində işləyir (məlumat yalnız həmin cihazda).

## 1. Ehtiyat nüsxə (2 dəqiqə)
Supabase → **Table Editor** → `questions`, `comments`, `messages`, `profiles` → hər birində **Export → CSV**.
(Sual Zəncirinə toxunulmur — bu sadəcə ehtiyat üçündür.)

## 2. Bazanı yaratmaq (3 dəqiqə)
1. Supabase → **SQL Editor → New query**.
2. [`supabase.sql`](supabase.sql) faylının **hamısını** yapışdırın → **Run**. "Success" yazmalıdır.
3. **Project Settings → Data API → Exposed schemas** → `almond` əlavə edin → **Save**.
   (`public` siyahıda qalmalıdır — Sual Zənciri ondan istifadə edir.)

## 3. Hesablar (hər biri 1 dəqiqə)
Hər şöbə üçün: **Authentication → Users → Add user → Create new user**
- E-poçt: `istifadəçiadı@almond.local`, parol (ən az 6 simvol), **Auto Confirm User ✓**

Sınaq üçün 5 hesab:

| E-poçt | Şöbə |
|---|---|
| `admin@almond.local` | Rəhbərlik + Admin (sizin üçün) |
| `anbar@almond.local` | Anbar |
| `inqilab@almond.local` | Anbar (İnqilab) |
| `satinalma@almond.local` | Satınalma |
| `keyfiyyet@almond.local` | Keyfiyyət |

Sonra SQL Editor-da (bir dəfə):
```sql
select almond.add_member('admin@almond.local',     'Rəhbərlik', true);
select almond.add_member('anbar@almond.local',     'Anbar');
select almond.add_member('inqilab@almond.local',   'Anbar (İnqilab)');
select almond.add_member('satinalma@almond.local', 'Satınalma');
select almond.add_member('keyfiyyet@almond.local', 'Keyfiyyət');
```
Proqrama giriş: istifadəçi adı (`anbar`) və parol. Admin hesabı yuxarıdan istənilən şöbənin ekranına baxa bilər;
digərləri yalnız öz şöbəsini görür.

## 4. İlk giriş — Admin
Birinci **admin** daxil olsun: kataloq (354 xammal) və firmalar bazaya bir dəfə yazılır.
Sonra Kataloq → **📥 Firma–mal Excel** (Mal | Firma sütunları).

## 5. Telefonda və kompüterdə
- **Android:** Chrome → ⋮ → "Ana ekrana əlavə et"
- **iPhone:** Safari → Paylaş (□↑) → "Ana ekrana əlavə et"
- **Kompüter:** Chrome / Edge → ünvan sətrindəki "Quraşdır" (⊕)

## Necə işləyir
- Hər dəyişiklik dərhal bazaya gedir (sağ yuxarıda ✓ — yazıldı, ⟳ — göndərilir, ⚠ — internet yoxdur, sonra özü göndərir).
- Başqalarının dəyişikliyi hər 15 saniyədə və proqram açılanda gəlir.
- İki nəfər eyni sifarişi eyni saniyədə dəyişsə, ikincisinə xəbərdarlıq çıxır — məlumat üst-üstə yazılmır.
- Heç nə silinmir: hər dəyişikliyin əvvəlki vəziyyəti `almond.history` cədvəlində qalır.

## Geri almaq
```sql
drop schema almond cascade;   -- yalnız bu proqramı silir, Sual Zənciri qalır
```
