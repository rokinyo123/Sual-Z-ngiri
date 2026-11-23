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
- Warehouse requests (`REQ_W` = Satış, Üzeyir, Elçin): requester picks warehouse + needed date/time (`needAt`). Order gets `req:true`, status `istek` → warehouse presses "Qəbul et" (`reqAcc`, requester notified) → per item "Anbarda var" (`i.rq='give'`) or "Yoxdur" (`i.rq='buy'`) → items in stock are given; missing ones become a normal purchase order P (`from=wh`, `forReq`, `reqFrom`, `needAt`; Satınalma sees the deadline and the arrival date defaults/caps to it). When P is received (`finishReceive`), the request closes (`reqDone`) and the requester is notified. `problem()` ignores req orders; Satınalma only sees the request itself in Sifarişlər. İstehsalat/Çeşidləmə still use the direct purchase flow.
- Meetings and commitments (📋 İclaslar, Rəhbərlik creates; Admin can too): meeting header = `meta` `meet-<id>` {at,title,people[],extra,decision,by,created}; each commitment = `meta` `mt-<meetId>-<n>` {meet,to(dept/person),what,due(optional),at,done,overAt}. Commitments accumulate across meetings and can be added to an old meeting. The assignee sees them on home under "📋 Öhdəliklərim" and can mark done (no reason flow); Rəhbərlik sees by meeting or by person and can mark done. Deadline is only a reminder: `meetSignals()` notifies Rəhbərlik only (fixed id `mt-over-<id>`).
- Daily expense report (💰 Hesabat, İstehsalat + Çeşidləmə only, each sees only its own): `meta` records `exp-<id>` {dept,date,what,amt,photo,at,deleted}; grouped by day with day/month totals.
- Satınalma answer deadline: requester (Anbar/İnqilab/Texnoloq/İstehsalat/Çeşidləmə) may set `ansBy` (datetime); `ansDue(o)` = ansBy or created+24h, used by `overdue`, `leftTxt`, `waitOn`. Satınalma accept box always shows an arrival date per group (also before a firm is chosen) plus "Hamısı üçün eyni gün".
- Keyfiyyət time limit (v65, owner's request; ISO 9001 8.6 / ISO 22000 "conditional release"): `QC_MIN = 60` min from `arrivedAt`. At 30 min left → reminder to Keyfiyyət (`qc-half-ID`); at 0 → Keyfiyyət + warehouse + Rəhbərlik (`qc-late-ID`). Until then Anbar's "Bitir" is disabled with a countdown; after it Anbar may finish → `o.qcSkip {at,by,min}`, log + notify (`qc-skip-ID`). The order stays in Keyfiyyət's list (`qcPend`), in Problemlər ("şərti qəbul") and in the Telegram board until Keyfiyyət checks; a later check sets `qcAt` + `qcLateMin`, bad items → notify warehouse ("malı ayırın"), Satınalma, Rəhbərlik. Card note `qcSkipNote()`. Telegram function has the same `qcLate`/`qcSkipOpen` (owner must redeploy it).
- Keyfiyyət is two-step: "✓ Anbara OK ver" (`qcok`: unmarked items → ok, sets `qcAt` + `qcOpen`) so Anbar can proceed; details (temperature for any item, mfg/exp, inspector) are optional and saved later via "Sifarişi tamamla" (`qcfin` → `qcOpen=false`). Temperature and inspector are no longer required.
- Satınalma's own orders (➕ Sifariş tab, `vBuyNew` / `PT`): 🧪 sample (`buy` mode → existing sample flow), 🏢 office, 📦 cargo, 🔄 swap ("instead of X", reason required) → order `from:"Satınalma"`, `stype`, status `yolda`, firm + date + warehouse + item names required. Office/cargo skip QC. Goods arriving without such an entry → Anbar "📦 Xəbərsiz mal gəldi" → Satınalma + Rəhbərlik, counted in statistics (`st.unann`).
- 🛡 Aktlar (`qa`, meta `qa-<id>`): NCR (`kind:"ncr"`, Keyfiyyət opens: product, type from `QA_TYPES`, description, severity, photo; no prices) → Satınalma answers agree+action / disagree+comment (text required) → Keyfiyyət closes or reopens (comment required). Repeat = same product+type within 60 days → flagged, Rəhbərlik notified (also for severity high). Returns (`kind:"ret"`): Keyfiyyət (Anbar goods, also from the expiry list) or Anbar (İnqilab) (own goods) propose → Satınalma sets return date → Keyfiyyət decides for Anbar goods (İnqilab skips this) → warehouse presses "Qaytarıldı". `qaSignals()` reminds Satınalma daily (fixed ids) while unanswered >24h and when the return date passed. Stats: counts, repeat %, agree/disagree, avg response hours, returns.
- Catalog (📚 Kataloq, v66): Admin and Satınalma (`catEd()`) add firms, add products, assign product→firm (table select, per-firm add/"Firmadan çıxar"), Excel firm–mal import. Deleting firms/products, renaming, size/unit and photos stay Admin-only.
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
- Work hours 08:00–18:00 Baku (owner, v67): instant alerts (`onAlert`) outside them are NOT sent to Telegram (they stay in the app); the app's Keyfiyyət 1-hour warnings (`qcSignals`) are only created in work hours (`bakuWork`).
- pg_cron (UTC), SQL in `supabase-cron-saatlar.sql`: `almond-seher 0 4` (08:00, per-department "bu gün nə etməlisiniz" via `plan()`/`sendPlan()`; each chat gets its own department, `*`/Rəhbərlik/Admin get all), `almond-gunorta 0 12` (16:00 → Satınalma), `almond-hesabat 45 13` (17:45 Excel), `almond-ehtiyat 55 15` (19:55 backup), `almond-axsam 0 16` (20:00, per-department "nə edilmədi" + day summary for management; last message of the day).

## Backups (free plan has none)
- Bot sends a full JSON backup daily 23:30 Baku (`?backup=1`, cron `almond-ehtiyat`) ONLY to chats connected with `/qosul Ehtiyat KOD` (owner's private chat). File: `{app, made, records:[{kind,id,version,data,updated_at}], tg_chats:[...]}`.
- Restore (owner pastes the file's `records` array into SQL Editor as a literal, or upload to Storage and read it): `insert into almond.records (kind,id,version,data,updated_at) select kind,id,version,data,updated_at from jsonb_to_recordset('<records json>'::jsonb) as x(kind text,id text,version int,data jsonb,updated_at timestamptz) on conflict (kind,id) do update set version=excluded.version, data=excluded.data, updated_at=excluded.updated_at;` Restore `tg_chats` the same way. Do it with the owner step by step.

## Hard rules
- Never put passwords, tokens or the service_role key in the repo, docs or chat; never ask the owner to paste them.
- Never replace the Supabase DB or touch `public`. New SQL must be additive and idempotent.
- No model identifiers in commits/PRs.
- Owner declined (don't re-offer unprompted): photo/scorpion chain login, ordering via Telegram, server-side mayak + phone calls, `/rol` buttons.

## Sadə görünüş (v64)
- Yazılar böyüdü (body 15.5px), köməkçi mətnlər 13.5px.
- Sifariş kartı: `from===wh` olanda yalnız bir ad (`routeTxt`). Zəncirdə yalnız cari addımın adı görünür. Düzəlt/Bağla/Sil kartın altındadır (`ownBtns`).
- Sifarişlər filtrində sayı 0 olan şöbə düymələri gizlidir.
- Menyuda 5-dən çox bölmə varsa: 4 bölmə + "☰ Daha" (aşağıdan açılan `#tsheet`).
- Satınalma "Kim görsün" seçimi bağlı `<details class="more who">` içindədir (`whoOpen`).
