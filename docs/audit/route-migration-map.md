# Route migration map

The existing public paths are few and stable. Preserve them first; introduce new information architecture only with explicit redirects and confirmed content.

## Page routes

| Current URL | Current behavior | Migration requirement | Proposed destination |
|---|---|---|---|
| `/` | Home page, 200 | Preserve exactly | `/` |
| `/about` | Embedded public résumé, 200 | Preserve path; replace unsafe PDF-first presentation with sanitized HTML when content is confirmed | `/about` |
| `/work` | Six-project list, 200 | Preserve as a page or permanent redirect; do not silently replace | Prefer `/work`; if `/projects` becomes canonical, redirect `/work` to `/projects` |
| `/documents` | Qualification downloads, 200 | Preserve path until privacy decision; content may become text-only or gated | `/documents` or a deliberate privacy-safe replacement |

## Existing aliases

| Alias | Current behavior | Recommendation |
|---|---|---|
| `/about/` | Redirects/normalizes to `/about` | Keep normalization. |
| `/work/` | Redirects/normalizes to `/work` | Keep normalization. |
| `/documents/` | Redirects/normalizes to `/documents` | Keep normalization. |
| `/about.html` | Returns 200 without canonical metadata | 308 redirect to `/about`. |
| `/work.html` | Returns 200 without canonical metadata | 308 redirect to `/work`. |
| `/documents.html` | Returns 200 without canonical metadata | 308 redirect to `/documents`. |

## Résumé and qualification assets

| Current path | State | Migration requirement |
|---|---|---|
| `/CV.pdf` | Public résumé; 40,311 bytes | Never replace with the private source PDF. Publish a sanitized derivative only if explicitly approved; otherwise redirect to sanitized HTML or return 410 after a transition. |
| `/bacdipl.pdf` | Public qualification PDF; 2,469,204 bytes | Human privacy decision required. Do not move the file into a public directory by default. |
| `/engling.pdf` | Public qualification PDF; 1,403,615 bytes | Same. |
| `/certcomp.pdf` | Public qualification PDF; 1,414,567 bytes | Same. |
| `/ateprof.pdf` | Public qualification PDF; 2,345,917 bytes | Same. |

If qualification files are removed, use 410 for intentionally retired sensitive assets rather than redirecting them to unrelated content. If access is still required, use authenticated object storage or a controlled request workflow; obscured filenames and PDF passwords are insufficient access control.

## Project downloads

| Current path | Size | Proposed handling |
|---|---:|---|
| `/download/pathfinder.zip` | 2,033,885 bytes | Preserve or redirect to a versioned release after source/licensing review. |
| `/download/optical_character_recognition.zip` | 183,034 bytes | Preserve or redirect after review. |
| `/download/spam_filtering.zip` | 162,543 bytes | Preserve or redirect after review. |
| `/download/basic_pizza_creator.zip` | 4,475 bytes | Preserve or redirect after canonical project-name confirmation. |
| `/download/flower_growth_simulation.zip` | 2,145 bytes | Preserve or redirect after status review. |
| `/download/space_invaders_v0.1.zip` | 75,992,435 bytes | Review before carrying forward; prefer a versioned release host if retained. |

Do not rename archives without permanent redirects. Add checksums, licenses, version/date information, and source-repository links if public downloads remain.

## Static assets and infrastructure URLs

- `/styles.css` and `/sidebar.js` are implementation details; they need not keep the same URLs after a migration.
- `/favicon.ico`, `/robots.txt`, and `/sitemap.xml` currently return 404. Adding them creates no redirect obligation.
- Unknown paths currently return 404. Preserve truthful 404 behavior.

## Candidate future routes from design concepts

The Stitch files suggest `/projects`, `/now`, `/skills`, `/hobbies`, `/education`, `/resume`, contact access, and project detail pages. These have never been live routes and carry no preservation requirement. Treat them as proposals only. Before launch:

- Resolve every factual conflict.
- Define canonical slugs.
- Redirect `/work` if `/projects` replaces it.
- Keep `/about` unless there is a compelling, documented information-architecture reason to move it.
- Avoid shipping placeholder search/query controls or dead `#` links.

## Platform implementation notes

- Netlify currently provides pretty-URL behavior for static `.html` files. Reproduce it explicitly on any new host.
- On Vercel with a static site, add redirects for the `.html` aliases and any `/work` to `/projects` decision.
- In Next.js App Router, create route segments for preserved paths and route handlers/redirect configuration for legacy aliases and downloads.
- Set a single canonical hostname only after the custom domain is confirmed.

## v0.12 implementation disposition

The migration foundation now preserves the four page routes, permanently
normalizes the three `.html` aliases, permanently redirects `/CV.pdf` to the
sanitized HTML résumé, returns 410 for the four qualification PDFs, and keeps
the six archive paths available through one-hop temporary Netlify redirects.
Legacy CSS and JavaScript paths are intentionally retired implementation details.

The preferred future hostname is `jenorichardtokoli.com`; a host-based rule
redirects `www.jenorichardtokoli.com` while preserving path and query. These
rules do not attach domains, edit DNS, or alter the current Netlify deployment.
Release and rollback procedure is documented in
`docs/deployment/seo-vercel-migration.md`.

