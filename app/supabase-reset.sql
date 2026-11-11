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

-- Qoruma: sıfırlanmadan əvvəl yaranmış sifariş/bildiriş/qeyd köhnə açıq cihazdan bir daha yazılmasın.
-- (almond.put_many yenilənir — "stale" cavabı alan proqram həmin köhnə yazını öz ekranından da silir)
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
