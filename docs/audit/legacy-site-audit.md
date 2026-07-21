# Legacy site audit

Audit date: 2026-07-21  
Branch: `v0.1.0/legacy-content-audit`  
Legacy deployment: `https://tjrichard.netlify.app/`

## Executive finding

The live portfolio is a small, hand-written static site: four HTML pages, one shared CSS file, and one vanilla JavaScript file, deployed by Netlify. It is not present in this Git repository. `main`, `origin/main`, and this branch all point to commit `1e2cab1`, whose tracked tree contains only five IntelliJ `.idea` files. There is no application source, `package.json`, lockfile, README, public directory, build configuration, deployment configuration, test configuration, or CI workflow in Git history.

The already-staged `design/legacy/**` captures match the deployed site's overall structure and visual treatment. The already-staged `design/stitch/**` files are later design concepts. They contain contradictory and apparently placeholder claims, so they must not be treated as verified content or as the current application.

Conclusion: the deployment cannot match `main`. Its source was deployed from an untracked local directory, another repository/branch, or a manual Netlify upload. Recover the Netlify deploy source and settings before changing hosting or routes.

## Current architecture

| Area | Finding |
|---|---|
| Framework | None detected. Static HTML/CSS/JavaScript. No framework version applies. |
| Language | HTML, CSS, and vanilla JavaScript. No TypeScript in the deployed site. |
| Styling | One global `styles.css`; Poppins from Google Fonts; Font Awesome 5.15.3 from cdnjs; gradient background; fixed/hovering sidebar; CSS media queries. |
| Routing | Four extensionless Netlify routes backed by static HTML: `/`, `/about`, `/work`, `/documents`. `.html` aliases also return 200; trailing slashes normalize to extensionless paths. |
| Shared code | Navigation markup is duplicated on every page. `styles.css` and `sidebar.js` are shared. |
| Rendering | Fully client-served static documents. `/about` embeds a public PDF with `<object>`. |
| Build | No build system is visible in the repository or deployed assets. The deployment appears to serve files directly. |
| Hosting | Netlify, confirmed by response headers and the `netlify.app` hostname. Local Netlify configuration is absent. |

## Pages and sections

| Route | Title | Current content |
|---|---|---|
| `/` | Home Page | Introductory professional summary, direct-email mail link, Facebook link, Instagram link. |
| `/about` | About Me | Embedded public `CV.pdf`; download fallback. |
| `/work` | My Work | Python and Java sections with six projects and direct ZIP downloads. |
| `/documents` | Documents | Four direct PDF downloads for qualifications plus a password-via-email disclaimer. |

The persistent navigation links to all four routes. There are no project detail routes, contact form, privacy page, error page, or server endpoint.

## Repository versus deployment

### Content online but absent from Git

- All four live HTML pages.
- `styles.css` and `sidebar.js`.
- The public résumé PDF.
- Four qualification PDFs.
- Six project ZIP archives.
- The direct contact mail link and Facebook/Instagram destinations.
- Any Netlify site configuration, deploy record, or source mapping.

### Repository content not deployed

- Five tracked IntelliJ project files on `main`.
- The staged `design/legacy/**` captures and note.
- The staged `design/stitch/**` HTML concepts, screenshots, extracted text, and design-system note.
- The audit documents on this branch.

### Does the deployment match `main`?

No. `main` has no deployable website and none of the live files. A byte-for-byte comparison is impossible until the deployment source is recovered.

## Deployment and custom-domain assumptions

- Netlify serves HTTPS and redirects HTTP to HTTPS.
- HSTS is enabled. No Content Security Policy, `X-Content-Type-Options`, Referrer Policy, or Permissions Policy was observed.
- No `netlify.toml`, `_redirects`, `_headers`, GitHub Actions workflow, or other deployment file exists locally.
- No build command or publish directory can be recovered from the repository.
- The site uses root-relative internal navigation/download URLs, so it assumes deployment at a domain root.
- Page CSS, script, and PDF references are relative; they currently resolve at the root because canonical page URLs have no trailing slash.
- No canonical URL, Open Graph URL, sitemap, or custom-domain record appears in the site. The only confirmed public hostname is the Netlify subdomain. A future custom domain requires Richard's confirmation.

## SEO and metadata

Present:

- A distinct `<title>` on each page.
- Reasonable top-level headings in visible content.

Missing or risky:

- No `<html lang>`.
- No declared character encoding.
- No viewport meta tag.
- No meta description.
- No canonical URL.
- No Open Graph or Twitter metadata.
- No structured data.
- `/robots.txt`, `/sitemap.xml`, and `/favicon.ico` return 404.
- Project downloads have no descriptive metadata page, repository link, license, or provenance.

## Analytics

No analytics, tag manager, tracking script, consent tool, or analytics configuration was found in the fetched HTML/JavaScript or repository.

## Contact behavior and privacy

- Home exposes a direct `mailto:` link and two public social-profile links.
- There is no form, API, spam protection, validation, privacy notice, or success/failure handling.
- The documents page tells visitors to request PDF passwords by email but does not provide a separate safe workflow.
- The public résumé currently displays direct contact details. This conflicts with the stated privacy direction.
- Four qualification PDFs are reachable by stable, unauthenticated URLs. A PDF password is not an access-control boundary; the continued public hosting of these files needs explicit approval.
- The staged extracted-site Markdown contains a direct address, and the legacy résumé screenshot visually contains direct contact details. Neither should be used as publishable content. The audit documents deliberately use only “private email” and “private telephone.”
- `.private/` did not exist and was not ignored at the start of the audit. A root `.gitignore` entry now excludes `.private/`. The private source PDF was not present and was not staged.

## Responsive behavior

The stylesheet contains a breakpoint at 768 px, but the pages omit a viewport meta tag. Real mobile browsers therefore tend to render a wider layout viewport and scale it down, which is visible in the supplied mobile capture: small text, a desktop-like side rail, and large unused vertical space.

A fresh headless check at 390×844 showed additional problems:

- The mobile header grows to 200 px on hover and overlaps the page heading.
- Navigation items are arranged in a vertical list inside a short horizontal header; only a subset remains visible.
- The page uses `height: 100vh` plus `overflow: hidden` on `body` and a separate scrolling content panel, producing nested/nonstandard scrolling.
- Content width and fixed padding leave little usable room on narrow screens.
- Tablet captures also show scaled desktop behavior rather than a deliberate tablet layout.

The supplied desktop captures otherwise match the current live work-page composition closely.

## Animation and interaction

- No animation library is used.
- CSS transitions animate link scale, link color, and sidebar width/height.
- `sidebar.js` attempts to duplicate hover behavior with mouseover/mouseout handlers.
- Because the script is loaded synchronously in `<head>` before `<header>` exists, it throws `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` on every checked page.
- The interaction is hover-only and has no equivalent keyboard or touch design.

## Accessibility risks

- Navigation icons and text are hidden with `display: none` until hover, leaving links with no reliable accessible name in the default state.
- Sidebar expansion is not triggered by keyboard focus.
- The mobile navigation is clipped/overlapped and does not provide a menu control.
- Icon-only social links lack explicit accessible labels.
- The embedded résumé PDF is not an accessible HTML alternative.
- The PDF object and document links do not communicate file size, language, accessibility, or privacy implications.
- No skip link, current-page indication, landmarks beyond the navigation header, or focus styling was found.
- Dark link text on a purple gradient appears low contrast in the supplied captures.
- Fixed viewport height and internal scrolling can obstruct zoom and keyboard users.
- The document does not declare its language or character encoding.

## Performance and reliability risks

- Render-blocking Google Fonts and Font Awesome stylesheets are loaded from third parties.
- The full Font Awesome stylesheet is used for a small number of icons.
- The synchronous head script fails immediately and adds no working behavior.
- Static responses use revalidation (`max-age=0`) rather than long-lived immutable caching for versionable assets.
- The about page embeds a PDF viewer rather than providing an HTML résumé first.
- The largest linked ZIP is about 75.9 MB. It is not loaded on page view, but it is expensive to download and host without release/version metadata.
- `backdrop-filter`, a full-viewport gradient, and an internal scroll panel add rendering cost without functional benefit.
- External CDN availability and tracking-prevention behavior affect icon rendering; Edge logged tracking-prevention notices for the Font Awesome CDN.
- There is no integrity attribute or self-hosted fallback for third-party assets.

## Links and runtime checks

- All four navigation routes returned 200.
- All six project ZIP links returned 200.
- The public résumé and four qualification PDF paths returned 200.
- The Facebook and Instagram destinations returned 200 at audit time.
- No missing in-page image was found because the live HTML does not use content images.
- `/favicon.ico`, `/robots.txt`, and `/sitemap.xml` returned 404.
- An unknown path correctly returned 404.
- A browser console error occurs on every page because of `sidebar.js`.

## Tests and CI

No test files, test framework, coverage configuration, lint configuration, TypeScript configuration, package scripts, lockfile, or CI configuration exists. There are therefore no existing lint, test, typecheck, or build commands to run. This is an absence of coverage, not a successful test result.

## Reusable assets and code

Potentially reusable after source recovery and review:

- The four stable public route names.
- The six project archive filenames if Richard wants backward-compatible downloads.
- The concise project list and qualification labels, subject to the conflict inventory.
- The global navigation concept, but not its current hover-only implementation.
- Poppins as a brand font only if third-party loading/privacy is acceptable.
- The legacy screenshots as regression evidence, not production assets.

Not safe to reuse as facts:

- Stitch professional titles, employment history, performance metrics, project outcomes, locations, status statements, or generated descriptions.
- Direct contact details from the public résumé, screenshots, or extracted text.
- Any apparent GitHub/LinkedIn URL in a mockup until confirmed.

## Audit limitations

- The private CV source was not locally available, so CV facts in this audit come from the sanitized inventory supplied with the task, not from extracting that PDF.
- Netlify account settings, deploy logs, environment variables, and source-repository linkage were unavailable.
- The live public résumé was reviewed through the supplied capture and its deployed presence/metadata; direct contact values were intentionally not transcribed.

