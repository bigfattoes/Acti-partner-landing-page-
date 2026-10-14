/*!
 * ActivateMe® Fest — "Partner with us" section with application form.
 *
 * Put this where the section should appear (e.g. on the Partner with us page):
 *   <div id="activateme-partner"></div>
 *   <script src="https://YOUR-WORKER.workers.dev/partner-form.js" defer></script>
 *
 * Without the <div>, the section appears where the script tag is.
 * Optional attributes on the script tag:
 *   data-sections  "full" (default: stats, steps and form side by side) or "form" (form only)
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
  var WHATSAPP = "https://api.whatsapp.com/send?phone=971524586156&text=" + encodeURIComponent("Hello Support Team,\nI would like to know: Become our Partner\n#partner");

  // Line icons (24x24, stroke). pathLength=1 lets CSS "draw" each line in.
  function icon(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      paths.map(function (d) { return '<path pathLength="1" d="' + d + '"/>'; }).join("") + "</svg>";
  }
  var ICONS = {
    crown: ["M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z", "M5 19h14"],
    flag: ["M5 21V4", "M5 4h12l-2.5 4L17 12H5"],
    booth: ["M3 9l1.5-5h15L21 9H3z", "M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0", "M5 12v8h14v-8", "M10 20v-5h4v5"],
    heart: ["M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z"],
    plane: ["M21.5 2.5L10.5 13.5", "M21.5 2.5l-7 19-4-8-8-4 19-7z"],
    chat: ["M21 11.5a8.4 8.4 0 01-12.3 7.4L3 20.5l1.6-5.2A8.4 8.4 0 1121 11.5z", "M8.5 11.5h.01", "M12 11.5h.01", "M15.5 11.5h.01"],
    calendar: ["M4 5.5h16v15H4z", "M4 10h16", "M8 3v4", "M16 3v4", "M9 15l2 2 4-4"],
    mail: ["M3 5.5h18v13H3z", "M3 6l9 7 9-7"],
    whatsapp: ["M20.5 11.6a8.5 8.5 0 01-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1115.5-4.6z", "M9 8.6c0 3.4 2.9 6.4 6.4 6.4l1.1-1.6-2.2-1-.9.8a4.4 4.4 0 01-2.6-2.6l.8-.9-1-2.2L9 8.6z"],
  };
  // The four "Partnership Opportunities" cards on activatemefest.com: [value, short line, icon, hover animation]
  var INTERESTS = [
    ["Title Sponsor", "Top-tier branding", "crown", "wobble"],
    ["Event Sponsorships", "Fun runs & clinics", "flag", "wave"],
    ["Interactive Booths", "Samples & activities", "booth", "hop"],
    ["Community Programs", "Youth & health", "heart", "beat"],
  ];
  var STATS = [[4500, "+", "visitors at Season 1"], [75, "+", "academies & clubs"], [120, "+", "partners & activations"], [2, " days", "of sport, tech & play"]];
  var STEPS = [
    ["plane", "Apply", "Tell us about you. Takes about two minutes."],
    ["chat", "Talk to our team", "We'll find the right fit and package."],
    ["calendar", "Join the line-up", "Confirm your spot and plan your activation."],
  ];

  var CSS = [
    ":host{all:initial;display:block;font-family:inherit;color:#1d1d24;--p:#6F23B0;--o:#EE6A1A;--line:#E6E1EE}",
    "*{box-sizing:border-box;font-family:inherit}",
    ".wrap{max-width:1120px;margin:0 auto;padding:8px 16px 32px}",
    ".card{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);background:#fff;border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(60,20,100,.10)}",
    ".card.solo{grid-template-columns:1fr}",

    // Left: purple panel
    ".side{position:relative;overflow:hidden;color:#fff;padding:30px 28px;background:linear-gradient(135deg,#5B1A96,#7E2CC0 45%,#9A3BD0 70%,#E0631F 130%);background-size:180% 180%;animation:shift 14s ease-in-out infinite alternate}",
    ".blob{position:absolute;border-radius:50%;filter:blur(40px);opacity:.45;pointer-events:none}",
    ".b1{width:220px;height:220px;background:#EE6A1A;right:-70px;top:-60px;animation:float 9s ease-in-out infinite}",
    ".b2{width:180px;height:180px;background:#C77DFF;left:-60px;bottom:-50px;animation:float 11s ease-in-out infinite reverse}",
    ".side>*{position:relative}",
    ".chip{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);padding:6px 12px;border-radius:999px}",
    ".dot{width:8px;height:8px;border-radius:50%;background:#FFB27A;box-shadow:0 0 0 0 rgba(255,178,122,.7);animation:ping 2s ease-out infinite}",
    "h2{font-size:clamp(24px,2.6vw,30px);line-height:1.15;margin:14px 0 8px;font-weight:800}",
    ".lead{font-size:15px;line-height:1.5;margin:0;opacity:.92}",
    ".stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0 16px}",
    ".stat{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:12px 14px;backdrop-filter:blur(4px)}",
    ".stat b{display:block;font-size:24px;font-weight:800;line-height:1.1;font-variant-numeric:tabular-nums}",
    ".stat span{font-size:12.5px;opacity:.85}",
    ".quote{font-size:13.5px;line-height:1.5;margin:0 0 18px;padding-left:12px;border-left:3px solid #FFB27A;opacity:.95;font-style:italic}",
    ".steps{display:grid;gap:12px;margin:0;padding:0;list-style:none}",
    ".step{display:flex;gap:12px;align-items:flex-start}",
    ".si{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#fff;color:var(--p);box-shadow:0 6px 16px rgba(30,0,60,.18)}",
    ".si svg{width:22px;height:22px}",
    ".step:nth-child(1) .si svg{animation:fly 3.2s ease-in-out infinite}",
    ".step:nth-child(2) .si path:nth-child(n+2){animation:typing 1.4s ease-in-out infinite}",
    ".step:nth-child(2) .si path:nth-child(3){animation-delay:.2s}.step:nth-child(2) .si path:nth-child(4){animation-delay:.4s}",
    ".step:nth-child(3) .si svg{animation:tick 3.2s ease-in-out infinite}",
    ".step b{display:block;font-size:14.5px}.step span{font-size:13px;opacity:.85;line-height:1.4}",
    ".talk{margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.2);font-size:13px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
    ".talk a{display:inline-flex;align-items:center;gap:6px;color:#fff;text-decoration:none;font-weight:700;background:rgba(255,255,255,.14);padding:7px 12px;border-radius:999px;transition:background .2s}",
    ".talk a:hover{background:rgba(255,255,255,.26)}.talk svg{width:16px;height:16px}",

    // Right: form
    "form{padding:28px}",
    ".fh{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px}",
    "h3{font-size:21px;margin:0;font-weight:800}.fh span{font-size:13px;color:#6b6577}",
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px}",
    ".full{grid-column:1/-1}",
    "label{display:grid;gap:5px;font-size:13px;font-weight:600;color:#3d3947}",
    "label i{font-style:normal;color:#B9480A}",
    "input,select,textarea{font-size:15px;padding:10px 12px;border:1.5px solid #DCD7E3;border-radius:11px;background:#fff;color:#1d1d24;width:100%;transition:border-color .15s,box-shadow .15s}",
    "textarea{resize:vertical}",
    "input:focus,select:focus,textarea:focus{outline:none;border-color:var(--p);box-shadow:0 0 0 3px rgba(111,35,176,.13)}",
    "fieldset{border:0;padding:0;margin:0;min-width:0}legend{font-size:13px;font-weight:600;color:#3d3947;margin-bottom:6px;padding:0}",
    ".opts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}",
    ".opt{display:block;position:relative;cursor:pointer;font-weight:400}",
    ".opt input{position:absolute;opacity:0;width:1px;height:1px}",
    ".tile{display:grid;justify-items:center;gap:4px;text-align:center;height:100%;padding:12px 8px 10px;border:1.5px solid #DCD7E3;border-radius:14px;background:#fff;transition:border-color .2s,background .2s,transform .2s,box-shadow .2s}",
    ".tile b{font-size:13px;line-height:1.2;color:#1d1d24}.tile small{font-size:11.5px;color:#6b6577;line-height:1.25}",
    ".ti{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#F3EAFB;color:var(--p);transition:background .2s,color .2s}",
    ".ti svg{width:21px;height:21px;transform-origin:50% 60%}",
    ".opt:hover .tile{border-color:#BFA2DC;transform:translateY(-2px);box-shadow:0 8px 18px rgba(111,35,176,.10)}",
    ".opt:hover .ti svg,.opt input:checked+.tile .ti svg{animation:var(--a) .8s ease}",
    ".opt input:checked+.tile{border-color:var(--p);background:#F8F2FD;box-shadow:0 0 0 3px rgba(111,35,176,.12)}",
    ".opt input:checked+.tile .ti{background:var(--p);color:#fff}",
    ".opt input:focus-visible+.tile{outline:2px solid var(--p);outline-offset:2px}",
    ".tick{position:absolute;top:7px;right:7px;width:18px;height:18px;border-radius:50%;background:var(--p);color:#fff;display:grid;place-items:center;transform:scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1)}",
    ".tick svg{width:11px;height:11px}.opt input:checked+.tile .tick{transform:scale(1)}",
    ".consent{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:13px;color:#5d5866}",
    ".consent input{width:auto;margin-top:2px;accent-color:var(--p)}",
    ".hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}",
    ".foot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px}",
    ".submit{display:inline-flex;align-items:center;gap:8px;background:var(--o);color:#fff;border:0;border-radius:999px;padding:13px 24px;font-size:15.5px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(238,106,26,.28);transition:transform .15s,box-shadow .15s,background .15s}",
    ".submit:hover{transform:translateY(-1px);background:#E05D10;box-shadow:0 10px 24px rgba(238,106,26,.36)}",
    ".submit svg{width:18px;height:18px;transition:transform .25s}.submit:hover svg{transform:translate(3px,-3px)}",
    ".submit:disabled{opacity:.65;cursor:wait;transform:none}",
    ".err{color:#B42318;font-size:13.5px;flex:1;min-width:200px}",
    ".alt{font-size:13px;color:#5d5866;margin:14px 0 0}.alt a{color:var(--p);font-weight:600}",
    "form.sent{display:grid;place-items:center}.done .alt{margin-top:14px}",
    ".done{text-align:center;padding:40px 18px}.done b{display:block;font-size:22px;margin:10px 0 6px;color:#1d1d24}.done p{color:#5d5866;margin:0}",
    ".ok{width:72px;height:72px;margin:0 auto;color:#0B7A3B}.ok circle,.ok path{stroke-dasharray:1;stroke-dashoffset:1;animation:draw .7s ease forwards}.ok path{animation-delay:.45s}",

    // Reveal on scroll: fade up, draw the icons, count the stats
    ".rv{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}",
    ".in .rv{opacity:1;transform:none}",
    ".in .rv:nth-child(2){transition-delay:.08s}.in .rv:nth-child(3){transition-delay:.16s}.in .rv:nth-child(4){transition-delay:.24s}.in .rv:nth-child(5){transition-delay:.32s}.in .rv:nth-child(6){transition-delay:.4s}",
    ".si path,.ti path{stroke-dasharray:1;stroke-dashoffset:1}",
    ".in .si path,.in .ti path{animation:draw 1.1s ease forwards}",
    ".in .step:nth-child(2) .si path{animation-delay:.25s}.in .step:nth-child(3) .si path{animation-delay:.5s}",
    ".in .opt:nth-child(2) .ti path{animation-delay:.15s}.in .opt:nth-child(3) .ti path{animation-delay:.3s}.in .opt:nth-child(4) .ti path{animation-delay:.45s}",
    ".in .step:nth-child(2) .si path:nth-child(n+2){animation:draw 1.1s .25s ease forwards,typing 1.4s 1.4s ease-in-out infinite}",

    "@keyframes draw{to{stroke-dashoffset:0}}",
    "@keyframes shift{0%{background-position:0% 30%}100%{background-position:100% 70%}}",
    "@keyframes float{0%,100%{transform:translate(0,0)}50%{transform:translate(-18px,16px)}}",
    "@keyframes ping{0%{box-shadow:0 0 0 0 rgba(255,178,122,.7)}80%,100%{box-shadow:0 0 0 9px rgba(255,178,122,0)}}",
    "@keyframes fly{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(2px,-3px) rotate(-6deg)}}",
    "@keyframes typing{0%,60%,100%{opacity:1}30%{opacity:.2}}",
    "@keyframes tick{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}",
    "@keyframes wobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}60%{transform:rotate(9deg)}}",
    "@keyframes wave{0%,100%{transform:skewY(0)}30%{transform:skewY(-9deg)}65%{transform:skewY(6deg)}}",
    "@keyframes hop{0%,100%{transform:translateY(0)}35%{transform:translateY(-5px)}60%{transform:translateY(1px)}}",
    "@keyframes beat{0%,100%{transform:scale(1)}25%{transform:scale(1.22)}45%{transform:scale(.94)}65%{transform:scale(1.1)}}",

    "@media (max-width:900px){.card{grid-template-columns:1fr}.side{padding:24px 20px}.stats{grid-template-columns:repeat(4,1fr)}.steps{grid-template-columns:repeat(3,1fr)}.step{display:block}.si{margin-bottom:6px}}",
    "@media (max-width:640px){.stats{grid-template-columns:1fr 1fr}.steps{grid-template-columns:1fr}.step{display:flex}.si{margin:0}.grid{grid-template-columns:1fr}.opts{grid-template-columns:1fr 1fr}form{padding:20px}.submit{width:100%;justify-content:center}}",
    "@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}.si path,.ti path,.ok circle,.ok path{stroke-dashoffset:0}}",
  ].join("\n");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var talk = '<a href="mailto:stefanie@mwanevents.com">' + icon(ICONS.mail) + "Email us</a>" +
    '<a href="' + WHATSAPP + '" target="_blank" rel="noopener">' + icon(ICONS.whatsapp) + "WhatsApp</a>";

  var side = !FULL ? "" :
    '<aside class="side"><span class="blob b1"></span><span class="blob b2"></span>' +
    '<span class="chip rv"><span class="dot"></span>Season 2 · 16–17 Jan 2027 · Dubai Silicon Oasis</span>' +
    '<h2 class="rv">Partner with ActivateMe® Fest</h2>' +
    '<p class="lead rv">Meet thousands of active families in one weekend and sign up new members on the spot.</p>' +
    '<div class="stats rv">' +
    STATS.map(function (s) { return '<div class="stat"><b data-to="' + s[0] + '" data-suf="' + esc(s[1]) + '">' + s[0].toLocaleString("en-US") + esc(s[1]) + "</b><span>" + esc(s[2]) + "</span></div>"; }).join("") + "</div>" +
    '<p class="quote rv">Families found their children\'s after-school activities through partners they met at Season 1.</p>' +
    '<ol class="steps rv">' +
    STEPS.map(function (s) { return '<li class="step"><span class="si">' + icon(ICONS[s[0]]) + "</span><div><b>" + esc(s[1]) + "</b><span>" + esc(s[2]) + "</span></div></li>"; }).join("") + "</ol>" +
    '<div class="talk rv"><span>Prefer to talk first?</span>' + talk + "</div></aside>";

  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var formHTML =
    '<form novalidate id="apply"><div class="fh"><h3>Apply to partner with us</h3><span>Takes about 2 minutes</span></div><div class="grid">' +
    '<label><span>Organisation name <i>*</i></span><input name="org" required maxlength="150" autocomplete="organization"></label>' +
    '<label><span>Type of organisation <i>*</i></span><select name="type" required><option value="">Choose…</option>' +
    TYPES.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("") + "</select></label>" +
    '<label><span>What do you do?</span><input name="activity" maxlength="150" placeholder="e.g. Kids football academy, ages 4–14"></label>' +
    '<label><span>Website or Instagram</span><input name="website" maxlength="300" placeholder="https://… or @yourclub"></label>' +
    '<fieldset class="full"><legend>Interested in</legend><div class="opts">' +
    INTERESTS.map(function (o) {
      return '<label class="opt" style="--a:' + o[3] + '"><input type="checkbox" name="interests" value="' + esc(o[0]) + '"><span class="tile">' +
        '<span class="tick">' + check + '</span><span class="ti">' + icon(ICONS[o[2]]) + "</span><b>" + esc(o[0]) + "</b><small>" + esc(o[1]) + "</small></span></label>";
    }).join("") + "</div></fieldset>" +
    '<label><span>Your name <i>*</i></span><input name="name" required maxlength="120" autocomplete="name"></label>' +
    '<label><span>Your role</span><input name="role" maxlength="120" autocomplete="organization-title" placeholder="e.g. Founder, Head Coach"></label>' +
    '<label><span>Email <i>*</i></span><input name="email" type="email" required maxlength="200" autocomplete="email"></label>' +
    '<label><span>Phone / WhatsApp <i>*</i></span><input name="phone" type="tel" required maxlength="40" autocomplete="tel" placeholder="+971"></label>' +
    '<label class="full"><span>Anything else we should know?</span><textarea name="message" rows="2" maxlength="2000"></textarea></label>' +
    '<label class="hp" aria-hidden="true">Leave empty<input name="company_url" tabindex="-1" autocomplete="off"></label>' +
    '<label class="full consent"><input type="checkbox" name="consent" required>I agree that MWAN Events can contact me about partnering with ActivateMe® Fest.</label>' +
    '</div><div class="foot"><button class="submit" type="submit">Send application' + icon(ICONS.plane) + '</button><div class="err" role="alert"></div></div>' +
    (FULL ? "" : '<p class="alt">Prefer to talk first? Email <a href="mailto:stefanie@mwanevents.com">stefanie@mwanevents.com</a> or <a href="' + WHATSAPP + '" target="_blank" rel="noopener">message us on WhatsApp</a>.</p>') +
    "</form>";

  var host = document.getElementById("activateme-partner");
  if (!host) {
    host = document.createElement("div");
    host.id = "activateme-partner";
    if (script && script.parentNode && script.parentNode !== document.head) script.parentNode.insertBefore(host, script);
    else document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(host); });
  }
  var root = host.attachShadow({ mode: "open" });
  root.innerHTML = "<style>" + CSS + '</style><div class="wrap"><div class="card' + (FULL ? "" : " solo") + '">' + side + formHTML + "</div></div>";
  var card = root.querySelector(".card");

  // Count the stats up from zero.
  function countUp() {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    Array.prototype.forEach.call(root.querySelectorAll("[data-to]"), function (el) {
      var to = +el.getAttribute("data-to"), suf = el.getAttribute("data-suf"), t0 = null;
      if (reduce) return;
      function frame(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        el.textContent = v.toLocaleString("en-US") + suf;
        if (k < 1) requestAnimationFrame(frame);
      }
      el.textContent = "0" + suf;
      requestAnimationFrame(frame);
    });
  }
  function reveal() { if (!card.classList.contains("in")) { card.classList.add("in"); countUp(); } }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { reveal(); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(host);
  } else reveal();

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
      else if (Array.isArray(window.dataLayer)) { var e = { event: name }; for (var k in params) e[k] = params[k]; window.dataLayer.push(e); }
    } catch (x) {}
  }

  var form = root.querySelector("form"), err = root.querySelector(".err"), btn = root.querySelector(".submit");
  var btnHTML = btn.innerHTML;
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
        form.classList.add("sent");
        form.innerHTML = '<div class="done"><svg class="ok" viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle pathLength="1" cx="26" cy="26" r="23"/><path pathLength="1" d="M15 27l7 7 15-16"/></svg>' +
          "<b>Thank you, " + esc(data.org.trim()) + "!</b><p>Your application is with our partnerships team and we'll be in touch soon.</p>" +
          '<p class="alt">Can\'t wait? Email <a href="mailto:stefanie@mwanevents.com">stefanie@mwanevents.com</a>.</p></div>';
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function (x) {
        btn.disabled = false;
        btn.innerHTML = btnHTML;
        err.textContent = (x && x.message) || "Something went wrong. Please try again, or email stefanie@mwanevents.com.";
      });
  });
})();
