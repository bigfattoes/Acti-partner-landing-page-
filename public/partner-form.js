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
  var STATS = [[8000, "+", "families"], [100, "+", "clubs & academies"], [150, "+", "partners & activations"], [2, "", "days of sport, tech & play"]];
  var STEPS = [
    ["plane", "Apply", "Tell us about you. It takes about two minutes."],
    ["chat", "Talk to our team", "We'll find the right fit and package."],
    ["ticket", "Join the line-up", "Confirm your spot and plan your activation."],
  ];

  var CSS = [
    ":host{all:initial;display:block;font-family:inherit;color:#1d1d24;-webkit-font-smoothing:antialiased;--p:#6F2FA0;--o:#EE6A1A;--line:#ECE8F1;--field:#F5F2F9;--ease:cubic-bezier(.25,.8,.25,1)}",
    "*{box-sizing:border-box;font-family:inherit}",
    // Fills the width of the page it sits in, so it lines up with the content around it.
    ".wrap{padding:8px 0 40px}",
    "h2.title{margin:0 0 18px;color:var(--o);font-size:clamp(28px,3.4vw,40px);line-height:1.05;font-weight:900;font-style:italic;letter-spacing:-.02em}",
    // Rounded white card; the purple panel sits inside it as its own rounded tile.
    ".card{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:8px;padding:8px;background:#fff;border:1px solid var(--line);border-radius:30px;box-shadow:0 1px 2px rgba(40,10,70,.04),0 20px 50px -12px rgba(40,10,70,.14)}",
    ".card.solo{grid-template-columns:1fr}",
    "svg{display:block;overflow:visible}",
    "svg .s{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}",
    "svg .l{fill:var(--lt)}svg .f{fill:var(--acc)}svg .b{fill:var(--ib)}",

    // Left: brand purple, like the Partnership Opportunities cards
    ".side{display:flex;flex-direction:column;justify-content:space-between;color:#fff;background:var(--p);border-radius:24px;padding:34px 30px 30px;--lt:rgba(255,255,255,.14);--acc:var(--o);--ib:var(--p)}",
    ".eyebrow{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#FFB27A;margin:0}",
    ".eyebrow span{color:rgba(255,255,255,.75);font-weight:600;letter-spacing:.06em}",
    "h2{font-size:clamp(28px,3vw,36px);line-height:1.04;margin:10px 0 12px;font-weight:900;font-style:italic;letter-spacing:-.02em}",
    ".lead{font-size:15.5px;line-height:1.55;margin:0;color:rgba(255,255,255,.88);max-width:36ch}",
    ".stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:26px 0 26px}",
    ".stat{padding:20px 18px 18px;border-radius:20px;background:rgba(0,0,0,.12)}",
    ".stat b{display:block;font-size:38px;line-height:1;font-weight:900;font-style:italic;letter-spacing:-.02em;font-variant-numeric:tabular-nums}",
    ".stat b i{color:#FF8A3D;font-style:italic}",
    ".stat span{display:block;margin-top:8px;font-size:13px;color:rgba(255,255,255,.8)}",
    ".steps{list-style:none;margin:0;padding:0;display:grid}",
    ".step{position:relative;display:grid;grid-template-columns:40px 1fr;gap:16px;padding-bottom:22px}.step:last-child{padding-bottom:0}",
    ".step:not(:last-child):after{content:'';position:absolute;left:19px;top:46px;bottom:6px;border-left:1.5px dashed rgba(255,255,255,.3)}",
    ".si{width:40px;height:40px}.si svg{width:40px;height:40px}",
    ".step small{display:block;font-size:11px;font-weight:800;letter-spacing:.12em;color:#FFB27A}",
    ".step b{display:block;font-size:16px;font-weight:800;margin-top:1px}.step span{display:block;font-size:13px;color:rgba(255,255,255,.78);line-height:1.4;margin-top:2px}",

    // Right: form
    "form{padding:26px 22px 22px 26px}",
    ".solo form{padding:26px}",
    ".fh{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}",
    "h3{font-size:22px;margin:0;font-weight:900;font-style:italic;letter-spacing:-.01em;color:var(--p)}.fh span{font-size:13px;color:#7a7486}",
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 12px}",
    ".full{grid-column:1/-1}",
    "label{display:grid;gap:6px;font-size:13px;font-weight:600;color:#4a4458}",
    "label i{font-style:normal;color:var(--o)}",
    "input,select,textarea{font-size:15px;padding:12px 14px;border:1.5px solid transparent;border-radius:14px;background:var(--field);color:#1d1d24;width:100%;transition:background .2s var(--ease),border-color .2s var(--ease),box-shadow .2s var(--ease)}",
    "input::placeholder,textarea::placeholder{color:#9b95a6}",
    "select{-webkit-appearance:none;appearance:none;padding-right:38px;cursor:pointer;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%236F2FA0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 15px center}",
    "textarea{resize:vertical}",
    "input:hover,select:hover,textarea:hover{background-color:#F0ECF5}",
    "input:focus,select:focus,textarea:focus{outline:none;background-color:#fff;border-color:var(--p);box-shadow:0 0 0 4px rgba(111,47,160,.12)}",
    "fieldset{border:0;padding:0;margin:0;min-width:0}legend{font-size:13px;font-weight:600;color:#4a4458;margin-bottom:8px;padding:0}",
    ".opts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}",
    ".opt{display:block;position:relative;cursor:pointer;font-weight:400}",
    ".opt input{position:absolute;opacity:0;width:1px;height:1px}",
    ".tile{display:grid;justify-items:start;align-content:start;gap:2px;height:100%;padding:14px 13px 13px;border:1.5px solid var(--line);border-radius:18px;background:#fff;color:var(--p);--lt:#F1E7FA;--acc:var(--o);--ib:#fff;transition:transform .25s var(--ease),border-color .25s var(--ease),background .25s var(--ease),box-shadow .25s var(--ease)}",
    ".ti{width:30px;height:30px;margin-bottom:6px}.ti svg{width:30px;height:30px;transform-origin:50% 70%}",
    ".tile b{font-size:13.5px;line-height:1.2;color:#1d1d24;font-weight:800}.tile small{font-size:12px;color:#7a7486;line-height:1.3}",
    ".opt:hover .tile{transform:translateY(-2px);border-color:#D9C6EC;box-shadow:0 10px 24px -10px rgba(111,47,160,.35)}",
    ".opt:active .tile{transform:scale(.98)}",
    ".opt:hover .ti svg,.opt input:checked+.tile .ti svg{animation:var(--a) .7s cubic-bezier(.3,1.4,.5,1)}",
    ".opt input:checked+.tile{border-color:var(--p);background:var(--p);--lt:rgba(255,255,255,.16);--ib:var(--p);color:#fff;box-shadow:0 10px 24px -10px rgba(111,47,160,.6)}",
    ".opt input:checked+.tile b{color:#fff}.opt input:checked+.tile small{color:rgba(255,255,255,.8)}",
    ".opt input:focus-visible+.tile{outline:2px solid var(--o);outline-offset:2px}",
    ".tick{position:absolute;top:10px;right:10px;width:20px;height:20px;border-radius:50%;background:var(--o);color:#fff;display:grid;place-items:center;transform:scale(0);transition:transform .3s cubic-bezier(.3,1.6,.5,1)}",
    ".tick svg{width:11px;height:11px}.tick .s{stroke-width:3.5}.opt input:checked+.tile .tick{transform:scale(1)}",
    ".consent{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:13px;color:#5d5866}",
    ".consent input{width:18px;height:18px;flex:none;margin:0;accent-color:var(--p)}",
    ".hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}",
    ".foot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:20px}",
    ".submit{display:inline-flex;align-items:center;gap:10px;background:var(--o);color:#fff;border:0;border-radius:999px;padding:15px 24px 15px 28px;font-size:15.5px;font-weight:800;cursor:pointer;box-shadow:0 10px 24px -8px rgba(238,106,26,.55);transition:transform .2s var(--ease),background .2s var(--ease),box-shadow .2s var(--ease)}",
    ".submit:hover{background:#E25F12;transform:translateY(-1px);box-shadow:0 14px 28px -8px rgba(238,106,26,.6)}",
    ".submit:active{transform:scale(.98)}",
    ".submit svg{width:18px;height:18px;transition:transform .2s var(--ease)}.submit .s{stroke-width:2.2}.submit:hover svg{transform:translateX(4px)}",
    ".submit:disabled{opacity:.65;cursor:wait;transform:none}",
    ".err{color:#B42318;font-size:13.5px;flex:1;min-width:200px}",
    // "Prefer to talk first?" sits under the button, where people decide.
    ".talk{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin-top:22px;padding-top:18px;border-top:1px solid var(--line);font-size:13.5px;color:#6b6577}",
    ".talk a{display:inline-flex;align-items:center;gap:7px;font-weight:800;text-decoration:none;color:var(--p);transition:background .2s var(--ease),transform .2s var(--ease)}",
    ".talk svg{width:17px;height:17px}",
    ".wa{background:#F3EBFA;padding:9px 15px;border-radius:999px}.wa:hover{background:#EADDF6;transform:translateY(-1px)}",
    ".em{border-bottom:1.5px solid #D9C6EC;padding-bottom:1px}.em:hover{border-color:var(--p)}",
    ".alt{font-size:13px;color:#5d5866;margin:14px 0 0}.alt a{color:var(--p);font-weight:700}",
    "form.sent{display:grid;place-items:center}",
    ".done{text-align:center;padding:40px 18px}.done b{display:block;font-size:24px;margin:14px 0 6px;color:var(--p);font-weight:900;font-style:italic}.done p{color:#5d5866;margin:0}.done .alt{margin-top:14px}",
    ".ok{width:64px;height:64px;margin:0 auto}.ok circle{fill:var(--o);transform-origin:center;animation:pop .5s cubic-bezier(.3,1.5,.5,1) both}",
    ".ok path{fill:none;stroke:#fff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:draw .45s .35s ease forwards}",

    // Reveal on scroll: fade up, draw the icon outlines then fill them, count the stats
    ".rv{opacity:0;transform:translateY(12px);transition:opacity .6s var(--ease),transform .6s var(--ease)}",
    ".in .rv{opacity:1;transform:none}",
    ".in .rv:nth-child(2){transition-delay:.06s}.in .rv:nth-child(3){transition-delay:.12s}.in .rv:nth-child(4){transition-delay:.18s}.in .rv:nth-child(5){transition-delay:.24s}",
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

    "@media (max-width:900px){.card{grid-template-columns:1fr}.side{padding:28px 24px 26px}.lead{max-width:none}.stats{grid-template-columns:repeat(4,1fr)}.steps{grid-template-columns:repeat(3,1fr);gap:16px}.step{grid-template-columns:1fr;gap:8px;padding:0}.step:after{display:none}form{padding:22px 18px 18px}}",
    // Phones: tighter spacing, short fields stay side by side, tile descriptions hidden.
    "@media (max-width:640px){.wrap{padding-bottom:28px}h2.title{margin-bottom:14px}.card{padding:6px;border-radius:26px;gap:6px}.side{border-radius:21px;padding:24px 20px 22px}h2{margin:8px 0 10px}.lead{font-size:14.5px}.stats{grid-template-columns:1fr 1fr;gap:6px;margin:20px 0 20px}.stat{padding:12px 14px;border-radius:15px}.stat b{font-size:27px}.steps{grid-template-columns:1fr;gap:0}.step{grid-template-columns:30px 1fr;gap:12px;padding-bottom:12px}.step:not(:last-child):after{display:block;left:14px;top:34px}.si,.si svg{width:30px;height:30px}.step div>span{display:none}form,.solo form{padding:20px 14px 16px}.fh{margin-bottom:14px}h3{font-size:20px}.grid{gap:12px 10px}.grid>label:not(.pair),.grid>fieldset{grid-column:1/-1}.opts{grid-template-columns:1fr 1fr}input,select,textarea{padding:11px 12px;font-size:16px}.tile{padding:12px 11px;border-radius:16px}.tile small{display:none}.ti{margin-bottom:4px}.submit{width:100%;justify-content:center}.talk{margin-top:18px;padding-top:14px}}",
    "@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}.si .s,.ti .s,.ok path{stroke-dashoffset:0}.si .l,.si .f,.ti .l,.ti .f{opacity:1}}",
  ].join("\n");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(n, suf) { return n.toLocaleString("en-US") + (suf ? "<i>" + suf + "</i>" : ""); }

  var side = !FULL ? "" :
    '<aside class="side">' +
    '<div class="rv"><p class="eyebrow">Season 2 · 16–17 Jan 2027 <span>· Dubai Silicon Oasis</span></p>' +
    '<h2>Partner with ActivateMe<sup style="font-size:.45em">®</sup> Fest</h2>' +
    '<p class="lead">Put your brand in front of 8,000+ active families over one weekend in Dubai.</p></div>' +
    '<div class="stats rv">' +
    STATS.map(function (s) { return '<div class="stat"><b data-to="' + s[0] + '" data-suf="' + esc(s[1]) + '">' + num(s[0], s[1]) + "</b><span>" + esc(s[2]) + "</span></div>"; }).join("") + "</div>" +
    '<ol class="steps rv">' +
    STEPS.map(function (s, i) { return '<li class="step"><span class="si">' + icon(ICONS[s[0]]) + "</span><div><small>0" + (i + 1) + "</small><b>" + esc(s[1]) + "</b><span>" + esc(s[2]) + "</span></div></li>"; }).join("") + "</ol></aside>";

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
    '<label class="pair"><span>Your name <i>*</i></span><input name="name" required maxlength="120" autocomplete="name"></label>' +
    '<label class="pair"><span>Your role</span><input name="role" maxlength="120" autocomplete="organization-title" placeholder="e.g. Founder"></label>' +
    '<label class="pair"><span>Email <i>*</i></span><input name="email" type="email" required maxlength="200" autocomplete="email"></label>' +
    '<label class="pair"><span>Phone / WhatsApp <i>*</i></span><input name="phone" type="tel" required maxlength="40" autocomplete="tel" placeholder="+971"></label>' +
    '<label class="full"><span>Anything else we should know?</span><textarea name="message" rows="2" maxlength="2000"></textarea></label>' +
    '<label class="hp" aria-hidden="true">Leave empty<input name="company_url" tabindex="-1" autocomplete="off"></label>' +
    '<label class="full consent"><input type="checkbox" name="consent" required>I agree that MWAN Events can contact me about partnering with ActivateMe® Fest.</label>' +
    '</div><div class="foot"><button class="submit" type="submit">Send application' + icon(ICONS.arrow) + '</button><div class="err" role="alert"></div></div>' +
    '<div class="talk"><span>Prefer to talk first?</span>' +
    '<a class="wa" href="' + WHATSAPP + '" target="_blank" rel="noopener">' + icon(ICONS.whatsapp) + "WhatsApp us</a>" +
    '<a class="em" href="mailto:stefanie@mwanevents.com">Email the team</a></div>' +
    "</form>";

  var host = document.getElementById("activateme-partner");
  if (!host) {
    host = document.createElement("div");
    host.id = "activateme-partner";
    if (script && script.parentNode && script.parentNode !== document.head) script.parentNode.insertBefore(host, script);
    else document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(host); });
  }
  var root = host.attachShadow({ mode: "open" });
  root.innerHTML = "<style>" + CSS + '</style><div class="wrap">' + (FULL ? '<h2 class="title">Ready to partner?</h2>' : "") +
    '<div class="card' + (FULL ? "" : " solo") + '">' + side + formHTML + "</div></div>";
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
