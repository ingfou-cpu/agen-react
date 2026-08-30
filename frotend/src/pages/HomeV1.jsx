import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatDate, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  V1 — Terracota Mediterraneo                                        */
/*  Warm, rustic-elegant, sun-kissed Mediterranean villa. All styling   */
/*  is scoped to the `.theme-mediterraneo` wrapper: the --c-* tokens    */
/*  are redefined there (so every Tailwind color utility recolors       */
/*  automatically), plus a page-scoped <style> block for the arch       */
/*  motif, plaster texture, DM Serif Display, and shared-component      */
/*  overrides. No global tokens / shared files are touched.             */
/* ------------------------------------------------------------------ */

/* Small olive-branch divider used sparingly under section titles */
function OliveDivider() {
  return (
    <svg
      width="72"
      height="16"
      viewBox="0 0 72 16"
      fill="none"
      aria-hidden="true"
      className="my-5 opacity-90"
    >
      <path d="M4 8 H58" stroke="#6B7F3B" strokeWidth="1.5" />
      <path d="M58 8 C64 2, 68 4, 66 8 C68 12, 64 14, 58 8 Z" fill="#6B7F3B" />
      <path d="M34 8 C30 3, 26 5, 28 8 C26 11, 30 13, 34 8 Z" fill="#6B7F3B" />
      <path d="M46 8 C42 4, 38 6, 40 8 C38 10, 42 12, 46 8 Z" fill="#6B7F3B" />
    </svg>
  );
}

const medCss = `
.theme-mediterraneo {
  /* Palette remap — scoped to this page only */
  --c-cream: 255 248 240;          /* Sun White */
  --c-sand-light: 255 248 240;     /* Sun White */
  --c-sand: 232 213 183;           /* Sandy Beige */
  --c-sand-dark: 232 213 183;      /* Sandy Beige */
  --c-forest: 194 69 45;           /* Terracotta (primary) */
  --c-forest-dark: 74 25 66;       /* Deep Fig (ink) */
  --c-forest-darker: 74 25 66;     /* Deep Fig */
  --c-forest-light: 107 127 59;    /* Olive Leaf */
  --c-copper: 194 69 45;           /* Terracotta */
  --c-copper-light: 212 149 107;   /* Warm Clay */
  --c-copper-dark: 168 101 58;     /* Warm Clay */
  --c-gold: 168 216 200;           /* Sea Foam */
  --c-accent: 194 69 45;           /* Terracotta */
  --c-accent-light: 212 149 107;   /* Warm Clay */
  --c-accent-dark: 168 101 58;     /* Warm Clay */
  position: relative;
  background-color: #FFF8F0;
}
/* Plaster / paper grain — inline feTurbulence noise */
.theme-mediterraneo::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  opacity: 0.05;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}
/* Editorial serif display — DM Serif Display */
.theme-mediterraneo h1,
.theme-mediterraneo h2,
.theme-mediterraneo h3,
.theme-mediterraneo .font-display {
  font-family: 'DM Serif Display', 'Playfair Display', Georgia, serif;
  font-weight: 700;
  letter-spacing: -0.01em;
}
/* Preserve Arabic font + natural case for RTL */
html[lang='ar'] .theme-mediterraneo h1,
html[lang='ar'] .theme-mediterraneo h2,
html[lang='ar'] .theme-mediterraneo h3,
html[lang='ar'] .theme-mediterraneo .font-display {
  font-family: 'Amiri', 'Playfair Display', Georgia, serif;
}
/* Arch-top primary button */
.theme-mediterraneo .med-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #C2452D;
  color: #FFF8F0;
  border-radius: 50% 50% 0 0;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  box-shadow: 0 6px 20px rgba(194, 69, 45, 0.12);
  transition: background-color .2s ease, transform .2s ease, box-shadow .2s ease;
  cursor: pointer;
  text-decoration: none;
}
.theme-mediterraneo .med-btn:hover {
  background: #A93B25;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(194, 69, 45, 0.2);
}
.theme-mediterraneo .med-btn:active {
  transform: translateY(-1px);
}
.theme-mediterraneo .med-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: #C2452D;
  border: 1.5px solid #C2452D;
  border-radius: 50% 50% 0 0;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  transition: background-color .2s ease, color .2s ease, transform .2s ease;
  cursor: pointer;
  text-decoration: none;
}
.theme-mediterraneo .med-btn-ghost:hover {
  background: rgba(194, 69, 45, 0.08);
  transform: translateY(-2px);
}
.theme-mediterraneo .med-btn-ghost:active {
  transform: translateY(-1px);
}
/* Cards — warm surface, clay border, arch-top image, scale hover */
.theme-mediterraneo .card {
  background: #FFF8F0;
  border: 2px solid #D4956B;
  border-radius: 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform .2s ease, box-shadow .2s ease;
}
.theme-mediterraneo .card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 30px -12px rgba(194, 69, 45, 0.25);
}
.theme-mediterraneo .card .relative {
  border-radius: 50% 50% 0 0 / 18% 18% 0 0;
}
/* DestinationCard "details" link -> Mediterranean Blue accent */
.theme-mediterraneo .card .mt-4.flex > span:last-child {
  color: #1565C0 !important;
}
/* Literal white utilities -> Sun White (only used inside dark bands) */
.theme-mediterraneo .bg-white { background: #FFF8F0 !important; }
.theme-mediterraneo .bg-white\\/90 { background: rgba(255, 248, 240, 0.92) !important; }
.theme-mediterraneo .bg-white\\/80 { background: rgba(255, 248, 240, 0.9) !important; }
.theme-mediterraneo .bg-white\\/15 { background: rgba(255, 248, 240, 0.15) !important; }
.theme-mediterraneo .bg-white\\/10 { background: rgba(255, 248, 240, 0.10) !important; }
.theme-mediterraneo .bg-white\\/5 { background: rgba(255, 248, 240, 0.05) !important; }
.theme-mediterraneo .border-white\\/10 { border-color: rgba(255, 248, 240, 0.10) !important; }
.theme-mediterraneo .border-white\\/20 { border-color: rgba(255, 248, 240, 0.20) !important; }
.theme-mediterraneo .border-white\\/40 { border-color: rgba(255, 248, 240, 0.40) !important; }
.theme-mediterraneo .text-white { color: #FFF8F0 !important; }
.theme-mediterraneo .text-white\\/80 { color: rgba(255, 248, 240, 0.80) !important; }
.theme-mediterraneo .text-white\\/50 { color: rgba(255, 248, 240, 0.50) !important; }
/* Focus rings -> Mediterranean Blue, 2px offset */
.theme-mediterraneo .input:focus {
  border-color: #1565C0 !important;
  box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.25) !important;
}
/* Cinematic reveals: fade + 16px rise, 540ms, 120ms stagger */
.theme-mediterraneo .reveal {
  transform: translateY(16px);
  transition: opacity .54s ease-out, transform .54s ease-out;
}
.theme-mediterraneo .reveal.visible {
  transform: translateY(0);
}
.theme-mediterraneo .reveal-delay-1 { transition-delay: .12s; }
.theme-mediterraneo .reveal-delay-2 { transition-delay: .24s; }
.theme-mediterraneo .reveal-delay-3 { transition-delay: .36s; }
/* Newsletter CTA (CtaBanner) — terracotta band, golden-hour wash */
.theme-mediterraneo section.bg-terracotta {
  background: linear-gradient(180deg, rgba(212, 149, 107, 0.25), transparent), #C2452D !important;
  color: #FFF8F0 !important;
}
.theme-mediterraneo section.bg-terracotta .text-white { color: #FFF8F0 !important; }
.theme-mediterraneo section.bg-terracotta .text-white\\/80 { color: rgba(255, 248, 240, 0.82) !important; }
.theme-mediterraneo section.bg-terracotta input {
  background: rgba(255, 248, 240, 0.15) !important;
  border-color: rgba(255, 248, 240, 0.40) !important;
  color: #FFF8F0 !important;
}
.theme-mediterraneo section.bg-terracotta input::placeholder { color: rgba(255, 248, 240, 0.6) !important; }
.theme-mediterraneo section.bg-terracotta input:focus {
  border-color: #1565C0 !important;
  box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.3) !important;
}
.theme-mediterraneo section.bg-terracotta button[type=submit] {
  background: #FFF8F0 !important;
  color: #C2452D !important;
}
.theme-mediterraneo section.bg-terracotta button[type=submit]:hover {
  background: #E8D5B7 !important;
  color: #4A1942 !important;
}
/* Weather band (WeatherWidget) — Deep Fig with sea-foam wash */
.theme-mediterraneo section.bg-forest-darker {
  background: linear-gradient(180deg, rgba(168, 216, 200, 0.12), transparent), #4A1942 !important;
}
.theme-mediterraneo .bg-forest-darker .text-sand-light { color: #FFF8F0 !important; }
.theme-mediterraneo .bg-forest-darker .text-sand-dark { color: #E8D5B7 !important; }
.theme-mediterraneo .bg-forest-darker .text-red-300,
.theme-mediterraneo .bg-forest-darker .text-red-400 { color: #A8D8C8 !important; }
.theme-mediterraneo .bg-forest-darker .border-copper\\/50 { border-color: rgba(232, 213, 183, 0.5) !important; }
.theme-mediterraneo .bg-forest-darker .bg-copper\\/10 { background: rgba(232, 213, 183, 0.12) !important; }
.theme-mediterraneo .bg-forest-darker .btn-primary {
  background: #C2452D !important;
  color: #FFF8F0 !important;
  box-shadow: none !important;
}
.theme-mediterraneo .bg-forest-darker .input:focus {
  border-color: #1565C0 !important;
  box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.3) !important;
}
/* Mosaic tile accent band */
.theme-mediterraneo .med-tile {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20'%3E%3Cpath d='M0 20 A20 20 0 0 1 20 0' fill='none' stroke='%23C2452D' stroke-width='2'/%3E%3Cpath d='M20 20 A20 20 0 0 1 40 0' fill='none' stroke='%23D4956B' stroke-width='2'/%3E%3C/svg%3E");
  background-size: 40px 20px;
  opacity: 0.5;
}
`;

/* ---------------------------- Hero -------------------------------- */

function Hero({ t, destinations }) {
  const [main, ...stack] = destinations;
  const featured = main;
  const bgImg = featured
    ? mediaUrl(featured.image)
    : 'https://images.unsplash.com/photo-1682687982185-531d09ec56fc?q=80&w=2940&auto=format&fit=crop';

  return (
    <section className="relative min-h-[88svh] flex flex-col overflow-hidden bg-[#FFF8F0]">
      {/* Golden-hour wash + soft terracotta plane */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(212,149,107,0.28),transparent_55%)]" />
      <div className="pointer-events-none absolute -top-32 -end-32 w-[28rem] h-[28rem] rounded-full bg-[#C2452D]/10" />

      <div className="container-site relative flex-1 flex flex-col justify-center py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="text-forest-dark/70 border-l-2 border-terracotta pl-4 mb-6 text-[0.75rem] uppercase tracking-[0.25em]">
                {t('home.hero2.kicker')}
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-forest-dark leading-[0.95]">
                {t('home.hero2.title1')}
                <br />
                <span className="italic font-light text-terracotta/70">{t('home.hero2.title2')}</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 text-lg md:text-xl text-forest-dark/70 max-w-lg font-light leading-relaxed">
                {t('home.hero2.tagline')}
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/circuit/" className="med-btn">
                  {t('home.hero2.cta')}
                </Link>
                <Link to="/destinations/" className="med-btn-ghost items-center gap-2">
                  <i className="bi bi-geo-alt"></i> {t('nav.destinations')}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={1} variant="image" className="relative h-[420px] lg:h-[560px] w-full rounded-t-[9999px] overflow-hidden shadow-[0_6px_20px_rgba(194,69,45,0.12)] border-2 border-[#D4956B]">
              <img
                src={bgImg}
                alt={featured ? featured.name : 'Algérie'}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </div>

      <div className="container-site relative pb-10">
        <div className="flex items-end justify-between border-t border-forest-dark/15 pt-6">
          <Reveal delay={2} className="flex items-center gap-4">
            <i className="bi bi-sun text-xl text-terracotta"></i>
            <p className="text-[0.7rem] uppercase tracking-widest text-forest-dark/60 leading-tight">
              Rooted in tradition.
              <br />
              Committed to responsible travel.
            </p>
          </Reveal>
          {featured && (
            <Reveal delay={3} className="hidden sm:block text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-forest-dark/50 mb-1">
                {featured.city_name || t('home.hero2.featuredLocation')}
              </div>
              <div className="font-display text-2xl text-forest-dark">{featured.name}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Editorial intro -------------------------- */

function Intro({ t, destinations }) {
  const d = destinations[0];
  return (
    <section className="py-24 lg:py-32 border-b border-forest-dark/10 bg-[#FFF8F0]">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <p className="text-overline-custom mb-6">{t('home.editorial.title1')}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest-dark leading-[1.05] mb-8">
            {t('home.editorial.title1')}
            <br />
            <span className="italic font-light text-forest-dark/40">{t('home.editorial.title2')}</span>
          </h2>
          <OliveDivider />
          <p className="text-forest-dark/60 leading-relaxed max-w-md">
            {t('home.editorial.body')}
          </p>
        </Reveal>
        <Reveal delay={1} variant="image" className="relative h-[400px] lg:h-[500px] w-full rounded-[2rem] overflow-hidden shadow-soft">
          {d ? (
            <img src={mediaUrl(d.image)} alt={d.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0 bg-forest-dark/10 animate-pulse" />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------- Destination spotlight --------------------- */

function Spotlight({ t, destinations }) {
  const d = destinations[0];
  if (!d) return null;
  return (
    <section className="py-24 md:py-32 bg-[#F3ECDD] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -end-24 w-[34rem] h-[34rem] opacity-10 bg-[#D4956B] rounded-full" />
      <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal variant="image" className="lg:col-span-6 rounded-[2rem] overflow-hidden shadow-soft">
          <img src={mediaUrl(d.image)} alt={d.name} className="w-full h-[52vh] object-cover" loading="lazy" />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-sm text-terracotta">01</span>
              <span className="h-px w-10 bg-terracotta/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('dest.kicker')}</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl text-forest-dark leading-tight mb-6">
              {t('home.grid.title')}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-lg text-forest-dark/60 leading-relaxed max-w-lg mb-8">
              {t('home.grid.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={2}>
            <div className="rounded-2xl border border-forest-dark/10 p-6 mb-8 max-w-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-2xl text-forest-dark">{d.name}</h4>
                <span className="text-copper font-semibold text-sm">{t('common.from')} {formatPrice(d.price)}</span>
              </div>
              <p className="text-sm text-forest-dark/60 line-clamp-3">{d.description}</p>
              <Link
                to={`/reselieuChoisi/${d.id}/`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1565C0] hover:gap-3 transition-all"
              >
                {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <Link
              to="/destinations/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1565C0] hover:text-terracotta transition-colors"
            >
              {t('cta.seeMore')} <i className="bi bi-arrow-right rtl:rotate-180 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Circuits — editorial list ------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#FFF8F0]">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const list = rest.slice(0, 3);

  return (
    <section id="circuits" className="py-24 md:py-32 bg-[#FFF8F0] border-b border-forest-dark/10">
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <Reveal>
              <div className="flex items-center gap-4 mb-5">
                <span className="font-mono text-sm text-terracotta">02</span>
                <span className="h-px w-10 bg-terracotta/40" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('home.circuits.kicker')}</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark">
                {t('home.circuits.title')}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={1}>
            <Link
              to="/circuit/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1565C0] hover:text-terracotta transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </Reveal>
        </div>

        {/* Featured card */}
        <Reveal>
          <Link
            to={`/circuitChoisi/${main.id}/`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] bg-[#FFF8F0] shadow-card ring-1 ring-forest-dark/5 hover:-translate-y-1.5 hover:shadow-soft transition duration-300"
          >
            <div className="md:col-span-7 aspect-[16/10] md:aspect-auto overflow-hidden relative">
              <span className="absolute top-4 left-4 z-10 bg-terracotta text-white text-[0.6rem] uppercase tracking-widest px-3 py-1.5 rounded-full">
                {t('circuit.featured')}
              </span>
              <img
                src={mediaUrl(main.image || main.image_circuit)}
                alt={main.pack_name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center">
              <div className="text-forest-dark/50 text-sm font-medium mb-3">
                {main.date ? formatDate(main.date) : '—'}
              </div>
              <h3 className="font-display text-3xl text-forest-dark mb-4 group-hover:text-terracotta transition-colors">
                {main.pack_name}
              </h3>
              <p className="text-forest-dark/60 line-clamp-3 mb-6">{main.description}</p>
              <div className="flex items-center justify-between">
                {main.price && (
                  <span className="text-copper font-bold text-lg">{formatPrice(main.price)}</span>
                )}
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta">
                  {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Editorial list */}
        {list.length > 0 && (
          <div className="mt-12 divide-y divide-forest-dark/10 border-y border-forest-dark/10">
            {list.map((pack, idx) => (
              <Reveal key={pack.id} delay={idx}>
                <Link
                  to={`/circuitChoisi/${pack.id}/`}
                  className="group flex flex-col md:flex-row md:items-center gap-4 py-6 hover:bg-white/60 rounded-xl px-4 -mx-4 transition-colors"
                >
                  <span className="font-mono text-sm text-terracotta/70 w-8">{String(idx + 2).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <h4 className="font-display text-xl text-forest-dark group-hover:text-terracotta transition-colors">
                      {pack.pack_name}
                    </h4>
                    <p className="text-sm text-forest-dark/50 mt-1 line-clamp-1">{pack.description}</p>
                  </div>
                  <div className="flex items-center gap-6 md:gap-10 text-sm">
                    {pack.date && <span className="text-forest-dark/50">{formatDate(pack.date)}</span>}
                    {pack.price && <span className="text-copper font-semibold">{formatPrice(pack.price)}</span>}
                    <span className="w-10 h-10 rounded-full border border-forest-dark/15 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white group-hover:border-terracotta transition-colors">
                      <i className="bi bi-arrow-right rtl:rotate-180"></i>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------- Pilgrimage — light band -------------------- */

function Pilgrimage({ t }) {
  const features = [
    { icon: 'bi-buildings-fill', title: t('home.pilgrimage.feat1Title'), desc: t('home.pilgrimage.feat1Desc') },
    { icon: 'bi-people-fill', title: t('home.pilgrimage.feat2Title'), desc: t('home.pilgrimage.feat2Desc') },
  ];

  return (
    <section id="pilgrimage" className="py-24 md:py-32 bg-[#F3ECDD] relative overflow-hidden border-b border-forest-dark/10">
      <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* Image collage — arch masked */}
        <div className="lg:col-span-5 relative h-[54vh] lg:h-[70vh]">
          <Reveal variant="image" className="absolute top-0 start-0 w-4/5 h-4/5 rounded-t-[9999px] overflow-hidden shadow-soft-lg z-10">
            <img
              src="https://images.unsplash.com/photo-1565552643982-26178cb6890d?auto=format&fit=crop&w=900&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={2} className="absolute bottom-0 end-0 w-1/2 h-1/2 rounded-[1.5rem] overflow-hidden shadow-soft border-4 border-white z-20">
            <img
              src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80"
              alt={t('hadj.titleArabic')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>

        {/* Text */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-sm text-terracotta">03</span>
              <span className="h-px w-10 bg-terracotta/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('home.pilgrimage.kicker')}</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest-dark leading-tight mb-6">
              {t('home.pilgrimage.title1')}{' '}
              <span className="italic font-light text-forest-dark/40">{t('home.pilgrimage.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-lg text-forest-dark/60 leading-relaxed max-w-lg mb-10">
              {t('home.pilgrimage.body')}
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {features.map((f, idx) => (
              <Reveal key={f.title} delay={idx + 1}>
                <div className="card p-6 h-full">
                  <div className="w-11 h-11 rounded-xl bg-copper/10 text-copper flex items-center justify-center mb-4">
                    <i className={`bi ${f.icon} text-lg`}></i>
                  </div>
                  <h4 className="font-semibold text-forest-dark mb-1">{f.title}</h4>
                  <p className="text-sm text-forest-dark/60">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={3}>
            <Link
              to="/hadj-omra/"
              className="med-btn"
            >
              {t('home.pilgrimage.cta')}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Destinations grid ----------------------- */

function Destinations({ t, destinations, loading }) {
  return (
    <section id="destinations" className="py-24 bg-[#FFF8F0] border-b border-forest-dark/10">
      <div className="container-site">
        <Reveal>
          <div className="flex items-center gap-4 mb-5">
            <span className="font-mono text-sm text-terracotta">04</span>
            <span className="h-px w-10 bg-terracotta/40" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('dest.kicker')}</span>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-4xl md:text-5xl text-forest-dark mb-14">
            {t('home.grid.title')}
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-forest-dark/10" />
              ))
            : destinations.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Contact ----------------------------- */

function Contact({ t }) {
  const items = [
    { icon: 'bi-geo-alt', title: t('home.contactAddress'), body: 'El Bayadh, Algérie' },
    { icon: 'bi-envelope', title: t('home.contactEmail'), body: 'contact@elbayadhtravels.dz', href: 'mailto:contact@elbayadhtravels.dz' },
    { icon: 'bi-phone', title: t('home.contactPhone'), body: '+213 (0) 00 00 00 00' },
  ];

  return (
    <section id="contact" className="container-site py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Reveal>
          <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('contact.kicker')}</span>
          <h2 className="font-display text-4xl text-forest-dark">{t('home.contact.title')}</h2>
          <OliveDivider />
          <p className="mt-3 text-forest-dark/60">{t('home.contact.subtitle')}</p>
        </Reveal>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((c) => (
          <div key={c.title} className="card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
              <i className={`bi ${c.icon}`}></i>
            </div>
            <h4 className="mt-4 text-lg font-semibold text-forest-dark">{c.title}</h4>
            <div className="mx-auto my-4 h-px w-12 bg-copper/40" />
            {c.href ? (
              <a href={c.href} className="text-sm text-forest-dark/70">{c.body}</a>
            ) : (
              <p className="text-sm text-forest-dark/70">{c.body}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Composition --------------------------- */

function HomeV1() {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .destinations()
      .then(setDestinations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="theme-mediterraneo">
      <style>{medCss}</style>

      <Hero t={t} destinations={destinations} />
      <Intro t={t} destinations={destinations} />
      <Spotlight t={t} destinations={destinations} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />

      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20 border-b border-forest-dark/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(var(--c-copper)/0.06),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-50" />
        <div className="container-site relative">
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl text-sand-light">{t('home.weather.title')}</h2>
            <p className="mt-3 text-sand-dark max-w-xl mx-auto">{t('home.weather.subtitle')}</p>
          </div>
          <div className="mt-10">
            <WeatherWidget initialCity="El Bayadh" />
          </div>
        </div>
      </section>

      <div className="med-tile h-5 w-full" aria-hidden="true" />
      <CtaBanner />
      <Contact t={t} />
    </div>
  );
}

export default HomeV1;
