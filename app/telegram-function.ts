// Almond Anbar → Telegram bildirişləri (Supabase Edge Function, adı: telegram)
// Lazımdır: Edge Functions → Secrets → TELEGRAM_TOKEN (BotFather-in verdiyi token).
// SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY Supabase tərəfindən özü verilir.
// "Verify JWT" söndürülməlidir (Telegram tokensiz çağırır; yoxlamanı funksiya özü edir).
//
// 1) ...functions/v1/telegram?setup=1  → Telegram webhook-u bu funksiyaya bağlanır
// 2) Telegram-da botla söhbətdə və ya qrupda:  /qosul Satınalma   (/qosul hamısı — bütün bildirişlər)
//    /siyahi — bu söhbət nələri alır,  /ayril — dayandır
// 3) Proqram hər yeni bildirişi bura göndərir → həmin şöbəyə bağlı söhbətlərə mesaj gedir
// 4) Sual əmrləri: /bugun /geciken /problemler /sobeler /sifaris 105
// 6) Günorta xatırlatması: ...functions/v1/telegram?midday=1 (pg_cron 16:00 Bakı) — bu gün gəlməli, hələ gəlməyən firmalar → Satınalma
// 7) Axşam yekunu: ...functions/v1/telegram?evening=1 (pg_cron 18:00 Bakı) — bu gün nə gəldi, nə gəlmədi, nə qəbul olunmadı
// 5) Səhər xülasəsi: ...functions/v1/telegram?morning=1 (pg_cron hər gün 09:30 Bakı vaxtı çağırır; gündə bir dəfə göndərir)

const TOKEN = Deno.env.get("TELEGRAM_TOKEN") ?? "";
const SB = Deno.env.get("SUPABASE_URL") ?? "";
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// Qoşulma kodu (Edge Functions → Secrets → TG_KOD). Yalnız bu kodu bilən söhbət /qosul edə bilər;
// qoşulmamış söhbət sual əmrlərinə (/bugun, /sifaris ...) cavab almır.
const KOD = (Deno.env.get("TG_KOD") ?? "").trim();
const APP = "https://rokinyo123.github.io/Sual-Z-ngiri/app/";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
const DEPTS: Record<string, string> = {
  satinalma: "Satınalma", keyfiyyet: "Keyfiyyət", anbar: "Anbar", inqilab: "Anbar (İnqilab)",
  "anbar(inqilab)": "Anbar (İnqilab)", anbarinqilab: "Anbar (İnqilab)", texnoloq: "Texnoloq",
  rehberlik: "Rəhbərlik", admin: "Admin", hamisi: "*", hamsi: "*", all: "*", "*": "*",
};
const ICON: Record<string, string> = { late: "⚠️", ok: "✅", arr: "📦", res: "📋", note: "📌" };

const fold = (s: string) => s.toLowerCase().replace(/ə/g, "e").replace(/ı/g, "i").replace(/i̇/g, "i").replace(/ş/g, "s")
  .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u").replace(/\s+/g, "");
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, "content-type": "application/json" } });

async function secret() {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(TOKEN));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 40);
}
const tg = (method: string, body: unknown) =>
  fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then((r) => r.json()).catch((e) => ({ ok: false, description: String(e) }));
const db = (path: string, init: RequestInit = {}) =>
  fetch(`${SB}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Accept-Profile": "almond", "Content-Profile": "almond", "content-type": "application/json", ...(init.headers ?? {}) },
  });
const say = (chat_id: number, text: string) => tg("sendMessage", { chat_id, text, parse_mode: "HTML", disable_web_page_preview: true });

// ---------- Proqramın məlumatları (oxumaq üçün) ----------
const H = 3600000, ANS_H = 12;
const bakuNow = () => new Date(Date.now() + 4 * H);
const today = () => bakuNow().toISOString().slice(0, 10);
const fmtD = (d: string) => d ? d.slice(8, 10) + "." + d.slice(5, 7) : "";
const days = (a: string, b: string) => Math.round((new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000);
const num = (v: unknown) => parseFloat(String(v ?? "").replace(",", ".")) || 0;
const hTxt = (h: number) => h < 1 ? Math.max(1, Math.round(h * 60)) + " dəq" : h < 48 ? Math.floor(h) + " saat" : Math.floor(h / 24) + " gün";
const link = (id?: number) => id ? `<a href="${APP}#o=${id}">#${id}</a>` : "";

async function load() {
  const out: any[] = [];
  for (let off = 0; ; off += 1000) {
    const r: any[] = await db(`records?kind=in.(order,product)&select=kind,data&limit=1000&offset=${off}`).then((x) => x.json()).catch(() => []);
    out.push(...r); if (r.length < 1000) break;
  }
  const P = new Map<number, string>();
  out.filter((r) => r.kind === "product").forEach((r) => P.set(Number(r.data.id), r.data.name));
  const orders = out.filter((r) => r.kind === "order").map((r) => r.data).filter((o) => o && !o.deleted && o.status !== "redd");
  return { orders, pname: (id: unknown) => P.get(Number(id)) ?? "?" };
}
const hasQC = (o: any) => o.wh === "Anbar" && !o.sample;
const held = (o: any) => !!(o.hold && !o.holdDone);
function problem(o: any, i: any) {
  if (i.unav) return "Satınalma: mal yoxdur";
  if (i.notFound) return "Sürücü tapmadı";
  if (i.qc === "bad") return "Keyfiyyət: " + (i.qcWhy || "uyğun deyil");
  if (i.techRes === "bad") return o.sample ? "" : "Texnoloq qəbul etmədi";
  if (!o.recvDone) return "";
  if (i.qc === "none" || !i.got) return "Gəlmədi";
  if ((i.got || 0) < num(i.qty)) return "Az gəldi";
  return "";
}
const canAnswer = (o: any, i: any) => !i.ans && !!problem(o, i) && (o.recvDone || (i.qc === "bad" && !!o.qcAt) || i.techRes === "bad" || !!i.unav || !!i.notFound);
const ansSince = (o: any, i: any) => (i.unav && i.unav.at) || (i.notFound && i.notFound.at) || (i.qc === "bad" ? o.qcAt : "") || (i.techRes === "bad" ? (i.techAt || o.last_move) : "") || o.recvAt || o.last_move || o.created;
const ansLeftH = (o: any, i: any) => ANS_H - (Date.now() - new Date(ansSince(o, i)).getTime()) / H;
const lateOpen = (o: any) => o.status === "yolda" && !!o.eta && o.eta < today();
const lateEntry = (o: any) => (o.lates || []).find((x: any) => x.eta === o.eta);
const techReady = (o: any, i: any) => i.tech && !i.techRes && i.qc !== "bad" && i.qc !== "none" && !i.unav && !i.notFound && o.recvDone && i.got > 0;
function stageTxt(o: any) {
  if (held(o)) return "⛔ Saxlanılır — Satınalma xəbərsiz nümunəni yazmayıb";
  if (o.status === "acik") return "Satınalmada (gəliş günü təyin olunmayıb)";
  if (o.status === "yolda") return lateOpen(o) ? `Gecikir · ${fmtD(o.eta)} gəlməli idi` : o.eta === today() ? "Bu gün gəlməlidir" : `Gözlənilir · ${fmtD(o.eta)}`;
  if (o.status === "anbar") return hasQC(o) && !o.qcAt ? "Gəldi · Keyfiyyət yoxlamayıb" : `Gəldi · ${o.wh} qəbulu bitirməyib`;
  if (o.items.some((i: any) => problem(o, i) && !i.ans)) return "Satınalmanın cavabı gözlənilir";
  if (o.items.some((i: any) => techReady(o, i))) return "Texnoloqda";
  return "Bağlanıb ✓";
}
function board(orders: any[]) {
  const acc = orders.filter((o) => o.status === "acik"), hl = orders.filter(held);
  const late = orders.filter((o) => lateOpen(o) && !(lateEntry(o) || {}).note);
  const un = orders.flatMap((o) => o.items.filter((i: any) => canAnswer(o, i)).map((i: any) => ({ o, i })));
  const unLate = un.filter((r) => ansLeftH(r.o, r.i) < 0).length;
  const qc = orders.filter((o) => o.status === "anbar" && hasQC(o) && !o.qcAt);
  const wh = (w: string) => orders.filter((o) => o.wh === w && o.status === "anbar" && (!hasQC(o) || o.qcAt)).length;
  const tp = orders.filter((o) => o.items.some((i: any) => techReady(o, i))).length;
  const L = (name: string, parts: string[]) => `${parts.length ? "🔸" : "✅"} <b>${name}</b>: ${parts.length ? parts.join(", ") : "işi yoxdur"}`;
  return [
    L("Satınalma", [hl.length ? `⛔ ${hl.length} xəbərsiz nümunəni yazmayıb` : "", acc.length ? `${acc.length} sifariş qəbul edilməyib` : "", late.length ? `${late.length} gecikməyə açıqlama yoxdur` : "", un.length ? `${un.length} mala cavab yoxdur` + (unLate ? ` (⚠ ${unLate}-i 12 saatı keçib)` : "") : ""].filter(Boolean)),
    L("Keyfiyyət", qc.length ? [`${qc.length} sifarişi yoxlamayıb`] : []),
    L("Anbar", wh("Anbar") ? [`${wh("Anbar")} sifarişin qəbulunu bitirməyib`] : []),
    L("İnqilab", wh("Anbar (İnqilab)") ? [`${wh("Anbar (İnqilab)")} sifarişin qəbulunu bitirməyib`] : []),
    L("Texnoloq", tp ? [`${tp} sifarişdə cavab verməyib`] : []),
  ].join("\n");
}
function cmdBugun(d: Awaited<ReturnType<typeof load>>) {
  const t = today(), list = d.orders.filter((o) => o.eta === t && o.status !== "acik");
  if (!list.length) return `🚚 <b>Bu gün (${fmtD(t)})</b> gəlməli sifariş yoxdur.`;
  return `🚚 <b>Bu gün (${fmtD(t)}) gələcəklər · ${list.length}</b>\n` + list.map((o) =>
    `${o.status === "yolda" ? "⏳" : "📦"} ${link(o.id)} <b>${esc(o.supplier || "Firmasız")}</b> → ${esc(o.wh)} · ${o.items.length} mal · <i>${esc(stageTxt(o))}</i>`).join("\n");
}
function cmdGeciken(d: Awaited<ReturnType<typeof load>>) {
  const list = d.orders.filter(lateOpen).sort((a, b) => a.eta.localeCompare(b.eta));
  if (!list.length) return "✅ Gecikən sifariş yoxdur.";
  return `⏰ <b>Gecikən sifarişlər · ${list.length}</b>\n` + list.map((o) => { const e = lateEntry(o) || {};
    return `${link(o.id)} <b>${esc(o.supplier || "Firmasız")}</b> → ${esc(o.wh)} · ${fmtD(o.eta)} gəlməli idi (${days(o.eta, today())} gün)\n   ${e.note ? "💬 " + esc(e.note) : "❗ Satınalma açıqlama verməyib"}`; }).join("\n");
}
function cmdProblemler(d: Awaited<ReturnType<typeof load>>) {
  const rs = d.orders.flatMap((o) => o.items.filter((i: any) => canAnswer(o, i) && ansLeftH(o, i) < 0).map((i: any) => ({ o, i })));
  const ls = d.orders.filter((o) => lateOpen(o) && !(lateEntry(o) || {}).note && (Date.now() - new Date(o.eta + "T23:59:00+04:00").getTime()) / H > ANS_H);
  const hl = d.orders.filter(held);
  if (!rs.length && !ls.length && !hl.length) return "✅ Problem yoxdur — Satınalma hamısına vaxtında cavab verib.";
  return `⚠️ <b>Problemlər · ${rs.length + ls.length + hl.length}</b>\n` +
    (hl.length ? hl.map((o) => `⛔ ${link(o.id)} xəbərsiz nümunə ${esc(o.wh)}da saxlanılır · ${hTxt((Date.now() - new Date(o.hold.at).getTime()) / H)} — Satınalma yazmayıb`).join("\n") + "\n" : "") +
    `<i>Satınalma 12 saat ərzində cavab verməyib</i>\n` +
    rs.map(({ o, i }) => `• ${esc(d.pname(i.pid))} ${esc(i.qty)} — ${esc(problem(o, i))} · ${link(o.id)} ${esc(o.supplier || "")} · ${hTxt(-ansLeftH(o, i))} gecikir`).join("\n") +
    (ls.length ? "\n" + ls.map((o) => `• ${link(o.id)} ${esc(o.supplier || "Firmasız")} ${fmtD(o.eta)} gəlmədi — açıqlama yoxdur`).join("\n") : "");
}
function cmdSifaris(d: Awaited<ReturnType<typeof load>>, arg: string) {
  const id = Number(arg.replace(/\D/g, ""));
  if (!id) return "Nömrəni yazın, məsələn: <code>/sifaris 105</code>";
  const o = d.orders.find((x) => Number(x.id) === id);
  if (!o) return `#${id} sifarişi tapılmadı.`;
  return `📄 <b>Sifariş ${link(o.id)}</b> · ${esc(o.from)} → ${esc(o.wh)}\n` +
    `Vəziyyət: <b>${esc(stageTxt(o))}</b>\n` + (o.eta ? `Gəliş: ${fmtD(o.eta)} · ${esc(o.supplier || "Firmasız")}\n` : "") +
    o.items.slice(0, 30).map((i: any) => { const pr = problem(o, i);
      return `• ${esc(d.pname(i.pid))} ${esc(i.qty)}` + (i.got != null && o.recvDone ? ` → gəldi ${esc(i.got)}` : "") + (pr ? ` — <b>${esc(pr)}</b>` : "") +
        (i.ans ? (i.ans.none ? " · Satınalma: tapılmır" : ` · Satınalma: ${fmtD(i.ans.date)} gələcək`) : ""); }).join("\n");
}
const cut = (t: string) => t.length > 3900 ? t.slice(0, 3900) + "\n…" : t;

const HELP = "Salam! Mən Almond Anbar botuyam.\n\n" +
  "Bu söhbətə hansı şöbənin bildirişləri gəlsin — yazın:\n" +
  "<code>/qosul Satınalma KOD</code>\n<code>/qosul Keyfiyyət KOD</code>\n<code>/qosul Anbar KOD</code>\n<code>/qosul İnqilab KOD</code>\n<code>/qosul Texnoloq KOD</code>\n<code>/qosul Rəhbərlik KOD</code>\n" +
  "<code>/qosul hamısı KOD</code> — bütün bildirişlər\n(KOD — qoşulma kodu, Admindən alın)\n\n" +
  "<code>/siyahi</code> — bu söhbət nələri alır\n<code>/ayril</code> — bildirişləri dayandır\n\n" +
  "Soruşmaq üçün:\n/bugun — bu gün nə gələcək\n/geciken — vaxtında gəlməyənlər\n/problemler — Satınalmanın cavabsız qoyduqları\n/sobeler — şöbələrdə nə iş gözləyir\n<code>/sifaris 105</code> — sifarişin vəziyyəti";

const joined = (chat: number) => db(`tg_chats?chat_id=eq.${chat}&select=dept&limit=1`).then((r) => r.json()).then((r) => Array.isArray(r) && r.length > 0).catch(() => false);

async function onTelegram(update: any) {
  const m = update.message ?? update.channel_post;
  const text: string = m?.text ?? "";
  if (!m || !text.startsWith("/")) return;
  const chat = m.chat.id as number;
  const [cmd0, ...rest] = text.trim().split(/\s+/);
  const cmd = cmd0.split("@")[0].toLowerCase();
  const arg = rest.join(" ");
  if (cmd === "/start" || cmd === "/help" || cmd === "/komek") return say(chat, HELP);
  if (cmd === "/qosul" || cmd === "/qoşul") {
    // kodlu mesajı söhbətdən silməyə çalışırıq (qrupda bot admin olmalıdır; alınmasa da olar)
    tg("deleteMessage", { chat_id: chat, message_id: m.message_id });
    if (!KOD) return say(chat, "⛔ Qoşulma kodu qurulmayıb. Admin Supabase-də <b>TG_KOD</b> əlavə etməlidir.");
    const parts = arg.split(/\s+/).filter(Boolean), code = parts.length > 1 ? parts.pop()! : "";
    if (code !== KOD) { await new Promise((r) => setTimeout(r, 1500)); return say(chat, "⛔ Kod səhvdir və ya yazılmayıb. Belə yazın: <code>/qosul Satınalma KOD</code>"); }
    const dept = DEPTS[fold(parts.join(" "))];
    if (!dept) return say(chat, "Şöbəni yazın, məsələn: <code>/qosul Satınalma KOD</code>");
    const r = await db("tg_chats", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ chat_id: chat, dept, title: m.chat.title ?? m.chat.first_name ?? "" }) });
    if (!r.ok) return say(chat, "Xəta: " + esc(await r.text()));
    return say(chat, `✅ Bu söhbət <b>${dept === "*" ? "bütün" : esc(dept)}</b> bildirişlərini alacaq.`);
  }
  if (cmd === "/ayril" || cmd === "/ayrıl") {
    const dept = DEPTS[fold(arg)];
    await db(`tg_chats?chat_id=eq.${chat}` + (dept ? `&dept=eq.${encodeURIComponent(dept)}` : ""), { method: "DELETE" });
    return say(chat, dept ? `Bu söhbət artıq ${esc(dept)} bildirişlərini almayacaq.` : "Bu söhbətə bildiriş göndərilməyəcək.");
  }
  if (["/bugun", "/bugün", "/geciken", "/gecikən", "/problemler", "/problemlər", "/sobeler", "/şöbələr", "/sifaris", "/sifariş"].includes(cmd)) {
    if (!(await joined(chat))) return say(chat, "⛔ Bu söhbət qoşulmayıb. Əvvəlcə: <code>/qosul Şöbə KOD</code> (kodu Admindən alın).");
    const d = await load();
    const f = fold(cmd);
    const t = f.startsWith("/bug") ? cmdBugun(d) : f.startsWith("/gec") ? cmdGeciken(d) : f.startsWith("/prob") ? cmdProblemler(d) : f.startsWith("/sob") ? `📋 <b>Şöbələr</b>\n` + board(d.orders) : cmdSifaris(d, arg);
    return say(chat, cut(t));
  }
  if (cmd === "/siyahi" || cmd === "/siyahı") {
    const rows = await db(`tg_chats?chat_id=eq.${chat}&select=dept`).then((r) => r.json()).catch(() => []);
    return say(chat, rows.length ? "Bu söhbət alır: " + rows.map((r: any) => (r.dept === "*" ? "hamısı" : r.dept)).join(", ") : "Bu söhbət heç bir şöbəyə qoşulmayıb.\n\n" + HELP);
  }
}

async function onAlert(req: Request, body: any) {
  // yalnız proqrama daxil olmuş istifadəçi göndərə bilər
  const auth = req.headers.get("authorization") ?? "";
  const u = await fetch(`${SB}/auth/v1/user`, { headers: { apikey: KEY, Authorization: auth } });
  if (!u.ok) return json({ ok: false, error: "auth" }, 401);
  const a = body.alert ?? {};
  if (!a.id || !a.title) return json({ ok: false, error: "bad" }, 400);
  // eyni bildiriş iki dəfə getməsin
  const s = await db("tg_sent", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ id: String(a.id) }) });
  if (s.status === 409) return json({ ok: true, dup: true });
  const to: string[] = Array.isArray(a.to) ? a.to : [];
  const rows: any[] = await db("tg_chats?select=chat_id,dept").then((r) => r.json()).catch(() => []);
  const chats = [...new Set(rows.filter((r) => r.dept === "*" || to.includes(r.dept)).map((r) => r.chat_id))];
  if (!chats.length) return json({ ok: true, sent: 0 });
  const items: string[] = Array.isArray(a.items) ? a.items.slice(0, 10) : [];
  const text = `${ICON[a.kind] ?? "🔔"} <b>${esc(a.title)}</b>` +
    (a.sub ? `\n${esc(a.sub)}` : "") +
    (items.length ? "\n" + items.map((x) => "• " + esc(x)).join("\n") : "") +
    (to.length ? `\n<i>Kimə: ${esc(to.join(", "))}</i>` : "") +
    `\n\n<a href="${APP}${a.oid ? "#o=" + a.oid : ""}">👉 Proqramda aç</a>`;
  let sent = 0;
  for (const c of chats) { const r = await say(c, text); if (r.ok) sent++; }
  return json({ ok: true, sent });
}

// Səhər xülasəsi: bütün qoşulmuş söhbətlərə, gündə bir dəfə (09:30 Bakı)
async function morning(force: boolean) {
  const t = today(), b = bakuNow();
  if (!force && b.getUTCHours() * 60 + b.getUTCMinutes() < 9 * 60 + 20) return json({ ok: true, skip: "tez" });
  const s = await db("tg_sent", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ id: (force ? "morning-test-" + Date.now() : "morning-" + t) }) });
  if (s.status === 409) return json({ ok: true, skip: "bu gün göndərilib" });
  const d = await load();
  const WD = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
  const text = cut(`☀️ <b>Sabahınız xeyir! ${fmtD(t)} · ${WD[b.getUTCDay()]}</b>\n\n` + cmdBugun(d) + "\n\n" + cmdGeciken(d) + "\n\n" + cmdProblemler(d) + "\n\n📋 <b>Şöbələr</b>\n" + board(d.orders) + `\n\n<a href="${APP}">👉 Proqramı aç</a>`);
  const rows: any[] = await db("tg_chats?select=chat_id").then((r) => r.json()).catch(() => []);
  let sent = 0;
  for (const c of [...new Set(rows.map((r) => r.chat_id))]) { const r = await say(c, text); if (r.ok) sent++; }
  return json({ ok: true, sent });
}

// 16:00 — bu gün gəlməli olan, amma hələ "Gəldi" basılmayan sifarişlər: Satınalma firmaya zəng etsin
async function midday(force: boolean) {
  const t = today(), b = bakuNow();
  if (!force && b.getUTCHours() * 60 + b.getUTCMinutes() < 15 * 60 + 50) return json({ ok: true, skip: "tez" });
  const d = await load();
  const list = d.orders.filter((o) => o.status === "yolda" && o.eta === t);
  if (!list.length) return json({ ok: true, sent: 0, skip: "hamısı gəlib" });
  const s = await db("tg_sent", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ id: (force ? "midday-test-" + Date.now() : "midday-" + t) }) });
  if (s.status === 409) return json({ ok: true, skip: "bu gün göndərilib" });
  const by = new Map<string, any[]>();
  list.forEach((o) => { const k = o.supplier || "Firmasız"; by.set(k, [...(by.get(k) ?? []), o]); });
  const text = cut(`⏰ <b>Saat 16:00 — bu gün gəlməli idi, hələ gəlməyib (${fmtD(t)})</b>\n<i>Satınalma: firmalara zəng edin, gecikirsə proqramda yeni tarix yazın</i>\n\n` +
    [...by.entries()].map(([f, os]) => `📞 <b>${esc(f)}</b> → ${[...new Set(os.map((o) => esc(o.wh)))].join(", ")} · ${os.reduce((a, o) => a + o.items.length, 0)} mal · ${os.map((o) => link(o.id)).join(" ")}\n   ` +
      ((ns) => esc(ns.slice(0, 6).join(", ")) + (ns.length > 6 ? "…" : ""))([...new Set(os.flatMap((o) => o.items.map((i: any) => d.pname(i.pid))))])).join("\n") +
    `\n\n<a href="${APP}">👉 Proqramı aç</a>`);
  const rows: any[] = await db("tg_chats?select=chat_id,dept").then((r) => r.json()).catch(() => []);
  let sent = 0;
  for (const c of [...new Set(rows.filter((r) => r.dept === "*" || r.dept === "Satınalma").map((r) => r.chat_id))]) { const r = await say(c, text); if (r.ok) sent++; }
  return json({ ok: true, sent });
}

// 18:00 — günün yekunu, bütün qoşulmuş söhbətlərə
const bakuDay = (iso?: string) => iso ? new Date(new Date(iso).getTime() + 4 * H).toISOString().slice(0, 10) : "";
async function evening(force: boolean) {
  const t = today(), b = bakuNow();
  if (!force && b.getUTCHours() * 60 + b.getUTCMinutes() < 17 * 60 + 50) return json({ ok: true, skip: "tez" });
  const s = await db("tg_sent", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ id: (force ? "evening-test-" + Date.now() : "evening-" + t) }) });
  if (s.status === 409) return json({ ok: true, skip: "bu gün göndərilib" });
  const d = await load();
  const got = d.orders.filter((o) => o.recvDone && bakuDay(o.recvAt) === t);
  const miss = d.orders.filter((o) => o.status === "yolda" && o.eta === t);
  const rej = d.orders.flatMap((o) => o.items.filter((i: any) => i.qc === "bad" && bakuDay(o.qcAt) === t).map((i: any) => ({ o, i })));
  const line = (o: any) => { const n = o.items.length, ok = o.items.filter((i: any) => !problem(o, i)).length;
    return `${link(o.id)} <b>${esc(o.supplier || "Firmasız")}</b> → ${esc(o.wh)} · ${ok === n ? `${n} mal tam ✓` : `${ok}/${n} mal tam, ${n - ok} problemli`}`; };
  const text = cut(`🌆 <b>Günün yekunu · ${fmtD(t)}</b>\n\n` +
    `✅ <b>Bu gün qəbul olunanlar · ${got.length}</b>\n` + (got.length ? got.map(line).join("\n") : "—") + "\n\n" +
    `⛔ <b>Bu gün gəlməli idi, gəlmədi · ${miss.length}</b>\n` + (miss.length ? miss.map((o) => `${link(o.id)} <b>${esc(o.supplier || "Firmasız")}</b> → ${esc(o.wh)} · ${o.items.length} mal`).join("\n") : "—") + "\n\n" +
    (rej.length ? `🔍 <b>Keyfiyyət bu gün qəbul etmədi · ${rej.length}</b>\n` + rej.map(({ o, i }) => `• ${esc(d.pname(i.pid))} — ${esc(i.qcWhy || "uyğun deyil")} · ${link(o.id)} ${esc(o.supplier || "")}`).join("\n") + "\n\n" : "") +
    cmdProblemler(d) + "\n\n📋 <b>Kim işini bitirməyib</b>\n" + board(d.orders) + `\n\n<a href="${APP}">👉 Proqramı aç</a>`);
  const rows: any[] = await db("tg_chats?select=chat_id").then((r) => r.json()).catch(() => []);
  let sent = 0;
  for (const c of [...new Set(rows.map((r) => r.chat_id))]) { const r = await say(c, text); if (r.ok) sent++; }
  return json({ ok: true, sent });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (!TOKEN) return json({ ok: false, error: "TELEGRAM_TOKEN yoxdur — Edge Functions → Secrets bölməsində əlavə edin" }, 500);
  const url = new URL(req.url);
  if (url.searchParams.has("morning")) return morning(url.searchParams.has("force"));
  if (url.searchParams.has("midday")) return midday(url.searchParams.has("force"));
  if (url.searchParams.has("evening")) return evening(url.searchParams.has("force"));
  if (req.method === "GET" && url.searchParams.has("setup")) {
    await tg("setMyCommands", { commands: [
      { command: "bugun", description: "Bu gün nə gələcək" }, { command: "geciken", description: "Vaxtında gəlməyənlər" },
      { command: "problemler", description: "Satınalmanın cavabsız qoyduqları" }, { command: "sobeler", description: "Şöbələrdə nə iş gözləyir" },
      { command: "sifaris", description: "Sifarişin vəziyyəti, məs. /sifaris 105" }, { command: "qosul", description: "Bu söhbəti şöbəyə qoş" },
      { command: "siyahi", description: "Bu söhbət nələri alır" }, { command: "ayril", description: "Bildirişləri dayandır" } ] });
    const self = `${SB}/functions/v1/telegram`;
    const r = await tg("setWebhook", { url: self, secret_token: await secret(), allowed_updates: ["message", "channel_post"] });
    const me = await tg("getMe", {});
    return new Response(r.ok ? `✅ Hazırdır. Bot: @${me?.result?.username ?? "?"}\nİndi Telegram-da bota /start yazın.` : `Xəta: ${r.description}`, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  if (req.method !== "POST") return new Response("Almond Anbar Telegram", { headers: CORS });
  const body = await req.json().catch(() => ({}));
  if (req.headers.get("x-telegram-bot-api-secret-token")) {
    if (req.headers.get("x-telegram-bot-api-secret-token") !== await secret()) return new Response("no", { status: 403 });
    await onTelegram(body).catch(() => {});
    return new Response("ok");
  }
  if (body.alert) return onAlert(req, body);
  return json({ ok: false }, 400);
});
