-- Telegram bildirişləri üçün iki kiçik cədvəl (bir dəfə işlədilir).
-- Mövcud cədvəllərə toxunmur. Yalnız server funksiyası (service_role) oxuyub yazır.
create table if not exists almond.tg_chats (
  chat_id bigint not null,
  dept    text   not null,          -- 'Satınalma', 'Keyfiyyət', ... və ya '*' (hamısı)
  title   text,
  created_at timestamptz not null default now(),
  primary key (chat_id, dept)
);
create table if not exists almond.tg_sent (
  id      text primary key,          -- göndərilmiş bildirişin id-si (təkrar getməsin)
  sent_at timestamptz not null default now()
);
alter table almond.tg_chats enable row level security;
alter table almond.tg_sent  enable row level security;
grant usage on schema almond to service_role;
grant all on almond.tg_chats, almond.tg_sent to service_role;

-- Səhər 08:00 Bakı (04:00 UTC): hər şöbəyə "bu gün nə etməlisiniz". Əvvəlcə Database → Extensions: pg_cron və pg_net açılmalıdır.
-- create extension if not exists pg_cron;
-- create extension if not exists pg_net;
-- select cron.schedule('almond-seher', '0 4 * * *',
--   $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?morning=1',
--        headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);

-- Günorta xatırlatması: hər gün 16:00 Bakı vaxtı (12:00 UTC) — bu gün gəlməli olub hələ gəlməyən firmalar → Satınalma
-- select cron.schedule('almond-gunorta', '0 12 * * *',
--   $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?midday=1',
--        headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);

-- Axşam 20:00 Bakı (16:00 UTC): hər şöbəyə "bu gün nə edilmədi" + Rəhbərliyə günün yekunu
-- select cron.schedule('almond-axsam', '0 16 * * *',
--   $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?evening=1',
--        headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);

-- Excel hesabatı: hər gün 17:45 Bakı (13:45 UTC) yoxlanır — bazar günü həftəlik, ayın son günü aylıq → Rəhbərlik
-- select cron.schedule('almond-hesabat', '45 13 * * *',
--   $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?report=auto',
--        headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);

-- Ehtiyat nüsxə: hər gün 19:55 Bakı (15:55 UTC) — bazanın tam nüsxəsi JSON fayl kimi "/qosul Ehtiyat KOD" yazılan söhbətə
-- select cron.schedule('almond-ehtiyat', '55 15 * * *',
--   $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?backup=1',
--        headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
