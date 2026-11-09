// Almond Anbar → Telegram bildirişləri (Supabase Edge Function, adı: telegram)
// Lazımdır: Edge Functions → Secrets → TELEGRAM_TOKEN (BotFather-in verdiyi token).
// SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY Supabase tərəfindən özü verilir.
// "Verify JWT" söndürülməlidir (Telegram tokensiz çağırır; yoxlamanı funksiya özü edir).
//
// 1) ...functions/v1/telegram?setup=1  → Telegram webhook-u bu funksiyaya bağlanır
// 2) Telegram-da botla söhbətdə və ya qrupda:  /qosul Satınalma   (/qosul hamısı — bütün bildirişlər)
//    /siyahi — bu söhbət nələri alır,  /ayril — dayandır
// 3) Proqram hər yeni bildirişi bura göndərir → həmin şöbəyə bağlı söhbətlərə mesaj gedir

const TOKEN = Deno.env.get("TELEGRAM_TOKEN") ?? "";
const SB = Deno.env.get("SUPABASE_URL") ?? "";
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
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

const HELP = "Salam! Mən Almond Anbar botuyam.\n\n" +
  "Bu söhbətə hansı şöbənin bildirişləri gəlsin — yazın:\n" +
  "<code>/qosul Satınalma</code>\n<code>/qosul Keyfiyyət</code>\n<code>/qosul Anbar</code>\n<code>/qosul İnqilab</code>\n<code>/qosul Texnoloq</code>\n<code>/qosul Rəhbərlik</code>\n" +
  "<code>/qosul hamısı</code> — bütün bildirişlər (yoxlamaq üçün)\n\n" +
  "<code>/siyahi</code> — bu söhbət nələri alır\n<code>/ayril</code> — bildirişləri dayandır";

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
    const dept = DEPTS[fold(arg)];
    if (!dept) return say(chat, "Şöbəni yazın, məsələn: <code>/qosul Satınalma</code>\n\n" + HELP);
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
    `\n\n<a href="${APP}">👉 Proqramda aç</a>`;
  let sent = 0;
  for (const c of chats) { const r = await say(c, text); if (r.ok) sent++; }
  return json({ ok: true, sent });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (!TOKEN) return json({ ok: false, error: "TELEGRAM_TOKEN yoxdur — Edge Functions → Secrets bölməsində əlavə edin" }, 500);
  const url = new URL(req.url);
  if (req.method === "GET" && url.searchParams.has("setup")) {
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
