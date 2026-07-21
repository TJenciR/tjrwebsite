# Production release checklist

Release branch: `v1.0.0/production-cutover`  
Canonical origin: `https://jenorichardtokoli.com`  
Legacy rollback origin: `https://tjrichard.netlify.app`  
Evidence snapshot: 2026-07-21 (Europe/Bucharest)

## Release decision

**HOLD — do not change apex DNS or redirect Netlify yet.** The codebase is ready
for final verification, but the content, Vercel settings, contact production
configuration, downloadable sanitized résumé, and rollback evidence below are
not all complete. An unchecked item is a release blocker unless it explicitly
says that it is an optional post-release task.

Use an evidence link, deployment ID, screenshot location, or named approver in
each item. Never paste environment-variable values, submitted form content, the
private résumé source, a direct email address, or a telephone number here.

## Confirmed baseline

- GitHub repository: `TJenciR/tjrwebsite`; the connected repository reports
  `main` as its default branch.
- Local `main`, `origin/main`, and the audited branch base were all at commit
  `592e964a6b5314071f8d65703487f635144db1a4` when this checklist was created.
- GitHub reported a successful Vercel status for that `main` commit and for the
  feature-branch parent. This proves the integration can deploy both kinds of
  commit; it does **not** prove the Vercel Production Branch setting or any
  environment-variable value.
- The application canonical origin is fixed to the apex domain. Vercel preview
  URLs cannot become canonical, and non-production Vercel environments receive
  metadata, robots, and header-level `noindex` controls.
- The custom 404 and runtime error recovery states do not expose error details.
- The legacy Netlify origin remains live over HTTPS and has not been redirected.
- Current public DNS before cutover:
  - apex A records: `13.248.243.5` and `76.223.105.230`;
  - `www` CNAME: `804fe376049b7377.vercel-dns-017.com`;
  - the apex currently responds from GoDaddy (`Server: DPS/2.0.0`);
  - `www` currently responds from Vercel with a 308 redirect to the apex;
  - HTTP currently upgrades through Vercel, but the HTTPS apex still serves the
    GoDaddy site. Treat this split behavior as incomplete cutover evidence.

## Required environment variables

| Variable | Preview | Production | Release evidence |
|---|---|---|---|
| `DESIGN_SYSTEM_SHOWCASE` | `false` | `false` | [ ] Names and scopes reviewed; no value copied here. |
| `CONTACT_DELIVERY_MODE` | `development` | `resend` | [ ] Preview cannot deliver; Production is explicitly enabled. |
| `RESEND_API_KEY` | Unset | Required sensitive value | [ ] Present only in Production and marked sensitive. |
| `CONTACT_RECIPIENT_EMAIL` | Unset | Required sensitive value | [ ] Present only in Production; value not recorded here. |
| `CONTACT_SENDER_EMAIL` | Unset | Required server-only value | [ ] Verified provider sender; value not recorded here. |
| `VERCEL_ENV` | Vercel system value | Vercel system value | [ ] System environment variables are exposed. Do not create manually. |
| `VERCEL_URL` | Vercel system value | Vercel system value | [ ] Do not create manually and never use as canonical. |

No variable may use a `NEXT_PUBLIC_` prefix. Environment changes apply to new
deployments, so create a fresh deployment after any correction.

## Content release blockers

- [ ] Richard has confirmed the Babeș-Bolyai University status, programme
  wording, and any publishable dates. The current model deliberately says the
  status is unknown and does not claim graduation.
- [ ] Richard has approved a professional title, short biography, long
  biography, availability, technical interests, development approach, and
  learning approach. The current site shows explicit pending-confirmation
  states rather than fabricated copy.
- [ ] Every project status has been reviewed. Flower Growth Simulator, Basic
  OCR, and Spam Filter remain unknown; Space Invaders Type Shooter Game is
  marked incomplete from legacy evidence. The other six status values match the
  verified inventory.
- [ ] Publishable project descriptions have been approved. All ten project
  narratives currently remain withheld; no outcome, benchmark, responsibility,
  lesson, date, implemented scope, or planned scope has been invented.
- [ ] Repository and live-demo links have been supplied or explicitly confirmed
  absent for all ten projects. None is currently published.
- [ ] A standalone portrait has been approved for public use, ownership, crop,
  and metadata. The current portrait is an intentional placeholder.
- [ ] A sanitized downloadable résumé has been reviewed and placed at the exact
  approved public path. The web résumé is sanitized, but no downloadable PDF is
  currently published and the UI says so.
- [ ] Social profiles have been confirmed. GitHub and LinkedIn are absent; the
  legacy Facebook and Instagram URLs remain draft and are not published.
- [ ] Every still-relevant question in
  `docs/audit/questions-for-richard.md` has an answer or an explicit decision to
  defer it. No unresolved placeholder may be silently changed to verified.

## 1. Verify final Vercel preview

- [ ] Record the commit SHA, immutable Preview Deployment URL and ID, build log
  result, reviewer, and review date.
- [ ] Confirm the preview corresponds exactly to this branch and uses Node.js 22,
  npm, the Next.js preset, and repository root as its Root Directory.
- [ ] Confirm the preview response includes `X-Robots-Tag: noindex, nofollow,
  noarchive`, `/robots.txt` disallows `/`, and canonical links still point to
  `https://jenorichardtokoli.com`.

Evidence: ________________________________________________

## 2. Verify all content

- [ ] Close or explicitly defer every content blocker above with Richard's
  approval and record the verified source/date in the typed content model.
- [ ] Review every page against `docs/audit/content-inventory.md` and
  `docs/audit/content-conflicts.md`; do not infer dates, skill levels, project
  outcomes, or professional titles.

Evidence/approver: _______________________________________

## 3. Verify desktop, tablet, and mobile

- [ ] Check 1440px, 1280px, 768px, 390px, and 320px widths on the final preview.
- [ ] Check expanded/collapsed desktop navigation, mobile drawer, project
  filters, command composer, résumé print preview, contact states, images, and
  absence of horizontal overflow.

Evidence: ________________________________________________

## 4. Verify accessibility

- [ ] Complete keyboard-only navigation, visible-focus, skip-link, focus trap,
  focus restoration, dialog labelling, heading order, form errors, contrast,
  200% zoom, and screen-reader smoke checks.
- [ ] Confirm reduced-motion disables nonessential transitions and animation.

Evidence/reviewer: _______________________________________

## 5. Verify contact submission

- [ ] Confirm the Vercel Firewall rule `contact-request` is published with the
  documented limit and test allowed, invalid, honeypot, rate-limited, provider
  unavailable, and generic-error states.
- [ ] Send one non-sensitive Production test request after explicit approval;
  verify manual receipt, no automatic access, and no direct contact detail in
  the browser response.
- [ ] Review Vercel runtime logs and Resend delivery logs by metadata only.
  Confirm the application emits no full form message, requester address,
  recipient value, provider body, key, or stack trace.

Evidence: ________________________________________________

## 6. Verify sanitized résumé

- [ ] A human has compared the downloadable artifact with the public content
  model and confirmed that it contains no private email or private telephone.
- [ ] Record the public filename, checksum, approval date, owner, download result,
  print result, and missing-file fallback result.
- [ ] Confirm the original source PDF is absent from Git, `public/`, `.next/`,
  build artifacts, deployment artifacts, and CI artifacts.

Evidence: ________________________________________________

## 7. Record current Netlify deployment and rollback URL

- [ ] Record Netlify site owner, site/project ID, immutable currently published
  deploy ID/URL, build settings, publish directory, environment names (not
  values), and the working rollback URL.
- [ ] Export or screenshot the deploy settings into an approved private release
  record. Do not place private configuration in this repository.

Evidence: ________________________________________________

## 8. Record existing DNS configuration

- [ ] Export the complete pre-cutover DNS zone, including nameservers, TTLs,
  apex, `www`, MX, TXT, CAA, and any verification records, to an approved private
  release record.
- [ ] Reconcile that export with the public snapshot above and identify the DNS
  owner who can perform and reverse the change.

Evidence/DNS owner: ______________________________________

## 9. Add the custom domain to Vercel

- [ ] In the intended Vercel team/project, verify the Git repository connection
  and confirm `main` is the Production Branch in Settings → Environments →
  Production → Branch Tracking.
- [ ] Add both apex and `www`, choose the apex as canonical, and copy the exact
  project-specific DNS values Vercel reports. Do not use generic example values.

Evidence: ________________________________________________

## 10. Apply required DNS records

- [ ] Obtain release approval, then change only the records required by Vercel.
  Preserve all unrelated mail, verification, and service records.
- [ ] Record before/after values, TTL, change time, operator, and ticket. The
  current apex records are rollback inputs, not a recommendation for the new
  destination.

Evidence/change record: __________________________________

## 11. Wait for certificate issuance

- [ ] Wait for DNS verification and Vercel-managed certificate issuance for both
  apex and `www`; do not bypass browser certificate warnings.
- [ ] Verify certificate names, validity, chain, automatic renewal state, and
  HTTPS responses from at least two networks/resolvers.

Evidence: ________________________________________________

## 12. Verify www and apex behavior

- [ ] Confirm HTTPS apex returns the redesigned production deployment.
- [ ] Confirm HTTP upgrades to HTTPS and `www` redirects once to the apex while
  preserving path and query string. Check representative legacy aliases and
  ensure there is no redirect loop or chain.

Evidence: ________________________________________________

## 13. Verify canonical redirect

- [ ] On every primary page and a project detail, confirm the canonical hostname
  is exactly `jenorichardtokoli.com`; preview and `vercel.app` hostnames must not
  appear in canonical, Open Graph, sitemap, résumé, sharing, or JSON-LD URLs.
- [ ] Confirm the host redirect does not alter the path or query.

Evidence: ________________________________________________

## 14. Verify sitemap and robots

- [ ] Confirm Production `/robots.txt` allows crawling and references
  `https://jenorichardtokoli.com/sitemap.xml`.
- [ ] Confirm the sitemap returns 200, contains only intentional canonical URLs,
  includes all public routes/project routes, and excludes the design-system
  showcase, API route, retired documents, and placeholders.

Evidence: ________________________________________________

## 15. Verify analytics if configured

- [ ] Current repository review found no analytics integration. Record “not
  configured” as the approved release state, or separately review consent,
  privacy, script cost, raw command-text handling, and production-only settings
  before enabling any provider.

Evidence/decision: _______________________________________

## 16. Verify search-engine ownership

- [ ] Record the verified owner for the apex property in the selected search
  engine consoles without committing verification secrets.
- [ ] Submit the canonical sitemap only after cutover health checks pass. Do not
  request indexing for previews or the development-only showcase.

Evidence: ________________________________________________

## 17. Keep Netlify deployment intact during monitoring

- [ ] Do not delete the Netlify site, deploy history, files, domain record, or
  account access during the agreed monitoring window.
- [ ] Monitor Vercel errors, 404s, contact failures, Web Vitals, DNS, certificate,
  and key journeys. Record owner, alert path, and monitoring window.

Evidence/window: _________________________________________

## 18. Redirect the Netlify URL only after approval

- [ ] Keep `https://tjrichard.netlify.app` as the working rollback origin until
  explicit post-monitoring approval selects archive, migration notice, or
  path-preserving redirect behavior.
- [ ] Before any Netlify redirect, replace the six Vercel download fallbacks;
  otherwise they can form loops or lose the legacy archives.

Approval/evidence: _______________________________________

## 19. Monitor production errors

- [ ] Check Vercel Functions, routing, build, and contact-provider metadata
  without opening or sharing sensitive form content. Confirm no application
  `console` statement logs request bodies or provider payloads.
- [ ] Record baseline/error counts and inspect custom 404, invalid project, 410
  retired-document, contact 429/503, and runtime recovery behavior.

Evidence: ________________________________________________

## 20. Document rollback procedure

- [ ] Run a tabletop rollback with the DNS, Netlify, Vercel, contact, and Git
  owners below. Record access availability and an expected recovery time.
- [ ] Keep this checklist and the private release record updated with immutable
  deploy IDs and commit SHAs; never rely only on “latest”.

Evidence/approver: _______________________________________

## Rollback procedure

Trigger rollback for a privacy exposure, broken primary route, widespread 5xx,
failed contact privacy boundary, bad canonical/indexing behavior, certificate
failure, or another release-owner decision. Announce the rollback and preserve
evidence; do not publish submitted form content.

### Restore the previous DNS destination

1. Use the private pre-cutover DNS export from items 8 and 10. Restore the exact
   previous apex and `www` values and TTLs through the current DNS provider; do
   not replace or remove MX, TXT, CAA, or unrelated service records.
2. Confirm propagation from multiple resolvers, then verify HTTPS, apex, `www`,
   paths, and queries. The 2026-07-21 public apex snapshot was
   `13.248.243.5`/`76.223.105.230`, but the signed release export is authoritative.

### Re-enable the Netlify production deployment

1. Use the recorded site/project and immutable deploy ID from item 7. If a
   migration notice or redirect was enabled, remove it using the recorded
   pre-change settings and republish the recorded last-known-good deploy.
2. Verify the immutable deploy URL first, then the Netlify site URL. Keep the
   Vercel project available for diagnosis; do not delete either provider.

### Roll back to the prior Vercel deployment

1. In Vercel Deployments, filter to `main`, select the recorded last-known-good
   production deployment, and use Instant Rollback. Confirm the custom domains
   now serve that exact deployment ID.
2. Vercel disables automatic production-domain assignment after an Instant
   Rollback. When the incident is resolved, deliberately promote the approved
   deployment to re-enable normal assignment; do not assume the next push will
   replace the rolled-back deployment.

### Disable the contact route safely

1. Set Production `CONTACT_DELIVERY_MODE=disabled` and create a new deployment.
   The provider abstraction treats every non-`resend` Production value as
   unavailable, so valid requests receive the generic provider-unavailable
   response without exposing or sending contact data.
2. Keep the firewall rule active, verify a 503 response with non-sensitive test
   data, and leave provider credentials server-only. Re-enable only by restoring
   `resend` and deploying after the provider and logs are verified.

### Restore the previous main commit

1. Record the cutover merge commit and the last-known-good `main` commit. Create
   a recovery branch from current `main`, revert the cutover merge (use
   `git revert -m 1 <cutover-merge-sha>` when reverting a merge), and open a
   reviewed pull request. Do not force-push or reset shared `main`.
2. Merge only after CI passes. Verify which Vercel deployment receives the
   production domain; if an Instant Rollback is active, explicitly promote the
   intended deployment as described above.

## Known limitations at checklist creation

- The Vercel dashboard was not available to this repository audit, so project
  assignment, Production Branch, domain state, environment scopes, firewall,
  provider delivery, deployment protection, certificate state, and runtime logs
  require a human dashboard review.
- The registrar/DNS account and Netlify account were not available. The public
  records above are a snapshot, not a complete DNS export or provider rollback
  record.
- The in-app browser surface was unavailable. Local Playwright coverage remains
  the deterministic browser verification; the final hosted preview still needs
  a manual multi-device/browser pass.
- No analytics integration exists in the repository.
- The downloadable sanitized résumé, approved portrait, project narratives,
  project links, verified social profiles, professional title, biographies, and
  confirmed university status are not available at this snapshot.
