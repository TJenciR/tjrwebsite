# Repository working agreement

These requirements apply to all work in this repository.

## Before editing

- Inspect the repository and current worktree before editing.
- Read `docs/audit/**` before changing content or routes.
- Treat user-confirmed facts as the highest authority.
- Treat Stitch files as design references, not factual sources.

## Content and privacy

- Never invent employers, qualifications, dates, metrics, or achievements.
- Never expose private phone or email data.
- Never commit `.private/` or the original CV.
- Do not publish uncertain content unless its status is `verified`.

## Architecture and routes

- Preserve legacy URLs or add explicit redirects.
- Prefer server components.
- Avoid unnecessary dependencies.
- Do not add authentication, databases, AI APIs, a CMS, or contact providers without explicit approval.
- Keep Netlify functional until the approved production release.
- Do not point the production custom domain to Vercel from a development branch.

## Quality

- Use semantic HTML.
- Maintain keyboard accessibility.
- Maintain reduced-motion support.
- Run lint, typecheck, tests, and build before completion.
- Report failures honestly; never imply an unrun check passed.

## Handoff

End every implementation handoff with:

- Changed files.
- Verification performed and exact results.
- Assumptions made.
- Remaining risks.

