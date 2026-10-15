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
  // Stefanie's WhatsApp, with a starter message filled in.
  var WHATSAPP = "https://wa.me/971529460819?text=" + encodeURIComponent("Hi, I'd like to partner with ActivateMe® Fest Season 2. #partner");

  // Two-tone icons on a 24px grid. Each part is [kind, path]:
  //   s = outline (currentColor), l = soft body fill, f = orange accent fill, b = background fill (hides lines behind it)
  function circle(cx, cy, r) { return "M" + (cx - r) + " " + cy + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0a" + r + " " + r + " 0 1 0 " + -2 * r + " 0z"; }
  function icon(parts) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + parts.map(function (p) {
      return '<path class="' + p[0] + '"' + (p[0] === "s" ? ' pathLength="1"' : "") + ' d="' + p[1] + '"/>';
    }).join("") + "</svg>";
  }
  var CROWN = "M4 9l4 3.5L12 6l4 6.5L20 9l-1.6 9H5.6L4 9z";
  var PLANE = "M21 3L3 10.5l7 3 3 7L21 3z";
  var BUBBLE = "M4.5 9H13a1.5 1.5 0 011.5 1.5V16a1.5 1.5 0 01-1.5 1.5H8.5L5.5 20v-2.5h-1A1.5 1.5 0 013 16v-5.5A1.5 1.5 0 014.5 9z";
  var TICKET = "M3 7.5A1.5 1.5 0 014.5 6h15A1.5 1.5 0 0121 7.5V10a2 2 0 000 4v2.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5V14a2 2 0 000-4z";
  var ICONS = {
    crown: [["l", CROWN], ["s", CROWN], ["s", "M5.5 21h13"], ["f", circle(4, 8.6, 1.4)], ["f", circle(12, 5, 1.4)], ["f", circle(20, 8.6, 1.4)]],
    flag: [["f", "M6 4.5h11.5l-2.6 4 2.6 4H6z"], ["s", "M6 4.5h11.5l-2.6 4 2.6 4H6"], ["s", "M6 21V3.5"], ["s", "M3.5 21h5"]],
    stall: [["f", "M5 4h3.5l-.75 5.5H3.5z"], ["f", "M12 4h3.5l.75 5.5H12z"], ["s", "M3.5 9.5L5 4h14l1.5 5.5z"],
      ["s", "M3.5 9.5a2.1 2.1 0 004.25 0 2.1 2.1 0 004.25 0 2.1 2.1 0 004.25 0 2.1 2.1 0 004.25 0"], ["s", "M5 13v7h14v-7"], ["s", "M3 20h18"], ["s", "M9.5 20v-4h5v4"]],
    community: [["s", circle(7.5, 7.5, 2.5)], ["s", circle(16.5, 7.5, 2.5)], ["s", "M2.5 19v-.5A5 5 0 017.5 13.5h1"], ["s", "M21.5 19v-.5a5 5 0 00-5-5h-1"],
      ["f", "M12 21s-3.6-2.1-3.6-4.7A1.95 1.95 0 0112 15a1.95 1.95 0 013.6 1.3c0 2.6-3.6 4.7-3.6 4.7z"]],
    plane: [["l", PLANE], ["f", "M10 13.5L21 3l-8 17.5z"], ["s", PLANE], ["s", "M10 13.5L21 3"]],
    chat: [["f", "M9 3.5h10.5A1.5 1.5 0 0121 5v6.5a1.5 1.5 0 01-1.5 1.5H18v2.8L15 13H9a1.5 1.5 0 01-1.5-1.5V5A1.5 1.5 0 019 3.5z"],
      ["b", BUBBLE], ["l", BUBBLE], ["s", BUBBLE], ["s", "M6.3 13.25h.01"], ["s", "M8.75 13.25h.01"], ["s", "M11.2 13.25h.01"]],
    ticket: [["l", TICKET], ["s", TICKET], ["s", "M15.5 6.5v1.5M15.5 11v2M15.5 16v1.5"],
      ["f", "M9.00 9.10L9.73 10.99L11.76 11.10L10.19 12.39L10.70 14.35L9.00 13.25L7.30 14.35L7.81 12.39L6.24 11.10L8.27 10.99z"]],
    mail: [["s", "M3 5.5h18v13H3z"], ["s", "M3 6l9 7 9-7"]],
    whatsapp: [["s", "M20.5 11.6a8.5 8.5 0 01-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1115.5-4.6z"], ["s", "M9 8.6c0 3.4 2.9 6.4 6.4 6.4l1.1-1.6-2.2-1-.9.8a4.4 4.4 0 01-2.6-2.6l.8-.9-1-2.2L9 8.6z"]],
    arrow: [["s", "M5 12h14"], ["s", "M13 6l6 6-6 6"]],
  };
  // The four "Partnership Opportunities" cards on activatemefest.com: [value, short line, icon, hover animation]
  var INTERESTS = [
    ["Title Sponsor", "Top-tier branding", "crown", "wobble"],
    ["Event Sponsorships", "Fun runs & clinics", "flag", "wave"],
    ["Interactive Booths", "Samples & activities", "stall", "hop"],
    ["Community Programs", "Youth & health", "community", "beat"],
  ];
  // Season 2 projections.
  var STATS = [[8000, "+", "expected visitors"], [100, "+", "expected academies & clubs"], [150, "+", "expected partners & activations"], [2, "", "days of sport, tech & play"]];
  var STEPS = [
    ["plane", "Apply", "Tell us about you. It takes about two minutes."],
    ["chat", "Talk to our team", "We'll find the right fit and package."],
    ["ticket", "Join the line-up", "Confirm your spot and plan your activation."],
  ];

  var CSS = [
    ":host{all:initial;display:block;font-family:inherit;color:#1d1d24;--p:#6F2FA0;--pd:#5A2386;--o:#EE6A1A;--line:#E6E1EE}",
    "*{box-sizing:border-box;font-family:inherit}",
    // Fills the width of the page it sits in, so it lines up with the content around it.
    ".wrap{padding:8px 0 32px}",
    ".card{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden}",
    ".card.solo{grid-template-columns:1fr}",
    "svg{display:block;overflow:visible}",
    "svg .s{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}",
    "svg .l{fill:var(--lt)}svg .f{fill:var(--acc)}svg .b{fill:var(--ib)}",

    // Left: flat brand purple, like the Partnership Opportunities cards
    ".side{color:#fff;background:var(--p);padding:34px 32px 30px;display:flex;flex-direction:column;--lt:rgba(255,255,255,.14);--acc:var(--o);--ib:var(--p)}",
    ".eyebrow{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#FFB27A;margin:0}",
    ".eyebrow span{color:rgba(255,255,255,.75);font-weight:600;letter-spacing:.06em}",
    "h2{font-size:clamp(28px,3vw,36px);line-height:1.02;margin:10px 0 12px;font-weight:900;font-style:italic;letter-spacing:-.01em}",
    "h2 em{color:#FFB27A;font-style:italic}",
    ".lead{font-size:15px;line-height:1.55;margin:0;color:rgba(255,255,255,.88);max-width:34ch}",
    ".stats{display:grid;grid-template-columns:1fr 1fr;margin:26px 0 22px;border-top:1px solid rgba(255,255,255,.18)}",
    ".stat{padding:14px 0 12px;border-bottom:1px solid rgba(255,255,255,.18)}",
    ".stat:nth-child(odd){padding-right:16px;border-right:1px solid rgba(255,255,255,.18)}.stat:nth-child(even){padding-left:18px}",
    ".stat b{display:block;font-size:34px;line-height:1;font-weight:900;font-style:italic;letter-spacing:-.02em;font-variant-numeric:tabular-nums}",
    ".stat b i{color:var(--o);font-style:italic}",
    ".stat span{display:block;margin-top:6px;font-size:12.5px;color:rgba(255,255,255,.78)}",
    ".steps{list-style:none;margin:0;padding:0;display:grid;gap:0}",
    ".step{position:relative;display:grid;grid-template-columns:34px 1fr;gap:14px;padding-bottom:16px}",
    ".step:not(:last-child):after{content:'';position:absolute;left:16px;top:38px;bottom:4px;border-left:1.5px dashed rgba(255,255,255,.3)}",
    ".si{width:34px;height:34px}.si svg{width:34px;height:34px}",
    ".step small{display:block;font-size:11px;font-weight:800;letter-spacing:.12em;color:#FFB27A}",
    ".step b{display:block;font-size:15px;font-weight:800;margin-top:1px}.step span{display:block;font-size:13px;color:rgba(255,255,255,.78);line-height:1.4;margin-top:2px}",
    ".talk{margin-top:auto;padding-top:18px;border-top:1px solid rgba(255,255,255,.18);display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;font-size:13px;color:rgba(255,255,255,.8)}",
    ".talk a{display:inline-flex;align-items:center;gap:7px;font-weight:800;text-decoration:none;font-size:13.5px}",
    ".talk svg{width:17px;height:17px}",
    ".wa{background:#fff;color:var(--p);padding:9px 14px;border-radius:999px;transition:transform .15s}.wa:hover{transform:translateY(-1px)}",
    ".em{color:#fff;border-bottom:1.5px solid rgba(255,255,255,.4);padding-bottom:1px}.em:hover{border-color:#fff}",

    // Right: form
    "form{padding:30px 30px 28px}",
    ".fh{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}",
    "h3{font-size:22px;margin:0;font-weight:900;font-style:italic;color:var(--p)}.fh span{font-size:13px;color:#6b6577}",
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px}",
    ".full{grid-column:1/-1}",
    "label{display:grid;gap:5px;font-size:13px;font-weight:600;color:#3d3947}",
    "label i{font-style:normal;color:var(--o)}",
    "input,select,textarea{font-size:15px;padding:10px 12px;border:1.5px solid #DCD7E3;border-radius:8px;background:#fff;color:#1d1d24;width:100%;transition:border-color .15s,box-shadow .15s}",
    "textarea{resize:vertical}",
    "input:focus,select:focus,textarea:focus{outline:none;border-color:var(--p);box-shadow:0 0 0 3px rgba(111,47,160,.14)}",
    "fieldset{border:0;padding:0;margin:0;min-width:0}legend{font-size:13px;font-weight:600;color:#3d3947;margin-bottom:6px;padding:0}",
    ".opts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}",
    ".opt{display:block;position:relative;cursor:pointer;font-weight:400}",
    ".opt input{position:absolute;opacity:0;width:1px;height:1px}",
    ".tile{display:grid;justify-items:start;align-content:start;gap:2px;height:100%;padding:12px 12px 11px;border:1.5px solid #DCD7E3;border-radius:10px;background:#fff;color:var(--p);--lt:#F1E7FA;--acc:var(--o);--ib:#fff;transition:border-color .2s,background .2s,box-shadow .2s}",
    ".ti{width:30px;height:30px;margin-bottom:6px}.ti svg{width:30px;height:30px;transform-origin:50% 70%}",
    ".tile b{font-size:13.5px;line-height:1.2;color:#1d1d24;font-weight:800}.tile small{font-size:12px;color:#6b6577;line-height:1.3}",
    ".opt:hover .tile{border-color:#B99AD6}",
    ".opt:hover .ti svg,.opt input:checked+.tile .ti svg{animation:var(--a) .7s cubic-bezier(.3,1.4,.5,1)}",
    ".opt input:checked+.tile{border-color:var(--p);background:var(--p);--lt:rgba(255,255,255,.16);--ib:var(--p);color:#fff}",
    ".opt input:checked+.tile b{color:#fff}.opt input:checked+.tile small{color:rgba(255,255,255,.8)}",
    ".opt input:focus-visible+.tile{outline:2px solid var(--o);outline-offset:2px}",
    ".tick{position:absolute;top:9px;right:9px;width:18px;height:18px;border-radius:50%;background:var(--o);color:#fff;display:grid;place-items:center;transform:scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1)}",
    ".tick svg{width:10px;height:10px}.tick .s{stroke-width:3.5}.opt input:checked+.tile .tick{transform:scale(1)}",
    ".consent{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:13px;color:#5d5866}",
    ".consent input{width:auto;margin-top:2px;accent-color:var(--p)}",
    ".hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}",
    ".foot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:18px}",
    ".submit{display:inline-flex;align-items:center;gap:10px;background:var(--o);color:#fff;border:0;border-radius:999px;padding:13px 22px 13px 26px;font-size:15.5px;font-weight:800;cursor:pointer;transition:background .15s}",
    ".submit:hover{background:#D95C10}",
    ".submit svg{width:18px;height:18px;transition:transform .2s}.submit .s{stroke-width:2.2}.submit:hover svg{transform:translateX(4px)}",
    ".submit:disabled{opacity:.65;cursor:wait}",
    ".err{color:#B42318;font-size:13.5px;flex:1;min-width:200px}",
    ".alt{font-size:13px;color:#5d5866;margin:14px 0 0}.alt a{color:var(--p);font-weight:700}",
    "form.sent{display:grid;place-items:center}",
    ".done{text-align:center;padding:40px 18px}.done b{display:block;font-size:24px;margin:12px 0 6px;color:var(--p);font-weight:900;font-style:italic}.done p{color:#5d5866;margin:0}.done .alt{margin-top:14px}",
    ".ok{width:64px;height:64px;margin:0 auto}.ok circle{fill:var(--o);transform-origin:center;animation:pop .5s cubic-bezier(.3,1.5,.5,1) both}",
    ".ok path{fill:none;stroke:#fff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:draw .45s .35s ease forwards}",

    // Reveal on scroll: fade up, draw the icon outlines then fill them, count the stats
    ".rv{opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s ease}",
    ".in .rv{opacity:1;transform:none}",
    ".in .rv:nth-child(2){transition-delay:.06s}.in .rv:nth-child(3){transition-delay:.12s}.in .rv:nth-child(4){transition-delay:.18s}.in .rv:nth-child(5){transition-delay:.24s}.in .rv:nth-child(6){transition-delay:.3s}.in .rv:nth-child(7){transition-delay:.36s}",
    ".si .s,.ti .s{stroke-dasharray:1;stroke-dashoffset:1}.si .l,.si .f,.ti .l,.ti .f{opacity:0;transition:opacity .5s ease}",
    ".in .si .s,.in .ti .s{animation:draw .9s ease forwards}.in .si .l,.in .si .f,.in .ti .l,.in .ti .f{opacity:1;transition-delay:.7s}",
    ".in .step:nth-child(2) .s{animation-delay:.2s}.in .step:nth-child(2) .l,.in .step:nth-child(2) .f{transition-delay:.9s}",
    ".in .step:nth-child(3) .s{animation-delay:.4s}.in .step:nth-child(3) .l,.in .step:nth-child(3) .f{transition-delay:1.1s}",
    ".in .opt:nth-child(2) .ti .s{animation-delay:.1s}.in .opt:nth-child(3) .ti .s{animation-delay:.2s}.in .opt:nth-child(4) .ti .s{animation-delay:.3s}",

    "@keyframes draw{to{stroke-dashoffset:0}}",
    "@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}",
    "@keyframes wobble{0%,100%{transform:rotate(0)}30%{transform:rotate(-10deg)}65%{transform:rotate(7deg)}}",
    "@keyframes wave{0%,100%{transform:skewY(0)}35%{transform:skewY(-8deg)}70%{transform:skewY(5deg)}}",
    "@keyframes hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}",
    "@keyframes beat{0%,100%{transform:scale(1)}30%{transform:scale(1.18)}60%{transform:scale(.96)}}",

    "@media (max-width:900px){.card{grid-template-columns:1fr}.side{padding:28px 22px 24px}.lead{max-width:none}.stats{grid-template-columns:repeat(4,1fr)}.stat,.stat:nth-child(odd),.stat:nth-child(even){padding:14px 12px;border-right:1px solid rgba(255,255,255,.18)}.stat:first-child{padding-left:0}.stat:last-child{border-right:0}.steps{grid-template-columns:repeat(3,1fr);gap:16px}.step{grid-template-columns:1fr;gap:8px}.step:after{display:none}.talk{margin-top:6px}}",
    "@media (max-width:640px){.stats{grid-template-columns:1fr 1fr}.stat:nth-child(odd){padding:14px 16px 12px 0}.stat:nth-child(even){padding:14px 0 12px 18px;border-right:0}.steps{grid-template-columns:1fr;gap:0}.step{grid-template-columns:34px 1fr;gap:14px}.step:not(:last-child):after{display:block}.grid{grid-template-columns:1fr}.opts{grid-template-columns:1fr 1fr}form{padding:22px 20px}.submit{width:100%;justify-content:center}}",
    "@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}.si .s,.ti .s,.ok path{stroke-dashoffset:0}.si .l,.si .f,.ti .l,.ti .f{opacity:1}}",
  ].join("\n");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(n, suf) { return n.toLocaleString("en-US") + (suf ? "<i>" + suf + "</i>" : ""); }

  var side = !FULL ? "" :
    '<aside class="side">' +
    '<p class="eyebrow rv">Season 2 · 16–17 Jan 2027 <span>· Dubai Silicon Oasis</span></p>' +
    '<h2 class="rv">Partner with ActivateMe<sup style="font-size:.45em">®</sup> Fest</h2>' +
    '<p class="lead rv">Meet thousands of active families in one weekend and sign up new members on the spot.</p>' +
    '<div class="stats rv">' +
    STATS.map(function (s) { return '<div class="stat"><b data-to="' + s[0] + '" data-suf="' + esc(s[1]) + '">' + num(s[0], s[1]) + "</b><span>" + esc(s[2]) + "</span></div>"; }).join("") + "</div>" +
    '<ol class="steps rv">' +
    STEPS.map(function (s, i) { return '<li class="step"><span class="si">' + icon(ICONS[s[0]]) + "</span><div><small>0" + (i + 1) + "</small><b>" + esc(s[1]) + "</b><span>" + esc(s[2]) + "</span></div></li>"; }).join("") + "</ol>" +
    '<div class="talk rv"><span>Prefer to talk first?</span>' +
    '<a class="wa" href="' + WHATSAPP + '" target="_blank" rel="noopener">' + icon(ICONS.whatsapp) + "WhatsApp us</a>" +
    '<a class="em" href="mailto:stefanie@mwanevents.com">Email the team</a></div></aside>';

  var check = icon([["s", "M5 12.5l4.5 4.5L19 7.5"]]);
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
    '</div><div class="foot"><button class="submit" type="submit">Send application' + icon(ICONS.arrow) + '</button><div class="err" role="alert"></div></div>' +
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
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Array.prototype.forEach.call(root.querySelectorAll("[data-to]"), function (el) {
      var to = +el.getAttribute("data-to"), suf = el.getAttribute("data-suf"), t0 = null;
      function frame(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 1400);
        el.innerHTML = num(Math.round(to * (1 - Math.pow(1 - k, 3))), suf);
        if (k < 1) requestAnimationFrame(frame);
      }
      el.innerHTML = num(0, suf);
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
        form.innerHTML = '<div class="done"><svg class="ok" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26"/><path pathLength="1" d="M15 27l7 7 15-16"/></svg>' +
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
