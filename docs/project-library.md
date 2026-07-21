# Project library and case-study contract

## Scope

The project library is the verified replacement for the legacy `/work` index.
It keeps all ten audited project names, gives every project a static
`/work/[slug]` route, and leaves undocumented case-study fields empty. The UI
renders a clear “Details being documented” state rather than generated prose.

The project order is intentional. The featured and pinned records are:

1. RepairPass Architecture
2. 3D Optimal Pathfinder
3. Online School Portal

The remaining seven audited projects stay in the all-project grid and have not
been silently removed.

## Publication boundary

`src/content/projects.ts` is the factual boundary. Each narrative, media, link,
date, status, and technology field carries independent source and verification
metadata. Pages read these fields through `getPublishedValue`; draft and hidden
values cannot become public merely because their parent project is published.

RepairPass keeps implemented functionality and planned functionality in
separate fields. Both remain unpublished until Richard confirms each scope.
No benchmark is claimed for 3D Optimal Pathfinder. No user, client, or scale
claim is made for Online School Portal.

## Routes and filtering

- `/work` remains the canonical library route.
- `/work.html` permanently redirects to `/work`.
- `/work/[slug]` is generated statically for each of the ten project slugs.
- Each all-project card retains an element ID matching its slug, so current
  `/work#...` workspace navigation continues to resolve.
- Search, status, technology, and category filters use GET parameters and are
  server-rendered. Invalid filter values fall back to the unfiltered value for
  that field.

## Legacy links and media

The audit found no legacy project detail pages, repository URLs, live demos, or
project screenshots. The legacy work-page captures are page evidence rather
than project media, and Stitch imagery is conceptual, so neither is published
as project evidence.

The six audited archive paths returned HTTP 200 during the legacy audit and
remain temporary redirects to Netlify:

- `/download/pathfinder.zip`
- `/download/optical_character_recognition.zip`
- `/download/spam_filtering.zip`
- `/download/basic_pizza_creator.zip`
- `/download/flower_growth_simulation.zip`
- `/download/space_invaders_v0.1.zip`

No broken project link was confirmed by the audit. Missing repository/demo URLs
and missing project images are recorded as source-aware hidden fields, not
broken public links. The archives still require ownership, license, version,
and long-term hosting confirmation before Netlify can be retired.

## Adding verified content

Add facts to the relevant field in `src/content/projects.ts`, cite the approved
source, and publish only after verification. Project media must use a public
root-relative path, descriptive alt text, and intrinsic width and height. Do
not copy the private CV or extract its embedded portrait into `public/`.

After any project change, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
