-- =====================================================================
-- 04 · SÜRÜCÜLƏR (03_sifaris.sql-dən sonra)
--
-- Sürücü sistemdə işçidir (şöbə: surucu) və təchizatçılar siyahısında
-- "surucu" növlü təchizatçıya bağlanır. Satınalma malı həmin sürücüyə
-- verəndə mal sürücünün "Bu gün alınacaqlar" siyahısına düşür.
-- Sürücü yalnız ona verilən malları görür və "Aldım" qeyd edir.
-- =====================================================================
begin;

insert into anbar.departments (code, name, sort) values ('surucu', 'Sürücü', 11)
on conflict (code) do nothing;

alter table anbar.order_items add column if not exists bought_qty  numeric(12,3) check (bought_qty is null or bought_qty >= 0);
alter table anbar.order_items add column if not exists bought_at   timestamptz;
alter table anbar.order_items add column if not exists bought_note text;

-- Bu mal giriş edən sürücüyə verilibmi
create or replace function anbar.is_my_driver_item(p_supplier bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from anbar.suppliers s join anbar.employees e on e.id = s.employee_id
                 where s.id = p_supplier and s.kind = 'surucu' and e.id = auth.uid() and e.active)
$$;

-- Sürücü yalnız öz mallarını və həmin sifarişin başlığını görür
drop policy if exists oxu on anbar.order_items;
create policy oxu on anbar.order_items for select to authenticated
  using (anbar.can_see_order(order_id) or anbar.is_my_driver_item(supplier_id));
drop policy if exists surucu on anbar.orders;
create policy surucu on anbar.orders for select to authenticated
  using (exists (select 1 from anbar.order_items i where i.order_id = orders.id and anbar.is_my_driver_item(i.supplier_id)));

-- Admin: sürücü işçini təchizatçıya bağlayır (yoxdursa, eyni adla yaradır)
create or replace function anbar.admin_link_driver(p_employee uuid, p_supplier bigint default null)
returns bigint
language plpgsql security definer set search_path = '' as $$
declare e anbar.employees; v bigint;
begin
  perform anbar.assert_admin();
  select * into e from anbar.employees where id = p_employee;
  if e.id is null then raise exception 'İşçi tapılmadı'; end if;
  if e.dept_code <> 'surucu' then raise exception 'İşçinin şöbəsi "surucu" olmalıdır'; end if;
  if p_supplier is null then
    select id into v from anbar.suppliers where lower(btrim(name)) = lower(btrim(e.full_name));
    if v is null then
      insert into anbar.suppliers (name, kind, phone, employee_id) values (e.full_name, 'surucu', e.phone, e.id) returning id into v;
      return v;
    end if;
  else v := p_supplier;
  end if;
  update anbar.suppliers set kind = 'surucu', employee_id = e.id where id = v;
  if not found then raise exception 'Təchizatçı tapılmadı'; end if;
  return v;
end $$;

-- Sürücü: "Aldım" (miqdar və qeyd). Sonra mal Anbara gəlir və orada qəbul olunur.
create or replace function anbar.driver_bought(p_item bigint, p_qty numeric, p_note text default null)
returns void
language plpgsql security definer set search_path = '' as $$
declare it anbar.order_items;
begin
  select * into it from anbar.order_items where id = p_item for update;
  if it.id is null or not anbar.is_my_driver_item(it.supplier_id) then
    raise exception 'Bu mal sizə verilməyib' using errcode = '42501';
  end if;
  if it.status <> 'planlandi' then raise exception 'Bu mal artıq Anbara çatıb və ya bağlanıb'; end if;
  if p_qty is null or p_qty < 0 then raise exception 'Alınan miqdarı yazın'; end if;
  if p_qty < it.qty_remaining and (p_note is null or length(btrim(p_note)) < 3) then
    raise exception 'Az alınıb — səbəbini yazın (məs. bazarda qurtarıb)';
  end if;
  update anbar.order_items set bought_qty = p_qty, bought_at = now(), bought_note = nullif(btrim(p_note),'') where id = p_item;
end $$;

revoke execute on function anbar.is_my_driver_item(bigint), anbar.admin_link_driver(uuid,bigint), anbar.driver_bought(bigint,numeric,text) from public, anon;
grant execute on function anbar.is_my_driver_item(bigint), anbar.admin_link_driver(uuid,bigint), anbar.driver_bought(bigint,numeric,text) to authenticated;

commit;

-- İstifadə (Admin, SQL Editor):
--   Authentication → Add user: elvin@almond.local
--   select anbar.admin_add_employee('elvin@almond.local','Elvin Məmmədov','elvin','surucu');
--   select anbar.admin_link_driver((select id from anbar.employees where username='elvin'));
