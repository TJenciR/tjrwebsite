# Contact-request workflow

## Product boundary

Contact Access is a request form for legitimate professional contact. It is not
authentication, a login, a member account, automatic approval, or a mechanism
that reveals direct contact details. Every request is reviewed manually.

The public form collects a full name, professional email, company or
organization, opportunity type, message, optional role-description URL, consent,
and a visually hidden honeypot. The route rejects unknown fields and validates
all submitted values on the server.

## Provider decision

The selected delivery provider is [Resend](https://resend.com/docs/api-reference/emails/send-email),
called through its HTTPS API rather than its SDK.

Reasons:

- Resend provides a small transactional email API and documents Next.js and
  Vercel usage directly.
- The built-in server `fetch` API is sufficient, so no email SDK is added to the
  client or server dependency graph.
- The recipient, sender, and provider key remain server-only environment values.
- A plain-text notification is enough; templates, attachments, tracking, and a
  contact database are unnecessary.

Required production environment variables:

| Variable | Purpose |
|---|---|
| `CONTACT_DELIVERY_MODE=resend` | Explicitly enables real delivery. |
| `RESEND_API_KEY` | Server-only Resend credential. |
| `CONTACT_RECIPIENT_EMAIL` | Server-only destination reviewed by Richard. |
| `CONTACT_SENDER_EMAIL` | Verified sender identity configured in Resend. |

None of these values may use the `NEXT_PUBLIC_` prefix. The recipient must never
be placed in source, browser responses, logs, screenshots, or test fixtures.

### Development behavior

`CONTACT_DELIVERY_MODE=development` validates and accepts requests but does not
call Resend, persist the request, or log its message. This is the default outside
Vercel production. Vercel production fails closed unless the mode is explicitly
set to `resend` and all provider variables exist.

### Failure behavior

Configuration errors, timeouts, non-successful provider responses, and network
errors are mapped to a generic provider-unavailable response. The browser does
not receive provider response bodies, stack traces, credentials, or the recipient
address. Automatic retries are intentionally omitted to avoid duplicate mail;
the visitor may retry manually.

## Rate limiting

Production and preview deployments use Vercel WAF through the
[`@vercel/firewall` rate-limiting SDK](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk).
This provides distributed counters suitable for Vercel functions without adding
a submissions database.

Configure a published Vercel Firewall rule before enabling the form:

1. Create a rule whose condition is `@vercel/firewall`.
2. Use the rate-limit ID `contact-request`.
3. Apply a fixed limit of 3 requests per 10 minutes, keyed by request IP.
4. Publish the rule to production and configure preview support as described by
   Vercel when preview testing is required.

The route calls this rule before parsing or delivering a request. A limited
request receives HTTP 429 and a generic retry message. If the production
rate-limit service cannot be checked, the route fails closed with a generic
server error. A bounded in-memory limiter exists only for local development and
tests; it is not represented as production protection.

Vercel documents that WAF counters are regional. The low limit, honeypot, strict
validation, and provider controls are defense in depth; deployment owners should
monitor abuse and adjust the firewall rule when evidence supports a change.

## Server processing

- Accept JSON only and cap the request body before parsing.
- Reject missing, invalid, oversized, or unexpected fields.
- Trim single-line fields, normalize email casing, normalize message line endings,
  and allow only `http` or `https` role URLs without embedded credentials.
- Treat a filled honeypot as a successful no-op so bots do not learn the trap.
- Do not log request bodies, full messages, provider bodies, or private settings.
- Send plain text only and set the requester address as `Reply-To`.
- Return a small typed result containing only public state and validation errors.

## Data handling

The portfolio does not store contact requests in a database. In real-delivery
mode, the submitted fields are transferred to Resend for delivery to the private
review inbox. They are used only to review and respond to the professional
request. Direct contact information is never returned after submission, and no
automatic contact access is granted.
