-- Yalnız Rəhbərlik şöbəsi sualları silə bilsin.
-- Supabase → SQL Editor-də bir dəfə işlədin.

alter table questions enable row level security;

drop policy if exists "rehberlik_sil" on questions;
create policy "rehberlik_sil" on questions
  for delete
  to authenticated
  using (my_dept() = 'Rəhbərlik');

-- Qeyd: questions üçün başqa DELETE qaydası olmamalıdır.
-- Yoxlamaq üçün:
-- select policyname, cmd from pg_policies where tablename = 'questions';
