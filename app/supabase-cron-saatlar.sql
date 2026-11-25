-- Almond Anbar · Telegram saatları (iş saatı 08:00–18:00 Bakı)
-- Supabase → SQL Editor → hamısını yapışdır → Run. Eyni adlı köhnə işləri yeniləyir, yenisini yaratmır.
-- Bakı = UTC+4.
select cron.schedule('almond-seher', '0 4 * * *',     -- 08:00: hər şöbəyə "bu gün nə etməlisiniz"
  $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?morning=1',
       headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
select cron.schedule('almond-gunorta', '0 12 * * *',  -- 16:00: bu gün gəlməli olub gəlməyənlər → Satınalma (dəyişmir)
  $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?midday=1',
       headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
select cron.schedule('almond-hesabat', '45 13 * * *', -- 17:45: həftəlik / aylıq Excel → Rəhbərlik
  $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?report=auto',
       headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
select cron.schedule('almond-ehtiyat', '55 15 * * *', -- 19:55: ehtiyat nüsxə (yalnız "Ehtiyat" söhbətinə)
  $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?backup=1',
       headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
select cron.schedule('almond-axsam', '0 16 * * *',    -- 20:00: hər şöbəyə "bu gün nə edilmədi" (günün son mesajı)
  $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?evening=1',
       headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
select cron.schedule('almond-ilisib', '15 4-13 * * *', -- 08:15–17:15 hər saat: "iş ilişib" yoxlaması (Satınalma qəbul etməyib, cavab yoxdur...)
  $$ select net.http_post(url := 'https://qzvyawuhmqdhzawfihzy.supabase.co/functions/v1/telegram?stuck=1',
       headers := '{"Content-Type":"application/json"}'::jsonb, body := '{}'::jsonb) $$);
-- Yoxlamaq üçün: select jobname, schedule from cron.job order by jobname;
