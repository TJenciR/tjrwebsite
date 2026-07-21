# Technical migration options

## Decision

Recommend **Option A: recover and modernize the static site in place first**.

This is the safer immediate option because the live source and deployment configuration are absent from Git, factual content is unresolved, the route surface is only four pages, and the current contact workflow is only a mail link. A framework migration would otherwise combine source reconstruction, content adjudication, redesign assumptions, hosting changes, and framework adoption in one step.

This recommendation is not a permanent rejection of Next.js. It creates a controlled baseline from which an incremental App Router migration can be evaluated after recovery, privacy remediation, and content confirmation.

## Option A — modernize the current static implementation

Scope:

1. Recover the exact Netlify deploy artifact and account settings.
2. Commit a sanitized static source baseline without private contact values or private PDFs.
3. Preserve `/`, `/about`, `/work`, and `/documents` plus deliberate aliases/redirects.
4. Extract duplicated navigation into a build-time partial only if a minimal tool is justified; otherwise keep the baseline dependency-free.
5. Fix document metadata, responsive navigation, keyboard behavior, contrast, and the head-script error.
6. Replace the PDF-first résumé with confirmed, accessible HTML; decide separately whether a sanitized PDF is needed.
7. Add link checks, HTML validation, accessibility smoke tests, and visual regression coverage.
8. Add explicit deployment configuration for the chosen host.

Advantages:

- Lowest risk of route and visual regression.
- No framework runtime or dependency upgrade burden.
- Static HTML is naturally portable to Netlify, Vercel, or any static host.
- Current SEO needs are small and can be fixed directly.
- Existing mail-link contact behavior does not require a server.
- Makes source recovery and privacy cleanup independently reviewable.

Limitations:

- Shared navigation/content needs a small templating strategy if the site grows.
- Rich project filtering, structured content, preview metadata generation, or a secure contact workflow may become awkward.
- Vercel support is generic static hosting rather than framework-native optimization.

## Option B — incrementally migrate to Next.js App Router, TypeScript, and Tailwind

Potential scope after the baseline is stable:

1. Create typed, sanitized content models.
2. Implement preserved routes as App Router segments.
3. Introduce a shared layout/navigation and metadata API.
4. Move project facts into validated local data.
5. Add redirect rules for `.html` aliases and any `/work` to `/projects` change.
6. Add a contact endpoint only after retention, spam, consent, and destination requirements are approved.
7. Deploy previews and compare against the recovered baseline route by route.

Advantages:

- Strong shared layout and typed content boundaries.
- First-class metadata, sitemap, robots, and social-image support.
- Straightforward project detail routes and content expansion.
- First-class Vercel preview/deployment experience.
- Server route support if a real contact workflow becomes necessary.

Risks:

- No current components or source can be reused directly; this is reconstruction, not a normal migration.
- Tailwind/Stitch prototypes could tempt the team to mix redesign with migration and publish unverified claims.
- Adds framework, Node, package, and upgrade maintenance to a site that currently needs only static files.
- A contact endpoint adds security, abuse, data-retention, and operational responsibilities.
- Static download/PDF routing must be handled explicitly, including privacy decisions and large assets.

## Decision matrix

| Criterion | Option A: static modernization | Option B: Next.js migration |
|---|---|---|
| Current code quality | Source must first be recovered; live code is small but duplicated and contains one runtime error | Cannot improve missing source without reconstructing it inside a new stack |
| Existing routes | Direct preservation is simple | Simple technically, but requires explicit redirects/configuration |
| Reusable components | Almost none; shared CSS/nav can be recovered | No existing components; new components would be created from scratch |
| SEO | Four static pages need basic metadata and files | Excellent framework support, but disproportionate before content is settled |
| Contact workflow | Current mail link needs no backend | Helpful only if a confirmed form/request workflow is required |
| Vercel compatibility | Static files are compatible; redirects need configuration | First-class |
| Migration risk | Low after recovery | Medium/high now because reconstruction and migration are coupled |
| Expected maintenance | Very low for a four-page site | Higher dependency and framework maintenance; better if scope grows |
| Privacy isolation | Easy to audit a small static public tree | Good with typed content, but public-folder mistakes remain possible |
| Recommendation | **Proceed now** | Reassess after baseline/content gates |

## Proposed migration path

### Phase 0 — recovery and containment

- Export the active Netlify deploy and record site/build/domain settings.
- Identify the actual source repository or confirm manual deployment.
- Remove direct private contact data from future tracked/public source.
- Decide the fate of the public résumé and qualification PDFs.
- Preserve checksums of public artifacts privately if historical evidence is required.

### Phase 1 — static baseline

- Add the recovered static site in a dedicated, reviewed commit.
- Preserve current URLs and download paths.
- Fix the runtime error, viewport, responsive navigation, keyboard access, metadata, and 404 support without redesigning.
- Add automated HTML/link/accessibility/build checks.

### Phase 2 — content confirmation

- Resolve `questions-for-richard.md`.
- Create one sanitized, typed-neutral content source with evidence links.
- Replace public résumé/document exposure according to the privacy decision.

### Phase 3 — framework gate

Choose Next.js only if confirmed requirements justify it: frequently changing projects, detail routes, generated metadata, preview workflows, or a server-backed contact process. Migrate one preserved route at a time and compare rendered output/links before redirecting traffic.

## Vercel-specific notes

- A recovered static site can deploy on Vercel without Next.js.
- Large or sensitive documents should not automatically move into `public/`.
- The 75.9 MB archive should be reviewed for platform limits and preferably moved to versioned release/object storage.
- Configure canonical host and redirects only after the domain and route decisions are confirmed.
- Do not use framework migration as a substitute for recovering deploy provenance.

