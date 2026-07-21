---
name: Technical Workspace Persona
colors:
  surface: '#061425'
  surface-dim: '#061425'
  surface-bright: '#2d3a4c'
  surface-container-lowest: '#020f1f'
  surface-container-low: '#0e1c2d'
  surface-container: '#132032'
  surface-container-high: '#1d2b3c'
  surface-container-highest: '#283648'
  on-surface: '#d6e3fb'
  on-surface-variant: '#c2c6d5'
  inverse-surface: '#d6e3fb'
  inverse-on-surface: '#243143'
  outline: '#8c909f'
  outline-variant: '#424653'
  surface-tint: '#afc6ff'
  primary: '#afc6ff'
  on-primary: '#002d6d'
  primary-container: '#5b91ff'
  on-primary-container: '#002a67'
  inverse-primary: '#0f59c4'
  secondary: '#62d6e9'
  on-secondary: '#00363d'
  secondary-container: '#0d9fb1'
  on-secondary-container: '#002f35'
  tertiary: '#ffb86e'
  on-tertiary: '#492900'
  tertiary-container: '#d68000'
  on-tertiary-container: '#452600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#afc6ff'
  on-primary-fixed: '#001944'
  on-primary-fixed-variant: '#00429a'
  secondary-fixed: '#9bf0ff'
  secondary-fixed-dim: '#62d6e9'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#061425'
  on-background: '#d6e3fb'
  surface-variant: '#283648'
  app-bg: '#050D18'
  sidebar-bg: '#071321'
  surface-elevated: '#102238'
  surface-interactive: '#142A43'
  border-subtle: '#203A57'
  text-primary: '#EEF5FF'
  text-secondary: '#9CB0C7'
  text-muted: '#70869F'
  status-success: '#45CEA1'
  status-warning: '#E4B768'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  code-snippet:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 260px
  sidebar-collapsed: 64px
  container-max: 1200px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

This design system is engineered for a personal software workspace that communicates technical mastery and deliberate professionalism. Moving away from standard portfolio tropes, the aesthetic mimics high-end developer tools and AI interfaces, prioritizing utility, clarity, and structural depth.

The style is defined as **Corporate / Modern** with a **Technical / Minimalist** edge. It avoids the aggressive glow of "gaming" aesthetics in favor of a sophisticated, deep-navy environment. The interface feels like a high-performance terminal or a focused IDE—quiet, efficient, and mature. It uses thin borders and tonal layering to create organization without visual noise.

## Colors

The palette is a carefully stepped "Midnight Navy" scale. The hierarchy of information is reinforced by shifting background values rather than heavy shadows. 

- **Primary & Accent:** The primary blue is used sparingly for active states and critical actions. The cyan accent is reserved for specific technical highlights, such as code snippets or secondary status indicators.
- **Tonal Hierarchy:** Depth is created by "lifting" surfaces toward the user with lighter hex values (`#050D18` for the base vs `#102238` for cards). 
- **Typography:** Contrast is strictly managed. Primary text is off-white to reduce eye strain, while secondary and muted colors provide a clear distinction between content and metadata.

## Typography

The typography system relies on **Inter** for its clean, humanist-meets-geometric legibility. To lean into the "software workspace" concept, **JetBrains Mono** is introduced for labels, status chips, and technical metadata.

- **Scale:** Headings use tighter letter spacing and heavier weights to feel "anchored."
- **Readability:** Body text uses a generous line height (1.6x) to ensure long-form professional summaries are comfortable to read against the dark background.
- **Hierarchy:** Monospaced elements should always be set in a smaller font size than the surrounding body text to maintain visual balance.

## Layout & Spacing

This design system utilizes a **Fixed Sidebar / Fluid Content** model, reminiscent of modern AI productivity tools.

- **Grid:** A 12-column grid is used within the main content area, but components primarily align to a vertical 8px rhythm. 
- **Sidebar:** The sidebar is collapsible to a 64px icon-only rail. When expanded, it occupies 260px and houses pinned items, navigation, and the command interface trigger.
- **Breakpoints:**
  - **Desktop (1024px+):** Sidebar expanded, main content centered with 1200px max-width.
  - **Tablet (768px - 1023px):** Sidebar collapses to icon rail, gutters reduce to 1.5rem.
  - **Mobile (<767px):** Sidebar moves to a bottom navigation bar or a hidden drawer; margins reduce to 1rem.

## Elevation & Depth

Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional drop shadows.

- **Layering:** The application background is the darkest layer. The main content surface is one step lighter, and "floating" elements like cards or modals are lighter still.
- **Borders:** Every surface change is reinforced with a 1px solid border (`#203A57`). These borders act as the primary structural dividers.
- **Shadows:** Use extremely soft, low-opacity shadows (e.g., `0 4px 20px rgba(0,0,0,0.4)`) only for high-level components like modals or dropdown menus to distinguish them from the base layout.
- **Glow:** Minimal 2px blur glows are permitted only on active status indicators (e.g., a "Success" dot) to simulate a hardware LED.

## Shapes

The design system uses "Rounded" geometry (base 8px radius) to soften the technical precision of the dark theme.

- **Base Radius (8px):** Applied to cards, main container areas, and input fields.
- **Large Radius (16px):** Reserved for large surface areas like the main application window or high-level containers.
- **Pill Shape:** Used exclusively for tags, status chips, and toggle switches.
- **Interactive Elements:** Buttons follow the base 8px radius to maintain a professional, slightly boxy appearance that aligns with technical tools.

## Components

- **Buttons:** Primary buttons use the Primary Blue background with white text. Secondary buttons use a ghost style with the Border color and Primary text.
- **Cards:** Defined by the Elevated Surface background and a 1px border. No inner padding should be less than 24px.
- **Command Interface:** A centered, floating search bar (CMD+K style) using the Elevated Surface and a subtle glow on the border when focused.
- **Sidebar Items:** Use a 4px left-accent border for the active state. Hover states should use the Interactive Surface color.
- **Input Fields:** Darker than the surface they sit on. Focus state is a 1px Primary Blue border. Labels should always use JetBrains Mono in the Muted Text color.
- **Status Chips:** Small, pill-shaped components with a background tint derived from Success or Warning colors at 15% opacity, paired with high-contrast text.