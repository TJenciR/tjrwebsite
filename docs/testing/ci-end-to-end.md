# CI and end-to-end verification

Branch: `v0.13.0/ci-end-to-end`

## Local sequence

The Playwright suite runs against a previously generated production build. A
small dependency-free runner starts Next directly on `127.0.0.1:3100`, waits
for readiness, and always stops the process after Playwright exits. It reuses an
already-running server and never depends on the Netlify site.

```bash
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e:install
npm run test:e2e
```

The first browser installation downloads Chromium for the current Playwright
version. CI additionally uses `playwright install --with-deps chromium` for the
Linux system packages required by the browser.

## Browser coverage

The twenty deterministic flows cover the overview, desktop and mobile shell,
persisted sidebar state, focus trapping, projects and filtering, known and
unknown commands, public résumé privacy, contact-form UI states, reduced
motion, legacy responses, overflow, titles, missing sanitized résumé behavior,
and the production-only absence of the design-system showcase.

Tests prefer accessible roles, names, and labels. Screenshots, videos, and
traces are retained only when a test fails; there are no full-page visual
regression snapshots.

## Contact safety

Browser contact tests intercept `/api/contact-request` and return deterministic
JSON responses. They do not reach the route handler or an email provider. The
workflow also sets `CONTACT_DELIVERY_MODE=development`, references no GitHub
secret, and never prints submitted form bodies.

## Workflow security

`.github/workflows/ci.yml` has read-only repository permissions, cancels stale
runs for the same pull request or branch, and uses npm's lockfile-aware cache.
Pull-request runs receive no secrets. Failure artifacts are limited to
`playwright-report/` and `test-results/`, exclude hidden files, and expire after
seven days. `.private/`, environment files, build output, and source documents
are never artifact inputs.

Playwright recommends one worker in CI for reproducibility and does not
recommend caching browser binaries because installation and restoration costs
are comparable. The configuration follows those recommendations while caching
the npm download cache through `actions/setup-node`.

## Dependency review

`@playwright/test` is the only dependency added for this branch. Existing
runtime dependencies remain referenced by application code, and existing test,
lint, TypeScript, styling, and framework packages remain referenced by their
configuration or scripts. No dependency was removed without evidence that it
was unused.
