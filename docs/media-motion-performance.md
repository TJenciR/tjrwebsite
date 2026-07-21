# Media, motion, and performance contract

Audit date: 2026-07-21  
Branch: `v0.11.0/media-motion-performance`

## Outcome

The application now has server-compatible media primitives for portraits,
project covers and galleries, architecture diagrams, qualification imagery,
hobby imagery, missing media, and Open Graph artwork. No legacy résumé image,
Stitch remote image, qualification document, or third-party bitmap was copied
into `public/`.

All public media sources must be root-relative, have positive intrinsic width
and height, and include useful alt text unless explicitly decorative. Remote
URLs are rejected by the rendering primitive. Missing media reserves the same
aspect-ratio space as a future image, so an absent asset does not create layout
shift. Project grids and galleries default to lazy loading; the verified
above-the-fold portrait or project hero may preload. Next.js is configured to
negotiate AVIF and WebP for future raster assets.

The Open Graph route is generated from local text and design tokens at
1200×630. It has no photograph, remote request, generated biography, or private
contact value.

## Component map

| Requirement | Implementation | Client JavaScript |
|---|---|---|
| Portrait | `Portrait` through `ProfilePortrait` | None |
| Project cover | `ProjectCover` through `ProjectMedia` | None |
| Project gallery | `ProjectGallery` | None |
| Architecture diagram | `ArchitectureDiagram` | None |
| Qualification image | `QualificationImage` | None |
| Hobby image | `HobbyImage` | None |
| Open Graph image | `OpenGraphArtwork` and `src/app/opengraph-image.tsx` | None |
| Missing media | `MediaPlaceholder` inside the shared media frame | None |

Qualification and hobby media components are intentionally not populated: the
audit found no approved source image. Icon-led cards remain the truthful public
state.

## Motion contract

- Shell expansion uses 200 ms; the mobile drawer uses 220 ms.
- Pages, dialogs, notices, cards, and filters use the shared 120 ms or 200 ms
  tokens and the non-overshooting standard easing curve.
- Motion is limited to opacity, translation, border, surface, and small shadow
  changes. There is no parallax, bounce, overshoot, animated blur, scroll
  listener, decorative loop, or motion dependency.
- Skeletons are static. The prior infinite shimmer was removed.
- `prefers-reduced-motion: reduce` removes entrances, drawer/dialog animation,
  card translation, and nonessential transitions.
- Filter results remain server-rendered GET navigation. A brief page entrance
  supplies continuity without adding a client-side filtering runtime.

## Client/server and bundle review

| Area | Finding |
|---|---|
| Pages and content | All page routes and project filters remain server components. Project detail routes remain static. |
| Workspace shell | The global shell is a client boundary for persisted collapse state, keyboard shortcuts, drawer focus, and route awareness. It remains the largest unavoidable shared interaction boundary. |
| Command composer | Dynamically loaded only after Ctrl/Cmd+K or a composer trigger. Matching remains local and deterministic; raw text is not sent or logged. |
| Contact form | Client code is isolated to `/contact-access`. Validation, rate limiting, and delivery remain in the server route. |
| Project gallery | Server-rendered, lazy, and free of lightbox/carousel JavaScript. Unrelated routes do not load gallery code. |
| Images | No production raster file currently exists in `public/images`; only `.gitkeep` remains. The generated Open Graph image is local and deterministic. |
| Fonts | Inter 400/500/600 and JetBrains Mono 400/500 are self-hosted with Fontsource. There are no runtime Google Fonts requests. |
| Third-party scripts | None. The application has no analytics, tag manager, external icon CDN, or runtime design CDN. |
| Icons | Lucide is accessed through the typed registry. The explicit registry is tree-shakeable but should be watched as icon count grows. |
| Contact dependencies | `@vercel/firewall` is imported only by the server-side rate-limit adapter; Resend uses server `fetch`, so no provider SDK enters the client graph. |
| CSS | Design and route styles are globally imported. This keeps token behavior consistent but means route-specific CSS is not split; it is the main CSS-composition risk. |

Every declared dependency is referenced by application, build, lint, or test
configuration. No legacy dependency was removed because none was confirmed
unused. `npm ls --depth=0` reports several extraneous transitive WASM packages
in the local `node_modules`; they are not declared in `package.json` or the root
lockfile dependency set and are not application dependencies.

Run `npm run performance:assets` after `npm run build` to report generated,
uncompressed JavaScript and CSS totals plus the largest chunks. This is not a
replacement for browser transfer-size, Core Web Vitals, accessibility, or
visual-regression measurement.

The verified production build generated 736.4 KiB of JavaScript and 120.7 KiB
of CSS across the complete static asset pool, before compression. Those totals
are not loaded by every route. The shared root chunk set is approximately
446.1 KiB uncompressed, excluding the separately listed 110.0 KiB compatibility
polyfill. The deferred chunk containing the command composer is 53.6 KiB
uncompressed and is absent until the composer opens. These figures are a
baseline for later per-route browser traces; they are not claimed as transfer
sizes or Core Web Vitals.

## Stitch comparison and intentional deviations

| Implemented screen | Stitch references | Comparison and deliberate deviation |
|---|---|---|
| Overview `/` | Seven desktop, laptop, tablet, mobile, and open-nav overview concepts | Keeps the fixed workspace/sidebar hierarchy, responsive icon rail/drawer, cards, actions, typography, and navy layers. Generated portraits, unverified title/availability, and mock social links are replaced by verified copy or fixed-ratio placeholders. |
| About `/about` | `about_richard` | Keeps the system-identity composition and modular cards. Generated biography and employment claims are withheld; project experience is used instead. |
| Projects `/work` | `projects_library`, `projects_library_detailed`, `projects_empty_state` | Keeps featured/all grids, technical filters, status chips, and empty state. Filtering is URL-backed and server-rendered; conceptual project renders and invented descriptions are omitted. |
| Project details | `project_repairpass`, `project_3d_optimal_pathfinder` | Keeps hero, metadata, conditional sections, media slots, and adjacent navigation. Generated diagrams, benchmarks, architecture, and planned-as-built claims are omitted. |
| Now `/now` | `now` | Keeps current-status cards and dated verification language. Only source-backed RepairPass status is shown; unsupported learning and milestone copy remains empty. |
| Skills `/skills` | `skills_stack`, `technical_skills_matrix` | Keeps grouped technical surfaces and evidence links. Progress percentages, “expert” labels, frameworks, and unsupported tools are omitted. |
| Hobbies `/hobbies` | `hobbies_plugins` | Keeps the plugin metaphor, active states, and expandable cards. Remote gaming imagery and invented personal stories are omitted. |
| Education `/education` | `education_academic_records`, `education_qualifications` | Keeps records and qualification-card hierarchy. University completion, unverified dates, and public document thumbnails/downloads are withheld. |
| Résumé `/resume` | `professional_r_sum`, `r_sum` | Keeps the dense workspace résumé structure and adds a print layout. Generated employment history, private contact data, and the unsafe legacy PDF are excluded. |
| Contact `/contact-access` | `contact_access`, `contact_request_submitted` | Keeps the secure request form and clear result state. Submission confirmation is inline instead of a separate route, preventing a replayable or misleading approval page. |
| Command composer | `system_command_suggestions`, `system_loading_state` | Keeps the command dialog, keyboard listbox, and local response model. No loading screen is shown because matching has no server request; the composer itself is deferred until opened. |
| Documents `/documents` | Supported by `education_qualifications` | Retains the legacy path with privacy-safe text only. There is no exact approved Stitch page and no unsafe PDF copying. |
| Privacy `/privacy` | No direct Stitch screen | Uses the same PageShell, token, notice, and typography system. It exists for the contact workflow rather than as a visual-concept route. |
| Not found | No direct Stitch screen | Uses the shared workspace shell and truthful recovery link; it does not imitate the system loading concept or expose hidden routes. |
| Design system `/design-system` | Cross-screen component reference | Development-only and `noindex`; it is not a portfolio destination and remains disabled in production by default. |

The mobile concept allowed either bottom navigation or a drawer. The implemented
drawer is intentional because the approved shell brief explicitly requires
Escape dismissal, overlay dismissal, focus trapping, and focus restoration.

## Remaining review gates

- Supply owned originals plus permission before portrait, project, hobby, or
  qualification imagery can replace placeholders.
- Run browser-based responsive screenshots and Core Web Vitals when an
  interactive browser runner is available; the current session exposed no
  browser/JavaScript-REPL capability.
- Reassess global CSS splitting and the shared workspace boundary if measured
  route costs, rather than framework preference, justify the complexity.
- Recheck image metadata before every future file enters `public/images`.
