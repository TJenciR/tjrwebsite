# Asset inventory

## Repository baseline

`main` contains no public assets. The assets below are staged working-tree additions and are not part of the `main` commit.

## Legacy reference captures

| File | Dimensions | Bytes | Content/use | Risk |
|---|---:|---:|---|---|
| `design/legacy/home-desktop.png` | 1920×1032 | 656,568 | Desktop home regression reference | Contains legacy contact UI; do not publish as site content. |
| `design/legacy/home-tablet.jpg` | 2560×1600 | 841,028 | Tablet home reference | Shows scaled desktop behavior. |
| `design/legacy/home-mobile.jpg` | 1080×2340 | 454,135 | Mobile home reference | Shows small scaled content and large unused area. |
| `design/legacy/about.png` | 1920×1032 | 511,221 | Public résumé embedded on `/about` | Contains a portrait and direct contact details; sensitive. |
| `design/legacy/skills.png` | 1920×1032 | 526,296 | Lower résumé section | Contains education/skill/language/hobby claims requiring confirmation. |
| `design/legacy/projects-01.png` | 1920×1032 | 744,830 | Upper `/work` capture | Regression evidence only. |
| `design/legacy/projects-02.png` | 1920×1032 | 732,154 | Lower `/work` capture | Regression evidence only. |
| `design/legacy/legacy-notes.md` | — | 98 | One-line résumé pointer | Not production content. |

These captures are useful for layout regression and content recovery. They should stay in design/audit context and should not be copied into a public assets directory.

## Stitch concept package

The staged Stitch package contains 25 standalone `code.html` files, 25 corresponding `screen.png` files, one extracted-live-text Markdown file, and one design-system Markdown file.

Concept directories:

- `about_richard`
- `contact_access`
- `contact_request_submitted`
- `education_academic_records`
- `education_qualifications`
- `hobbies_plugins`
- `now`
- `overview_compact_tablet_768px`
- `overview_desktop`
- `overview_desktop_1440px`
- `overview_laptop_1280px`
- `overview_mobile`
- `overview_mobile_nav_open`
- `overview_tablet_1024px`
- `professional_r_sum`
- `project_3d_optimal_pathfinder`
- `project_repairpass`
- `projects_empty_state`
- `projects_library`
- `projects_library_detailed`
- `r_sum`
- `skills_stack`
- `system_command_suggestions`
- `system_loading_state`
- `technical_skills_matrix`

The HTML files are independent Tailwind-CDN prototypes, not components of the live site. They load external Google Fonts, Material Symbols, and in many cases remote Google-hosted images. Their links are mostly `#` placeholders; the few profile URLs are unverified.

Four supposed PNGs are invalid 28-byte text placeholders with identical contents indicating an image-fetch failure:

- `design/stitch/about_richard/screen.png`
- `design/stitch/overview_desktop/screen.png`
- `design/stitch/projects_library/screen.png`
- `design/stitch/r_sum/screen.png`

The other 21 Stitch screenshots are valid PNG files ranging from 548×1600 to 1600×1280/1600-class canvases. They are design references, not reusable production assets.

Additional risks:

- `design/stitch/extracted_text_from_https_tjrichard.netlify.app.md` contains a direct address and must not be used as a public content source.
- Mock résumé screens contain fabricated/unverified professional claims.
- Remote image URLs have unclear ownership, permanence, and licensing.
- The generated HTML depends on runtime Tailwind CDN and is not a maintainable application foundation.

## Live deployment assets

| Path | Type | Bytes | Result |
|---|---|---:|---|
| `/styles.css` | CSS | 2,878 | 200 |
| `/sidebar.js` | JavaScript | 650 | 200; throws at runtime |
| `/CV.pdf` | PDF | 40,311 | 200; public résumé with direct contact details |
| `/bacdipl.pdf` | PDF | 2,469,204 | 200; qualification document |
| `/engling.pdf` | PDF | 1,403,615 | 200; qualification document |
| `/certcomp.pdf` | PDF | 1,414,567 | 200; qualification document |
| `/ateprof.pdf` | PDF | 2,345,917 | 200; qualification document |
| `/download/pathfinder.zip` | ZIP | 2,033,885 | 200 |
| `/download/optical_character_recognition.zip` | ZIP | 183,034 | 200 |
| `/download/spam_filtering.zip` | ZIP | 162,543 | 200 |
| `/download/basic_pizza_creator.zip` | ZIP | 4,475 | 200 |
| `/download/flower_growth_simulation.zip` | ZIP | 2,145 | 200 |
| `/download/space_invaders_v0.1.zip` | ZIP | 75,992,435 | 200 |

Third-party runtime assets:

- Google Fonts stylesheet and Poppins font files.
- Font Awesome 5.15.3 CSS/font resources from cdnjs.

No live content images, favicon, social preview image, local webfont, project screenshot, manifest, robots file, or sitemap were found.

## Existing personal photographs

The only confirmed personal photograph is the portrait embedded in the public résumé, visible inside the legacy about screenshot. There is no standalone original in the repository. Do not extract or reuse it without Richard's approval and a source-quality original.

## Existing project screenshots

None. The work-page screenshots show text entries, not project UIs. Stitch project-detail images are generated concepts and must not be represented as evidence of the actual projects.

## v0.11 media disposition

The classifications below describe production disposition. “Reuse” means the
file remains useful inside `design/` as audit or comparison evidence; it does
not authorize copying it into `public/`.

| Asset or group | Classification | Production decision |
|---|---|---|
| `home-desktop.png` | Reuse | Retain as desktop regression evidence only. |
| `home-tablet.jpg` | Reuse | Retain as tablet regression evidence only; it is not portfolio content. |
| `home-mobile.jpg` | Reuse | Retain as mobile regression evidence only; it documents a legacy layout problem. |
| `projects-01.png` and `projects-02.png` | Reuse | Retain as route/content evidence only; neither is a screenshot of a project. |
| `skills.png` | Reuse | Retain as sanitized audit evidence only; do not derive skill ratings or production imagery from it. |
| `about.png` | Remove | Exclude from production and public documentation because the captured résumé contains private contact data. |
| `legacy-notes.md` | Remove | It is not media and adds no production asset value. |
| Portrait embedded in the legacy résumé | Ownership unclear | Do not extract, crop, or publish it. An approved original plus explicit public-use permission is required first. |
| Legacy public `CV.pdf` | Remove | Do not copy it; it exposes private contact data. A separately sanitized résumé is required. |
| Four legacy qualification PDFs | Ownership unclear | Do not copy them until ownership, metadata, and public-document privacy are approved. |
| 21 valid Stitch `screen.png` files | Reuse | Keep as design references only. They are composite mockups, not production media. |
| Four invalid 28-byte Stitch PNG placeholders | Remove | They contain no image data and cannot be reused. |
| Stitch remote portraits, project renders, and hobby images | Ownership unclear | Do not download, proxy, or publish them. They remain layout references only. |

No current local asset qualifies for **Re-crop**, **Re-export**, or **Replace**:
those actions require a source-quality, owned original. The application therefore
uses fixed-ratio missing-media states until approved originals are supplied.

