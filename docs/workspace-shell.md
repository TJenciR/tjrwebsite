# Personal workspace shell

## Scope

The v0.4.0 shell translates the approved Stitch workspace structure into an
accessible navigation frame. It does not redesign the route content or replace
the live Netlify deployment.

## Navigation model

`src/content/workspace-navigation.ts` is the typed source of truth for primary,
pinned-project, and secondary-project navigation. Projects continue to resolve
through the audited `/work` route and use stable fragment identifiers. The
legacy routes `/`, `/about`, `/work`, and `/documents` remain available.

The added `/now`, `/skills`, `/hobbies`, `/education`, `/resume`, and
`/contact-access` routes are privacy-safe placeholders. They deliberately do not
publish unverified content.

## Responsive behavior

- Desktop: 260px expanded sidebar or persisted 64px icon rail.
- Compact desktop/tablet: 64px icon rail without changing the saved desktop state.
- Mobile: modal slide-over navigation with an overlay, focus trap, Escape close,
  focus restoration, and close-on-selection behavior.
- The command composer occupies its own layout row so it never overlays page content.
- Shell transitions use 200ms on desktop and 220ms for the mobile drawer.
- Reduced-motion preferences disable nonessential shell transitions and animation.

The persisted key is `tjr:workspace-sidebar-collapsed`. Server rendering always
uses the expanded snapshot, and the client reads storage through an external
store subscription to avoid rendering browser-only state during hydration.

## Content and privacy boundaries

There is no approved standalone portrait asset, professional title, location,
GitHub URL, or LinkedIn URL. The shell uses a TJR monogram and clearly labelled
pending states. LinkedIn is omitted until verified. Contact access remains
closed; no private contact values or original résumé are exposed.

## Deployment origins

The canonical production origin is stored as
`https://jenorichardtokoli.com`. The legacy deployment remains separately stored
as `https://tjrichard.netlify.app`. Vercel previews use `VERCEL_URL` for runtime
Open Graph origin reporting but inherit `noindex, nofollow`; they cannot become
canonical. Only a Vercel production deployment is indexable.

No redirect or DNS cutover from Netlify is part of this branch.
