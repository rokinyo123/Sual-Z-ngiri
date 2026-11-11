-- Proqramı sıfırlamaq (kataloqdan başqa) — yalnız Admin. Bir dəfə SQL Editor-da işlədilir (funksiyanı yaradır).
-- Silinir: sifarişlər (silinənlər də), bildirişlər, tarixçə, hesabat qeydləri, Telegram-a göndərilənlərin qeydi.
-- Qalır: kataloq (mallar), firmalar, istifadəçilər və parollar, Telegram qrupları.
create or replace function almond.reset_data() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if not exists (select 1 from almond.members m where m.user_id = auth.uid() and m.active and m.is_admin) then
    raise exception 'Yalnız Admin sıfırlaya bilər';
  end if;
  delete from almond.records where kind in ('order','alert','log') or (kind = 'meta' and id = 'reports');
  get diagnostics n = row_count;
  delete from almond.history where kind in ('order','alert','log') or (kind = 'meta' and id = 'reports');
  if to_regclass('almond.tg_sent') is not null then execute 'delete from almond.tg_sent'; end if;
  -- açıq olan digər cihazlar bunu görüb özləri yenilənir
  insert into almond.records (kind, id, version, data, updated_by)
    values ('meta', 'reset', 1, jsonb_build_object('at', now()), auth.uid())
    on conflict (kind, id) do update set version = almond.records.version + 1, data = excluded.data, updated_at = clock_timestamp(), updated_by = auth.uid();
  return jsonb_build_object('deleted', n);
end $$;
revoke all on function almond.reset_data() from public, anon;
grant execute on function almond.reset_data() to authenticated;
