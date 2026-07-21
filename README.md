# Tököli Jenő-Richard portfolio

Migration-safe technical foundation for the existing portfolio. The live legacy site remains on Netlify while replacement routes are developed and reviewed in Vercel previews.

## Status

- Branch scope: framework and content-safety foundation only.
- Production cutover: not authorized.
- Final visual design: not implemented.
- Contact provider, authentication, database, CMS, and AI APIs: intentionally absent.
- Legacy source recovery: still required.

Read `docs/audit/` and `docs/migration/foundation.md` before changing routes or content.

## Stack

- Next.js App Router
- React
- TypeScript in strict mode
- Tailwind CSS
- npm
- Vitest
- ESLint

## Local development

Requirements: Node.js 22 or newer and npm 11 or newer.

```bash
npm install
npm run dev
```

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

Implemented page paths: `/`, `/about`, `/work`, `/documents`.

`.html` aliases redirect permanently to extensionless paths. The six public project-download paths temporarily redirect to Netlify. Sensitive résumé and qualification PDF paths remain documented as legacy-only and are not copied into the new application.

The current Netlify deployment and its custom-domain configuration, if any, must remain unchanged until an approved release branch.

