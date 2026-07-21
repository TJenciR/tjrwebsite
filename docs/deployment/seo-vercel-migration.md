# SEO and Vercel migration

Branch: `v0.12.0/seo-vercel-migration`  
Canonical production origin: `https://jenorichardtokoli.com`  
Legacy deployment: `https://tjrichard.netlify.app`

## Release boundary

This branch prepares code and documentation only. It does not attach either
custom-domain hostname to Vercel, change DNS, edit the Netlify deployment, or
remove the Netlify project. Production cutover requires explicit release
approval and an independently verified rollback owner.

Vercel should be connected to the repository as a Next.js project with npm and
Node.js 22. The production branch remains the approved release branch. Every
other Git branch, including this one, should create a Preview Deployment.
Vercel documents Preview and Production as separate environments and supplies
`VERCEL_ENV` and `VERCEL_URL` at build and runtime when system environment
variables are exposed:

- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/environment-variables/system-environment-variables

## Environment matrix

| Variable | Preview | Production | Notes |
|---|---|---|---|
| `VERCEL_ENV` | System value `preview` | System value `production` | Do not create manually. Drives robots metadata and the defense-in-depth `X-Robots-Tag`. |
| `VERCEL_URL` | System preview hostname | System deployment hostname | May describe runtime, but is never used for canonical or social URLs. |
| `DESIGN_SYSTEM_SHOWCASE` | `false` | `false` | Enable only for a temporary access-controlled QA deployment. |
| `CONTACT_DELIVERY_MODE` | `development` | `resend` | Preview validates without sending; production delivery must be explicitly enabled. |
| `RESEND_API_KEY` | Unset | Required secret | Server-only; never use a `NEXT_PUBLIC_` prefix. |
| `CONTACT_RECIPIENT_EMAIL` | Unset | Required secret | Private review destination; never place the value in source or logs. |
| `CONTACT_SENDER_EMAIL` | Unset | Required server value | Verified provider sender; never use a `NEXT_PUBLIC_` prefix. |

No environment variable controls the canonical origin. The verified typed
configuration is the single source of truth, preventing a preview hostname from
becoming canonical. Vercel environment changes apply only to new deployments,
so redeploy after editing a value.

## Preview indexing controls

Preview builds receive three aligned controls:

1. Metadata robots values use `noindex, nofollow`.
2. `/robots.txt` disallows `/` while still identifying the final canonical
   sitemap URL.
3. Every response adds `X-Robots-Tag: noindex, nofollow, noarchive` unless
   `VERCEL_ENV=production`.

Vercel also adds `X-Robots-Tag: noindex` to ordinary Preview Deployments by
default. The application-level header remains necessary defense in depth,
especially because Vercel notes that a custom domain assigned to a non-production
branch may not receive the platform header:

- https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines

## Canonical and structured-data policy

- Every indexable page has an absolute canonical URL on
  `jenorichardtokoli.com`.
- Every indexable page has a specific title, description, Open Graph URL, and social
  preview image.
- The sitemap includes eleven public page routes and ten project routes.
- `/robots.txt` references
  `https://jenorichardtokoli.com/sitemap.xml`.
- Global JSON-LD contains only accurate `Person` and `WebSite` fields.
- Project details include `BreadcrumbList` JSON-LD matching the visible
  Overview → Projects → project hierarchy.
- JSON-LD serialization escapes `<` before injection, following the Next.js
  guidance at https://nextjs.org/docs/app/guides/json-ld.
- Direct contact fields, employment, occupation, alumni status, graduation,
  awards, ratings, testimonials, and unverified social profiles are absent.

## Security headers

Headers are configured through `next.config.ts` for all routes. The Content
Security Policy intentionally limits navigation and embedding directives only;
fetch directives remain unset so self-hosted images/fonts, Next.js scripts,
the server-side contact provider, and Vercel preview tooling are not accidentally
blocked.

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | `base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'` | Prevents base-tag injection, cross-origin form targets, framing, and plugin objects without constraining required fetches. |
| `Permissions-Policy` | Disables camera, geolocation, microphone, payment, USB, and browsing topics | The portfolio does not need these browser capabilities. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Retains same-origin debugging context while limiting cross-origin path disclosure. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Enforces HTTPS for the canonical host and `www`; `preload` is intentionally deferred until post-cutover validation. |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type guessing. |
| `X-DNS-Prefetch-Control` | `off` | Avoids speculative resolution of external destinations. |
| `X-Frame-Options` | `DENY` | Legacy clickjacking defense alongside CSP `frame-ancestors`. |
| `X-XSS-Protection` | `0` | Disables obsolete browser filters that can create unsafe transformations. |
| `X-Robots-Tag` | `noindex, nofollow, noarchive` outside production | Prevents preview and local production builds from being indexed. |

Retired qualification-document responses additionally use `410 Gone`,
`Cache-Control: no-store`, and `X-Robots-Tag: noindex, noarchive`.

## Legacy route disposition

| Legacy path | Vercel behavior | Rationale |
|---|---|---|
| `/`, `/about`, `/work`, `/documents` | Preserved, 200 | Indexed legacy page paths remain directly available. |
| `/about.html`, `/work.html`, `/documents.html` | Permanent 308 to extensionless route | One-hop canonical normalization; query strings are retained by Next.js. |
| `/CV.pdf` | Permanent 308 to `/resume` | The public HTML résumé is sanitized; the contact-bearing PDF is not copied. |
| Four qualification PDF paths | 410 Gone | Intentional privacy removal pending ownership, metadata, and publication approval. |
| Six `/download/*.zip` paths | Temporary 307 directly to the Netlify artifact | Preserves access and rollback during migration without copying large or unreviewed archives. |
| `/styles.css`, `/sidebar.js` | Intentional 404 | Legacy implementation details are not indexed content and are no longer required by any preserved page. |
| Unknown paths | 404 | Truthful not-found behavior is retained. |

The `www` hostname permanently redirects to the apex hostname while retaining
path and query. HTML aliases and the résumé path have explicit one-step `www`
rules so hostname and path normalization do not form a redirect chain. Legacy
downloads go directly to their temporary Netlify destination in one hop.

## Netlify URL plan

Current decision: **leave the Netlify site unchanged as the production and
rollback source throughout preview testing**.

Recommended release sequence, only after approval:

1. Record the active Netlify deploy identifier, ownership, DNS state, and a
   tested rollback operator. Do not delete or overwrite the deploy.
2. Validate the Vercel Preview Deployment by its deployment URL. Exercise a
   production-context build with Production environment variables without
   promoting it to the current Production Deployment.
3. Attach the apex and `www` domains to Vercel and verify apex canonicalization,
   headers, forms, sitemap, and every legacy route.
4. Keep the Netlify site alias available for rollback. During the monitoring
   window, prefer a temporary migration notice with `noindex` and a link to the
   canonical site over an immediate redirect.
5. After the monitoring window and separate approval, replace the notice with
   a path-preserving permanent redirect from the Netlify URL to the canonical
   domain.

If rollback is required before step 5, restore DNS to the recorded Netlify
configuration. After a Netlify-wide redirect is enabled, rollback also requires
restoring the preserved Netlify deploy/configuration, so the site and deploy
history must not be removed.

## Cutover checklist

- Production HTML has canonical, Open Graph, and JSON-LD URLs on the apex host.
- Preview HTML and headers are non-indexable.
- `www` preserves paths and queries in one redirect where an explicit final
  mapping exists.
- Sitemap and robots responses use the canonical origin.
- The sanitized web résumé is the only résumé served by Vercel.
- `.private/` remains ignored and the original CV is not tracked or staged.
- Direct contact values are absent from HTML, metadata, JSON-LD, sitemap, and
  social images.
- Contact development and provider-failure states are verified before enabling
  production delivery.
- Netlify rollback ownership and DNS instructions are recorded outside the
  public repository.
