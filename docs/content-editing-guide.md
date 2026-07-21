# Content editing guide

## Purpose

The files in `src/content/` are the factual boundary for the portfolio. They
store source-backed facts separately from UI components and keep verification
independent from publication. Stitch files remain visual references only.

## Source precedence

Use the first applicable source and retain lower-priority conflicts in an
`internalNote` instead of deleting or silently resolving them:

1. `user-confirmed`
2. `repository-verified`
3. `cv`
4. `legacy-website`
5. `placeholder`

The precedence rank is exported from `src/types/content-model.ts`. A higher
precedence does not automatically make a claim safe to publish. Recency,
conflicts, privacy, and Richard's approval still determine verification and
publication state.

## Metadata contract

Every important content entry implements `ContentMetadata`:

- `source`: source kind plus a repository-relative audit reference.
- `verifiedAt`: ISO date, or `null` when not verified.
- `confidence`: `confirmed`, `high`, `medium`, or `low`.
- `publicationStatus`: `published`, `draft`, or `hidden`.
- `verificationStatus`: `verified`, `needs-confirmation`, or `unverified`.
- `internalNote`: conflict or editorial context that must never be rendered.
- `requiresConfirmation`: explicit human-review gate.

Conflict-prone fields use `SourcedValue<T>`, so a verified project title can
coexist with an unresolved status, URL, description, or technology list.

`published` is allowed only with `verified`, a non-null verification date, a
non-placeholder source, and `requiresConfirmation: false`. Draft and hidden
entries may retain source values for review but must not be rendered as current
truth.

## Content modules

- `profile.ts`: profile, biographies, media assets, and future sanitized résumé metadata.
- `education.ts`: education and qualification facts.
- `skills.ts`: programming/technology skills, tools, communication languages, and project evidence.
- `projects.ts`: full source-aware case-study schema, exact project names, known technology/status facts, approved priority categories, aliases, and legacy download paths.
- `hobbies.ts`: CV-backed interests and independently sourced experience details; only the user-confirmed DJ duration is currently publishable.
- `now.ts`: one user-confirmed current project plus unpublished placeholders for learning, improvement, milestones, and recent completions.
- `socials.ts`: audited public URLs and unresolved professional profiles.
- `contact.ts`: privacy-safe contact-access state and copy.
- `portfolio.ts`: validated aggregate consumed by application code.

Do not add factual content directly to a page or component. Add it to the
appropriate module, cite its source, validate it, and render only entries whose
publication and verification states allow publication.

## Editing workflow

1. Read `docs/audit/content-inventory.md`, `content-conflicts.md`, and
   `questions-for-richard.md`.
2. Record new user-confirmed wording verbatim enough to preserve meaning and add
   the confirmation date.
3. If sources conflict, keep the disputed value draft or hidden, set
   `requiresConfirmation: true`, and describe the conflict in `internalNote`.
4. Never infer a degree completion, current “Present” state, employer, title,
   metric, outcome, framework, or project description.
5. Add project evidence to a skill only when the project technology field has a
   supporting source.
6. Add or update validation tests before publishing a new content shape.

## Privacy

Content modules must not define direct email, phone, or telephone fields and
must not contain corresponding values. Public social profile URLs are separate
from direct contact data. The current résumé is not reusable because it exposes
private contact details; `resumeMetadata` must continue to point to a future
sanitized document until an approved replacement exists.

Never import `internalNote` into a client component or render it in application
copy. Never copy `.private/` assets into `public/`.

## Validation

`src/lib/content-validator.ts` is a small dependency-free validator for this
fixed static model. It rejects duplicate project IDs/slugs, missing IDs/titles,
invalid status values, invalid project media, non-HTTPS external URLs, direct
contact fields/values, and inconsistent verified/publication metadata. A schema
library is intentionally not added while the model remains static and compact.

Run after every content edit:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
