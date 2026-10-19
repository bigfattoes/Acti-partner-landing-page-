// Partner applications from the "Partner with ActivateMe®" section (public/partner-form.js).
//
// POST /apply        the form submits here (CORS: same allowed sites as /chat)
// GET  /leads        private list for the partnerships team (password = the LEADS_PASSWORD secret)
// GET  /leads.csv    spreadsheet download
// POST /leads/update change a lead's status / notes, or delete it (form on /leads)
//
// Stored in D1 (binding "DB", table `applications`). These are business contacts someone chose to
// send us, so they're kept until the team deletes them.

import { guard, esc, csvCell } from "./helpers.js";

const STATUSES = ["New", "Contacted", "Interested", "Joined", "Declined"];
const TYPES = ["Academy / club", "Brand / sponsor", "Performer / speaker", "School / community group", "Other"];
// Same four options as the "Partnership Opportunities" cards on activatemefest.com.
const INTERESTS = ["Title Sponsor", "Event Sponsorships", "Interactive Booths", "Community Programs"];
let ready = false;

async function ensureTable(db) {
  if (ready) return;
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL DEFAULT (datetime('now')),
        org TEXT NOT NULL, type TEXT, activity TEXT, interests TEXT,
        name TEXT NOT NULL, role TEXT, email TEXT NOT NULL, phone TEXT, website TEXT, message TEXT,
        site TEXT, page TEXT, status TEXT NOT NULL DEFAULT 'New', notes TEXT
      )`
    )
    .run();
  ready = true;
}

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// POST /apply  -> { ok: true } or { ok: false, error }
export async function apply(request, env, cors, json) {
  if (!env.DB) return json({ ok: false, error: "Applications aren't available right now." }, 503, cors);
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: "apply:" + (request.headers.get("CF-Connecting-IP") || "unknown") });
    if (!success) return json({ ok: false, error: "Too many attempts. Please wait a minute." }, 429, cors);
  }
  const b = await request.json().catch(() => null);
  if (!b) return json({ ok: false, error: "Invalid form." }, 400, cors);
  if (str(b.company_url, 200)) return json({ ok: true }, 200, cors); // honeypot field: bots fill it, people never see it

  // Field names match the "Become a Partner" report in Mwan Events.
  const lead = {
    org: str(b.company_name, 150),
    type: TYPES.includes(b.organisation_type) ? b.organisation_type : "Other",
    activity: str(b.activity, 150),
    interests: (Array.isArray(b.interests) ? b.interests : []).filter((i) => INTERESTS.includes(i)).join(", "),
    name: [str(b.first_name, 60), str(b.last_name, 60)].filter(Boolean).join(" "),
    role: str(b.designation, 120),
    email: str(b.email, 200),
    phone: str(b.mobile_number, 40),
    website: str(b.website, 300),
    message: str(b.message, 2000),
  };
  if (!lead.org || !lead.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) || lead.phone.replace(/\D/g, "").length < 7) {
    return json({ ok: false, error: "Please fill in your organisation, name, a valid email and phone number." }, 400, cors);
  }
  if (b.consent !== true) return json({ ok: false, error: "Please tick the consent box." }, 400, cors);

  const site = (() => { try { return new URL(request.headers.get("Origin") || "").host; } catch { return ""; } })();
  await ensureTable(env.DB);
  await env.DB.prepare(
    `INSERT INTO applications (org, type, activity, interests, name, role, email, phone, website, message, site, page)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(lead.org, lead.type, lead.activity, lead.interests, lead.name, lead.role, lead.email, lead.phone, lead.website, lead.message, site, str(b.page, 200))
    .run();
  return json({ ok: true }, 200, cors);
}

// POST /leads/update — status, notes or delete; only from the /leads page itself.
export async function updateLead(request, env, url) {
  const denied = await guard(request, env);
  if (denied) return denied;
  const origin = request.headers.get("Origin");
  if (request.method !== "POST" || (origin && origin !== url.origin)) return new Response("Forbidden", { status: 403 });
  const f = await request.formData();
  const id = Number(f.get("id")) || 0;
  await ensureTable(env.DB);
  if (id && f.get("action") === "delete") {
    await env.DB.prepare("DELETE FROM applications WHERE id = ?").bind(id).run();
  } else if (id) {
    const status = STATUSES.includes(f.get("status")) ? f.get("status") : "New";
    await env.DB.prepare("UPDATE applications SET status = ?, notes = ? WHERE id = ?")
      .bind(status, String(f.get("notes") || "").slice(0, 2000), id)
      .run();
  }
  const back = String(f.get("back") || "/leads");
  return new Response(null, { status: 303, headers: { Location: (back.startsWith("/leads") ? back : "/leads") + "#lead-" + id } });
}

export async function leadsPage(request, env, url) {
  const denied = await guard(request, env);
  if (denied) return denied;
  await ensureTable(env.DB);
  const filter = STATUSES.includes(url.searchParams.get("status")) ? url.searchParams.get("status") : "";
  const rows = (
    await env.DB.prepare(
      `SELECT id, datetime(ts, '+4 hours') AS ts, org, type, activity, interests, name, role, email, phone, website, message, site, status, notes
       FROM applications ${filter ? "WHERE status = ?" : ""} ORDER BY id DESC LIMIT 1000`
    )
      .bind(...(filter ? [filter] : []))
      .all()
  ).results;
  const counts = Object.fromEntries(
    (await env.DB.prepare("SELECT status, COUNT(*) AS n FROM applications GROUP BY status").all()).results.map((r) => [r.status, r.n])
  );

  if (url.pathname.endsWith(".csv")) {
    const head = ["received (Dubai)", "organisation", "type", "activity", "interested in", "contact", "role", "email", "phone", "website / instagram", "message", "status", "notes"];
    const lines = [head, ...rows.map((r) => [r.ts, r.org, r.type, r.activity, r.interests, r.name, r.role, r.email, r.phone, r.website, r.message, r.status, r.notes])];
    return new Response("﻿" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n"), {
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="activateme-partner-leads.csv"', "cache-control": "no-store" },
    });
  }

  const back = url.pathname + url.search;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const chip = (s, label) => `<a class="tab${s === filter ? " on" : ""}" href="/leads${s ? "?status=" + encodeURIComponent(s) : ""}">${label}</a>`;
  const link = (v) => {
    const s = String(v || "");
    if (/^https?:\/\//i.test(s)) return `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a>`;
    if (/^@?[\w.]{2,30}$/.test(s)) return `<a href="https://instagram.com/${esc(s.replace(/^@/, ""))}" target="_blank" rel="noopener">${esc(s)}</a>`;
    return esc(s);
  };
  const card = (r) => `<div class="card" id="lead-${r.id}">
    <div class="top"><span class="badge s-${esc(r.status.toLowerCase())}">${esc(r.status)}</span><span class="muted">${esc(r.ts)} · ${esc(r.type)}</span></div>
    <h3>${esc(r.org)}</h3>
    ${r.activity ? `<p class="muted">${esc(r.activity)}</p>` : ""}
    ${r.interests ? `<p><b>Interested in:</b> ${esc(r.interests)}</p>` : ""}
    <p><b>${esc(r.name)}</b>${r.role ? ", " + esc(r.role) : ""} · <a href="mailto:${esc(r.email)}">${esc(r.email)}</a> · <a href="https://api.whatsapp.com/send?phone=${esc(r.phone.replace(/\D/g, ""))}" target="_blank" rel="noopener">${esc(r.phone)}</a>${r.website ? " · " + link(r.website) : ""}</p>
    ${r.message ? `<p class="msg">${esc(r.message)}</p>` : ""}
    <form method="post" action="/leads/update" class="upd">
      <input type="hidden" name="id" value="${r.id}"><input type="hidden" name="back" value="${esc(back)}">
      <select name="status">${STATUSES.map((s) => `<option${s === r.status ? " selected" : ""}>${s}</option>`).join("")}</select>
      <input name="notes" placeholder="Notes (e.g. call booked Tue)" value="${esc(r.notes || "")}" maxlength="2000">
      <button class="save" name="action" value="save">Save</button>
      <button class="del" name="action" value="delete" onclick="return confirm('Delete this lead permanently?')">Delete</button>
    </form></div>`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Partner leads</title><style>
:root{--purple:#6F23B0;--orange:#EE6A1A;--ink:#1d1d24;--muted:#6b6577;--line:#ECEAF0;--bg:#faf8fd}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg)}
header{background:linear-gradient(120deg,var(--purple),#8A33C9 60%,var(--orange) 140%);color:#fff;padding:24px 16px}header h1{margin:0;font-size:22px}header p{margin:4px 0 0;opacity:.9;font-size:14px}
main{max-width:1000px;margin:0 auto;padding:16px}.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0 16px}
.tab{padding:7px 12px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;font-size:14px;font-weight:600}.tab.on{background:var(--purple);border-color:var(--purple);color:#fff}
.spacer{flex:1}.csv{color:var(--purple);font-weight:600;font-size:14px}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:12px}.card h3{margin:6px 0 2px;font-size:17px}.card p{margin:6px 0;font-size:14px;overflow-wrap:anywhere}
.top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.muted{color:var(--muted);font-size:13px}.msg{background:#FCFAFE;border-left:3px solid #E3D2F3;padding:8px 10px;white-space:pre-wrap}
a{color:var(--purple)}.badge{padding:2px 9px;border-radius:999px;font-weight:700;font-size:12px}
.s-new{background:#F3EAFB;color:var(--purple)}.s-contacted{background:#E8F0FE;color:#1A56B8}.s-interested{background:#FFF1E6;color:#B9480A}.s-joined{background:#E3F6EA;color:#0B7A3B}.s-declined{background:#F1EFF4;color:var(--muted)}
.upd{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)}
.upd select,.upd input{font:inherit;font-size:14px;padding:7px 10px;border:1.5px solid #DCD7E3;border-radius:10px;background:#fff}.upd input{flex:1;min-width:180px}
.save{background:var(--purple);color:#fff;border:0;border-radius:10px;padding:8px 14px;font-weight:700;cursor:pointer}.del{background:#fff;color:#B42318;border:1.5px solid #F3C7C3;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
.empty{color:var(--muted);padding:24px 0}
</style></head><body>
<header><h1>Partner leads</h1><p>Applications from the "Partner with ActivateMe®" form. Times are Dubai time.</p></header>
<main><div class="bar">${chip("", `All (${total})`)}${STATUSES.map((s) => chip(s, `${s} (${counts[s] || 0})`)).join("")}<span class="spacer"></span><a class="csv" href="/leads.csv${filter ? "?status=" + encodeURIComponent(filter) : ""}">Download as spreadsheet (CSV)</a></div>
${rows.length ? rows.map(card).join("") : `<p class="empty">No applications here yet.</p>`}
</main></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
