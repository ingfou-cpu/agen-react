# El Bayadh Travels — Design System

> **React frontend** (`frotend/`). For the legacy Django/Bootstrap theme, see `agence/design.md`.

---

## 1. Overview & Principles

- **Art-directed editorial** aesthetic: asymmetric layouts, generous whitespace, display serif headlines, scroll-reveal animations
- **Extend, don't replace**: all pages use the same token system, 4 theme variants, dark mode, and shared component classes
- **Trilingual**: French (source), English, Arabic with full RTL support
- **Theme variants** let users switch the entire color palette: Zellige (emerald/gold), Dunes (terracotta/sand), Arabesque (teal/brass), Marrakech (charcoal/gold)

---

## 2. Tokens

### Color variables (`index.css` `@layer base`)

| Variable | Default | Zellige | Dunes | Arabesque | Marrakech |
|---|---|---|---|---|---|
| `--c-copper` | `201 123 58` | `201 162 39` | `196 106 63` | `169 132 47` | `217 169 65` |
| `--c-forest` | `35 77 66` | `29 90 78` | `107 74 53` | `31 93 92` | `42 52 51` |
| `--c-forest-darker` | `15 36 31` | `11 42 37` | `46 31 22` | `12 40 40` | `17 24 23` |
| `--c-sand` | `232 220 200` | `236 223 198` | `234 219 195` | `233 226 210` | `236 225 200` |
| `--c-cream` | `250 247 240` | `248 244 233` | `250 244 234` | `247 245 239` | `242 236 221` |
| `--c-accent` | `184 80 66` | (same) | (same) | (same) | (same) |

### Tailwind colors (via `tailwind.config.js`)

```
copper (DEFAULT / light / dark)
forest (DEFAULT / dark / darker / light)
sand   (DEFAULT / light / dark)
gold, cream
terracotta (DEFAULT / light / dark)
```

### Dark mode

- Toggled via `html.dark` class (persisted in `localStorage ebt_theme`)
- `html.dark body` → `bg-forest-darker text-sand-light`
- Components carry explicit `dark:` variants

### Shadows

```js
soft:    '0 20px 60px -20px rgb(var(--c-forest-darker) / 0.35)'
soft-lg: '0 40px 80px -24px rgb(var(--c-forest-darker) / 0.4)'
card:    '0 10px 40px -12px rgb(var(--c-forest-darker) / 0.25)'
glow:    '0 10px 40px -8px rgb(var(--c-copper) / 0.5)'
```

---

## 3. Typography

### Font stacks

| Tailwind | CSS | Use |
|---|---|---|
| `font-sans` | Inter, system-ui | Body, UI |
| `font-display` | Playfair Display, Georgia | Headings, display text |
| `font-arabic` | Amiri, Playfair Display | Arabic headings (`h1-h3`) |
| `font-mono` | JetBrains Mono | Code |

### Scale

| Class | Size | Use |
|---|---|---|
| `.display-text` | `clamp(3rem, 7vw, 7.5rem)` | Hero headlines (lh 0.92) |
| `.display-2` | `clamp(2.5rem, 5vw, 4rem)` | Page hero headings (lh 1.05) |
| `text-4xl md:text-5xl` | Tailwind | Section headings |

### Kickers & labels

```css
.text-xs.font-bold.uppercase.tracking-widest.text-terracotta
```

---

## 4. Components

### CSS classes (`@layer components` in `index.css`)

| Class | Description |
|---|---|
| `.container-site` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| `.btn` / `.btn-primary` / `.btn-outline` / `.btn-ghost` / `.btn-terracotta` | Button variants |
| `.card` | `rounded-3xl bg-white shadow-card ring-1 ring-forest-dark/5` |
| `.glass-panel` | Frosted glass: `backdrop-filter: blur(16px)` |
| `.input` / `.label` | Form primitives |
| `.badge` | Small pill indicator |
| `.section-title` | Centered heading block (legacy; prefer `SectionTitle` component) |

### React components (`src/components/`)

| Component | Props | Description |
|---|---|---|
| `Reveal` | `as`, `delay` (0-3), `variant` ("image"), `className` | Scroll-reveal wrapper |
| `SectionTitle` | `kicker`, `title`, `subtitle`, `align`, `dark` | Section header |
| `PageHero` | `kicker`, `title`, `subtitle`, `dark`, `pattern`, `align`, `children` | Full-width hero band |
| `CtaBanner` | (none) | Newsletter CTA band |
| `AuthLayout` | `children` | Split-screen auth layout |
| `DestinationCard` | `destination` | Destination card with image, price, hover |
| `PackCard` | `pack` | Circuit/pack card with image, name |
| `WeatherWidget` | `initialCity` | Weather search + forecast |
| `ThemeVariantSwitcher` | `compact` | Theme variant dropdown |
| `Navbar` | (none) | Sticky glass header with nav, auth, theme |
| `Footer` | (none) | Dark footer with newsletter, socials |
| `Spinner` | `className` | Loading spinner |
| `ErrorState` | `message`, `onRetry` | Error display with retry |
| `ScrollToTop` | (none) | Scroll to top on route change |

---

## 5. Motion

| Effect | Implementation |
|---|---|
| Scroll reveal | `Reveal` component → IntersectionObserver + `.reveal` CSS |
| Image reveal | `Reveal variant="image"` → clip-path inset animation |
| Magnetic buttons | `useMagnetic` hook → mousemove translate |
| Parallax | `useParallax` hook → scroll-linked translateY |
| Hide on scroll | Navbar `headerRef` → `translateY(-100%)` on scroll-down |
| Hover lift | `hover:-translate-y-1.5 hover:shadow-soft` on cards |
| Image zoom | `group-hover:scale-105 transition duration-700` on images |
| `scaleIn` | `@keyframes scaleIn` for success states |

---

## 6. Section Recipes

Pages follow these repeatable patterns:

| Recipe | Structure |
|---|---|
| **PageHero** | Full-width band, kicker + heading + subtitle, optional children slot |
| **Editorial break** | Centered star icon, display quote, light body |
| **Bento grid** | 12-col grid, 7-col main card + 5-col side cards |
| **Dark immersive** | `bg-forest-darker`, pattern overlay, blur blobs, checklist, white CTA |
| **CTA band** | `bg-terracotta`, newsletter form, decorative watermark |
| **Card grid** | `sm:grid-cols-2 lg:grid-cols-3`, `Reveal` stagger, `.card` items |

---

## 7. Page Patterns

| Pattern | Pages | Layout |
|---|---|---|
| Catalog/index | Destinations, Circuits, Croisiere | PageHero → featured card (optional) → grid → CtaBanner |
| Detail | DestinationDetail, CircuitDetail | Hero banner → 2-col (content + sticky booking) |
| Info | About, Contact, Currency, Search | PageHero → split/grid layout |
| Auth | Login, Register | AuthLayout (split-screen) |
| Transactional | PaymentHome, PaymentHistory, Success, Cancel | PageHero → content |
| Article | Blog, BlogPost | PageHero → editorial content |
| Status | Weather, NotFound, 404 | Standalone section |

---

## 8. Conventions

### i18n
- Languages: `fr` (default), `en`, `ar`
- Keys are flat strings: `namespace.section.key`
- `t('key')` looks up `messages[lang]`, falls back to `fr`
- All UI chrome is translated; DB content (destinations, circuits) stays as-is

### RTL
- Arabic: `html[lang='ar']` + `dir="rtl"`
- Use logical properties: `ps-*`/`pe-*`/`ms-*`/`me-*`, `start`/`end`
- Arrow icons: add `rtl:rotate-180` for directional meaning

### Images
- Django media served via Vite proxy at `/media/`
- `mediaUrl(path)` helper passes through absolute/external URLs
- All images: `loading="lazy"`, `object-cover`, hover scale on cards

### Dark mode
- Default: dark (`html.dark` on mount)
- Toggle: `useTheme()` hook
- Every new section must include `dark:` variants
- `glass-panel` auto-adapts via CSS

### Accessibility
- CTA contrast ≥ 4.5:1 (copper on white, white on copper)
- `aria-label` on icon-only buttons
- Semantic HTML (`section`, `article`, `nav`, `main`)
- Form labels with `htmlFor`

---

## 9. File Structure

```
frotend/src/
├── components/     # Shared React components
│   ├── Reveal.jsx
│   ├── SectionTitle.jsx
│   ├── PageHero.jsx
│   ├── CtaBanner.jsx
│   ├── AuthLayout.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── DestinationCard.jsx
│   ├── PackCard.jsx
│   ├── WeatherWidget.jsx
│   ├── ThemeVariantSwitcher.jsx
│   ├── Spinner.jsx
│   ├── ErrorState.jsx
│   └── ScrollToTop.jsx
├── hooks/
│   ├── useAuth.jsx
│   ├── useTheme.js
│   ├── useVariant.js
│   ├── useMagnetic.js
│   └── useParallax.js
├── lib/
│   ├── api.js          # API client
│   ├── i18n.jsx        # Translations
│   ├── format.jsx      # Formatting helpers
│   └── themes.jsx      # Theme variant definitions
├── pages/              # Route-level components
│   ├── Home.jsx        # Flagship (8 sections)
│   ├── HadjOmra.jsx    # Pilgrimage page
│   ├── Destinations.jsx
│   ├── Circuits.jsx
│   ├── Croisiere.jsx
│   ├── DestinationDetail.jsx
│   ├── CircuitDetail.jsx
│   ├── Blog.jsx
│   ├── BlogPost.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Currency.jsx
│   ├── Search.jsx
│   ├── Weather.jsx
│   ├── Testimonials.jsx
│   ├── MapPage.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── PaymentHome.jsx
│   ├── PaymentHistory.jsx
│   ├── PaymentSuccess.jsx
│   ├── PaymentCancel.jsx
│   └── NotFound.jsx
├── index.css           # Tokens, components, utilities, patterns
├── App.jsx             # Routes
└── main.jsx            # Entry point
```
