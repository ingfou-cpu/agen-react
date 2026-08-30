# Design — El Bayadh travels

Visual system and design decisions for the Django travel site. Source of truth for how the site should look; treat every change as a delta against this file.

## Stack & where styles live

- Theme is **"EL BAYADH TRAVELS — Maghreb Saharien"** (palette arabe — vert, cuivre, terre cuite), built on **Start Bootstrap Grayscale + Bootstrap 5.2.3** and bundled into one file: `static/css/styles.css` (13 334 lines / 291 790 bytes). The theme section starts at line ~11623.
- `styles.css` and `static/js/scripts.js` (1 536 bytes) are the **deployed** versions from https://ingfou32.pythonanywhere.com/ (`/static/css/styles.css?v=2`). The deployed site is the source of truth — re-import it rather than hand-editing theme tokens.
- Blog templates (`blog/list.html`, `blog/detail.html`) redefine the `--eb-*` tokens in their own inline `<style>` blocks (indigo-on-navy) — they **intentionally override** the global palette.
- Weather-section styles (`.weather-section-2`, `.weather-main-card`, `.forecast-*`) are **inlined in `home.html`**, not in `styles.css`.

## Type

- **UI/display**: `Inter` (Google Fonts, loaded in `base.html`). Headings weight 500 with `letter-spacing: -0.02em`; `body` font-family is `'Inter', system-ui`.
- **Arabic**: `Noto Naskh Arabic` (loaded globally in `base.html`) — the RTL stack; never rely on Inter for Arabic glyphs.
- **Mono/labels**: `JetBrains Mono` (weather stats, forecast dates, `.text-mono`).
- **Carousel captions**: heading `Inter`; body `'Playfair Display', serif` — Playfair is **not** loaded globally and falls back to `serif` unless the font is added.
- **Stale leftovers**: `--bs-body-font-family` still lists Nunito and the old `.masthead` internals still list Varela Round, but **neither font is loaded anymore**. Rendered text is Inter — do not reintroduce Nunito/Varela Round.

## Color

### Palette "Maghreb Saharien" (global `:root` in `styles.css`; `--ka-*` and `--eb-*` alias the same values)
| Token | Hex | Use |
|---|---|---|
| `--ka-brick` / `--ka-gold` / `--eb-primary` | `#c97b3a` | primary accent (copper) — also the `theme-color` |
| `--ka-clay` / `--ka-brick-light` / `--eb-primary-light` | `#d4a373` | light copper |
| `--ka-blue` | `#234d42` | deep green (section gradients) |
| `--ka-blue-light` | `#3a7d5c` | light green |
| `--ka-sand` / `--eb-secondary` | `#e0cdb3` | sand |
| `--ka-sand-light` / `--eb-dark` | `#2d1f0e` | dark espresso text |
| `--ka-shadow` | `#8b7355` | muted text / placeholders |
| `--ka-dark` | `#fdf6ec` | page background (cream) |
| `--ka-dark-2` | `#f5ead6` | alternate section background (weather) |
| `--ka-light` | `#fffaf0` | elevated surfaces |

- Gradients: `--ka-gradient-primary` (`#c97b3a → #d4a373`), `--ka-gradient-sunset` (`… → #1a3c34`), `--ka-gradient-dark` (`#1a3c34 → #234d42 → #c97b3a`). Glass: `--ka-glass-bg` / `--ka-glass-border`. Radii: `--ka-radius-sm/md/lg/xl` = 6/12/20/28 px. Motion: `--ka-transition` (`all .35s cubic-bezier(.4,0,.2,1)`).

### Blog "eb" palette (scoped to blog templates only — overrides the global one)
| Token | Hex | Use |
|---|---|---|
| `--eb-light` | `#1c2237` | page background |
| `--eb-light-2` | `#141929` | input background |
| `--eb-primary` | `#6d5dfb` | accent / focus ring |
| `--eb-gradient-primary` | `linear-gradient(135deg, #6d5dfb, #4A3F9E)` | brand gradients |
| `--eb-dark` | `#eef0ff` | text on dark |
| `--eb-shadow-sm/lg` | rgba(0,0,0,.35/.5) | cards, toasts |

> Note: `--eb-*`/`--ka-*` are **defined globally** at `:root` now, so every template referencing them resolves to the copper/green palette. Only the blog templates deliberately override them.

## Components & motifs

- **Navbar**: `navbar-dark fixed-top` (`#mainNav`), centered link row `#mainNav-center` (`mx-auto`, `gap-1 gap-lg-2`), pill-shaped dropdowns (`border-radius: 12px`). Shrinks on scroll and auto-collapses on link click (see Motion).
- **Hero masthead**: `.masthead` + `.ka-hero-pattern` texture, `.hero-badge` (dot + label), `.hero-title`, `.hero-subtitle`, `.hero-actions` (`hero-btn-primary` copper gradient / `hero-btn-outline`), `.hero-stats` (50+ / 1000+ / 15+ with `.hero-stat-divider`), and the `.ksar-frame` showcase (arch spans, sun icon, feature checklist: Circuits guidés / Hébergement nomade / Transport inclus).
- **Destinations carousel**: full-width section on `linear-gradient(var(--eb-dark), #1a3c34, var(--eb-dark))`; `.section-title` heading + sub; carousel `data-bs-interval="3000"`; captions `Inter` heading + `Playfair Display` body.
- **Destinations grid** (`#projects`): `.projects-section.bg-light` + `.section-title`; `.destination-grid` → `.destination-card` (image `.card-img`, `.card-body` title + truncated description, `.card-footer` with `.btn-destination` "Choisir cette destination").
- **Weather**: `.weather-section-2` (ka-dark-2 + radial `weatherPulse`), pill `.weather-search-box` with copper-gradient button, `.weather-main-card` glass card (city / temp / stats), horizontal `.forecast-scroll` snap cards (`.forecast-day-2`, `.today` highlight).
- **Contact**: `.contact-section` with three `card py-4` items (Adresse / Courriel / Téléphone) + `.social` icon row (facebook / instagram / whatsapp / youtube).
- **Circuit page** (`circuit_touris.html`): the "Détails du circuit" collapse uses `.nav-pills` tabs (Itinéraire / Prix & Dates / Fiche technique / Nos engagements) and the description panels use `.bg-black .project-text`. The theme's global rules for these assume a **dark section** — `.nav-pills .nav-link { color: var(--ka-dark) }` (cream) and `.bg-black .project-text h3 { color: var(--ka-sand-light) }` (dark-on-black) — so the template carries a **page-scoped `<style>`** overriding them: pills → `--ka-sand-light`, Description h3 → `#fff`. Content inside the collapse uses `text-muted` (not `text-white-50`), which reads on the cream body.
- **Footer**: themed with `--eb-primary-light` / `--eb-secondary-light` / `--eb-sand-light` / `--eb-gradient-primary` / `--ka-shadow`; Newsletter pill form posts to `/newsletter/subscribe/`.
- **Dark mode**: `<body data-theme="dark">` by default; `#darkModeToggle` (fixed bottom-right) flips to `light` and persists in `localStorage.theme`. `[data-theme="light"]` re-tokenizes the `--ka-*` surface colors (pure white instead of cream).
- **Buttons**: `.hero-btn` / `.btn-destination` replace the old `.btn-brand` (removed). CTAs are white-on-copper; keep contrast ≥ 4.5:1.

## Motion

- `static/js/scripts.js`: navbar shrink on scroll, auto-collapse navbar on link click, Bootstrap carousel init (interval 3000), `IntersectionObserver` fade-in-up on `.destination-card`, `.testimonial-card`, `.circuit-card`.
- Weather section: `weatherPulse` keyframes (inlined in `home.html`).

## Contrast rules (do not regress)

- CTAs must stay ≥ 4.5:1 — white on the copper gradient (`#c97b3a`) on dark/cream sections. Do not use `--ka-shadow` (`#8b7355`) as button text.
- Body copy on cream uses `--ka-sand-light` (`#2d1f0e`, ~12:1); `--ka-shadow` is for placeholders and labels only, not body copy.

## i18n & typography interplay

- `lang`/`dir` come from `LANGUAGE_CODE` (fr/en/ar); Arabic renders RTL.
- There is **no `html[lang="ar"]` rule in the CSS** — RTL is handled by the inline `<style>` block in `base.html` (`[dir="rtl"] …` margin / icon-flip / carousel overrides) plus the globally loaded `Noto Naskh Arabic` font.
- Uppercase + wide tracking mangle Arabic: keep `letter-spacing` normal and use `Noto Naskh Arabic` for AR glyphs.
