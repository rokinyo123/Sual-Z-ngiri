-- =====================================================================
-- 06 · TEXNOLOQ VƏ ALTERNATİV MALLAR (05_qebul.sql-dən sonra)
--
--   Texnoloqa düşür:
--     * kataloqda "needs_tech" işarəli mal
--     * Satınalmanın "Texnoloq baxsın" dediyi mal (request_tech)
--     * ALTERNATİV (əvəzedici) mal — Texnoloq təsdiq edənə qədər istifadəyə buraxılmır
--   Mal qəbul olunanda Texnoloqa tapşırıq düşür. Texnoloq əvvəl cavab günü təyin edir,
--   sonra "qəbul olundu / qəbul olunmadı" deyir (rədddə səbəb mütləq).
--   Rədd → mal geri qaytarılır (qəbul sayılmır), Satınalmaya "cavab ver" düşür.
--   Bloklanmış (status = bloklu) məhsulu sifariş etmək olmur.
-- =====================================================================
begin;

drop function if exists anbar.substitute_item(bigint,bigint,numeric,text,bigint,date,text);

alter table anbar.order_items add column if not exists tech_required boolean not null default false;
alter table anbar.order_items add column if not exists tech_note text;   -- Satınalmanın Texnoloqa qeydi

create table if not exists anbar.product_alternatives (
  id             bigint generated always as identity primary key,
  product_id     bigint not null references anbar.products(id),     -- əsl mal
  alternative_id bigint not null references anbar.products(id),     -- əvəzedici
  status         text not null default 'gozleyir' check (status in ('gozleyir','tesdiq','redd')),
  decided_by     uuid references anbar.employees(id),
  decided_at     timestamptz,
  note           text,
  created_at     timestamptz not null default now(),
  unique (product_id, alternative_id),
  check (product_id <> alternative_id)
);

create table if not exists anbar.tech_reviews (
  id          bigint generated always as identity primary key,
  item_id     bigint not null references anbar.order_items(id),
  product_id  bigint not null references anbar.products(id),
  reason      text not null check (reason in ('mal','satinalma','alternativ')),
  note        text,                                          -- niyə baxmalıdır
  due_date    date,                                          -- Texnoloq təyin edir
  result      text not null default 'gozleyir' check (result in ('gozleyir','tesdiq','redd','lazim_deyil')),
  result_note text,
  decided_by  uuid references anbar.employees(id),
  decided_at  timestamptz,
  created_at  timestamptz not null default now(),
  unique (item_id)
);
create index if not exists tech_open_idx on anbar.tech_reviews (result, due_date) where result = 'gozleyir';

-- ---------------------------------------------------------------------
-- Bloklanmış / arxiv məhsulu sifariş etmək olmaz
-- ---------------------------------------------------------------------
create or replace function anbar.tg_item_product_ok() returns trigger
language plpgsql security definer set search_path = '' as $$
declare st text;
begin
  select status into st from anbar.products where id = new.product_id;
  if st in ('bloklu','arxiv') then
    raise exception 'Bu məhsul % — sifariş etmək olmaz', case st when 'bloklu' then 'bloklanıb' else 'arxivdədir' end;
  end if;
  -- kataloqda Texnoloq tələb edən və ya hələ təsdiqlənməmiş mal
  if st = 'texnoloq_gozleyir' or exists (select 1 from anbar.products where id = new.product_id and needs_tech) then
    new.tech_required := true;
  end if;
  return new;
end $$;
drop trigger if exists product_ok on anbar.order_items;
create trigger product_ok before insert on anbar.order_items
  for each row execute function anbar.tg_item_product_ok();

-- ---------------------------------------------------------------------
-- Satınalma: "Texnoloq baxsın" (sifariş qəbul olunmamış və ya planlanmış mala)
-- ---------------------------------------------------------------------
create or replace function anbar.request_tech(p_item bigint, p_note text)
returns void
language plpgsql security definer set search_path = '' as $$
declare it anbar.order_items;
begin
  perform anbar.assert_dept('satinalma');
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null then raise exception 'Mal tapılmadı'; end if;
  if it.status not in ('yeni','planlandi') then raise exception 'Mal artıq gəlib — Texnoloq işarəsi gəlişdən əvvəl qoyulur'; end if;
  update anbar.order_items set tech_required = true, tech_note = nullif(btrim(p_note),'') where id = p_item;
end $$;

-- ---------------------------------------------------------------------
-- Satınalma: problemli mala əvəzedici (alternativ) — yeni sətir, Texnoloq təsdiqi ilə
-- Əsl malın qalığı "əvəzinə X" səbəbi ilə bağlanır.
-- ---------------------------------------------------------------------
create or replace function anbar.substitute_item(p_item bigint, p_alt_product bigint, p_qty numeric,
                                                 p_unit text, p_supplier bigint, p_promised date, p_reason text,
                                                 p_alt_name text default null)   -- kataloqda yoxdursa adı
returns bigint
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; it anbar.order_items; v_new bigint; ok boolean;
begin
  me := anbar.assert_dept('satinalma');
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null or it.status not in ('problem','planlandi') then raise exception 'Bu mala əvəzedici vermək olmaz (status: %)', it.status; end if;
  if p_alt_product is null then
    if p_alt_name is null or length(btrim(p_alt_name)) < 2 then raise exception 'Əvəzedici malı seçin və ya adını yazın'; end if;
    p_alt_product := anbar.product_by_name(p_alt_name, me.id);
  end if;
  if p_alt_product = it.product_id then raise exception 'Əvəzedici eyni məhsul ola bilməz'; end if;
  if p_reason is null or length(btrim(p_reason)) < 3 then raise exception 'Səbəbi yazın'; end if;
  if p_promised is null or p_promised < anbar.today_baku() then raise exception 'Tarix bu gündən əvvəl ola bilməz'; end if;
  if p_supplier is null or not exists (select 1 from anbar.suppliers where id = p_supplier and active) then raise exception 'Təchizatçını seçin'; end if;
  -- cüt əvvəl təsdiqlənibsə Texnoloq lazım deyil
  insert into anbar.product_alternatives (product_id, alternative_id) values (it.product_id, p_alt_product)
  on conflict (product_id, alternative_id) do nothing;
  select status = 'tesdiq' into ok from anbar.product_alternatives where product_id = it.product_id and alternative_id = p_alt_product;
  insert into anbar.order_items (order_id, product_id, qty_ordered, unit, status, supplier_id, purchaser_id, promised_date,
                                 accepted_by, accepted_at, parent_item_id, is_alternative, tech_required, tech_note, created_by, added_later)
  values (it.order_id, p_alt_product, coalesce(p_qty, it.qty_remaining), coalesce(p_unit, it.unit), 'planlandi', p_supplier, me.id, p_promised,
          me.id, now(), it.id, true, not coalesce(ok,false), 'Əvəzedici: '||(select name from anbar.products where id = it.product_id), me.id, true)
  returning id into v_new;
  -- əsl malın qalığını bağla (məsələn "əvəzinə X") — mal itmir, tarixçədə və əvəzedicidə izlənir
  perform anbar.cancel_remaining(p_item, 'Əvəzinə: '||(select name from anbar.products where id = p_alt_product)||' — '||btrim(p_reason));
  perform anbar.refresh_order(it.order_id);
  return v_new;
end $$;

-- ---------------------------------------------------------------------
-- Qəbul bağlananda: Texnoloq tələb edən malı Texnoloqa göndər
-- (05-dəki close_delivery yalnız needs_tech-i nəzərə alırdı — indi tech_required)
-- ---------------------------------------------------------------------
create or replace function anbar.tg_item_to_tech() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'qebul_olundu' and old.status is distinct from 'qebul_olundu' and new.tech_required then
    insert into anbar.tech_reviews (item_id, product_id, reason, note)
    values (new.id, new.product_id,
            case when new.is_alternative then 'alternativ' when new.tech_note is not null then 'satinalma' else 'mal' end,
            new.tech_note)
    on conflict (item_id) do update set result = 'gozleyir', due_date = null, result_note = null, decided_by = null, decided_at = null;
    insert into anbar.tasks (kind, order_id, item_id, dept_code, title, due_at)
    values ('texnoloq', new.order_id, new.id, 'texnoloq',
            '#'||new.order_id||' · '||(select name from anbar.products where id = new.product_id)||' — yoxlayın, cavab günü təyin edin',
            now() + interval '1 day');
    new.status := 'texnoloqda';
  end if;
  return new;
end $$;
drop trigger if exists to_tech on anbar.order_items;
create trigger to_tech before update of status on anbar.order_items
  for each row execute function anbar.tg_item_to_tech();

-- close_delivery: needs_tech yoxlaması tech_required ilə əvəzlənir
create or replace function anbar.close_delivery(p_delivery bigint)
returns int
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; d anbar.deliveries; l anbar.delivery_lines; it anbar.order_items;
        acc numeric; rest numeric; why text; n_problem int := 0;
begin
  me := anbar.assert_dept('anbar','inqilab');
  select * into d from anbar.deliveries where id = p_delivery for update;
  if d.id is null or d.status <> 'acik' then raise exception 'Açıq qəbul tapılmadı'; end if;
  if (select dept_code from anbar.warehouses where code = d.warehouse_code) <> me.dept_code and me.role <> 'admin' then
    raise exception 'Bu qəbul sizin anbara aid deyil';
  end if;
  if d.qc_required and d.qc_done_at is null then raise exception 'Keyfiyyət hələ yoxlamayıb'; end if;
  for l in select * from anbar.delivery_lines where delivery_id = p_delivery loop
    select * into it from anbar.order_items where id = l.item_id for update;
    acc := case when l.qc_status = 'bloklandi' then 0 else least(l.qty_arrived, it.qty_remaining) end;
    update anbar.delivery_lines set qty_accepted = acc where id = l.id;
    rest := it.qty_remaining - acc;
    why := case when l.qc_status = 'bloklandi' then 'Keyfiyyət blokladı: '||l.qc_note
                when l.qty_arrived = 0 then 'Gəlmədi'
                when rest > 0 then 'Az gəldi: '||trim(to_char(rest,'FM999999990.###'))||' '||it.unit||' əskik' end;
    update anbar.order_items
       set qty_received = qty_received + acc,
           status = case when rest <= 0 then 'qebul_olundu' else 'problem' end,
           problem_note = why
     where id = it.id;
    if rest > 0 then
      n_problem := n_problem + 1;
      insert into anbar.tasks (kind, order_id, item_id, dept_code, assignee_id, title, due_at)
      values ('cavab', it.order_id, it.id, 'satinalma', it.purchaser_id,
              '#'||it.order_id||' · '||(select name from anbar.products where id = it.product_id)||': '||why||' — yeni tarix, əvəzedici və ya ləğv',
              now() + interval '4 hours');
    end if;
  end loop;
  update anbar.order_items i set status = 'bagli'
   where i.id in (select item_id from anbar.delivery_lines where delivery_id = p_delivery)
     and i.status = 'qebul_olundu';
  update anbar.deliveries set status = 'bagli', closed_at = now(), closed_by = me.id where id = p_delivery;
  perform anbar.refresh_order(d.order_id);
  return n_problem;
end $$;

-- ---------------------------------------------------------------------
-- Texnoloq: cavab günü, sonra qərar
-- ---------------------------------------------------------------------
create or replace function anbar.tech_set_due(p_review bigint, p_due date)
returns void
language plpgsql security definer set search_path = '' as $$
declare r anbar.tech_reviews;
begin
  perform anbar.assert_dept('texnoloq');
  select * into r from anbar.tech_reviews where id = p_review for update;
  if r.id is null or r.result <> 'gozleyir' then raise exception 'Açıq yoxlama tapılmadı'; end if;
  if p_due is null or p_due < anbar.today_baku() then raise exception 'Cavab günü bu gündən əvvəl ola bilməz'; end if;
  update anbar.tech_reviews set due_date = p_due where id = p_review;
  update anbar.tasks set due_at = (p_due + 1)::timestamp at time zone 'Asia/Baku', assignee_id = auth.uid()
   where item_id = r.item_id and kind = 'texnoloq' and status = 'acik';
end $$;

-- p_result: tesdiq | redd | lazim_deyil
create or replace function anbar.tech_decide(p_review bigint, p_result text, p_note text default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; r anbar.tech_reviews; it anbar.order_items;
begin
  me := anbar.assert_dept('texnoloq');
  select * into r from anbar.tech_reviews where id = p_review for update;
  if r.id is null or r.result <> 'gozleyir' then raise exception 'Açıq yoxlama tapılmadı'; end if;
  if p_result not in ('tesdiq','redd','lazim_deyil') then raise exception 'Nəticə: tesdiq, redd və ya lazim_deyil'; end if;
  if p_result in ('tesdiq','redd') and r.due_date is null then raise exception 'Əvvəl cavab gününü təyin edin'; end if;
  if p_result = 'redd' and (p_note is null or length(btrim(p_note)) < 3) then raise exception 'Niyə qəbul olunmadığını yazın'; end if;
  update anbar.tech_reviews set result = p_result, result_note = nullif(btrim(p_note),''), decided_by = me.id, decided_at = now()
   where id = p_review;
  select * into it from anbar.order_items where id = r.item_id for update;
  if p_result in ('tesdiq','lazim_deyil') then
    update anbar.order_items set status = 'bagli' where id = it.id;
    if p_result = 'tesdiq' then
      update anbar.products set status = 'aktiv' where id = r.product_id and status = 'texnoloq_gozleyir';
      if it.is_alternative and it.parent_item_id is not null then
        update anbar.product_alternatives set status = 'tesdiq', decided_by = me.id, decided_at = now(), note = nullif(btrim(p_note),'')
         where product_id = (select product_id from anbar.order_items where id = it.parent_item_id) and alternative_id = it.product_id;
      end if;
    end if;
  else
    -- rədd: mal geri qaytarılır (qəbul sayılmır), Satınalma cavab verməlidir
    update anbar.order_items
       set qty_received = 0, status = 'problem', problem_note = 'Texnoloq qəbul etmədi: '||btrim(p_note)
     where id = it.id;
    if it.is_alternative and it.parent_item_id is not null then
      update anbar.product_alternatives set status = 'redd', decided_by = me.id, decided_at = now(), note = btrim(p_note)
       where product_id = (select product_id from anbar.order_items where id = it.parent_item_id) and alternative_id = it.product_id;
    end if;
    insert into anbar.tasks (kind, order_id, item_id, dept_code, assignee_id, title, due_at)
    values ('cavab', it.order_id, it.id, 'satinalma', it.purchaser_id,
            '#'||it.order_id||' · '||(select name from anbar.products where id = it.product_id)||': Texnoloq qəbul etmədi — yeni tarix, əvəzedici və ya ləğv',
            now() + interval '4 hours');
  end if;
  update anbar.tasks set status = 'bitdi', done_at = now(), done_by = me.id
   where item_id = r.item_id and kind = 'texnoloq' and status = 'acik';
  perform anbar.refresh_order(it.order_id);
end $$;

-- Admin: məhsulu bloklamaq / açmaq, Texnoloq tələbi
create or replace function anbar.admin_product_status(p_product bigint, p_status text, p_needs_tech boolean default null)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform anbar.assert_admin();
  update anbar.products set status = coalesce(p_status, status), needs_tech = coalesce(p_needs_tech, needs_tech) where id = p_product;
  if not found then raise exception 'Məhsul tapılmadı'; end if;
end $$;

-- Tarixçə, RLS, icazələr
do $$
declare t text;
begin
  foreach t in array array['product_alternatives','tech_reviews'] loop
    execute format('drop trigger if exists audit on anbar.%I', t);
    execute format('create trigger audit after insert or update or delete on anbar.%I for each row execute function anbar.tg_event()', t);
  end loop;
end $$;
alter table anbar.product_alternatives enable row level security;
alter table anbar.tech_reviews         enable row level security;
drop policy if exists oxu on anbar.product_alternatives;
create policy oxu on anbar.product_alternatives for select to authenticated using (anbar.is_active());
drop policy if exists oxu on anbar.tech_reviews;
create policy oxu on anbar.tech_reviews for select to authenticated
  using (anbar.can_see_order((select i.order_id from anbar.order_items i where i.id = item_id)));
revoke all on anbar.product_alternatives, anbar.tech_reviews from public, anon, authenticated;
grant select on anbar.product_alternatives, anbar.tech_reviews to authenticated;
grant all on anbar.product_alternatives, anbar.tech_reviews to service_role;

revoke execute on all functions in schema anbar from public, anon;
grant execute on function
  anbar.request_tech(bigint,text), anbar.substitute_item(bigint,bigint,numeric,text,bigint,date,text,text),
  anbar.close_delivery(bigint), anbar.tech_set_due(bigint,date), anbar.tech_decide(bigint,text,text),
  anbar.admin_product_status(bigint,text,boolean)
to authenticated;

commit;
