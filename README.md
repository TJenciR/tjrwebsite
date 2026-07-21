# Tököli Jenő-Richard portfolio

Migration-safe personal workspace with source-aware profile, projects, and a privacy-safe professional contact-request workflow. The live legacy site remains on Netlify while replacement routes are developed and reviewed in Vercel previews.

## Status

- Branch scope: privacy-safe media primitives, coordinated motion, and measured performance polish.
- Production cutover: not authorized.
- Unverified project narratives, media, dates, repositories, and demos: intentionally withheld.
- Authentication, accounts, a submissions database, CMS, and AI APIs: intentionally absent.
- Legacy source recovery: still required.

Read `docs/audit/` and `docs/migration/foundation.md` before changing routes or content.
Read `docs/design-system/foundation.md` before extending tokens or components.
Read `docs/workspace-shell.md` before changing the workspace navigation, persistence, or deployment-origin behavior.
Read `docs/content-editing-guide.md` before adding or publishing factual content.
Read `docs/profile-resume-pages.md` before changing profile placeholders, portrait handling, or print behavior.
Read `docs/project-library.md` before changing project routes, filters, media, or legacy downloads.
Read `docs/now-skills-hobbies.md` before changing current activity, skill groupings, evidence links, communication levels, or hobby details.
Read `docs/portfolio-command-composer.md` before changing command matching, actions, privacy refusals, or keyboard behavior.
Read `docs/contact-access.md` before changing contact fields, validation, delivery, rate limiting, or privacy behavior.
Read `docs/deployment/contact-access.md` before enabling real delivery on Vercel.
Read `docs/media-motion-performance.md` before adding imagery, animation, fonts, scripts, or client-side interaction.

## Stack

- Next.js App Router
- React
- TypeScript in strict mode
- Tailwind CSS
- Semantic CSS custom-property tokens
- Self-hosted Inter and JetBrains Mono typefaces
- Lucide icons through a typed local registry
- Vercel Firewall rate limiting for the contact endpoint
- Resend REST delivery behind a server-only provider abstraction
- npm
- Vitest and Testing Library
- ESLint

The command composer opens from the shell, sidebar search control, or
Ctrl/Cmd+K. It performs deterministic matching in the browser against a typed,
server-built public command registry. Entered text is not sent to a server,
persisted, or captured by analytics.

## Local development

Requirements: Node.js 22 or newer and npm 11 or newer.

```bash
npm install
npm run dev
```

The development-only component showcase is available at `/design-system`. It is
`noindex` and returns 404 in production unless `DESIGN_SYSTEM_SHOWCASE=true` is
set at build time. Keep it disabled on public deployments.

Optional preview origin:

```bash
copy .env.example .env.local
```

Do not place contact details, the original CV, or qualification documents in environment files or `public/`.

Contact requests default to development mode locally: they are validated but are
not sent, stored, or logged. Real delivery requires explicit server-only Vercel
configuration and the published firewall rule documented in
`docs/deployment/contact-access.md`.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run performance:assets
```

The asset report runs after a production build and lists uncompressed generated
JavaScript and CSS. It is a composition aid rather than a network-transfer
estimate; Vercel compression and per-route loading still need browser-based
measurement before production cutover.

## Legacy compatibility

Preserved legacy page paths: `/`, `/about`, `/work`, `/documents`.

Workspace routes added without replacing verified content: `/now`, `/skills`,
`/hobbies`, `/education`, `/resume`, and `/contact-access`. The project library
continues to use `/work`. Static detail routes use `/work/[slug]`, while the
original project fragment identifiers remain on the all-project grid.

`.html` aliases redirect permanently to extensionless paths. The six public project-download paths temporarily redirect to Netlify. Sensitive résumé and qualification PDF paths remain documented as legacy-only and are not copied into the new application.

The current Netlify deployment and its custom-domain configuration, if any, must remain unchanged until an approved release branch.

## Deployment origins

- Canonical production origin: `https://jenorichardtokoli.com`
- Legacy Netlify deployment: `https://tjrichard.netlify.app`
- Vercel previews: use the platform-provided preview URL at runtime and remain `noindex`

The application does not derive its canonical origin from `VERCEL_URL`, and no
redirect from the Netlify deployment is configured.

