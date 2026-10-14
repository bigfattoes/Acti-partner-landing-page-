// ActivateMe® partner applications — Cloudflare Worker.
//
// Static files in /public (partner-form.js, partners.html) are served by Workers Assets.
// POST /apply         form submissions (only from ALLOWED_ORIGINS or this worker's own pages)
// GET  /leads         private list for the partnerships team (LEADS_PASSWORD secret)
// GET  /leads.csv     spreadsheet download
// POST /leads/update  change status / notes, or delete (form on /leads)

import { apply, leadsPage, updateLead } from "./leads.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: cors ? 204 : 403, headers: cors || {} });
    }
    if (url.pathname === "/apply") {
      if (request.method !== "POST") return json({ error: "Use POST" }, 405, cors);
      if (!cors) return json({ error: "Origin not allowed" }, 403);
      return apply(request, env, cors, json);
    }
    if (url.pathname === "/leads" || url.pathname === "/leads.csv") return leadsPage(request, env, url);
    if (url.pathname === "/leads/update") return updateLead(request, env, url);
    if (url.pathname === "/") return Response.redirect(url.origin + "/partners.html", 302);
    return new Response("Not found", { status: 404 });
  },
};

// CORS headers if the caller's site is allowed, otherwise null.
function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const self = new URL(request.url).origin;
  if (!origin || origin === self || allowed.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
  }
  return null;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } });
}
