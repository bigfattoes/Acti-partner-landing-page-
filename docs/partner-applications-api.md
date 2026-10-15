# Partner Applications API – specification

For the Mwan Events platform team. This describes what the ActivateMe® partner form sends, how the
endpoint should validate it, and what it should reply. The form is already built and tested; once the
endpoint exists, the form is pointed at it and nothing else changes for visitors.

## 1. How it works

1. A visitor fills in the partner form on the ActivateMe® Fest website (Partner page).
2. The visitor's browser sends one `POST` request with a JSON body to the platform endpoint.
3. The endpoint checks where the request came from, validates the fields, and saves the application
   under the ActivateMe® Fest event.
4. The endpoint replies with a small JSON object. The form shows a thank-you message, or the error
   text from the reply.

The request comes directly from the visitor's browser (not from a server), so the endpoint must
support CORS (section 3).

## 2. Endpoint

| | |
|---|---|
| Method | `POST` |
| URL | Chosen by the platform team, e.g. `https://events.mwancloud.com/api/partner-applications` |
| Request body | JSON, `Content-Type: application/json` |
| Authentication | None (public form). Protected by the domain allowlist, validation and rate limiting below |

## 3. Domain validation and CORS

**Allowed domains (origins):**

- `https://www.activatemefest.com`
- `https://activatemefest.com`
- `https://activateme.dev.mwancloud.com` (staging, for testing)

**Rules:**

- Read the `Origin` request header. If it is not in the list, reject with `403` and do not save.
- Because the body is JSON, browsers first send an `OPTIONS` "preflight" request. For an allowed
  origin, answer it with `204` and:
  - `Access-Control-Allow-Origin: <the request's Origin>`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type`
  - `Access-Control-Max-Age: 86400`
  - `Vary: Origin`
- Include `Access-Control-Allow-Origin: <Origin>` and `Vary: Origin` on the `POST` response too,
  including error responses, or the browser hides the reply from the form.

**Note:** the `Origin` check stops other websites from sending applications through visitors'
browsers, but a script outside a browser can fake the header. That's why we also recommend the
extra protection in section 6.

## 4. Request payload

| Field | Type | Required | Rules | Example |
|---|---|---|---|---|
| `event` | string | yes | Event alias. Accept only known aliases (currently `activate-me-festival`) | `"activate-me-festival"` |
| `org` | string | yes | Organisation name. Trim; 1–150 characters | `"Little Kickers Dubai"` |
| `type` | string | yes | One of the type options below | `"Academy / club"` |
| `activity` | string | no | What they do. Max 150 | `"Kids football academy, ages 4–14"` |
| `interests` | array of strings | no | Zero or more of the interest options below; ignore anything else | `["Title Sponsor", "Interactive Booths"]` |
| `name` | string | yes | Contact person. Trim; 1–120 | `"Sara Ahmed"` |
| `role` | string | no | Max 120 | `"Founder"` |
| `email` | string | yes | Valid email format. Max 200 | `"sara@example.com"` |
| `phone` | string | yes | Phone / WhatsApp. Max 40; at least 7 digits | `"+971 50 123 4567"` |
| `website` | string | no | Website URL or Instagram handle. Max 300 | `"@littlekickersdxb"` |
| `message` | string | no | Free text. Max 2000 | `"We'd love a booth on both days."` |
| `consent` | boolean | yes | Must be `true` ("I agree that MWAN Events can contact me…") | `true` |
| `page` | string | no | Page path the form was sent from. Max 200 | `"/partner-with-us"` |
| `company_url` | string | no | **Spam trap.** Hidden field; real people leave it empty (see section 6) | `""` |

**Type options** (`type`):
`Academy / club`, `Brand / sponsor`, `Performer / speaker`, `School / community group`, `Other`

**Interest options** (`interests`), matching the Partnership Opportunities cards on the site:
`Title Sponsor`, `Event Sponsorships`, `Interactive Booths`, `Community Programs`

**Example request:**

```http
POST /api/partner-applications HTTP/1.1
Host: events.mwancloud.com
Origin: https://www.activatemefest.com
Content-Type: application/json

{
  "event": "activate-me-festival",
  "org": "Little Kickers Dubai",
  "type": "Academy / club",
  "activity": "Kids football academy, ages 4–14",
  "interests": ["Title Sponsor", "Interactive Booths"],
  "name": "Sara Ahmed",
  "role": "Founder",
  "email": "sara@example.com",
  "phone": "+971 50 123 4567",
  "website": "@littlekickersdxb",
  "message": "We'd love a booth on both days.",
  "consent": true,
  "page": "/partner-with-us",
  "company_url": ""
}
```

## 5. Validation (server side)

The form already checks these in the browser, but the server must check them again, because
browser checks can be bypassed.

1. `Origin` is allowed (section 3), otherwise `403`.
2. Body is valid JSON, otherwise `400`.
3. If `company_url` is not empty, it's a bot: reply `200 {"ok": true}` but **do not save**.
4. `event` is a known alias, otherwise `400`.
5. `org`, `name` present after trimming; `email` valid; `phone` has at least 7 digits;
   otherwise `400` with a message listing what's missing.
6. `consent` is exactly `true`, otherwise `400`.
7. `type` not in the list → store `Other`. `interests` → keep only values from the list.
8. Trim all strings and cut them to the maximum lengths. Store as plain text; escape when
   displaying in the admin.

## 6. Spam protection (recommended)

- **Rate limit:** about 10 requests per minute per IP address; above that reply `429`.
- **Spam trap:** the hidden `company_url` field (section 5, step 3).
- **Optional, later:** if spam becomes a problem, add a captcha (e.g. Google reCAPTCHA or Cloudflare
  Turnstile). The form would then send one extra token field for the server to verify.

## 7. Responses

The form shows the `error` text to the visitor, so please keep it short and human-friendly.

| Case | Status | Body |
|---|---|---|
| Saved (or spam trap hit) | `200` | `{"ok": true}` |
| Invalid / missing fields | `400` | `{"ok": false, "error": "Please fill in your organisation, name, a valid email and phone number."}` |
| Consent not given | `400` | `{"ok": false, "error": "Please tick the consent box."}` |
| Origin not allowed | `403` | `{"ok": false, "error": "Origin not allowed"}` |
| Too many requests | `429` | `{"ok": false, "error": "Too many attempts. Please wait a minute."}` |
| Server problem | `500` / `503` | `{"ok": false, "error": "Applications aren't available right now."}` |

The form treats any reply without `"ok": true` as a failure and shows `error` (or a generic
message with the team's email address if there is none).

## 8. What to store

Everything from section 4 (except `company_url`), plus:

| Field | Notes |
|---|---|
| `id` | Auto |
| `event` | Link to the ActivateMe® Fest event |
| `received_at` | Server time of submission (shown in Dubai time) |
| `source_site` | Host from the `Origin` header, e.g. `www.activatemefest.com` |
| `consent_at` | Same as `received_at`; record that consent was given and when |
| `status` | `New` by default; then `Contacted`, `Interested`, `Joined`, `Declined` |
| `notes` | Free text for the team |

We suggest not storing IP addresses, or deleting them after a short time; they're only needed
for rate limiting.

## 9. Admin section ("Partner Applications" inside the event)

What the team needs, mirroring the temporary leads page used for testing:

- List of applications, newest first: date, organisation, type, interests, contact name, role,
  email, phone, website/Instagram, message, status.
- Change status and add notes per application.
- Filter by status.
- Export to spreadsheet (CSV / Excel).
- Delete an application (for spam, or if someone asks for their data to be removed).
- Access limited to the team's platform accounts.

**Nice to have:** when an application is marked `Joined`, a button to copy it into the General
Database of partners (name, website, email, phone, partner type), so nobody retypes it.

## 10. Switching the form over

Once the endpoint is live, the embed code on the Partner page gets one extra attribute:

```html
<div id="activateme-partner"></div>
<script src="https://acti-partner-landing-page.activateme-assistant.workers.dev/partner-form.js"
        data-endpoint="https://events.mwancloud.com/api/partner-applications" defer></script>
```

(Or the form's default address is changed on our side, so the embed code stays the same.) The
script file only contains the form's design and code; it stores no personal data. The platform team
can also host the file themselves if preferred.

The temporary Cloudflare database and leads page will then be switched off.
