# Almond Anbar — notes for Claude

Technical handoff for any future session working on `app/`. The owner's own handbook is a Claude Doc ("Almond Anbar — İdarəetmə kitabçası"); keep both consistent when behaviour changes.

## What it is
- Single-file vanilla-JS PWA: `app/index.html` (~3.2k lines; HTML+CSS+JS). Service worker `app/sw.js`.
- Live: https://rokinyo123.github.io/Sual-Z-ngiri/app/ (GitHub Pages from `main`).
- Data: Supabase project `qzvyawuhmqdhzawfihzy`, schema **`almond`** only. The `public` schema belongs to the separate "Sual Zənciri" app (root `index.html`, `sw.js`) — never touch either.
- Telegram bot @Almond_anbar_bot = Supabase Edge Function `telegram`, source `app/telegram-function.ts`.

## Deploy flow
1. `git pull origin main` first — another session also commits to `main` (design, `chainRings`, esgarow kit).
2. Edit, then **bump `CACHE` in `app/sw.js`** (`almond-anbar-vNN`) and the version in the footer, or phones keep the old build.
3. Commit on the session branch → push → PR → merge to `main`. Pages deploys in ~1 min.
4. Telegram function and SQL are **not** deployed by git. The owner does it by hand:
   - Function: Supabase → Edge Functions → telegram → Code → replace all with `telegram-function.ts` → Deploy updates. "Verify JWT" must stay off.
   - SQL: owner pastes the file into SQL Editor → Run.
5. Test with Playwright before merging (Chromium is preinstalled; mock the Supabase REST with `TEST_API` or route interception). The login splash needs a "Toxunun" tap and a short delay.

## Data model
- Everything is in `almond.records(kind, id, version, data jsonb, updated_at)`; history in `almond.history`.
- Kinds: `order`, `alert`, `log`, `product`, `meta` (`meta/reset`, `meta/reports`, …).
- Writes go through RPC `put_many` with optimistic versioning. After a reset, `put_many` rejects version-0 inserts of order/alert/log created >5 min before `meta/reset.at` (stale devices re-pushing). Client also drops stale local orders.
- `reset_data()` (security definer, admin only) — in `supabase-reset.sql`. Wipes order/alert/log/meta reports, history, `tg_sent`; keeps catalog and accounts.
- Telegram tables: `tg_chats(chat_id, dept)`, `tg_sent(id)` for dedup (`supabase-telegram.sql`).
- Files: storage bucket `almond-fayllar`.
- Accounts: Supabase Auth users `<name>@almond.local` + `almond.add_member(email, dept, admin)`.

## Domain rules (owner's decisions — do not change without asking)
- Departments: Anbar, Anbar (İnqilab), Texnoloq, Satınalma, Keyfiyyət, Rəhbərlik, Admin. Production departments per item are optional (incl. "Quru").
- Order statuses: `acik` (at Satınalma) → `yolda` → `anbar` (arrived) → `bagli` (closed) / `redd`.
- `hasQC = wh==="Anbar" && !sample && !techOrder`: Keyfiyyət checks only Anbar's own orders; samples (nümunə) and Texnoloq orders skip it.
- Unannounced sample (xəbərsiz nümunə) is held until Satınalma registers it; otherwise a problem for Rəhbərlik.
- Warehouse reports (Anbar + İnqilab home): `hold.t` = `sample` | `noinv` (mal gəldi, qaiməsi gəlməyib) | `noorder` (xəbərsiz mal). The last two are orders with `rep`, no items; Satınalma answers with text (`holdAnswer`) → `bagli`. Open ones are listed in Problemlər, in the 09:30 morning message and in the 16:00 message to Satınalma until answered.
- Satınalma must answer within 12h or the item shows in Problemlər. Late but accepted deliveries are **not** problems — they go to reports.
- Bulk order: fully arrived items close; problem items split into a child order (`splitProblems`).
- Delete: Admin always (`adminView()`); the sender (Anbar/İnqilab/Texnoloq) only on the same day, before goods arrive (`canOwnEdit`). Edit by the owner resets `yolda`→`acik` and notifies Satınalma.
- Each department sees only its own tabs (`tabsFor`).
- Keyfiyyət keeps all checked orders (30 days + "Hamısını göstər"); expiry warning 7 days ahead. Inspectors: Məcidli Məsumə, Məmmədzadə Aysun.
- Satış tasks (📝 Tapşırıqlar + 📅 Təqvim, separate from Anbar's calendar): Satış (manager, login `satis`) creates tasks, picks assignee (Üzeyir / Elçin / both) and deadline date+time (`due` = `YYYY-MM-DDTHH:MM`). Üzeyir and Elçin have their own logins (`uzeyir`, `elcin`, depts `Üzeyir` / `Elçin`): they see only their own tasks and calendar, mark "Yerinə yetirildi" or "Yerinə yetirilmədi" with a mandatory reason (reason also mandatory after the deadline). Each task = `meta` record `task-<id>` {title,to[],due,by,at,done{st ok|no,by,at,why,late},overAt,deleted}. New task notifies the assignee(s); result notifies Satış; overdue notifies ONLY Satış + Rəhbərlik once (fixed alert id `tk-over-<id>`). Rəhbərlik read-only.
- Requester depts `REQ` = Satış, Üzeyir, Elçin, İstehsalat, Çeşidləmə: own logins (`satis`, `uzeyir`, `elcin`, `istehsalat`, `cesidleme`), order like Texnoloq but pick receiving warehouse (`draft.wh`); they see only their own orders; Anbar/İnqilab/Satınalma see them as normal orders; receipt notifies the requester. Satış tasks are visible only to Satış and Rəhbərlik.
- Daily expense report (💰 Hesabat, İstehsalat + Çeşidləmə only, each sees only its own): `meta` records `exp-<id>` {dept,date,what,amt,photo,at,deleted}; grouped by day with day/month totals.
- Excel import: blank row = new order; reads "qalıq" column. Firma–mal Excel: coloured (yellow) cell = firm header, or `Mal | Firma` columns.
- `SINAQ = true` (test mode, session kept in localStorage `almond-sess`). Owner will ask to turn it off and set passwords.

## Look (owner's choice, Nov 2026)
Navy design: splash `#spl` (inline in `<body>`, auto-hides after 2.3s), login `nlLogin()`, loading overlay `nlLoading()` / `ldrHtml()`, navy rounded header, floating bottom tab bar. Default theme is light; 🌙 toggles dark navy. The old lamp/moth login and intro were removed at the owner's request — do not bring them back.

## Key code anchors (app/index.html)
`Cloud` module (`URL0`, `AKEY`, `SINAQ`) ~l.648 · `hasQC` · `problem()` · `splitProblems()` · `notify()` → `Cloud.tg()` · `tabsFor()` · `chainRings()` (ring chain UI).

## Telegram function
- Secrets: `TELEGRAM_TOKEN`, `TG_KOD` (+ Supabase defaults). `APP` constant = site URL for deep links (`#o=ID`).
- `?setup=1` sets the webhook (secret = sha256(token) prefix).
- Commands: `/qosul KOD Şöbə`, `/bugun`, `/geciken`, `/problemler`, `/sobeler`, `/sifaris`, `/hesabat`.
- pg_cron (UTC): `almond-seher 30 5` (09:30 Baku), `almond-gunorta 0 12` (16:00), `almond-axsam 0 14` (18:00, problems only, "from → wh"), `almond-hesabat 5 16` (weekly/monthly Excel to Rəhbərlik).

## Hard rules
- Never put passwords, tokens or the service_role key in the repo, docs or chat; never ask the owner to paste them.
- Never replace the Supabase DB or touch `public`. New SQL must be additive and idempotent.
- No model identifiers in commits/PRs.
- Owner declined (don't re-offer unprompted): photo/scorpion chain login, ordering via Telegram, server-side mayak + phone calls, `/rol` buttons.
