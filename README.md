# Tököli Jenő-Richard portfolio

Migration-safe personal workspace with a typed, source-aware content model for the existing portfolio. The live legacy site remains on Netlify while replacement routes are developed and reviewed in Vercel previews.

## Status

- Branch scope: typed profile, education, skill, project, interest, social, résumé, and contact content with runtime validation.
- Production cutover: not authorized.
- Final page designs and publication of verified portfolio content: not implemented.
- Contact provider, authentication, database, CMS, and AI APIs: intentionally absent.
- Legacy source recovery: still required.

Read `docs/audit/` and `docs/migration/foundation.md` before changing routes or content.
Read `docs/design-system/foundation.md` before extending tokens or components.
Read `docs/workspace-shell.md` before changing the workspace navigation, persistence, or deployment-origin behavior.
Read `docs/content-editing-guide.md` before adding or publishing factual content.

## Stack

- Next.js App Router
- React
- TypeScript in strict mode
- Tailwind CSS
- Semantic CSS custom-property tokens
- Self-hosted Inter and JetBrains Mono typefaces
- Lucide icons through a typed local registry
- npm
- Vitest and Testing Library
- ESLint

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

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Legacy compatibility

Preserved legacy page paths: `/`, `/about`, `/work`, `/documents`.

Workspace routes added without replacing verified content: `/now`, `/skills`,
`/hobbies`, `/education`, `/resume`, and `/contact-access`. The projects entry
continues to use `/work`; project links use fragment identifiers on that route.

`.html` aliases redirect permanently to extensionless paths. The six public project-download paths temporarily redirect to Netlify. Sensitive résumé and qualification PDF paths remain documented as legacy-only and are not copied into the new application.

The current Netlify deployment and its custom-domain configuration, if any, must remain unchanged until an approved release branch.

## Deployment origins

- Canonical production origin: `https://jenorichardtokoli.com`
- Legacy Netlify deployment: `https://tjrichard.netlify.app`
- Vercel previews: use the platform-provided preview URL at runtime and remain `noindex`

The application does not derive its canonical origin from `VERCEL_URL`, and no
redirect from the Netlify deployment is configured.

