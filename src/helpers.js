// Shared helpers: password check for /leads, HTML/CSV escaping.

// Returns a Response to send instead (not set up / rate-limited / password needed), or null if OK.
export async function guard(request, env) {
  if (!env.DB || !env.LEADS_PASSWORD) {
    return new Response("Leads page isn't set up yet. Add the LEADS_PASSWORD secret in Cloudflare.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: "leads:" + (request.headers.get("CF-Connecting-IP") || "unknown") });
    if (!success) return new Response("Too many requests. Wait a minute.", { status: 429 });
  }
  if (!(await authorised(request, env.LEADS_PASSWORD))) {
    return new Response("Password required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Partner leads", charset="UTF-8"', "cache-control": "no-store" },
    });
  }
  return null;
}

// HTTP Basic auth: any username, password must match. Hash-compare so timing doesn't leak it.
async function authorised(request, password) {
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  let given = "";
  try {
    const decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0)));
    given = decoded.slice(decoded.indexOf(":") + 1);
  } catch {
    return false;
  }
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(given)), crypto.subtle.digest("SHA-256", enc.encode(password))]);
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export function csvCell(v) {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
