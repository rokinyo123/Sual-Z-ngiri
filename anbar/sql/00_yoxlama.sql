-- =====================================================================
-- 00 · MÖVCUD BAZANIN YOXLANMASI (yalnız oxuyur, heç nəyi dəyişmir)
-- Supabase → SQL Editor → hər bloku ayrıca işlədin, nəticəni saxlayın.
-- =====================================================================

-- 1) public sxemindəki cədvəllər və sütunlar (Sual Zənciri)
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

-- 2) RLS aktivdirmi (relrowsecurity = true olmalıdır)
select c.relname as cedvel, c.relrowsecurity as rls_aktiv, c.relforcerowsecurity as rls_mecburi
from pg_class c
where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
order by 1;

-- 3) Bütün RLS qaydaları
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd;

-- 4) Funksiyalar (my_dept və s.)
select p.proname as funksiya, pg_get_function_identity_arguments(p.oid) as arqumentler,
       p.prosecdef as security_definer, pg_get_functiondef(p.oid) as metn
from pg_proc p
where p.pronamespace = 'public'::regnamespace
order by 1;

-- 5) Trigger-lər
select event_object_table as cedvel, trigger_name, action_timing, event_manipulation, action_statement
from information_schema.triggers
where trigger_schema = 'public'
order by 1, 2;

-- 6) Cədvəllərə verilən icazələr (anon / authenticated nə edə bilir)
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as icazeler
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon','authenticated')
group by table_name, grantee
order by table_name, grantee;

-- 7) Storage bucket-lər (public = true olanlar hamıya açıqdır)
select id, name, public, file_size_limit, allowed_mime_types from storage.buckets;

-- 8) Storage qaydaları
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects';

-- 9) İstifadəçilər və şöbələri (parollar görünmür)
select u.email, p.dept, u.created_at, u.last_sign_in_at
from auth.users u left join public.profiles p on p.id = u.id
order by p.dept;

-- 10) Sətir sayları (nə qədər məlumat var)
select 'questions' as cedvel, count(*) from public.questions
union all select 'comments', count(*) from public.comments
union all select 'messages', count(*) from public.messages
union all select 'profiles', count(*) from public.profiles;

-- 11) "anbar" adlı sxem artıq varmı (yox olmalıdır)
select nspname from pg_namespace where nspname = 'anbar';

-- 12) pg_cron mövcuddurmu (5-ci mərhələ üçün lazımdır)
select name, installed_version from pg_available_extensions where name in ('pg_cron','pg_net');
