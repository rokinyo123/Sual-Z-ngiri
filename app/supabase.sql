-- =====================================================================
-- ALMOND ANBAR ZƏNCİRİ — ortaq baza (sınaq versiyası)
-- Supabase → SQL Editor → bu faylın HAMISINI yapışdırın → Run.
-- Sual Zənciri (public sxemi) dəyişmir — hər şey ayrıca "almond" sxemindədir.
-- Təkrar işlətmək təhlükəsizdir.
-- =====================================================================
begin;

create schema if not exists almond;

-- Kim hansı şöbədir (yalnız buradakı hesablar proqrama girə bilər)
create table if not exists almond.members (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  username  text not null unique,
  dept      text not null,          -- "Anbar", "Anbar (İnqilab)", "Satınalma", "Keyfiyyət", "Rəhbərlik", "Admin" ...
  is_admin  boolean not null default false,
  active    boolean not null default true,
  created_at timestamptz not null default now()
);

-- Bütün məlumat: sifarişlər, mallar, bildirişlər, tarixçə, ayarlar.
-- Hər yazının versiyası var: iki nəfər eyni sifarişi eyni anda dəyişsə, ikincisi xəbərdarlıq alır (məlumat itmir).
create table if not exists almond.records (
  kind       text not null check (kind in ('order','product','alert','log','meta')),
  id         text not null,
  version    int  not null default 1,
  data       jsonb not null,
  updated_at timestamptz not null default clock_timestamp(),
  updated_by uuid references auth.users(id),
  primary key (kind, id)
);
create index if not exists records_updated_idx on almond.records (updated_at);

-- Silinmə yoxdur; hər dəyişiklik ayrıca saxlanır (geri qaytarmaq mümkün olsun)
create table if not exists almond.history (
  hid        bigint generated always as identity primary key,
  kind       text not null,
  id         text not null,
  version    int  not null,
  data       jsonb not null,
  at         timestamptz not null default now(),
  by         uuid
);

create or replace function almond.is_member() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from almond.members m where m.user_id = auth.uid() and m.active)
$$;

create or replace function almond.me() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('username', m.username, 'dept', m.dept, 'is_admin', m.is_admin)
    from almond.members m where m.user_id = auth.uid() and m.active
$$;

-- Bir neçə yazını birdən saxlayır. p_items: [{kind, id, version, data}]
--   version = 0 → yeni yazı. Sifariş/mal nömrəsi artıq tutulubsa, növbəti boş nömrə verilir (cavabda "id").
--   version > 0 → yalnız bazadakı versiya eynidirsə yazılır, yoxsa "conflict" qaytarılır.
create or replace function almond.put_many(p_items jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare it jsonb; k text; i text; v int; d jsonb; nv int; ts timestamptz; out jsonb := '[]'::jsonb; newid bigint; rs timestamptz; born timestamptz;
begin
  if not almond.is_member() then raise exception 'İcazə yoxdur' using errcode = '42501'; end if;
  -- sıfırlanma vaxtı: ondan əvvəl yaranmış sifariş/bildiriş/qeyd bir daha yazılmır (köhnə açıq cihazlar geri yazmasın)
  select (r.data->>'at')::timestamptz into rs from almond.records r where r.kind = 'meta' and r.id = 'reset';
  for it in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    k := it->>'kind'; i := it->>'id'; v := coalesce((it->>'version')::int, 0); d := it->'data';
    if k not in ('order','product','alert','log','meta') or i is null or d is null then
      out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'error','bad')); continue;
    end if;
    if rs is not null and k in ('order','alert','log') and v = 0 then
      born := null;
      begin born := coalesce(d->>'created', d->>'at')::timestamptz; exception when others then born := null; end;
      if born is null or born < rs - interval '5 minutes' then
        out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'stale',true)); continue;
      end if;
    end if;
    if v = 0 then
      if exists (select 1 from almond.records r where r.kind = k and r.id = i) then
        if k in ('order','product') then
          perform pg_advisory_xact_lock(hashtext('almond-'||k));
          select coalesce(max(r.id::bigint), 0) + 1 into newid from almond.records r where r.kind = k and r.id ~ '^[0-9]+$';
          d := jsonb_set(d, '{id}', to_jsonb(newid));
          out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'new_id',newid::text,'version',1));
          i := newid::text;
        else
          out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'conflict',true)); continue;
        end if;
      else
        out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'version',1));
      end if;
      insert into almond.records (kind, id, version, data, updated_by) values (k, i, 1, d, auth.uid());
      insert into almond.history (kind, id, version, data, by) values (k, i, 1, d, auth.uid());
    else
      update almond.records r set data = d, version = r.version + 1, updated_at = clock_timestamp(), updated_by = auth.uid()
       where r.kind = k and r.id = i and r.version = v
      returning r.version into nv;
      if nv is null then
        out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'conflict',true));
      else
        insert into almond.history (kind, id, version, data, by) values (k, i, nv, d, auth.uid());
        out := out || jsonb_build_array(jsonb_build_object('kind',k,'id',i,'version',nv));
      end if;
    end if;
  end loop;
  return out;
end $$;

-- Admin: şöbə hesabı əlavə etmək (əvvəl Authentication → Add user)
create or replace function almond.add_member(p_email text, p_dept text, p_admin boolean default false) returns uuid
language plpgsql security definer set search_path = '' as $$
declare u uuid;
begin
  if auth.uid() is not null and not exists (select 1 from almond.members where user_id = auth.uid() and is_admin) then
    raise exception 'Yalnız Admin';
  end if;
  select id into u from auth.users where lower(email) = lower(p_email);
  if u is null then raise exception 'Bu e-poçtla istifadəçi yoxdur: % (əvvəl Authentication → Add user)', p_email; end if;
  insert into almond.members (user_id, username, dept, is_admin) values (u, split_part(lower(p_email),'@',1), p_dept, p_admin)
  on conflict (user_id) do update set dept = excluded.dept, is_admin = excluded.is_admin, active = true;
  return u;
end $$;

-- Təhlükəsizlik: oxumaq yalnız üzvlərə; birbaşa yazmaq heç kimə (yalnız put_many ilə)
alter table almond.members enable row level security;
alter table almond.records enable row level security;
alter table almond.history enable row level security;
drop policy if exists oxu on almond.members;
create policy oxu on almond.members for select to authenticated using (almond.is_member());
drop policy if exists oxu on almond.records;
create policy oxu on almond.records for select to authenticated using (almond.is_member());

revoke all on all tables in schema almond from public, anon, authenticated;
grant usage on schema almond to authenticated, service_role;
grant select on almond.records, almond.members to authenticated;
grant all on all tables in schema almond to service_role;
revoke execute on all functions in schema almond from public, anon;
grant execute on function almond.is_member(), almond.me(), almond.put_many(jsonb), almond.add_member(text,text,boolean) to authenticated;

commit;

-- Şəkil və fayllar üçün yer (sifariş şəkilləri, Excel faylları, məhsul şəkilləri)
insert into storage.buckets (id, name, public) values ('almond-fayllar', 'almond-fayllar', true)
on conflict (id) do nothing;
drop policy if exists "almond yukle" on storage.objects;
create policy "almond yukle" on storage.objects for insert to authenticated
  with check (bucket_id = 'almond-fayllar' and almond.is_member());
