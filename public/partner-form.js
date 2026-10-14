/*!
 * ActivateMe® Fest — "Partner with us" section with application form.
 *
 * Put this where the section should appear (e.g. on the Partner with us page):
 *   <div id="activateme-partner"></div>
 *   <script src="https://YOUR-WORKER.workers.dev/partner-form.js" defer></script>
 *
 * Without the <div>, the section appears where the script tag is.
 * Optional attributes on the script tag:
 *   data-sections  "full" (default: intro, stats, ways to join, steps, form) or "form" (form only)
 *   data-endpoint  where applications are sent (default: same host as this script + /apply)
 */
(function () {
  "use strict";
  if (window.__activateMePartner) return;
  window.__activateMePartner = true;

  var script = document.currentScript;
  var attr = function (n, d) { var v = script && script.getAttribute("data-" + n); return v == null || v === "" ? d : v; };
  var origin = script && script.src ? new URL(script.src, location.href).origin : location.origin;
  var ENDPOINT = attr("endpoint", origin + "/apply");
  var FULL = attr("sections", "full") !== "form";

  var TYPES = ["Academy / club", "Brand / sponsor", "Performer / speaker", "School / community group", "Other"];
  var WAYS = [
    ["Trial sessions & demos", "Run free taster sessions for kids and meet parents looking for after-school activities."],
    ["Interactive booth", "Your own space for activities, samples and giveaways."],
    ["Event sponsorship", "Put your name on a family fun run, sports clinic or competition."],
    ["Title sponsorship", "Become the main partner, with top-tier branding throughout the fest."],
    ["Community programme", "Youth initiatives, workshops and health-education programmes."],
    ["Stage performance / talk", "Perform, demo or inspire families from the main stage."],
  ];

  var CSS = [
    ":host{all:initial;display:block;font-family:inherit;color:#1d1d24}",
    "*{box-sizing:border-box;font-family:inherit}",
    ".wrap{max-width:1080px;margin:0 auto;padding:8px 16px 40px}",
    ".hero{border-radius:22px;padding:36px 28px;color:#fff;background:linear-gradient(120deg,#6F23B0 0%,#8A33C9 55%,#EE6A1A 140%)}",
    ".eyebrow{display:inline-block;font-size:13px;font-weight:700;letter-spacing:.02em;background:rgba(255,255,255,.18);padding:6px 12px;border-radius:999px}",
    "h2{font-size:clamp(26px,4vw,38px);line-height:1.15;margin:14px 0 10px}",
    ".hero p{font-size:17px;line-height:1.5;margin:0;max-width:720px;opacity:.95}",
    ".cta{display:inline-block;margin-top:20px;background:#fff;color:#6F23B0;font-weight:800;padding:12px 22px;border-radius:999px;text-decoration:none;border:0;cursor:pointer;font-size:16px}",
    ".stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0 8px}",
    ".stat{background:#fff;border:1px solid #ECEAF0;border-radius:16px;padding:16px;text-align:center}",
    ".stat b{display:block;font-size:28px;color:#6F23B0}.stat span{font-size:13px;color:#6b6577}",
    ".quote{margin:14px 0 6px;padding:14px 18px;border-left:4px solid #EE6A1A;background:#FFF6EF;border-radius:0 14px 14px 0;font-size:15px;line-height:1.5}",
    "h3{font-size:22px;margin:30px 0 12px}",
    ".ways{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}",
    ".way{background:#fff;border:1px solid #ECEAF0;border-radius:16px;padding:16px}",
    ".way b{display:block;font-size:16px;margin-bottom:6px;color:#1d1d24}.way span{font-size:14px;color:#5d5866;line-height:1.45}",
    ".steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;counter-reset:s}",
    ".step{background:#F7F2FC;border-radius:16px;padding:16px;font-size:14px;line-height:1.45;color:#3d3947}",
    ".step b{display:block;font-size:16px;color:#1d1d24;margin-bottom:4px}",
    ".step:before{counter-increment:s;content:counter(s);display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#6F23B0;color:#fff;font-weight:800;margin-bottom:8px}",
    "form{background:#fff;border:1px solid #ECEAF0;border-radius:20px;padding:22px;box-shadow:0 10px 30px rgba(40,10,70,.06)}",
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}",
    ".full{grid-column:1/-1}",
    "label{display:grid;gap:6px;font-size:14px;font-weight:600;color:#3d3947}",
    "label i{font-style:normal;color:#B9480A}",
    "input,select,textarea{font-size:15px;padding:11px 12px;border:1.5px solid #DCD7E3;border-radius:12px;background:#fff;color:#1d1d24;width:100%}",
    "input:focus,select:focus,textarea:focus{outline:none;border-color:#6F23B0;box-shadow:0 0 0 3px rgba(111,35,176,.12)}",
    "fieldset{border:0;padding:0;margin:0}legend{font-size:14px;font-weight:600;color:#3d3947;margin-bottom:8px}",
    ".checks{display:flex;flex-wrap:wrap;gap:8px}",
    ".check{display:inline-flex;align-items:center;gap:8px;border:1.5px solid #DCD7E3;border-radius:999px;padding:8px 12px;font-weight:600;font-size:14px;cursor:pointer;background:#fff}",
    ".check input{width:auto;margin:0;accent-color:#6F23B0}",
    ".check:has(input:checked){border-color:#6F23B0;background:#F3EAFB;color:#6F23B0}",
    ".consent{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:13.5px;color:#5d5866;grid-template-columns:none}",
    ".consent input{width:auto;margin-top:2px;accent-color:#6F23B0}",
    ".hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}",
    ".submit{margin-top:16px;background:#EE6A1A;color:#fff;border:0;border-radius:999px;padding:14px 26px;font-size:16px;font-weight:800;cursor:pointer}",
    ".submit:disabled{opacity:.6;cursor:wait}",
    ".err{color:#B42318;font-size:14px;margin-top:10px;min-height:1em}",
    ".done{text-align:center;padding:34px 18px}.done b{display:block;font-size:22px;margin-bottom:8px;color:#0B7A3B}",
    ".alt{font-size:14px;color:#5d5866;margin-top:14px;line-height:1.5}.alt a{color:#6F23B0;font-weight:600}",
    "@media (max-width:760px){.stats{grid-template-columns:repeat(2,1fr)}.ways,.steps,.grid{grid-template-columns:1fr}.hero{padding:28px 20px}form{padding:18px}}",
  ].join("\n");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var intro = !FULL ? "" :
    '<div class="hero"><span class="eyebrow">Season 2 · 16–17 January 2027 · Dubai Silicon Oasis</span>' +
    "<h2>Bring your club, academy or brand to ActivateMe® Fest</h2>" +
    "<p>Meet thousands of active families in one weekend. Run trial sessions and demos, showcase your brand, and sign up new members on the spot.</p>" +
    '<button class="cta" type="button" data-go>Apply to join</button></div>' +
    '<div class="stats">' +
    '<div class="stat"><b>4,500+</b><span>visitors at Season 1</span></div>' +
    '<div class="stat"><b>75+</b><span>academies & clubs met families</span></div>' +
    '<div class="stat"><b>120+</b><span>partners & activations</span></div>' +
    '<div class="stat"><b>2 days</b><span>of sport, creativity, tech & play</span></div></div>' +
    '<div class="quote">Families told us they found their children\'s after-school activities through the partners they met at Season 1.</div>' +
    "<h3>Ways to take part</h3><div class=\"ways\">" +
    WAYS.map(function (w) { return '<div class="way"><b>' + esc(w[0]) + "</b><span>" + esc(w[1]) + "</span></div>"; }).join("") + "</div>" +
    '<h3>How it works</h3><div class="steps">' +
    '<div class="step"><b>Apply</b>Tell us about your organisation. It takes about two minutes.</div>' +
    '<div class="step"><b>Talk to our team</b>Our partnerships team gets in touch to find the right fit and package.</div>' +
    '<div class="step"><b>Join the line-up</b>Confirm your spot and we\'ll help you plan your activation.</div></div>';

  var formHTML =
    '<h3 id="apply">Apply to partner with us</h3>' +
    '<form novalidate><div class="grid">' +
    '<label><span>Organisation name <i>*</i></span><input name="org" required maxlength="150" autocomplete="organization"></label>' +
    '<label><span>Type of organisation <i>*</i></span><select name="type" required><option value="">Choose…</option>' +
    TYPES.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("") + "</select></label>" +
    '<label class="full"><span>What do you do?</span><input name="activity" maxlength="150" placeholder="e.g. Kids football academy, ages 4–14"></label>' +
    '<fieldset class="full"><legend>Interested in</legend><div class="checks">' +
    WAYS.map(function (w) { return '<label class="check"><input type="checkbox" name="interests" value="' + esc(w[0]) + '">' + esc(w[0]) + "</label>"; }).join("") +
    "</div></fieldset>" +
    '<label><span>Your name <i>*</i></span><input name="name" required maxlength="120" autocomplete="name"></label>' +
    '<label><span>Your role</span><input name="role" maxlength="120" autocomplete="organization-title" placeholder="e.g. Founder, Head Coach, Marketing"></label>' +
    '<label><span>Email <i>*</i></span><input name="email" type="email" required maxlength="200" autocomplete="email"></label>' +
    '<label><span>Phone / WhatsApp <i>*</i></span><input name="phone" type="tel" required maxlength="40" autocomplete="tel" placeholder="+971"></label>' +
    '<label class="full"><span>Website or Instagram</span><input name="website" maxlength="300" placeholder="https://… or @yourclub"></label>' +
    '<label class="full"><span>Anything else we should know?</span><textarea name="message" rows="3" maxlength="2000"></textarea></label>' +
    '<label class="hp" aria-hidden="true">Leave empty<input name="company_url" tabindex="-1" autocomplete="off"></label>' +
    '<label class="full consent"><input type="checkbox" name="consent" required>I agree that MWAN Events can contact me about partnering with ActivateMe® Fest.</label>' +
    '</div><button class="submit" type="submit">Send application</button><div class="err" role="alert"></div>' +
    '<p class="alt">Prefer to talk first? Email <a href="mailto:stefanie@mwanevents.com">stefanie@mwanevents.com</a> or ' +
    '<a href="https://api.whatsapp.com/send?phone=971524586156&text=' + encodeURIComponent("Hello Support Team,\nI would like to know: Become our Partner\n#partner") + '" target="_blank" rel="noopener">message us on WhatsApp</a>.</p></form>';

  var host = document.getElementById("activateme-partner");
  if (!host) {
    host = document.createElement("div");
    host.id = "activateme-partner";
    if (script && script.parentNode && script.parentNode !== document.head) script.parentNode.insertBefore(host, script);
    else document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(host); });
  }
  var root = host.attachShadow({ mode: "open" });
  root.innerHTML = "<style>" + CSS + '</style><div class="wrap">' + intro + formHTML + "</div>";

  var form = root.querySelector("form"), err = root.querySelector(".err"), btn = root.querySelector(".submit");
  var go = root.querySelector("[data-go]");
  if (go) go.addEventListener("click", function () { root.getElementById("apply").scrollIntoView({ behavior: "smooth", block: "start" }); });

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
      else if (Array.isArray(window.dataLayer)) { var e = { event: name }; for (var k in params) e[k] = params[k]; window.dataLayer.push(e); }
    } catch (x) {}
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.textContent = "";
    var f = function (n) { return form.elements.namedItem(n); };
    var data = {
      org: f("org").value, type: f("type").value, activity: f("activity").value, name: f("name").value, role: f("role").value,
      email: f("email").value, phone: f("phone").value, website: f("website").value, message: f("message").value,
      company_url: f("company_url").value, consent: f("consent").checked, page: location.pathname,
      interests: Array.prototype.filter.call(form.querySelectorAll("input[name=interests]"), function (i) { return i.checked; }).map(function (i) { return i.value; }),
    };
    var missing = [];
    if (!data.org.trim()) missing.push("organisation name");
    if (!data.type) missing.push("type of organisation");
    if (!data.name.trim()) missing.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) missing.push("a valid email");
    if (data.phone.replace(/\D/g, "").length < 7) missing.push("a phone number");
    if (missing.length) { err.textContent = "Please add " + missing.join(", ") + "."; return; }
    if (!data.consent) { err.textContent = "Please tick the box so our team can contact you."; return; }

    btn.disabled = true;
    btn.textContent = "Sending…";
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || "");
        track("partner_application", { org_type: data.type });
        form.innerHTML = '<div class="done"><b>Thank you, ' + esc(data.org.trim()) + "!</b>Your application is with our partnerships team and we'll be in touch soon." +
          '<p class="alt">Can\'t wait? Email <a href="mailto:stefanie@mwanevents.com">stefanie@mwanevents.com</a>.</p></div>';
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function (x) {
        btn.disabled = false;
        btn.textContent = "Send application";
        err.textContent = (x && x.message) || "Something went wrong. Please try again, or email stefanie@mwanevents.com.";
      });
  });
})();
