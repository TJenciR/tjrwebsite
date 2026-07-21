# Profile and résumé pages

## Publication boundary

Overview, About, Education, and Résumé render through
`src/lib/public-content.ts`. An entry or field is public only when it is marked
`published`, `verified`, dated, and not awaiting confirmation. Draft values may
remain in the source-aware model for review but are never rendered as truth.

The v0.6 brief confirms Cluj-Napoca as the public location and confirms the
education institution/background wording used on these pages. It does not
confirm professional positioning, biography text, current work, university
completion, or an employment history. Those areas use visible editorial
placeholders.

## Media behavior

No portrait from the legacy résumé is reused. The audit found no standalone,
approved, source-quality personal photograph, and the legacy résumé image is
entangled with private information. `ProfilePortrait` therefore reserves a
fixed 4:5 area and renders a graceful placeholder.

When a future media record is verified and published, it must provide a public
path, descriptive alternative text, width, and height. The component then uses
`next/image`, preserving intrinsic dimensions and preventing layout shift.

## Résumé behavior

The `/resume` page is an HTML résumé generated from the same public content as
the site. It contains no direct contact fields and does not link to the legacy
CV. `ResumeDownload` exposes a download only after the sanitized résumé metadata
is verified, published, and has a public path. Until then it renders an explicit
unavailable state.

The print rules in `src/styles/profile-pages.css` remove workspace navigation,
the command composer, web-only controls, and interactive project links. They
reset scroll containers and colors for paper/PDF output and avoid breaking
résumé sections and project cards across pages.

## Content terminology

Project lists use “Project experience.” No employment timeline or “Work
experience” heading is generated because no professional employment history is
verified. Seniority, expertise, duration, performance, and outcome claims remain
excluded.
