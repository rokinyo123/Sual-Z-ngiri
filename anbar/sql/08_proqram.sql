-- =====================================================================
-- 08 · PROQRAM ÜÇÜN KİÇİK ƏLAVƏLƏR (07_bildiris.sql-dən sonra)
--   * Satış və Çeşidləmə sifarişləri GÖRÜR (yalnız oxumaq): "X nə vaxt gələcək?" sualına cavab üçün
--   * anbar.my_profile(): giriş edən işçinin məlumatı + şöbə adı (proqram açılanda)
--   * "📦 Gəldi" yalnız yazılan mallar üçündür: bir sifarişin malları müxtəlif firmalardan
--     müxtəlif günlərdə gəlir — A firması gələndə B firmasının malı "gəlmədi" sayılmır.
--     Eyni sifariş üçün bir neçə açıq qəbul ola bilər (hər firma ayrıca); Keyfiyyət hər qəbulu ayrıca bitirir.
--   * Rəhbərliyə eyni hadisə üçün iki bildiriş getməsin (blok / Texnoloq rəddi)
-- =====================================================================
begin;

create or replace function anbar.can_see_wh(p_wh text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from anbar.employees e
    where e.id = auth.uid() and e.active and (
      e.role = 'admin' or e.dept_code in ('rehberlik','admin','satinalma','satis','cesidleme')
      or e.dept_code = (select w.dept_code from anbar.warehouses w where w.code = p_wh)
      or (p_wh = 'ANBAR' and e.dept_code in ('keyfiyyet','texnoloq','istehsalat'))
    ))
$$;

create or replace function anbar.my_profile() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
           'id', e.id, 'full_name', e.full_name, 'username', e.username, 'dept_code', e.dept_code,
           'dept_name', d.name, 'role', e.role, 'active', e.active,
           'warehouse', (select w.code from anbar.warehouses w where w.dept_code = e.dept_code and w.active limit 1),
           'driver_supplier', (select s.id from anbar.suppliers s where s.employee_id = e.id limit 1),
           'today', anbar.today_baku())
    from anbar.employees e join anbar.departments d on d.code = e.dept_code
   where e.id = auth.uid()
$$;

alter table anbar.tasks add column if not exists delivery_id bigint references anbar.deliveries(id);

-- p_lines: [{"item_id":..,"qty":..}]  — qty = 0 → "gəlmədi"
create or replace function anbar.mark_arrived(p_order bigint, p_lines jsonb, p_note text default null)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; o anbar.orders; w anbar.warehouses; v_del bigint; ln jsonb; it anbar.order_items; n int := 0;
begin
  me := anbar.assert_dept('anbar','inqilab');
  select * into o from anbar.orders where id = p_order for update;
  if o.id is null then raise exception 'Sifariş tapılmadı'; end if;
  select * into w from anbar.warehouses where code = o.warehouse_code;
  if w.dept_code <> me.dept_code and me.role <> 'admin' then raise exception 'Bu sifariş sizin anbara aid deyil'; end if;
  if p_lines is null or jsonb_typeof(p_lines) <> 'array' or jsonb_array_length(p_lines) = 0 then
    raise exception 'Gələn malları seçin';
  end if;
  insert into anbar.deliveries (order_id, warehouse_code, received_by, note, qc_required)
  values (p_order, o.warehouse_code, me.id, nullif(btrim(p_note),''), w.requires_qc) returning id into v_del;
  for ln in select * from jsonb_array_elements(p_lines) loop
    select * into it from anbar.order_items where id = (ln->>'item_id')::bigint and order_id = p_order for update;
    if it.id is null then raise exception 'Mal bu sifarişdə yoxdur: %', ln->>'item_id'; end if;
    if it.status <> 'planlandi' then
      raise exception '% artıq qəbuldadır və ya gözlənilmir', (select name from anbar.products where id = it.product_id);
    end if;
    if (ln->>'qty') is null or (ln->>'qty')::numeric < 0 then raise exception 'Miqdar düzgün deyil'; end if;
    insert into anbar.delivery_lines (delivery_id, item_id, qty_arrived, qc_status)
    values (v_del, it.id, (ln->>'qty')::numeric, case when w.requires_qc then 'gozleyir' else 'lazim_deyil' end);
    update anbar.order_items set status = case when w.requires_qc then 'keyfiyyetde' else 'geldi' end where id = it.id;
    n := n + 1;
  end loop;
  if w.requires_qc then
    insert into anbar.tasks (kind, order_id, delivery_id, dept_code, title, due_at)
    values ('keyfiyyet', p_order, v_del, 'keyfiyyet',
            '#'||p_order||' gəldi ('||n||' mal) — yoxlayın ('||w.name||')', now() + interval '2 hours');
  end if;
  perform anbar.refresh_order(p_order);
  return v_del;
end $$;

create or replace function anbar.qc_finish(p_delivery bigint)
returns int
language plpgsql security definer set search_path = '' as $$
declare me anbar.employees; d anbar.deliveries; n_block int;
begin
  me := anbar.assert_dept('keyfiyyet');
  select * into d from anbar.deliveries where id = p_delivery for update;
  if d.id is null or d.status <> 'acik' or not d.qc_required or d.qc_done_at is not null then raise exception 'Yoxlanacaq qəbul tapılmadı'; end if;
  if exists (select 1 from anbar.delivery_lines where delivery_id = p_delivery and qc_status = 'gozleyir' and qty_arrived > 0) then
    raise exception 'Gələn bütün mallara baxın (✓ və ya ✗)';
  end if;
  update anbar.delivery_lines set qc_status = 'lazim_deyil' where delivery_id = p_delivery and qc_status = 'gozleyir';
  update anbar.deliveries set qc_done_at = now(), qc_done_by = me.id where id = p_delivery;
  update anbar.tasks set status = 'bitdi', done_at = now(), done_by = me.id
   where kind = 'keyfiyyet' and status = 'acik'
     and (delivery_id = p_delivery or (delivery_id is null and order_id = d.order_id));
  select count(*) into n_block from anbar.delivery_lines where delivery_id = p_delivery and qc_status = 'bloklandi';
  return n_block;
end $$;

create or replace function anbar.tg_notify_problem() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  -- Keyfiyyət bloku və Texnoloq rəddi üçün ayrıca bildiriş artıq gedir — təkrarlanmasın
  if new.status = 'problem' and old.status is distinct from 'problem'
     and coalesce(new.problem_note,'') not like 'Keyfiyyət blokladı%' and coalesce(new.problem_note,'') not like 'Texnoloq qəbul etmədi%' then
    perform anbar.notify(array['rehberlik'], null, 'problem', 'warn',
                         '⚠ '||anbar.item_label(new.id)||': '||coalesce(new.problem_note,'problem'),
                         new.order_id, new.id, null, 'problem:'||new.id||':'||now()::text);
  end if;
  -- yeni tarix və ya səbəb yazıldı → açıq "gecikmə səbəbi" tapşırığı bağlanır
  if (new.promised_date is distinct from old.promised_date or new.delay_reason is distinct from old.delay_reason
      or new.status in ('geldi','keyfiyyetde','bagli','legv'))
     and exists (select 1 from anbar.tasks where item_id = new.id and kind = 'gecikme_sebebi' and status = 'acik') then
    update anbar.tasks set status = 'bitdi', done_at = now(), done_by = auth.uid()
     where item_id = new.id and kind = 'gecikme_sebebi' and status = 'acik';
  end if;
  return null;
end $$;

revoke execute on function anbar.my_profile() from public, anon;
grant execute on function anbar.my_profile(), anbar.can_see_wh(text), anbar.mark_arrived(bigint,jsonb,text), anbar.qc_finish(bigint) to authenticated;

commit;
