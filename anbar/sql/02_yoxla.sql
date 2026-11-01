-- =====================================================================
-- 02 · 01_temel.sql-dən sonra yoxlama (yalnız oxuyur)
-- =====================================================================

-- Sxem və cədvəllər yaranıbmı (6 cədvəl: departments, employees, events, products, suppliers, warehouses)
select table_name from information_schema.tables where table_schema = 'anbar' order by 1;

-- RLS hamısında aktivdirmi (hamısı true olmalıdır)
select relname, relrowsecurity from pg_class
where relnamespace = 'anbar'::regnamespace and relkind = 'r' order by 1;

-- Qaydalar
select tablename, policyname, cmd, roles from pg_policies where schemaname = 'anbar' order by 1;

-- anon heç nəyə çıxış etməməlidir (boş nəticə)
select table_name, privilege_type from information_schema.role_table_grants
where table_schema = 'anbar' and grantee = 'anon';

-- authenticated yalnız SELECT edə bilməlidir (INSERT/UPDATE/DELETE olmamalıdır)
select table_name, string_agg(privilege_type, ', ') from information_schema.role_table_grants
where table_schema = 'anbar' and grantee = 'authenticated' group by 1 order by 1;

-- Başlanğıc məlumatlar
select * from anbar.departments order by sort;
select * from anbar.warehouses;
select id, name, kind from anbar.suppliers order by name;
select id, full_name, username, dept_code, role, active from anbar.employees order by dept_code;

-- Tarixçə işləyirmi (son 20 əməliyyat)
select at, entity_type, entity_id, action from anbar.events order by id desc limit 20;

-- public sxeminə (Sual Zənciri) toxunulmayıb: sətir sayları əvvəlki kimi olmalıdır
select 'questions' t, count(*) from public.questions
union all select 'comments', count(*) from public.comments
union all select 'messages', count(*) from public.messages
union all select 'profiles', count(*) from public.profiles;
