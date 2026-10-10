# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Persona 5 Royal (P5R) themed web course project** that ports a Vue 3 UI component library (`p5-ui-main/`) into pure HTML + CSS + vanilla JavaScript pages. The course requirement is strict: **no frameworks allowed** — delivery must be static HTML with CSS and minimal vanilla JS only.

## Running the Project

No build step is required for the course deliverables. Open HTML files directly in a browser, or serve locally:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

For the source Vue library (reference only, not for delivery):
```bash
cd p5-ui-main
npm install
npm run dev      # dev server with hot reload
npm run build    # production build
npm run preview  # preview built output
```

Format minified CSS for readability:
```bash
python scripts/pretty_css.py
```

## Architecture

### Key Directories

- `shared/p5ui/css/p5-ui.css` — Pre-compiled, self-contained CSS with all components, embedded fonts (base64), and embedded images. **This is the primary styling dependency.**
- `shared/p5ui/assets/src-assets/` — Raw asset files (fonts, crowd animation frames, character portraits, etc.) for Option B embedding.
- `test/` — **Complete working reference implementation.** Study this before implementing anything.
  - `test/index.html` — Full page layout template with all major components in use
  - `test/site.js` — 750+ line vanilla JS reference: hash routing, localStorage, carousel, drag-drop, canvas, pagination, upload preview
  - `test/site.css` — Layout + custom styling layered on top of p5-ui.css
- `p5-ui-main/` — Source Vue 3 library (for reference; inspect to understand component HTML structure)
- `00-p5-ui转纯HTML-CSS落地方案.md` — Implementation strategy guide (Chinese)
- `01-任务清单与分工初稿-P5R主题.md` — Team task assignment

### CSS Component Pattern

Pages import `p5-ui.css` and compose `.p5-*` classes on semantic HTML:

```html
<link rel="stylesheet" href="../../shared/p5ui/css/p5-ui.css">

<!-- Button -->
<button class="p5-btn-ctn p5-hover-animation-mix" type="button">START</button>

<!-- Switch (requires JS toggle of p5-switch-off/p5-switch-on classes) -->
<div class="p5-switch-ctn p5-switch-size-medium p5-switch-off" data-p5-switch>
  <input type="checkbox" aria-label="switch" />
  <div class="p5-switch-bg-ctn"><span class="p5-switch-bg"></span></div>
  <span class="p5-switch-icon"></span>
  <span class="p5-switch-sub-icon"></span>
</div>
```

Never modify `.p5-*` class names — they map directly to the CSS library's selectors.

### JavaScript Patterns

The `test/site.js` implements a hash-based SPA router (`window.addEventListener('hashchange', ...)`) and `localStorage` for user state. Reuse these patterns verbatim; they are already battle-tested. Common utilities to copy:

- Hash router: routes between `#home`, `#login`, `#contact` views without page reload
- Banner carousel with auto-play and indicator dots
- Switch toggle: swaps `p5-switch-off` ↔ `p5-switch-on` classes
- Upload preview with zoom
- Pagination state management

### P5R Design Language

- **Colors:** Black backgrounds, `#ff0022` red highlights, `#1cfeff` cyan accents, white text
- **Typography:** Alibaba DingTalk Bold (阿里妈妈数黑体 Bold) — embedded in `p5-ui.css` via `@font-face`
- **Transforms:** Skew (`-4deg` to `45deg`), scale on hover, rotation effects
- **Animations:** CSS `@keyframes` for hover effects, sword animations, 12-frame crowd sprite animation via `mix-blend-mode`

### Team Workflow

Individual work goes in `play1/`, `play2/`, `play3/`, `play4/`; final integration in `integration/`. Always reference `test/` as the canonical working example before starting any new page or component.
