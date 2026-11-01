-- =====================================================================
-- 03 · SİFARİŞ VƏ SATINALMA (01_temel.sql-dən sonra işlədin)
--
-- Axın:
--   Anbar / İnqilab sifariş yazır  → sifariş Satınalma növbəsinə düşür
--   Satınalma hər mal üçün seçir   → kimdən (firma/sürücü), nə vaxt, kim məsul
--   Sifarişi verən həmin gün mal əlavə edə bilər → yeni mal yenə Satınalmaya düşür
--   Satınalma tarixi gec çəkəndə səbəb yazmalıdır; qalığı yalnız səbəblə ləğv edə bilər
--
-- Hər mal sətri ayrıca izlənir. Mal heç vaxt itmir:
--   qalıq = sifariş − qəbul olunan − ləğv edilən  (avtomatik hesablanır)
-- Standart müddət (need_by): gündəlik → növbəti gün; həftəlik → növbəti çərşənbə
--   (bazar günü verilibsə — çərşənbə). Saat qurşağı: Asia/Baku.
-- =====================================================================
begin;

-- Sürücü həm təchizatçıdır, həm də (istəyə görə) sistemdə işçi hesabı ola bilər
alter table anbar.suppliers add column if not exists employee_id uuid references anbar.employees(id);

-- Ayarlar (Admin dəyişə bilər)
create table if not exists anbar.settings (
  key   text primary key,
  value text not null,
  note  text
);
insert into anbar.settings (key, value, note) values
  ('satinalma_qebul_saat', '4', 'Yeni sifarişi Satınalma neçə saat ərzində qəbul etməlidir'),
  ('heftelik_gun', '3', 'Həftəlik sifarişin standart günü (1=B.e … 3=Çərşənbə … 7=Bazar)')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- Sifariş (qovluq) və mal sətirləri
-- ---------------------------------------------------------------------
create table if not exists anbar.orders (
  id             bigint generated always as identity primary key,
  warehouse_code text not null references anbar.warehouses(code),
  type           text not null check (type in ('gundelik','heftelik')),
  created_by     uuid not null references anbar.employees(id),
  created_at     timestamptz not null default now(),
  need_by        date not null,
  note           text,
  status         text not null default 'satinalmada'
                 check (status in ('satinalmada','gozlenilir','qismen','bagli','legv')),
  closed_at      timestamptz,
  updated_at     timestamptz not null default now()
);
create index if not exists orders_wh_status_idx on anbar.orders (warehouse_code, status, created_at desc);

create table if not exists anbar.order_items (
  id             bigint generated always as identity primary key,
  order_id       bigint not null references anbar.orders(id) on delete restrict,
  product_id     bigint not null references anbar.products(id),
  qty_ordered    numeric(12,3) not null check (qty_ordered > 0),
  unit           text not null check (unit in ('kq','koli','ədəd','litr','vedrə','qutu','dəstə','rulon')),
  note           text,
  status         text not null default 'yeni'
                 check (status in ('yeni','planlandi','geldi','keyfiyyetde','qebul_olundu','texnoloqda','bagli','legv')),
  supplier_id    bigint references anbar.suppliers(id),
  purchaser_id   uuid references anbar.employees(id),       -- Satınalmada məsul işçi
  promised_date  date,
  accepted_by    uuid references anbar.employees(id),
  accepted_at    timestamptz,
  delay_reason   text,
  qty_received   numeric(12,3) not null default 0 check (qty_received >= 0),
  qty_cancelled  numeric(12,3) not null default 0 check (qty_cancelled >= 0),
  qty_remaining  numeric(12,3) generated always as (qty_ordered - qty_received - qty_cancelled) stored,
  added_later    boolean not null default false,              -- göndəriləndən sonra əlavə edilib
  parent_item_id bigint references anbar.order_items(id),     -- təkrar sifariş / əvəzedici
  is_alternative boolean not null default false,
  created_by     uuid references anbar.employees(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint qty_not_over check (qty_received + qty_cancelled <= qty_ordered),
  constraint planned_has_plan check (status = 'yeni' or status = 'legv' or (supplier_id is not null and promised_date is not null and purchaser_id is not null))
);
create index if not exists items_order_idx on anbar.order_items (order_id);
create index if not exists items_status_idx on anbar.order_items (status, promised_date);
create index if not exists items_purchaser_idx on anbar.order_items (purchaser_id) where status not in ('bagli','legv');

-- Qalığı rəsmi bağlamaq (səbəb mütləqdir)
create table if not exists anbar.cancellations (
  id        bigint generated always as identity primary key,
  item_id   bigint not null references anbar.order_items(id),
  qty       numeric(12,3) not null check (qty > 0),
  reason    text not null check (length(btrim(reason)) >= 3),
  by_id     uuid not null references anbar.employees(id),
  at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tapşırıqlar: hər işin şöbəsi, istəyə görə konkret məsulu və vaxtı var
-- ---------------------------------------------------------------------
create table if not exists anbar.tasks (
  id          bigint generated always as identity primary key,
  kind        text not null check (kind in ('qebul_et','gelis','keyfiyyet','texnoloq','cavab','gecikme_sebebi')),
  order_id    bigint references anbar.orders(id),
  item_id     bigint references anbar.order_items(id),
  dept_code   text not null references anbar.departments(code),
  assignee_id uuid references anbar.employees(id),
  title       text not null,
  due_at      timestamptz,
  status      text not null default 'acik' check (status in ('acik','bitdi','legv')),
  created_at  timestamptz not null default now(),
  done_at     timestamptz,
  done_by     uuid references anbar.employees(id)
);
create index if not exists tasks_open_idx on anbar.tasks (dept_code, status, due_at) where status = 'acik';
create unique index if not exists tasks_one_open_qebul on anbar.tasks (order_id) where kind = 'qebul_et' and status = 'acik';

-- =====================================================================
-- Köməkçilər
-- =====================================================================
create or replace function anbar.today_baku() returns date
language sql stable set search_path = '' as $$ select (now() at time zone 'Asia/Baku')::date $$;

-- Standart müddət: gündəlik → sabah; həftəlik → növbəti "heftelik_gun" (standart çərşənbə)
create or replace function anbar.default_need_by(p_type text, p_at timestamptz default now())
returns date language plpgsql stable set search_path = '' as $$
declare d date := (p_at at time zone 'Asia/Baku')::date;
        wd int := coalesce((select value::int from anbar.settings where key = 'heftelik_gun'), 3);
        add int;
begin
  if p_type = 'gundelik' then return d + 1; end if;
  add := (wd - extract(isodow from d)::int + 7) % 7;
  if add = 0 then add := 7; end if;
  return d + add;
end $$;

-- Kim hansı anbarın sifarişlərini görür
create or replace function anbar.can_see_wh(p_wh text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from anbar.employees e
    where e.id = auth.uid() and e.active and (
      e.role = 'admin' or e.dept_code in ('rehberlik','admin','satinalma')
      or e.dept_code = (select w.dept_code from anbar.warehouses w where w.code = p_wh)
      or (p_wh = 'ANBAR' and e.dept_code in ('keyfiyyet','texnoloq','istehsalat'))
    ))
$$;
create or replace function anbar.can_see_order(p_order bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select anbar.can_see_wh((select o.warehouse_code from anbar.orders o where o.id = p_order))
$$;

create or replace function anbar.assert_dept(variadic p_depts text[]) returns anbar.employees
language plpgsql stable security definer set search_path = '' as $$
declare me anbar.employees;
begin
  select * into me from anbar.employees e where e.id = auth.uid() and e.active;
  if me.id is null then raise exception 'Giriş edilməyib və ya hesab aktiv deyil' using errcode = '42501'; end if;
  if not (me.dept_code = any(p_depts) or me.role = 'admin' or me.dept_code = 'admin') then
    raise exception 'Bu əməliyyat sizin şöbəyə aid deyil' using errcode = '42501';
  end if;
  return me;
end $$;

-- Ad ilə məhsul tap; yoxdursa "yeni" statusu ilə yarat (Admin sonra baxır)
create or replace function anbar.product_by_name(p_name text, p_by uuid) returns bigint
language plpgsql security definer set search_path = '' as $$
declare v bigint;
begin
  if p_name is null or length(btrim(p_name)) < 2 then raise exception 'Malın adı boşdur'; end if;
  select id into v from anbar.products where lower(btrim(name)) = lower(btrim(p_name));
  if v is null then
    insert into anbar.products (name, status, created_by) values (btrim(p_name), 'yeni', p_by) returning id into v;
  end if;
  return v;
end $$;

-- Sifarişin vəziyyətini mal sətirlərindən hesabla
create or replace function anbar.refresh_order(p_order bigint) returns void
language plpgsql security definer set search_path = '' as $$
declare n int; n_yeni int; n_legv int; n_bagli int; n_got int; st text;
begin
  select count(*),
         count(*) filter (where status = 'yeni'),
         count(*) filter (where status = 'legv'),
         count(*) filter (where status in ('bagli','legv')),
         count(*) filter (where qty_received > 0)
    into n, n_yeni, n_legv, n_bagli, n_got
    from anbar.order_items where order_id = p_order;
  st := case when n = 0 or n_legv = n then 'legv'
             when n_bagli = n then 'bagli'
             when n_yeni > 0 then 'satinalmada'
             when n_got > 0 then 'qismen'
             else 'gozlenilir' end;
  update anbar.orders set status = st, closed_at = case when st in ('bagli','legv') then coalesce(closed_at, now()) end
   where id = p_order and status is distinct from st;
  -- Satınalmanın "qəbul et" tapşırığı: qəbul edilməmiş mal yoxdursa bağlanır, varsa açılır
  if n_yeni = 0 then
    update anbar.tasks set status = 'bitdi', done_at = now(), done_by = auth.uid()
     where order_id = p_order and kind = 'qebul_et' and status = 'acik';
  elsif not exists (select 1 from anbar.tasks where order_id = p_order and kind = 'qebul_et' and status = 'acik') then
    insert into anbar.tasks (kind, order_id, dept_code, title, due_at)
    select 'qebul_et', p_order, 'satinalma', '#'||p_order||' sifarişini qəbul et ('||w.name||')',
           now() + make_interval(hours => coalesce((select value::int from anbar.settings where key = 'satinalma_qebul_saat'), 4))
      from anbar.orders o join anbar.warehouses w on w.code = o.warehouse_code where o.id = p_order;
  end if;
end $$;

-- =====================================================================
-- RPC: Anbar / İnqilab sifariş yazır
-- p_items: [{"product_id":1} və ya {"product_name":"Darçın"}, "qty":5, "unit":"kq", "note":"..."]
-- =====================================================================
create or replace function anbar.create_order(p_type text, p_items jsonb, p_note text default null)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; v_wh text; v_order bigint; it jsonb; v_pid bigint;
begin
  me := anbar.assert_dept('anbar','inqilab');
  select code into v_wh from anbar.warehouses where dept_code = me.dept_code and active;
  if v_wh is null then raise exception 'Sizin şöbəyə bağlı anbar yoxdur (Admin sifariş yaza bilməz)'; end if;
  if p_type not in ('gundelik','heftelik') then raise exception 'Sifariş növü: gundelik və ya heftelik'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Ən azı bir mal yazın';
  end if;
  insert into anbar.orders (warehouse_code, type, created_by, need_by, note)
  values (v_wh, p_type, me.id, anbar.default_need_by(p_type), nullif(btrim(p_note),''))
  returning id into v_order;
  for it in select * from jsonb_array_elements(p_items) loop
    v_pid := coalesce((it->>'product_id')::bigint, anbar.product_by_name(it->>'product_name', me.id));
    insert into anbar.order_items (order_id, product_id, qty_ordered, unit, note, created_by)
    values (v_order, v_pid, (it->>'qty')::numeric, coalesce(it->>'unit','ədəd'), nullif(btrim(it->>'note'),''), me.id);
  end loop;
  perform anbar.refresh_order(v_order);
  return v_order;
end $$;

-- Sifarişi verən şöbə həmin gün (Bakı vaxtı ilə) mal əlavə edə bilər
create or replace function anbar.add_items(p_order bigint, p_items jsonb)
returns int
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; o anbar.orders; it jsonb; v_pid bigint; n int := 0;
begin
  me := anbar.assert_dept('anbar','inqilab');
  select * into o from anbar.orders where id = p_order for update;
  if o.id is null then raise exception 'Sifariş tapılmadı'; end if;
  if (select dept_code from anbar.warehouses where code = o.warehouse_code) <> me.dept_code then
    raise exception 'Yalnız sifarişi verən anbar əlavə edə bilər';
  end if;
  if (o.created_at at time zone 'Asia/Baku')::date <> anbar.today_baku() then
    raise exception 'Əlavə etmək yalnız sifariş verilən gün mümkündür';
  end if;
  if o.status in ('bagli','legv') then raise exception 'Sifariş bağlıdır'; end if;
  for it in select * from jsonb_array_elements(p_items) loop
    v_pid := coalesce((it->>'product_id')::bigint, anbar.product_by_name(it->>'product_name', me.id));
    insert into anbar.order_items (order_id, product_id, qty_ordered, unit, note, added_later, created_by)
    values (p_order, v_pid, (it->>'qty')::numeric, coalesce(it->>'unit','ədəd'), nullif(btrim(it->>'note'),''), true, me.id);
    n := n + 1;
  end loop;
  perform anbar.refresh_order(p_order);
  return n;
end $$;

-- Satınalma yeni təchizatçı (firma və ya sürücü) əlavə edə bilər
create or replace function anbar.add_supplier(p_name text, p_kind text default 'firma', p_phone text default null)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare v bigint;
begin
  perform anbar.assert_dept('satinalma');
  select id into v from anbar.suppliers where lower(btrim(name)) = lower(btrim(p_name));
  if v is not null then return v; end if;
  insert into anbar.suppliers (name, kind, phone) values (btrim(p_name), coalesce(p_kind,'firma'), p_phone) returning id into v;
  return v;
end $$;

-- =====================================================================
-- RPC: Satınalma malları bölüşdürür — hər mal üçün kimdən, nə vaxt, kim məsul
-- p_lines: [{"item_id":10, "supplier_id":3, "promised_date":"2026-11-05", "purchaser_id":"uuid"(istəyə görə)}]
-- =====================================================================
create or replace function anbar.plan_items(p_lines jsonb, p_note text default null)
returns int
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; ln jsonb; it anbar.order_items; v_sup bigint; v_date date; v_buyer uuid; n int := 0;
        orders bigint[] := '{}'; oid bigint;
begin
  me := anbar.assert_dept('satinalma');
  for ln in select * from jsonb_array_elements(p_lines) loop
    select * into it from anbar.order_items where id = (ln->>'item_id')::bigint for update;
    if it.id is null then raise exception 'Mal sətri tapılmadı: %', ln->>'item_id'; end if;
    if it.status <> 'yeni' then raise exception 'Bu mal artıq planlaşdırılıb (#%) — tarixi dəyişmək üçün replan_item', it.id; end if;
    v_sup := (ln->>'supplier_id')::bigint;
    if v_sup is null or not exists (select 1 from anbar.suppliers where id = v_sup and active) then
      raise exception 'Təchizatçı seçilməyib və ya aktiv deyil (mal #%)', it.id;
    end if;
    v_date := (ln->>'promised_date')::date;
    if v_date is null or v_date < anbar.today_baku() then raise exception 'Gəliş tarixi bu gündən əvvəl ola bilməz (mal #%)', it.id; end if;
    v_buyer := coalesce((ln->>'purchaser_id')::uuid, me.id);
    if not exists (select 1 from anbar.employees where id = v_buyer and active and dept_code = 'satinalma') then
      raise exception 'Məsul işçi Satınalmadan olmalıdır';
    end if;
    update anbar.order_items
       set status = 'planlandi', supplier_id = v_sup, promised_date = v_date, purchaser_id = v_buyer,
           accepted_by = me.id, accepted_at = now(), note = coalesce(nullif(btrim(p_note),''), note)
     where id = it.id;
    n := n + 1;
    if not it.order_id = any(orders) then orders := orders || it.order_id; end if;
  end loop;
  foreach oid in array orders loop perform anbar.refresh_order(oid); end loop;
  return n;
end $$;

-- Tarixi / təchizatçını sonradan dəyişmək. Tarix gec çəkilirsə — səbəb mütləqdir
create or replace function anbar.replan_item(p_item bigint, p_promised date, p_supplier bigint default null,
                                             p_purchaser uuid default null, p_reason text default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; it anbar.order_items;
begin
  me := anbar.assert_dept('satinalma');
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null then raise exception 'Mal sətri tapılmadı'; end if;
  if it.status in ('yeni','bagli','legv') then raise exception 'Bu malın planı dəyişdirilə bilməz (status: %)', it.status; end if;
  if p_promised is null or p_promised < anbar.today_baku() then raise exception 'Yeni tarix bu gündən əvvəl ola bilməz'; end if;
  if p_promised > it.promised_date and (p_reason is null or length(btrim(p_reason)) < 3) then
    raise exception 'Tarix gec çəkilir — səbəbi yazın';
  end if;
  update anbar.order_items
     set promised_date = p_promised,
         supplier_id   = coalesce(p_supplier, supplier_id),
         purchaser_id  = coalesce(p_purchaser, purchaser_id),
         delay_reason  = coalesce(nullif(btrim(p_reason),''), delay_reason)
   where id = p_item;
end $$;

-- Qalığı səbəblə ləğv etmək (mal heç vaxt səssizcə itmir)
create or replace function anbar.cancel_remaining(p_item bigint, p_reason text, p_qty numeric default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; it anbar.order_items; q numeric;
begin
  me := anbar.assert_dept('satinalma','rehberlik');
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null then raise exception 'Mal sətri tapılmadı'; end if;
  if p_reason is null or length(btrim(p_reason)) < 3 then raise exception 'Ləğv səbəbini yazın'; end if;
  q := coalesce(p_qty, it.qty_remaining);
  if q <= 0 or q > it.qty_remaining then raise exception 'Ləğv miqdarı 0-dan böyük və qalıqdan (%) çox olmamalıdır', it.qty_remaining; end if;
  insert into anbar.cancellations (item_id, qty, reason, by_id) values (p_item, q, btrim(p_reason), me.id);
  update anbar.order_items
     set qty_cancelled = qty_cancelled + q,
         status = case when qty_remaining - q = 0 then (case when qty_received > 0 then 'bagli' else 'legv' end) else status end
   where id = p_item;
  perform anbar.refresh_order(it.order_id);
end $$;

-- Tapşırığı üzərinə götürmək (məsul olmaq)
create or replace function anbar.claim_task(p_task bigint) returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; t anbar.tasks;
begin
  select * into me from anbar.employees where id = auth.uid() and active;
  select * into t from anbar.tasks where id = p_task for update;
  if t.id is null or t.status <> 'acik' then raise exception 'Tapşırıq tapılmadı və ya bağlıdır'; end if;
  if me.id is null or (me.dept_code <> t.dept_code and me.role <> 'admin') then raise exception 'Bu tapşırıq sizin şöbəyə aid deyil'; end if;
  update anbar.tasks set assignee_id = me.id where id = p_task;
end $$;

-- =====================================================================
-- Trigger-lər: updated_at və tarixçə
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['orders','order_items'] loop
    execute format('drop trigger if exists touch on anbar.%I', t);
    execute format('create trigger touch before update on anbar.%I for each row execute function anbar.tg_touch()', t);
  end loop;
  foreach t in array array['settings','orders','order_items','cancellations','tasks'] loop
    execute format('drop trigger if exists audit on anbar.%I', t);
    execute format('create trigger audit after insert or update or delete on anbar.%I for each row execute function anbar.tg_event()', t);
  end loop;
end $$;

-- =====================================================================
-- RLS
-- =====================================================================
alter table anbar.settings      enable row level security;
alter table anbar.orders        enable row level security;
alter table anbar.order_items   enable row level security;
alter table anbar.cancellations enable row level security;
alter table anbar.tasks         enable row level security;

drop policy if exists oxu on anbar.settings;
create policy oxu on anbar.settings      for select to authenticated using (anbar.is_active());
drop policy if exists oxu on anbar.orders;
create policy oxu on anbar.orders        for select to authenticated using (anbar.can_see_wh(warehouse_code));
drop policy if exists oxu on anbar.order_items;
create policy oxu on anbar.order_items   for select to authenticated using (anbar.can_see_order(order_id));
drop policy if exists oxu on anbar.cancellations;
create policy oxu on anbar.cancellations for select to authenticated
  using (anbar.can_see_order((select i.order_id from anbar.order_items i where i.id = item_id)));
drop policy if exists oxu on anbar.tasks;
create policy oxu on anbar.tasks         for select to authenticated
  using (anbar.can_see_all() or assignee_id = auth.uid() or dept_code = anbar.my_dept());

revoke all on anbar.settings, anbar.orders, anbar.order_items, anbar.cancellations, anbar.tasks from public, anon, authenticated;
grant select on anbar.settings, anbar.orders, anbar.order_items, anbar.cancellations, anbar.tasks to authenticated;
grant all on anbar.settings, anbar.orders, anbar.order_items, anbar.cancellations, anbar.tasks to service_role;

-- Admin ayarları dəyişir
create or replace function anbar.admin_set_setting(p_key text, p_value text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform anbar.assert_admin();
  update anbar.settings set value = p_value where key = p_key;
  if not found then raise exception 'Belə ayar yoxdur: %', p_key; end if;
end $$;

revoke execute on all functions in schema anbar from public, anon;
grant execute on function
  anbar.today_baku(), anbar.default_need_by(text,timestamptz), anbar.can_see_wh(text), anbar.can_see_order(bigint),
  anbar.create_order(text,jsonb,text), anbar.add_items(bigint,jsonb), anbar.add_supplier(text,text,text),
  anbar.plan_items(jsonb,text), anbar.replan_item(bigint,date,bigint,uuid,text),
  anbar.cancel_remaining(bigint,text,numeric), anbar.claim_task(bigint), anbar.admin_set_setting(text,text)
to authenticated;
-- daxili köməkçilər (refresh_order, product_by_name, assert_dept) birbaşa çağırıla bilməz

commit;
