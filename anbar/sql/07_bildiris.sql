-- =====================================================================
-- 07 · BİLDİRİŞLƏR VƏ GECİKMƏLƏR (06_texnoloq.sql-dən sonra)
--
--   * Hər işçinin öz bildiriş siyahısı (anbar.notifications) — proqram Realtime ilə dərhal görür
--   * Avtomatik bildirişlər:
--       - yeni tapşırıq → məsul işçiyə (yoxdursa şöbənin hamısına)
--       - Keyfiyyət blokladı → Satınalma + həmin anbar + Rəhbərlik (dərhal)
--       - Texnoloq qəbul etmədi → Satınalma + Anbar + Rəhbərlik
--       - mal "problem" oldu (az gəldi / gəlmədi) → Rəhbərlik
--   * Gecikmə yoxlaması (anbar.check_overdue, hər 15 dəqiqədən bir pg_cron ilə):
--       - vəd edilən gün keçib, mal gəlməyib → Satınalmaya "gecikmə səbəbi" tapşırığı + Rəhbərliyə
--       - sifarişin son günü keçib, bağlanmayıb → Rəhbərliyə
--       - tapşırığın vaxtı keçib → məsula və Rəhbərliyə
--     Eyni hadisə üçün bildiriş bir dəfə göndərilir (təkrarlanmır).
--   * anbar.v_problemler — Rəhbərlik üçün bütün açıq gecikmə və problemlər (canlı siyahı)
--   * Web Push üçün abunə cədvəli (göndərmə 7-ci mərhələdə Edge Function ilə)
-- =====================================================================
begin;

create table if not exists anbar.notifications (
  id          bigint generated always as identity primary key,
  employee_id uuid not null references anbar.employees(id),
  kind        text not null,                    -- tapsiriq, blok, texnoloq_redd, problem, gecikme, son_gun, vaxt_kecdi
  severity    text not null default 'info' check (severity in ('info','warn','danger')),
  title       text not null,
  order_id    bigint references anbar.orders(id),
  item_id     bigint references anbar.order_items(id),
  task_id     bigint references anbar.tasks(id),
  dedupe_key  text,                             -- eyni xəbər bir işçiyə bir dəfə
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);
create index if not exists notif_unread_idx on anbar.notifications (employee_id, created_at desc) where read_at is null;
create unique index if not exists notif_dedupe on anbar.notifications (employee_id, dedupe_key) where dedupe_key is not null;

create table if not exists anbar.push_subscriptions (
  id          bigint generated always as identity primary key,
  employee_id uuid not null references anbar.employees(id),
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Daxili: bildiriş göndər (şöbələrə və/və ya bir işçiyə). Qaytarır: neçə nəfərə.
-- ---------------------------------------------------------------------
create or replace function anbar.notify(p_depts text[], p_employee uuid, p_kind text, p_severity text, p_title text,
                                        p_order bigint default null, p_item bigint default null,
                                        p_task bigint default null, p_dedupe text default null)
returns int
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  insert into anbar.notifications (employee_id, kind, severity, title, order_id, item_id, task_id, dedupe_key)
  select e.id, p_kind, p_severity, p_title, p_order, p_item, p_task, p_dedupe
    from anbar.employees e
   where e.active and (e.id = p_employee or e.dept_code = any(coalesce(p_depts, '{}')))
  on conflict (employee_id, dedupe_key) where dedupe_key is not null do nothing;
  get diagnostics n = row_count;
  return n;
end $$;

-- Malın adı və anbarın şöbəsi (bildiriş mətnləri üçün)
create or replace function anbar.item_label(p_item bigint) returns text
language sql stable security definer set search_path = '' as $$
  select '#'||i.order_id||' · '||p.name||' ('||w.name||')'
    from anbar.order_items i join anbar.products p on p.id = i.product_id
    join anbar.orders o on o.id = i.order_id join anbar.warehouses w on w.code = o.warehouse_code
   where i.id = p_item
$$;
create or replace function anbar.order_dept(p_order bigint) returns text
language sql stable security definer set search_path = '' as $$
  select w.dept_code from anbar.orders o join anbar.warehouses w on w.code = o.warehouse_code where o.id = p_order
$$;

-- ---------------------------------------------------------------------
-- Avtomatik bildirişlər (triggerlər)
-- ---------------------------------------------------------------------
create or replace function anbar.tg_notify_task() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform anbar.notify(case when new.assignee_id is null then array[new.dept_code] end, new.assignee_id,
                       'tapsiriq', 'info', new.title, new.order_id, new.item_id, new.id, 'tapsiriq:'||new.id);
  return null;
end $$;
drop trigger if exists notify_task on anbar.tasks;
create trigger notify_task after insert on anbar.tasks for each row execute function anbar.tg_notify_task();

create or replace function anbar.tg_notify_qc_block() returns trigger
language plpgsql security definer set search_path = '' as $$
declare oid bigint;
begin
  if new.qc_status = 'bloklandi' and old.qc_status is distinct from 'bloklandi' then
    select order_id into oid from anbar.order_items where id = new.item_id;
    perform anbar.notify(array['satinalma', anbar.order_dept(oid), 'rehberlik'], null, 'blok', 'danger',
                         '⛔ Keyfiyyət blokladı: '||anbar.item_label(new.item_id)||' — '||coalesce(new.qc_note,''),
                         oid, new.item_id, null, 'blok:'||new.id);
  end if;
  return null;
end $$;
drop trigger if exists notify_qc_block on anbar.delivery_lines;
create trigger notify_qc_block after update of qc_status on anbar.delivery_lines
  for each row execute function anbar.tg_notify_qc_block();

create or replace function anbar.tg_notify_tech() returns trigger
language plpgsql security definer set search_path = '' as $$
declare oid bigint;
begin
  if new.result = 'redd' and old.result is distinct from 'redd' then
    select order_id into oid from anbar.order_items where id = new.item_id;
    perform anbar.notify(array['satinalma', anbar.order_dept(oid), 'rehberlik'], null, 'texnoloq_redd', 'danger',
                         '✗ Texnoloq qəbul etmədi: '||anbar.item_label(new.item_id)||' — '||coalesce(new.result_note,''),
                         oid, new.item_id, null, 'texredd:'||new.id||':'||coalesce(new.decided_at::text,''));
  elsif new.result = 'tesdiq' and old.result is distinct from 'tesdiq' then
    select order_id into oid from anbar.order_items where id = new.item_id;
    perform anbar.notify(array['satinalma', anbar.order_dept(oid)], null, 'texnoloq_tesdiq', 'info',
                         '✓ Texnoloq qəbul etdi: '||anbar.item_label(new.item_id), oid, new.item_id, null, 'textesdiq:'||new.id);
  end if;
  return null;
end $$;
drop trigger if exists notify_tech on anbar.tech_reviews;
create trigger notify_tech after update of result on anbar.tech_reviews
  for each row execute function anbar.tg_notify_tech();

create or replace function anbar.tg_notify_problem() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'problem' and old.status is distinct from 'problem' then
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
drop trigger if exists notify_problem on anbar.order_items;
create trigger notify_problem after update on anbar.order_items
  for each row execute function anbar.tg_notify_problem();

-- ---------------------------------------------------------------------
-- Satınalma: gecikmənin səbəbi (tarix dəyişmədən). Yeni tarix üçün replan_item.
-- ---------------------------------------------------------------------
create or replace function anbar.set_delay_reason(p_item bigint, p_reason text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform anbar.assert_dept('satinalma');
  if p_reason is null or length(btrim(p_reason)) < 3 then raise exception 'Səbəbi yazın'; end if;
  update anbar.order_items set delay_reason = btrim(p_reason) where id = p_item and status not in ('bagli','legv');
  if not found then raise exception 'Açıq mal tapılmadı'; end if;
end $$;

-- ---------------------------------------------------------------------
-- Gecikmə yoxlaması — pg_cron hər 15 dəqiqədən bir çağırır (əl ilə də olar)
-- ---------------------------------------------------------------------
create or replace function anbar.check_overdue()
returns int
language plpgsql security definer set search_path = '' as $$
declare r record; n int := 0; today date := anbar.today_baku();
begin
  for r in select i.*, anbar.item_label(i.id) lbl from anbar.order_items i
            where i.status = 'planlandi' and i.promised_date < today loop
    if not exists (select 1 from anbar.tasks where item_id = r.id and kind = 'gecikme_sebebi' and status = 'acik') then
      insert into anbar.tasks (kind, order_id, item_id, dept_code, assignee_id, title, due_at)
      values ('gecikme_sebebi', r.order_id, r.id, 'satinalma', r.purchaser_id,
              r.lbl||' — '||to_char(r.promised_date,'DD.MM')||' gəlməli idi. Səbəb və yeni tarix yazın',
              now() + interval '2 hours');
    end if;
    n := n + anbar.notify(array['rehberlik'], null, 'gecikme', 'danger',
                          '⏰ Gecikir: '||r.lbl||' — '||to_char(r.promised_date,'DD.MM')||' gəlməli idi'
                          ||coalesce(' · səbəb: '||r.delay_reason,''),
                          r.order_id, r.id, null, 'gecikme:'||r.id||':'||r.promised_date);
  end loop;

  for r in select o.*, w.name wname, w.dept_code wdept from anbar.orders o join anbar.warehouses w on w.code = o.warehouse_code
            where o.status not in ('bagli','legv') and o.need_by < today loop
    n := n + anbar.notify(array['rehberlik', r.wdept], null, 'son_gun', 'warn',
                          '📅 #'||r.id||' ('||r.wname||') sifarişi '||to_char(r.need_by,'DD.MM')||' tamamlanmalı idi',
                          r.id, null, null, 'songun:'||r.id||':'||r.need_by);
  end loop;

  for r in select * from anbar.tasks where status = 'acik' and due_at < now() loop
    n := n + anbar.notify(case when r.assignee_id is null then array[r.dept_code, 'rehberlik'] else array['rehberlik'] end,
                          r.assignee_id, 'vaxt_kecdi', 'warn', '⌛ Vaxtı keçib: '||r.title,
                          r.order_id, r.item_id, r.id, 'vaxt:'||r.id||':'||r.due_at);
  end loop;
  return n;
end $$;

-- ---------------------------------------------------------------------
-- İşçi: bildirişləri oxundu etmək, push abunəsi
-- ---------------------------------------------------------------------
create or replace function anbar.mark_read(p_ids bigint[] default null)   -- null → hamısı
returns int
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if not anbar.is_active() then raise exception 'Giriş edin' using errcode = '42501'; end if;
  update anbar.notifications set read_at = now()
   where employee_id = auth.uid() and read_at is null and (p_ids is null or id = any(p_ids));
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function anbar.save_push(p_endpoint text, p_p256dh text, p_auth text, p_ua text default null)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not anbar.is_active() then raise exception 'Giriş edin' using errcode = '42501'; end if;
  insert into anbar.push_subscriptions (employee_id, endpoint, p256dh, auth, user_agent)
  values (auth.uid(), p_endpoint, p_p256dh, p_auth, p_ua)
  on conflict (endpoint) do update set employee_id = excluded.employee_id, p256dh = excluded.p256dh, auth = excluded.auth;
end $$;
create or replace function anbar.remove_push(p_endpoint text)
returns void
language sql security definer set search_path = '' as $$
  delete from anbar.push_subscriptions where endpoint = p_endpoint and employee_id = auth.uid()
$$;

-- ---------------------------------------------------------------------
-- Rəhbərlik: canlı problem siyahısı (RLS işləyir — hər kəs öz görə bildiyini görür)
-- ---------------------------------------------------------------------
create or replace view anbar.v_problemler with (security_invoker = true) as
select i.id item_id, i.order_id, o.warehouse_code, p.name product, i.qty_remaining, i.unit,
       s.name supplier, e.full_name purchaser, i.promised_date, i.status,
       case when i.status = 'problem' then 'problem'
            when i.status = 'texnoloqda' then 'texnoloq'
            when i.status = 'planlandi' and i.promised_date < anbar.today_baku() then 'gecikir'
            when i.status = 'yeni' and o.need_by <= anbar.today_baku() then 'planlanmayib' end as nov,
       greatest(anbar.today_baku() - coalesce(i.promised_date, o.need_by), 0) as gecikme_gun,
       coalesce(i.problem_note, i.delay_reason) as sebeb
  from anbar.order_items i
  join anbar.orders o on o.id = i.order_id
  join anbar.products p on p.id = i.product_id
  left join anbar.suppliers s on s.id = i.supplier_id
  left join anbar.employees e on e.id = i.purchaser_id
 where i.status = 'problem' or i.status = 'texnoloqda'
    or (i.status = 'planlandi' and i.promised_date < anbar.today_baku())
    or (i.status = 'yeni' and o.need_by <= anbar.today_baku());

-- ---------------------------------------------------------------------
-- RLS və icazələr
-- ---------------------------------------------------------------------
alter table anbar.notifications      enable row level security;
alter table anbar.push_subscriptions enable row level security;
drop policy if exists oxu on anbar.notifications;
create policy oxu on anbar.notifications for select to authenticated using (employee_id = auth.uid() and anbar.is_active());
drop policy if exists oxu on anbar.push_subscriptions;
create policy oxu on anbar.push_subscriptions for select to authenticated using (employee_id = auth.uid());
revoke all on anbar.notifications, anbar.push_subscriptions, anbar.v_problemler from public, anon, authenticated;
grant select on anbar.notifications, anbar.v_problemler to authenticated;
grant select (id, endpoint, created_at) on anbar.push_subscriptions to authenticated;
grant all on anbar.notifications, anbar.push_subscriptions to service_role;
grant select on anbar.v_problemler to service_role;

revoke execute on all functions in schema anbar from public, anon;
revoke execute on function anbar.notify(text[],uuid,text,text,text,bigint,bigint,bigint,text),
                           anbar.check_overdue(), anbar.item_label(bigint), anbar.order_dept(bigint)
  from authenticated;
grant execute on function anbar.mark_read(bigint[]), anbar.save_push(text,text,text,text), anbar.remove_push(text),
                          anbar.set_delay_reason(bigint,text)
  to authenticated;
-- view daxilində çağırılır
grant execute on function anbar.today_baku() to authenticated;

commit;

-- ---------------------------------------------------------------------
-- Realtime: bildirişlər proqrama dərhal gəlsin (Supabase-də "supabase_realtime" var)
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime'
                     and schemaname = 'anbar' and tablename = 'notifications') then
    execute 'alter publication supabase_realtime add table anbar.notifications';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- pg_cron: hər 15 dəqiqədən bir gecikmə yoxlaması
-- Əgər burada xəta çıxsa: Database → Extensions → pg_cron → Enable, sonra bu bloku yenidən işlədin.
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.unschedule(jobid) from cron.job where jobname = 'anbar-gecikme';
    perform cron.schedule('anbar-gecikme', '*/15 * * * *', 'select anbar.check_overdue()');
    raise notice 'pg_cron: anbar-gecikme hər 15 dəqiqədən bir işləyəcək';
  else
    raise notice 'pg_cron yoxdur — Database → Extensions → pg_cron aktiv edin və bu bloku yenidən işlədin';
  end if;
end $$;
