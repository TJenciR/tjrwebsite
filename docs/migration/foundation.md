# Migration foundation

## Strategy

This branch creates an additive Next.js App Router foundation for Vercel previews. It does not replace, reconfigure, or remove the current Netlify deployment. This respects the audit's Option A recovery gate while preparing the typed route and content boundaries requested for the eventual incremental migration.

The missing legacy source remains a blocker to production cutover. The foundation is intentionally not a visual redesign.

## Legacy behavior contract

| Legacy path | Foundation behavior |
|---|---|
| `/` | Server-rendered migration status page; links to the live legacy home. |
| `/about` | Sanitized placeholder; links to the legacy page without copying its résumé PDF. |
| `/work` | Preserves the six published project names and download paths. |
| `/documents` | Preserves qualification labels without copying or redirecting sensitive PDFs. |
| `/about.html` | Permanent redirect to `/about`. |
| `/work.html` | Permanent redirect to `/work`. |
| `/documents.html` | Permanent redirect to `/documents`. |
| Six `/download/*.zip` paths | Temporary redirects to the current Netlify assets. |
| Public résumé and four qualification PDFs | Explicitly `legacy-only` until privacy-safe replacements are approved. |

Unknown paths continue to return 404. The preview foundation disallows all crawling through `robots.txt` until the release branch deliberately enables indexing.

## Content safety

Every site-level content field uses `{ value, status, verifiedAt, source }`. Only `verified` values pass through `getPublicValue`. `needs-confirmation` and `hidden` values cannot be rendered through that public accessor.

The professional title, biographies, location, availability, profile URLs, production domain, and sanitized résumé URL remain unset. No direct contact value, original CV, qualification PDF, or personal photograph is copied into `src/` or `public/`.

## Rendering model

- App Router pages are server components by default.
- There are no client components, API routes, server actions, authentication, database connections, CMS integrations, AI calls, analytics, or contact providers.
- Routes are statically generated when possible.
- Tailwind is used only for a neutral structural shell.
- Global focus and reduced-motion rules establish accessibility defaults.

## Deployment boundary

- Netlify remains the live legacy host.
- Vercel is for previews only on this branch.
- No custom-domain record or production alias should be changed.
- No Netlify configuration was available to edit or remove.

## Remaining gates

1. Recover and commit a reviewed, sanitized legacy source baseline.
2. Resolve `docs/audit/questions-for-richard.md`.
3. Decide how to retire, gate, or replace the public résumé and qualification files.
4. Confirm the production domain and social/profile URLs.
5. Review archive licensing and move large downloads if appropriate.
6. Add route-level browser/accessibility regression tests once replacement UI work begins.

