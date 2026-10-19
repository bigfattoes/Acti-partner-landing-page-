ActivateMe® Partner Form – API details

What the form sends, what to check, and what to reply. Prepared by Aseel
(Marketing).

**Good news:** Reporting → **Become a Partner** already has First Name,
Last Name, Email, Company Name, Mobile Number, Designation and Created
date. The form now uses the same fields, so it could feed that report
directly. It just needs a few **new columns** for the extra questions
(marked below).

1\. How it works

1.  Someone fills in the partner form on activatemefest.com.

2.  Their browser sends one POST request with the answers as JSON
    (Content-Type: application/json) to your endpoint. No login needed,
    it's a public form.

3.  Your API checks it, saves it in the **Become a Partner** report for
    ActivateMe® Fest, and replies ok or not ok + message. The form then
    shows a thank-you or the error message.

If an API already feeds the Become a Partner report, the form can use
that one. Otherwise the address is up to you, e.g.
https://events.mwancloud.com/api/partner-applications.

2\. Allowed domains

Accept only requests whose Origin header is one of:

- https://www.activatemefest.com

- https://activatemefest.com

- https://activateme.dev.mwancloud.com (staging)

Anything else: reply 403 and don't save. Because the request comes from
the browser, the API also needs to answer the browser's OPTIONS check
(CORS) for these domains with Access-Control-Allow-Origin: \<origin\>,
Access-Control-Allow-Methods: POST, OPTIONS and
Access-Control-Allow-Headers: Content-Type, and add
Access-Control-Allow-Origin to every POST reply too, errors included.

Note: the domain check stops other websites, but scripts can fake it, so
please also add a rate limit (about 10 requests per minute per IP) and
keep the spam trap below.

3\. Inputs

| **Field**         | **Required** | **Rules**                                                | **Report column**          |
|-------------------|--------------|----------------------------------------------------------|----------------------------|
| event             | Yes          | Event alias. Only activate-me-festival for now           | (which event)              |
| first_name        | Yes          | Up to 60 characters                                      | First Name                 |
| last_name         | Yes          | Up to 60                                                 | Last Name                  |
| email             | Yes          | Valid email, up to 200                                   | Email                      |
| company_name      | Yes          | Organisation name, up to 150                             | Company Name               |
| mobile_number     | Yes          | Phone / WhatsApp, at least 7 digits, up to 40            | Mobile Number              |
| designation       | No           | Their role, up to 120                                    | Designation                |
| organisation_type | Yes          | One of the type options below                            | **New column**             |
| interests         | No           | List, any of the interest options below                  | **New column**             |
| activity          | No           | What they do, up to 150                                  | **New column**             |
| website           | No           | Website or Instagram, up to 300                          | **New column**             |
| message           | No           | Free text, up to 2000                                    | **New column**             |
| consent           | Yes          | Must be true (agreed to be contacted)                    | **New column** (with date) |
| page              | No           | Page the form was sent from                              | Optional                   |
| company_url       | No           | Hidden spam trap. Real people leave it empty. Don't save | \-                         |

**Type options:** Academy / club · Brand / sponsor · Performer / speaker
· School / community group · Other

**Interest options:** Title Sponsor · Event Sponsorships · Interactive
Booths · Community Programs

4\. Example request

> POST /api/partner-applications
>
> Origin: https://www.activatemefest.com
>
> Content-Type: application/json
>
> {
>
> "event": "activate-me-festival",
>
> "first_name": "Sara",
>
> "last_name": "Ahmed",
>
> "email": "sara@example.com",
>
> "company_name": "Little Kickers Dubai",
>
> "mobile_number": "+971 50 123 4567",
>
> "designation": "Founder",
>
> "organisation_type": "Academy / club",
>
> "interests": \["Title Sponsor", "Interactive Booths"\],
>
> "activity": "Kids football academy, ages 4-14",
>
> "website": "@littlekickersdxb",
>
> "message": "We'd love a booth on both days.",
>
> "consent": true,
>
> "page": "/partner-with-us",
>
> "company_url": ""
>
> }

5\. Checks the API should do

The form already checks these, but the API should check again since
browser checks can be skipped:

1.  Domain is allowed, otherwise 403.

2.  If company_url is filled in, it's a bot: reply ok but don't save.

3.  first_name, last_name, company_name, organisation_type, email
    (valid), mobile_number (7+ digits) and consent = true are present,
    otherwise 400.

4.  Unknown organisation_type → save as Other. Unknown interests →
    ignore.

5.  Trim text and cut to the max lengths. Store as plain text.

6\. Responses

The form shows the error text to the person, so keep it short and
friendly.

| **Case**                 | **Status** | **Reply**                                                                                                        |
|--------------------------|------------|------------------------------------------------------------------------------------------------------------------|
| Saved (or spam trap)     | 200        | {"ok": true}                                                                                                     |
| Missing / invalid fields | 400        | {"ok": false, "error": "Please fill in your organisation, first and last name, a valid email and phone number."} |
| Consent not ticked       | 400        | {"ok": false, "error": "Please tick the consent box."}                                                           |
| Domain not allowed       | 403        | {"ok": false, "error": "Origin not allowed"}                                                                     |
| Too many attempts        | 429        | {"ok": false, "error": "Too many attempts. Please wait a minute."}                                               |
| Server problem           | 500        | {"ok": false, "error": "Applications aren't available right now."}                                               |

7\. What to save and show

- **Save:** in the Become a Partner report, with the new columns above,
  plus the website it came from, **status** (New by default) and
  **notes**. No need to keep IP addresses.

- **In the report:** change status (New / Contacted / Interested /
  Joined / Declined), add notes, filter by status, export to Excel,
  delete (spam or data-removal requests). Team logins only.

- **Nice to have:** when an application is marked Joined, one click to
  add it to the General Database of partners.

8\. Next step

Once the endpoint is ready, send me its address and I'll point the form
to it. Nothing else changes on the website.
