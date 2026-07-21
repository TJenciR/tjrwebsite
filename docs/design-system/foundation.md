# Design system foundation

## Source of truth

The approved Google Stitch package in `design/stitch/` is the visual source of truth for this branch. `design/stitch/technical_workspace_persona/DESIGN.md` provides the canonical palette, typography, radii, and layout intent. The healthy desktop, mobile, command, contact, empty, and loading captures clarify component composition and responsive behavior.

Legacy captures remain useful for route, content, and identity continuity only. They do not define the new visual standard. Stitch biography, project, employment, location, availability, portrait, and social-profile content remains unverified and is not copied into the application.

## Token contract

`src/styles/tokens.css` exposes semantic custom properties for:

- Application, sidebar, primary, elevated, and interactive surfaces.
- Structural borders and primary, secondary, and muted text.
- Primary, cyan, success, warning, danger, focus, and overlay roles.
- Sans and mono typography scales.
- A 4px/8px-oriented spacing scale and layout dimensions.
- Radius, shadow, z-index, duration, and easing scales.

Components consume roles instead of repeating color literals. `src/styles/components.css` contains component and temporary foundation-shell styles; it is not CSS-in-JS and requires no runtime style library.

Inter and JetBrains Mono are self-hosted from Fontsource packages. Their CSS includes Unicode-range subsets, so the browser requests only the glyph sets it needs and no runtime Google Fonts connection is required.

## Component API

All public primitives are exported from `@/components/ui`. The icon API is exported from `@/components/icons`.

Server-compatible primitives remain free of the `use client` directive. Only `Dialog`, `Drawer`, and `Tooltip` create client boundaries because they need keyboard/focus behavior or child attribute composition.

`Dialog` and `Drawer` provide:

- `role="dialog"` and `aria-modal="true"`.
- Programmatic title and optional description relationships.
- Initial focus, Tab wrapping, Escape dismissal, overlay dismissal, scroll locking, and trigger-focus restoration.
- A visible, labelled close control.

`IconButton` requires a `label`. The icon wrapper accepts only the `IconName` union backed by the local Lucide registry; components do not resolve unchecked string names at runtime.

## Component showcase

Run `npm run dev` and open `/design-system`. The route declares `noindex`, uses generic sample copy, and is enabled automatically only outside production.

Production builds return a 404 for the route unless `DESIGN_SYSTEM_SHOWCASE=true` is set at build time. Keep the variable false for public deployments; temporary enabled previews should also be access-controlled at the platform layer.

## Accessibility and motion

All focusable elements receive the shared high-contrast `:focus-visible` treatment. Form controls retain native labels and disabled behavior. Status variants pair color with text and icons. The reduced-motion media query collapses transition and animation duration and removes skeleton shimmer.

Tests cover variants, disabled controls, focus indication, dialog focus trapping/Escape/restoration, and reduced-motion output. These primitives still require page-level semantic and contrast review when real content and layouts are composed.
