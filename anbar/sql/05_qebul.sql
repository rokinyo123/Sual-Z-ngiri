-- =====================================================================
-- 05 · MAL QƏBULU VƏ KEYFİYYƏT (04_surucu.sql-dən sonra)
--
--   Anbar "📦 Gəldi" → çatdırılma (delivery) yaranır, gələn miqdarlar yazılır
--   Anbar (əsas):  Keyfiyyət hər sətrə baxır → keçdi / bloklandı (səbəb mütləq)
--                  Keyfiyyət bitirmədən Anbar qəbulu bağlaya bilməz
--   İnqilab:       Keyfiyyət addımı yoxdur
--   Qəbul bağlananda:
--     keçən miqdar malın "qəbul olunan"ına əlavə olunur
--     qalıq varsa (gəlmədi / az gəldi / bloklandı) → mal "problem" olur və
--     Satınalmaya "cavab ver" tapşırığı düşür: yeni tarix (səbəblə) və ya
--     səbəblə ləğv. Mal heç vaxt itmir.
--   Bir mal bir neçə dəfə, hissə-hissə gələ bilər.
-- =====================================================================
begin;

-- Yeni vəziyyət: problem (Satınalmanın cavabını gözləyir)
alter table anbar.order_items drop constraint if exists order_items_status_check;
alter table anbar.order_items add constraint order_items_status_check
  check (status in ('yeni','planlandi','geldi','keyfiyyetde','problem','qebul_olundu','texnoloqda','bagli','legv'));
alter table anbar.order_items add column if not exists problem_note text;

create table if not exists anbar.deliveries (
  id             bigint generated always as identity primary key,
  order_id       bigint not null references anbar.orders(id),
  warehouse_code text not null references anbar.warehouses(code),
  arrived_at     timestamptz not null default now(),
  received_by    uuid not null references anbar.employees(id),
  note           text,
  qc_required    boolean not null,
  qc_done_at     timestamptz,
  qc_done_by     uuid references anbar.employees(id),
  status         text not null default 'acik' check (status in ('acik','bagli')),
  closed_at      timestamptz,
  closed_by      uuid references anbar.employees(id)
);
create index if not exists deliveries_open_idx on anbar.deliveries (warehouse_code, status);

create table if not exists anbar.delivery_lines (
  id           bigint generated always as identity primary key,
  delivery_id  bigint not null references anbar.deliveries(id),
  item_id      bigint not null references anbar.order_items(id),
  qty_arrived  numeric(12,3) not null check (qty_arrived >= 0),
  qc_status    text not null default 'gozleyir' check (qc_status in ('gozleyir','kecdi','bloklandi','lazim_deyil')),
  qc_note      text,
  qc_photo     text,
  qc_by        uuid references anbar.employees(id),
  qc_at        timestamptz,
  qty_accepted numeric(12,3),
  unique (delivery_id, item_id),
  constraint block_has_note check (qc_status <> 'bloklandi' or length(btrim(coalesce(qc_note,''))) >= 3)
);
create index if not exists dlines_item_idx on anbar.delivery_lines (item_id);

-- ---------------------------------------------------------------------
-- Anbar / İnqilab: "📦 Gəldi"
-- p_lines: [{"item_id":1,"qty":18}, ...]  (gəlməyən malı yazmamaq olar — qəbul bağlananda "gəlmədi" sayılır)
-- ---------------------------------------------------------------------
create or replace function anbar.mark_arrived(p_order bigint, p_lines jsonb, p_note text default null)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; o anbar.orders; w anbar.warehouses; v_del bigint; ln jsonb; it anbar.order_items;
begin
  me := anbar.assert_dept('anbar','inqilab');
  select * into o from anbar.orders where id = p_order for update;
  if o.id is null then raise exception 'Sifariş tapılmadı'; end if;
  select * into w from anbar.warehouses where code = o.warehouse_code;
  if w.dept_code <> me.dept_code and me.role <> 'admin' then raise exception 'Bu sifariş sizin anbara aid deyil'; end if;
  if exists (select 1 from anbar.deliveries where order_id = p_order and status = 'acik') then
    raise exception 'Bu sifariş üçün açıq qəbul var — əvvəl onu bitirin';
  end if;
  insert into anbar.deliveries (order_id, warehouse_code, received_by, note, qc_required)
  values (p_order, o.warehouse_code, me.id, nullif(btrim(p_note),''), w.requires_qc) returning id into v_del;
  -- planlanmış hər mal üçün sətir (yazılmayanlar 0 sayılır)
  for it in select * from anbar.order_items where order_id = p_order and status = 'planlandi' loop
    ln := null;
    select x.value into ln from jsonb_array_elements(coalesce(p_lines,'[]'::jsonb)) as x(value)
     where (x.value->>'item_id')::bigint = it.id limit 1;
    insert into anbar.delivery_lines (delivery_id, item_id, qty_arrived, qc_status)
    values (v_del, it.id, greatest(coalesce((ln->>'qty')::numeric, 0), 0),
            case when w.requires_qc then 'gozleyir' else 'lazim_deyil' end);
    update anbar.order_items set status = case when w.requires_qc then 'keyfiyyetde' else 'geldi' end where id = it.id;
  end loop;
  if not exists (select 1 from anbar.delivery_lines where delivery_id = v_del) then
    raise exception 'Bu sifarişdə gözlənilən (planlanmış) mal yoxdur';
  end if;
  if w.requires_qc then
    insert into anbar.tasks (kind, order_id, dept_code, title, due_at)
    values ('keyfiyyet', p_order, 'keyfiyyet', '#'||p_order||' gəldi — yoxlayın ('||w.name||')', now() + interval '2 hours');
  end if;
  perform anbar.refresh_order(p_order);
  return v_del;
end $$;

-- Anbar qəbul açıq ikən miqdarı düzəldir
create or replace function anbar.set_arrived_qty(p_line bigint, p_qty numeric)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; d anbar.deliveries;
begin
  me := anbar.assert_dept('anbar','inqilab');
  select dl.* into d from anbar.deliveries dl join anbar.delivery_lines l on l.delivery_id = dl.id where l.id = p_line;
  if d.id is null or d.status <> 'acik' then raise exception 'Qəbul tapılmadı və ya bağlıdır'; end if;
  if (select dept_code from anbar.warehouses where code = d.warehouse_code) <> me.dept_code and me.role <> 'admin' then
    raise exception 'Bu qəbul sizin anbara aid deyil';
  end if;
  if p_qty is null or p_qty < 0 then raise exception 'Miqdar mənfi ola bilməz'; end if;
  update anbar.delivery_lines set qty_arrived = p_qty where id = p_line;
end $$;

-- ---------------------------------------------------------------------
-- Keyfiyyət: hər sətir — keçdi / bloklandı (səbəb mütləq)
-- ---------------------------------------------------------------------
create or replace function anbar.qc_line(p_line bigint, p_pass boolean, p_note text default null, p_photo text default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; d anbar.deliveries;
begin
  me := anbar.assert_dept('keyfiyyet');
  select dl.* into d from anbar.deliveries dl join anbar.delivery_lines l on l.delivery_id = dl.id where l.id = p_line;
  if d.id is null or d.status <> 'acik' or not d.qc_required then raise exception 'Yoxlanacaq qəbul tapılmadı'; end if;
  if d.qc_done_at is not null then raise exception 'Bu qəbulun yoxlaması artıq bitib'; end if;
  if not p_pass and (p_note is null or length(btrim(p_note)) < 3) then raise exception 'Niyə uyğun olmadığını yazın'; end if;
  update anbar.delivery_lines
     set qc_status = case when p_pass then 'kecdi' else 'bloklandi' end,
         qc_note = nullif(btrim(p_note),''), qc_photo = p_photo, qc_by = me.id, qc_at = now()
   where id = p_line;
end $$;

-- Keyfiyyət yoxlamanı bitirir. Baxılmayan sətir: gəlmə miqdarı 0-dırsa "gəlmədi",
-- deyilsə yoxlama bitmir (hər gələn mala baxılmalıdır).
create or replace function anbar.qc_finish(p_delivery bigint)
returns int
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; d anbar.deliveries; n_block int;
begin
  me := anbar.assert_dept('keyfiyyet');
  select * into d from anbar.deliveries where id = p_delivery for update;
  if d.id is null or d.status <> 'acik' or not d.qc_required then raise exception 'Yoxlanacaq qəbul tapılmadı'; end if;
  if exists (select 1 from anbar.delivery_lines where delivery_id = p_delivery and qc_status = 'gozleyir' and qty_arrived > 0) then
    raise exception 'Gələn bütün mallara baxın (✓ və ya ✗)';
  end if;
  update anbar.delivery_lines set qc_status = 'lazim_deyil' where delivery_id = p_delivery and qc_status = 'gozleyir';
  update anbar.deliveries set qc_done_at = now(), qc_done_by = me.id where id = p_delivery;
  update anbar.tasks set status = 'bitdi', done_at = now(), done_by = me.id
   where order_id = d.order_id and kind = 'keyfiyyet' and status = 'acik';
  select count(*) into n_block from anbar.delivery_lines where delivery_id = p_delivery and qc_status = 'bloklandi';
  return n_block;
end $$;

-- ---------------------------------------------------------------------
-- Anbar qəbulu bağlayır → qəbul olunan miqdar mala yazılır, qalıq Satınalmaya
-- ---------------------------------------------------------------------
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
                when rest > 0 then 'Az gəldi: '||trim(to_char(rest,'FM999999990.###'))||' '||it.unit||' əskik'
           end;
    update anbar.order_items
       set qty_received = qty_received + acc,
           status = case when rest <= 0 then 'qebul_olundu' else 'problem' end,
           problem_note = why
     where id = it.id;
    if rest > 0 then
      n_problem := n_problem + 1;
      insert into anbar.tasks (kind, order_id, item_id, dept_code, assignee_id, title, due_at)
      values ('cavab', it.order_id, it.id, 'satinalma', it.purchaser_id,
              '#'||it.order_id||' · '||(select name from anbar.products where id = it.product_id)||': '||why||' — yeni tarix və ya ləğv',
              now() + interval '4 hours');
    end if;
  end loop;
  -- tam qəbul olunan və Texnoloq tələb etməyən mal bağlanır
  update anbar.order_items i set status = 'bagli'
   where i.id in (select item_id from anbar.delivery_lines where delivery_id = p_delivery)
     and i.status = 'qebul_olundu'
     and not exists (select 1 from anbar.products p where p.id = i.product_id and p.needs_tech);
  update anbar.deliveries set status = 'bagli', closed_at = now(), closed_by = me.id where id = p_delivery;
  perform anbar.refresh_order(d.order_id);
  return n_problem;
end $$;

-- Satınalma problemli mala cavab verir: yeni tarix (səbəb mütləq) → mal yenə "planlandi"
create or replace function anbar.answer_problem(p_item bigint, p_promised date, p_reason text,
                                                p_supplier bigint default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; it anbar.order_items;
begin
  me := anbar.assert_dept('satinalma');
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null or it.status <> 'problem' then raise exception 'Bu malın cavab gözləyən problemi yoxdur'; end if;
  if p_promised is null or p_promised < anbar.today_baku() then raise exception 'Yeni tarix bu gündən əvvəl ola bilməz'; end if;
  if p_reason is null or length(btrim(p_reason)) < 3 then raise exception 'Gecikmə səbəbini yazın'; end if;
  update anbar.order_items
     set status = 'planlandi', promised_date = p_promised, delay_reason = btrim(p_reason),
         supplier_id = coalesce(p_supplier, supplier_id), bought_qty = null, bought_at = null, bought_note = null
   where id = p_item;
  update anbar.tasks set status = 'bitdi', done_at = now(), done_by = me.id
   where item_id = p_item and kind = 'cavab' and status = 'acik';
  perform anbar.refresh_order(it.order_id);
end $$;

-- Ləğv problemli malın tapşırığını da bağlasın
create or replace function anbar.tg_close_cavab() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status in ('bagli','legv') and old.status = 'problem' then
    update anbar.tasks set status = 'bitdi', done_at = now(), done_by = auth.uid()
     where item_id = new.id and kind = 'cavab' and status = 'acik';
  end if;
  return new;
end $$;
drop trigger if exists close_cavab on anbar.order_items;
create trigger close_cavab after update of status on anbar.order_items
  for each row execute function anbar.tg_close_cavab();

-- cancel_remaining: problemli malın qalığını da ləğv edə bilsin, bağlananda statusu düzgün qoysun
create or replace function anbar.cancel_remaining(p_item bigint, p_reason text, p_qty numeric default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; it anbar.order_items; q numeric;
begin
  me := anbar.assert_dept('satinalma','rehberlik');
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null then raise exception 'Mal sətri tapılmadı'; end if;
  if it.status in ('geldi','keyfiyyetde') then raise exception 'Mal qəbuldadır — qəbul bitəndən sonra'; end if;
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

-- Sifarişin vəziyyəti: problem və qəbul mərhələləri nəzərə alınır
create or replace function anbar.refresh_order(p_order bigint) returns void
language plpgsql security definer set search_path = '' as $$
declare n int; n_yeni int; n_legv int; n_bagli int; n_got int; st text;
begin
  select count(*),
         count(*) filter (where status = 'yeni'),
         count(*) filter (where status = 'legv'),
         count(*) filter (where status in ('bagli','legv')),
         count(*) filter (where qty_received > 0 or status in ('geldi','keyfiyyetde','problem'))
    into n, n_yeni, n_legv, n_bagli, n_got
    from anbar.order_items where order_id = p_order;
  st := case when n = 0 or n_legv = n then 'legv'
             when n_bagli = n then 'bagli'
             when n_yeni > 0 then 'satinalmada'
             when n_got > 0 then 'qismen'
             else 'gozlenilir' end;
  update anbar.orders set status = st, closed_at = case when st in ('bagli','legv') then coalesce(closed_at, now()) end
   where id = p_order and status is distinct from st;
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

-- Tarixçə və RLS
do $$
declare t text;
begin
  foreach t in array array['deliveries','delivery_lines'] loop
    execute format('drop trigger if exists audit on anbar.%I', t);
    execute format('create trigger audit after insert or update or delete on anbar.%I for each row execute function anbar.tg_event()', t);
  end loop;
end $$;
alter table anbar.deliveries     enable row level security;
alter table anbar.delivery_lines enable row level security;
drop policy if exists oxu on anbar.deliveries;
create policy oxu on anbar.deliveries     for select to authenticated using (anbar.can_see_order(order_id));
drop policy if exists oxu on anbar.delivery_lines;
create policy oxu on anbar.delivery_lines for select to authenticated
  using (anbar.can_see_order((select d.order_id from anbar.deliveries d where d.id = delivery_id)));
revoke all on anbar.deliveries, anbar.delivery_lines from public, anon, authenticated;
grant select on anbar.deliveries, anbar.delivery_lines to authenticated;
grant all on anbar.deliveries, anbar.delivery_lines to service_role;

revoke execute on all functions in schema anbar from public, anon;
grant execute on function
  anbar.mark_arrived(bigint,jsonb,text), anbar.set_arrived_qty(bigint,numeric),
  anbar.qc_line(bigint,boolean,text,text), anbar.qc_finish(bigint), anbar.close_delivery(bigint),
  anbar.answer_problem(bigint,date,text,bigint), anbar.cancel_remaining(bigint,text,numeric)
to authenticated;
revoke execute on function anbar.refresh_order(bigint) from authenticated;

commit;
