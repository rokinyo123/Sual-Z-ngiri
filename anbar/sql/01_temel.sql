-- =====================================================================
-- 01 · TƏMƏL — "Təchizat və Anbar Nəzarət Sistemi"
-- Yalnız YENİ "anbar" sxemini yaradır. public sxeminə (Sual Zənciri)
-- toxunmur. Təkrar işlətmək təhlükəsizdir (if not exists / on conflict).
--
-- Qaydalar:
--   * Oxumaq: yalnız aktiv işçi (anbar.employees) — RLS ilə.
--   * Yazmaq: cədvəllərə birbaşa yazmaq BAĞLIDIR. Yalnız yoxlama aparan
--     funksiyalar (RPC) vasitəsilə.
--   * Hər dəyişiklik anbar.events cədvəlinə avtomatik yazılır; o cədvəli
--     heç kim dəyişə və ya silə bilməz.
-- =====================================================================
begin;

create schema if not exists anbar;
revoke all on schema anbar from public;
grant usage on schema anbar to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Şöbələr və anbarlar
-- ---------------------------------------------------------------------
create table if not exists anbar.departments (
  code text primary key,
  name text not null unique,
  sort smallint not null default 0
);
insert into anbar.departments (code, name, sort) values
  ('anbar',      'Anbar',            1),
  ('inqilab',    'Anbar (İnqilab)',  2),
  ('satinalma',  'Satınalma',        3),
  ('keyfiyyet',  'Keyfiyyət',        4),
  ('texnoloq',   'Texnoloq',         5),
  ('istehsalat', 'İstehsalat',       6),
  ('cesidleme',  'Çeşidləmə',        7),
  ('satis',      'Satış',            8),
  ('rehberlik',  'Rəhbərlik',        9),
  ('admin',      'Admin',           10)
on conflict (code) do nothing;

create table if not exists anbar.warehouses (
  code        text primary key,
  name        text not null unique,
  dept_code   text not null references anbar.departments(code),
  requires_qc boolean not null,          -- Anbar: Keyfiyyət yoxlaması var; İnqilab: yox
  active      boolean not null default true
);
insert into anbar.warehouses (code, name, dept_code, requires_qc) values
  ('ANBAR',   'Anbar',           'anbar',   true),
  ('INQILAB', 'Anbar (İnqilab)', 'inqilab', false)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------
-- İşçilər: hər işçinin öz Supabase hesabı var (köhnə şöbə hesablarından ayrı)
-- ---------------------------------------------------------------------
create table if not exists anbar.employees (
  id          uuid primary key references auth.users(id) on delete restrict,
  full_name   text not null check (length(btrim(full_name)) >= 2),
  username    text not null unique check (username ~ '^[a-z0-9._-]{3,30}$'),
  dept_code   text not null references anbar.departments(code),
  role        text not null default 'isci' check (role in ('isci','rehber','admin')),
  phone       text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists employees_dept_idx on anbar.employees (dept_code) where active;

-- ---------------------------------------------------------------------
-- Təchizatçılar (firma və ya Satınalmanın sürücüsü)
-- ---------------------------------------------------------------------
create table if not exists anbar.suppliers (
  id          bigint generated always as identity primary key,
  name        text not null check (length(btrim(name)) >= 2),
  kind        text not null default 'firma' check (kind in ('firma','surucu')),
  phone       text,
  note        text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index if not exists suppliers_name_uq on anbar.suppliers (lower(btrim(name)));
insert into anbar.suppliers (name, kind) values
  ('A Agro','firma'), ('Bal Qinyətoğulları','firma'), ('Bərk Dərə (Həsənov Loğman)','firma'),
  ('Cavid Pack','firma'), ('Hicaz','firma'), ('Loyal Packing','firma'), ('Rofruit','firma'),
  ('RİCH S.A. MMC','firma'), ('Sultan təmizlik (Musayev Orxan Vahid oğlu)','firma'),
  ('Tayqa (Veliyev Nahid Abbas oglu)','firma'), ('İlkin penaplast','firma'), ('Şünasif','firma')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- Məhsullar (kataloq boş başlayır)
-- status: aktiv | yeni (sifarişdən gəlib, Admin baxmalıdır)
--         | texnoloq_gozleyir (alternativ/yeni — Texnoloq təsdiqi olmadan istifadə olunmur)
--         | bloklu | arxiv
-- ---------------------------------------------------------------------
create table if not exists anbar.products (
  id                  bigint generated always as identity primary key,
  name                text not null check (length(btrim(name)) >= 2),
  size                text,
  default_unit        text check (default_unit in ('kq','koli','ədəd','litr','vedrə','qutu','dəstə','rulon')),
  default_supplier_id bigint references anbar.suppliers(id) on delete set null,
  storage_type        text not null default 'stok' check (storage_type in ('stok','gundelik')),
  status              text not null default 'aktiv' check (status in ('aktiv','yeni','texnoloq_gozleyir','bloklu','arxiv')),
  needs_tech          boolean not null default false,
  photo_path          text,
  created_by          uuid references anbar.employees(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create unique index if not exists products_name_uq on anbar.products (lower(btrim(name)));

-- ---------------------------------------------------------------------
-- Tarixçə: hər əməliyyat. Yalnız trigger-lər yazır, heç kim dəyişə bilməz.
-- ---------------------------------------------------------------------
create table if not exists anbar.events (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),
  actor_id    uuid,
  entity_type text not null,
  entity_id   text,
  action      text not null,
  before      jsonb,
  after       jsonb
);
create index if not exists events_entity_idx on anbar.events (entity_type, entity_id, at desc);
create index if not exists events_at_idx on anbar.events (at desc);

-- =====================================================================
-- Köməkçi funksiyalar (RLS və RPC-lər bunlardan istifadə edir)
-- =====================================================================
create or replace function anbar.me() returns anbar.employees
language sql stable security definer set search_path = '' as $$
  select e.* from anbar.employees e where e.id = auth.uid() and e.active
$$;
create or replace function anbar.is_active() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from anbar.employees e where e.id = auth.uid() and e.active)
$$;
create or replace function anbar.my_dept() returns text
language sql stable security definer set search_path = '' as $$
  select e.dept_code from anbar.employees e where e.id = auth.uid() and e.active
$$;
create or replace function anbar.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select e.role from anbar.employees e where e.id = auth.uid() and e.active
$$;
create or replace function anbar.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from anbar.employees e
                 where e.id = auth.uid() and e.active and (e.role = 'admin' or e.dept_code = 'admin'))
$$;
create or replace function anbar.can_see_all() returns boolean   -- Rəhbərlik və Admin
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from anbar.employees e
                 where e.id = auth.uid() and e.active and (e.role = 'admin' or e.dept_code in ('rehberlik','admin')))
$$;

-- updated_at avtomatik
create or replace function anbar.tg_touch() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

-- Tarixçə trigger-i: hər insert / update / delete anbar.events-ə yazılır
create or replace function anbar.tg_event() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  n jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  o jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
begin
  insert into anbar.events (actor_id, entity_type, entity_id, action, before, after)
  values (auth.uid(), tg_table_name,
          coalesce(n->>'id', o->>'id', n->>'code', o->>'code'),
          lower(tg_op), o, n);
  return coalesce(new, old);
end $$;

-- Tarixçəni dəyişmək / silmək qadağandır (hətta səhvən verilən icazə ilə də)
create or replace function anbar.tg_events_readonly() returns trigger
language plpgsql set search_path = '' as $$
begin raise exception 'Tarixçəni dəyişmək və ya silmək olmaz'; end $$;

drop trigger if exists events_readonly on anbar.events;
create trigger events_readonly before update or delete on anbar.events
  for each row execute function anbar.tg_events_readonly();

do $$
declare t text;
begin
  foreach t in array array['employees','suppliers','products'] loop
    execute format('drop trigger if exists touch on anbar.%I', t);
    execute format('create trigger touch before update on anbar.%I for each row execute function anbar.tg_touch()', t);
  end loop;
  foreach t in array array['departments','warehouses','employees','suppliers','products'] loop
    execute format('drop trigger if exists audit on anbar.%I', t);
    execute format('create trigger audit after insert or update or delete on anbar.%I for each row execute function anbar.tg_event()', t);
  end loop;
end $$;

-- =====================================================================
-- RLS: oxumaq — yalnız aktiv işçi; yazmaq — yalnız funksiyalarla
-- =====================================================================
alter table anbar.departments enable row level security;
alter table anbar.warehouses  enable row level security;
alter table anbar.employees   enable row level security;
alter table anbar.suppliers   enable row level security;
alter table anbar.products    enable row level security;
alter table anbar.events      enable row level security;

drop policy if exists oxu on anbar.departments;
create policy oxu on anbar.departments for select to authenticated using (anbar.is_active());
drop policy if exists oxu on anbar.warehouses;
create policy oxu on anbar.warehouses  for select to authenticated using (anbar.is_active());
drop policy if exists oxu on anbar.employees;
create policy oxu on anbar.employees   for select to authenticated using (anbar.is_active() or id = auth.uid());
drop policy if exists oxu on anbar.suppliers;
create policy oxu on anbar.suppliers   for select to authenticated using (anbar.is_active());
drop policy if exists oxu on anbar.products;
create policy oxu on anbar.products    for select to authenticated using (anbar.is_active());
drop policy if exists oxu on anbar.events;
create policy oxu on anbar.events      for select to authenticated using (anbar.can_see_all());

revoke all on all tables in schema anbar from public, anon, authenticated;
grant select on all tables in schema anbar to authenticated;
grant all on all tables in schema anbar to service_role;
alter default privileges in schema anbar revoke all on tables from public, anon;
alter default privileges in schema anbar grant select on tables to authenticated;

-- =====================================================================
-- Admin funksiyaları (RPC). Hər biri öz yoxlamasını edir.
-- SQL Editor-dən (auth.uid() boşdur) işlətmək olar — ilk Admini yaratmaq üçün.
-- =====================================================================
create or replace function anbar.assert_admin() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not anbar.is_admin() then
    raise exception 'Bu əməliyyat yalnız Admin üçündür' using errcode = '42501';
  end if;
end $$;

-- İşçi əlavə etmək: əvvəl Supabase → Authentication → Add user (e-poçt: <istifadəçi adı>@almond.local)
create or replace function anbar.admin_add_employee(
  p_email text, p_full_name text, p_username text, p_dept text,
  p_role text default 'isci', p_phone text default null)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  perform anbar.assert_admin();
  select u.id into v_id from auth.users u where lower(u.email) = lower(btrim(p_email));
  if v_id is null then
    raise exception 'Bu e-poçtla hesab tapılmadı: %. Əvvəl Authentication → Add user ilə yaradın.', p_email;
  end if;
  insert into anbar.employees (id, full_name, username, dept_code, role, phone)
  values (v_id, btrim(p_full_name), lower(btrim(p_username)), p_dept, coalesce(p_role,'isci'), p_phone)
  on conflict (id) do update
    set full_name = excluded.full_name, username = excluded.username, dept_code = excluded.dept_code,
        role = excluded.role, phone = excluded.phone, active = true;
  return v_id;
end $$;

create or replace function anbar.admin_set_employee(
  p_id uuid, p_dept text default null, p_role text default null, p_active boolean default null)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform anbar.assert_admin();
  if p_id = auth.uid() and (p_active = false or (p_role is not null and p_role <> 'admin')) then
    raise exception 'Öz Admin hüququnuzu ləğv edə bilməzsiniz';
  end if;
  update anbar.employees
     set dept_code = coalesce(p_dept, dept_code),
         role      = coalesce(p_role, role),
         active    = coalesce(p_active, active)
   where id = p_id;
  if not found then raise exception 'İşçi tapılmadı'; end if;
end $$;

create or replace function anbar.admin_upsert_supplier(
  p_id bigint, p_name text, p_kind text default 'firma', p_phone text default null,
  p_note text default null, p_active boolean default true)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare v_id bigint;
begin
  perform anbar.assert_admin();
  if p_id is null then
    insert into anbar.suppliers (name, kind, phone, note, active)
    values (btrim(p_name), coalesce(p_kind,'firma'), p_phone, p_note, coalesce(p_active,true))
    returning id into v_id;
  else
    update anbar.suppliers
       set name = btrim(p_name), kind = coalesce(p_kind, kind), phone = p_phone, note = p_note,
           active = coalesce(p_active, active)
     where id = p_id returning id into v_id;
    if v_id is null then raise exception 'Təchizatçı tapılmadı'; end if;
  end if;
  return v_id;
end $$;

create or replace function anbar.admin_upsert_product(
  p_id bigint, p_name text, p_size text default null, p_unit text default null,
  p_supplier_id bigint default null, p_storage_type text default 'stok',
  p_needs_tech boolean default false, p_status text default 'aktiv')
returns bigint
language plpgsql security definer set search_path = '' as $$
declare v_id bigint;
begin
  perform anbar.assert_admin();
  if p_id is null then
    insert into anbar.products (name, size, default_unit, default_supplier_id, storage_type, needs_tech, status, created_by)
    values (btrim(p_name), p_size, p_unit, p_supplier_id, coalesce(p_storage_type,'stok'),
            coalesce(p_needs_tech,false), coalesce(p_status,'aktiv'), auth.uid())
    returning id into v_id;
  else
    update anbar.products
       set name = btrim(p_name), size = p_size, default_unit = p_unit, default_supplier_id = p_supplier_id,
           storage_type = coalesce(p_storage_type, storage_type), needs_tech = coalesce(p_needs_tech, needs_tech),
           status = coalesce(p_status, status)
     where id = p_id returning id into v_id;
    if v_id is null then raise exception 'Məhsul tapılmadı'; end if;
  end if;
  return v_id;
end $$;

-- Funksiyalara icazələr: hamıdan götür, yalnız giriş etmiş istifadəçiyə ver
revoke execute on all functions in schema anbar from public, anon;
grant execute on function
  anbar.me(), anbar.is_active(), anbar.my_dept(), anbar.my_role(), anbar.is_admin(), anbar.can_see_all(),
  anbar.admin_add_employee(text,text,text,text,text,text),
  anbar.admin_set_employee(uuid,text,text,boolean),
  anbar.admin_upsert_supplier(bigint,text,text,text,text,boolean),
  anbar.admin_upsert_product(bigint,text,text,text,bigint,text,boolean,text)
to authenticated;
alter default privileges in schema anbar revoke execute on functions from public, anon;

commit;

-- =====================================================================
-- SONRA (bir dəfə):
-- 1) Supabase → Project Settings → Data API → "Exposed schemas" siyahısına
--    anbar əlavə edin (public qalır).
-- 2) İlk Admin: Authentication → Add user → e-poçt admin@almond.local,
--    parol (ən az 6 simvol), "Auto Confirm User" işarəli. Sonra burada:
--      select anbar.admin_add_employee('admin@almond.local','Ad Soyad','admin','admin','admin');
-- 3) Yoxlama: 02_yoxla.sql
-- =====================================================================
