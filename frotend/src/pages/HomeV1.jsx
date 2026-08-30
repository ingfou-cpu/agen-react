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
/*  V1 — Precision Technology (Estilo de Tecnología de Precisión)      */
/*  Industrial-precision, cleanroom aesthetic: hairline grids are      */
/*  structural, Roboto 700 display + JetBrains Mono technical meta,    */
/*  measurement ticks, HUD annotations, electric-cyan accents on       */
/*  industrial navy. All styling is scoped to the `.theme-precision`   */
/*  wrapper: the --c-* tokens are redefined there (so every Tailwind   */
/*  color utility recolors automatically), plus a page-scoped <style>  */
/*  block. No global tokens / shared files are touched.                */
/* ------------------------------------------------------------------ */

/* Reticle-style measurement rule used sparingly under section titles */
function SpecRule() {
  return (
    <svg
      width="96"
      height="16"
      viewBox="0 0 96 16"
      fill="none"
      aria-hidden="true"
      className="my-5 opacity-90"
    >
      <path d="M0 8 H96" stroke="#00BFFF" strokeWidth="1" />
      <path d="M14 4 V12 M28 4 V12 M42 4 V12 M56 4 V12 M70 4 V12 M84 4 V12" stroke="#003366" strokeWidth="1" />
      <rect x="44.5" y="5.5" width="7" height="5" fill="#00BFFF" />
    </svg>
  );
}

/* Numbered callout badge + overline kicker (precision style) */
function SectionTag({ num, label }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="w-9 h-9 rounded-[4px] border border-copper/50 bg-white text-terracotta font-mono text-sm flex items-center justify-center shadow-[0_2px_8px_rgba(0,51,102,0.08)]">
        {num}
      </span>
      <span className="h-px w-10 bg-copper/60" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{label}</span>
    </div>
  );
}

const precisionCss = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Roboto:wght@400;500;700&display=swap');

.theme-precision {
  /* Palette remap — scoped to this page only (values are R G B triplets) */
  --c-cream: 255 255 255;          /* Cleanroom White */
  --c-sand-light: 255 255 255;     /* Cleanroom White */
  --c-sand: 224 224 224;           /* Cinza Claro */
  --c-sand-dark: 192 192 192;      /* Prata */
  --c-forest: 0 51 102;            /* Azul Industrial (primary) */
  --c-forest-dark: 10 10 10;       /* Off-black ink */
  --c-forest-darker: 13 20 32;     /* Deep engineering charcoal */
  --c-forest-light: 0 191 255;     /* Azul Eléctrico */
  --c-copper: 0 191 255;           /* Azul Eléctrico */
  --c-copper-light: 92 217 255;    /* Soft cyan */
  --c-copper-dark: 0 51 102;       /* Azul Industrial */
  --c-gold: 192 192 192;           /* Prata */
  --c-accent: 0 51 102;            /* Azul Industrial */
  --c-accent-light: 0 191 255;     /* Azul Eléctrico */
  --c-accent-dark: 0 51 102;       /* Azul Industrial */
  position: relative;
  background-color: #FFFFFF;
}
/* Hairline engineering grid — structural, not decorative */
.theme-precision .grid-lines {
  background-image:
    linear-gradient(rgba(0, 51, 102, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 51, 102, 0.045) 1px, transparent 1px);
  background-size: 20px 20px;
}
.theme-precision .grid-lines-dark {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 20px 20px;
}
/* Faint CRT/oscilloscope striation for dark surfaces */
.theme-precision .scanlines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.035) 0px,
    rgba(255, 255, 255, 0.035) 1px,
    transparent 1px,
    transparent 4px
  );
}
/* Industrial display — Roboto bold, tight tracking */
.theme-precision h1,
.theme-precision h2,
.theme-precision h3,
.theme-precision h4,
.theme-precision .font-display {
  font-family: 'Roboto', 'Inter', system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* Preserve Arabic font + natural case for RTL */
html[lang='ar'] .theme-precision h1,
html[lang='ar'] .theme-precision h2,
html[lang='ar'] .theme-precision h3,
html[lang='ar'] .theme-precision h4,
html[lang='ar'] .theme-precision .font-display {
  font-family: 'Amiri', 'Playfair Display', Georgia, serif;
}
/* Tech metadata — JetBrains Mono (HUD annotations, spec values) */
.theme-precision .tech-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
/* Primary button — industrial navy, 8px radius */
.theme-precision .med-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #003366;
  color: #FFFFFF;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: background-color .2s ease, transform .2s ease, box-shadow .2s ease;
  cursor: pointer;
  text-decoration: none;
}
.theme-precision .med-btn:hover {
  background: #00254a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.theme-precision .med-btn:active {
  transform: translateY(-1px) scale(0.98);
}
.theme-precision .med-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: #003366;
  border: 1.5px solid #E0E0E0;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  transition: background-color .2s ease, color .2s ease, transform .2s ease;
  cursor: pointer;
  text-decoration: none;
}
.theme-precision .med-btn-ghost:hover {
  background: #F0F4F8;
  transform: translateY(-2px);
}
.theme-precision .med-btn-ghost:active {
  transform: translateY(-1px) scale(0.98);
}
/* Cards — cleanroom white, hairline border, 8px radius */
.theme-precision .card {
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform .2s ease, box-shadow .2s ease;
}
.theme-precision .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px -12px rgba(0, 51, 102, 0.22);
}
/* DestinationCard "details" link -> industrial navy */
.theme-precision .card .mt-4.flex > span:last-child {
  color: #003366 !important;
}
/* Focus rings — electric cyan, 2px offset */
.theme-precision .input:focus {
  border-color: #00BFFF !important;
  box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.3) !important;
}
/* Cinematic reveals: fade + 16px rise, 420ms, 80ms stagger */
.theme-precision .reveal {
  transform: translateY(16px);
  transition: opacity .42s ease-out, transform .42s ease-out;
}
.theme-precision .reveal.visible {
  transform: translateY(0);
}
.theme-precision .reveal-delay-1 { transition-delay: .08s; }
.theme-precision .reveal-delay-2 { transition-delay: .16s; }
.theme-precision .reveal-delay-3 { transition-delay: .24s; }
/* Newsletter CTA (CtaBanner) — industrial navy band, cyan accents */
.theme-precision section.bg-terracotta {
  background:
    linear-gradient(180deg, rgba(0, 191, 255, 0.08), transparent),
    #003366 !important;
  color: #FFFFFF !important;
}
.theme-precision section.bg-terracotta .text-white { color: #FFFFFF !important; }
.theme-precision section.bg-terracotta .text-white\\/80 { color: rgba(255, 255, 255, 0.82) !important; }
.theme-precision section.bg-terracotta input {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
  color: #FFFFFF !important;
}
.theme-precision section.bg-terracotta input::placeholder { color: rgba(255, 255, 255, 0.6) !important; }
.theme-precision section.bg-terracotta input:focus {
  border-color: #00BFFF !important;
  box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.35) !important;
}
.theme-precision section.bg-terracotta button[type=submit] {
  background: #00BFFF !important;
  color: #00254a !important;
}
.theme-precision section.bg-terracotta button[type=submit]:hover {
  background: #5CD9FF !important;
  color: #00254a !important;
}
/* Weather band (WeatherWidget) — deep engineering charcoal, cyan readouts */
.theme-precision section.bg-forest-darker {
  background:
    linear-gradient(180deg, rgba(0, 191, 255, 0.07), transparent),
    #0D1420 !important;
}
.theme-precision .bg-forest-darker .text-sand-light { color: #FFFFFF !important; }
.theme-precision .bg-forest-darker .text-sand-dark { color: #C0C0C0 !important; }
.theme-precision .bg-forest-darker .text-red-300,
.theme-precision .bg-forest-darker .text-red-400 { color: #5CD9FF !important; }
.theme-precision .bg-forest-darker .border-copper\\/50 { border-color: rgba(0, 191, 255, 0.4) !important; }
.theme-precision .bg-forest-darker .bg-copper\\/10 { background: rgba(0, 191, 255, 0.12) !important; }
.theme-precision .bg-forest-darker .btn-primary {
  background: #00BFFF !important;
  color: #00254a !important;
  box-shadow: none !important;
}
.theme-precision .bg-forest-darker .input:focus {
  border-color: #00BFFF !important;
  box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.35) !important;
}
/* Schematic accent strip (replaces the tiled motif) */
.theme-precision .prec-tile {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='24'%3E%3Cpath d='M0 12 H60' stroke='%2300BFFF' stroke-width='1'/%3E%3Cpath d='M10 8 V16 M20 8 V16 M30 8 V16 M40 8 V16 M50 8 V16' stroke='%23003366' stroke-width='1'/%3E%3Crect x='28.5' y='10.5' width='3' height='3' fill='%2300BFFF'/%3E%3Crect x='48.5' y='10.5' width='3' height='3' fill='%23C0C0C0'/%3E%3C/svg%3E");
  background-size: 60px 24px;
  opacity: 0.85;
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
    <section className="relative min-h-[88svh] flex flex-col overflow-hidden bg-white">
      {/* Hairline engineering grid + faint laser-wash */}
      <div className="pointer-events-none absolute inset-0 grid-lines" />
      <div className="pointer-events-none absolute -top-32 -end-32 w-[28rem] h-[28rem] rounded-full bg-[#00BFFF]/5" />

      <div className="container-site relative flex-1 flex flex-col justify-center py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="tech-mono text-[0.75rem] uppercase tracking-[0.3em] text-terracotta border-s-2 border-copper ps-4 mb-6">
                {t('home.hero2.kicker')}
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-forest-dark leading-[0.95]">
                {t('home.hero2.title1')}
                <br />
                <span className="block font-normal text-forest-dark/45 mt-2">{t('home.hero2.title2')}</span>
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
            <Reveal delay={1} variant="image" className="relative h-[420px] lg:h-[560px] w-full rounded-lg overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
              <img
                src={bgImg}
                alt={featured ? featured.name : 'Algérie'}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* HUD annotations — engineering readouts */}
              <span className="pointer-events-none absolute top-4 start-4 z-10 tech-mono text-[0.65rem] tracking-[0.2em] bg-white/85 border border-black/5 px-3 py-1.5 text-terracotta">
                REF-010 // SAHARA GRID
              </span>
              <span className="pointer-events-none absolute bottom-4 end-4 z-10 tech-mono text-[0.65rem] tracking-[0.2em] bg-[#0D1420]/85 px-3 py-1.5 text-copper">
                ±0.02°
              </span>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="container-site relative pb-10">
        <div className="flex items-end justify-between border-t border-forest-dark/15 pt-6">
          <Reveal delay={2} className="flex items-center gap-3">
            <span className="tech-mono text-[0.7rem] tracking-[0.25em] text-copper">{'{'}</span>
            <p className="tech-mono text-[0.7rem] uppercase tracking-[0.2em] text-forest-dark/60 leading-tight">
              Rooted in tradition.
              <br />
              Committed to responsible travel.
            </p>
          </Reveal>
          {featured && (
            <Reveal delay={3} className="hidden sm:block text-right">
              <div className="tech-mono text-xs font-medium uppercase tracking-wider text-forest-dark/50 mb-1">
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
    <section className="py-24 lg:py-32 border-b border-forest-dark/10 bg-white">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <p className="text-overline-custom mb-6">{t('home.editorial.title1')}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest-dark leading-[1.05] mb-8">
            {t('home.editorial.title1')}
            <br />
            <span className="font-normal text-forest-dark/40">{t('home.editorial.title2')}</span>
          </h2>
          <SpecRule />
          <p className="text-forest-dark/60 leading-relaxed max-w-md">
            {t('home.editorial.body')}
          </p>
        </Reveal>
        <Reveal delay={1} variant="image" className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden shadow-soft ring-1 ring-black/5">
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
    <section className="py-24 md:py-32 bg-[#F0F4F8] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-lines" />
      <div className="container-site relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal variant="image" className="lg:col-span-6 rounded-lg overflow-hidden shadow-soft ring-1 ring-black/5">
          <img src={mediaUrl(d.image)} alt={d.name} className="w-full h-[52vh] object-cover" loading="lazy" />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <SectionTag num="01" label={t('dest.kicker')} />
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
            <div className="rounded-lg border border-black/5 bg-white p-6 mb-8 max-w-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-2xl text-forest-dark">{d.name}</h4>
                <span className="tech-mono text-copper font-medium text-sm">{t('common.from')} {formatPrice(d.price)}</span>
              </div>
              <p className="text-sm text-forest-dark/60 line-clamp-3">{d.description}</p>
              <Link
                to={`/reselieuChoisi/${d.id}/`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:text-copper hover:gap-3 transition-all"
              >
                {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <Link
              to="/destinations/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:text-copper transition-colors"
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
      <section className="py-24 bg-white">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const list = rest.slice(0, 3);

  return (
    <section id="circuits" className="py-24 md:py-32 bg-white border-b border-forest-dark/10">
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <Reveal>
              <SectionTag num="02" label={t('home.circuits.kicker')} />
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
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:text-copper transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </Reveal>
        </div>

        {/* Featured card */}
        <Reveal>
          <Link
            to={`/circuitChoisi/${main.id}/`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5 hover:-translate-y-1.5 hover:shadow-[0_14px_34px_-14px_rgba(0,51,102,0.25)] transition duration-300"
          >
            <div className="md:col-span-7 aspect-[16/10] md:aspect-auto overflow-hidden relative">
              <span className="absolute top-4 left-4 z-10 bg-terracotta text-white text-[0.6rem] uppercase tracking-widest px-3 py-1.5 rounded-[4px]">
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
              <div className="tech-mono text-forest-dark/50 text-sm font-medium mb-3">
                {main.date ? formatDate(main.date) : '—'}
              </div>
              <h3 className="font-display text-3xl text-forest-dark mb-4 group-hover:text-terracotta transition-colors">
                {main.pack_name}
              </h3>
              <p className="text-forest-dark/60 line-clamp-3 mb-6">{main.description}</p>
              <div className="flex items-center justify-between">
                {main.price && (
                  <span className="tech-mono text-copper font-semibold text-lg">{formatPrice(main.price)}</span>
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
                  className="group flex flex-col md:flex-row md:items-center gap-4 py-6 hover:bg-[#F0F4F8]/80 rounded-lg px-4 -mx-4 transition-colors"
                >
                  <span className="tech-mono text-sm text-copper/70 w-8">{String(idx + 2).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <h4 className="font-display text-xl text-forest-dark group-hover:text-terracotta transition-colors">
                      {pack.pack_name}
                    </h4>
                    <p className="text-sm text-forest-dark/50 mt-1 line-clamp-1">{pack.description}</p>
                  </div>
                  <div className="flex items-center gap-6 md:gap-10 text-sm">
                    {pack.date && <span className="tech-mono text-forest-dark/50">{formatDate(pack.date)}</span>}
                    {pack.price && <span className="tech-mono text-copper font-medium">{formatPrice(pack.price)}</span>}
                    <span className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white group-hover:border-terracotta transition-colors">
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
    <section id="pilgrimage" className="py-24 md:py-32 bg-[#F0F4F8] relative overflow-hidden border-b border-forest-dark/10">
      <div className="pointer-events-none absolute inset-0 grid-lines" />
      <div className="container-site relative grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* Image collage — straight precision frames */}
        <div className="lg:col-span-5 relative h-[54vh] lg:h-[70vh]">
          <Reveal variant="image" className="absolute top-0 start-0 w-4/5 h-4/5 rounded-lg overflow-hidden shadow-soft-lg ring-1 ring-black/5 z-10">
            <img
              src="https://images.unsplash.com/photo-1565552643982-26178cb6890d?auto=format&fit=crop&w=900&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={2} className="absolute bottom-0 end-0 w-1/2 h-1/2 rounded-lg overflow-hidden shadow-soft border-4 border-[#F0F4F8] ring-1 ring-black/5 z-20">
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
            <SectionTag num="03" label={t('home.pilgrimage.kicker')} />
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest-dark leading-tight mb-6">
              {t('home.pilgrimage.title1')}{' '}
              <span className="font-normal text-forest-dark/40">{t('home.pilgrimage.title2')}</span>
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
                  <div className="w-11 h-11 rounded-lg bg-copper/10 text-copper flex items-center justify-center mb-4">
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
    <section id="destinations" className="py-24 bg-white border-b border-forest-dark/10">
      <div className="container-site">
        <Reveal>
          <SectionTag num="04" label={t('dest.kicker')} />
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
          <span className="tech-mono text-copper text-xs font-medium uppercase tracking-widest block mb-3">{t('contact.kicker')}</span>
          <h2 className="font-display text-4xl text-forest-dark">{t('home.contact.title')}</h2>
          <div className="flex justify-center"><SpecRule /></div>
          <p className="mt-3 text-forest-dark/60">{t('home.contact.subtitle')}</p>
        </Reveal>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((c) => (
          <div key={c.title} className="card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-copper/10 text-2xl text-copper">
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
    <div className="theme-precision">
      <style>{precisionCss}</style>

      <Hero t={t} destinations={destinations} />
      <Intro t={t} destinations={destinations} />
      <Spotlight t={t} destinations={destinations} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />

      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20 border-b border-forest-dark/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(var(--c-copper)/0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 grid-lines-dark" />
        <div className="pointer-events-none absolute inset-0 scanlines" />
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

      <div className="prec-tile h-6 w-full" aria-hidden="true" />
      <CtaBanner />
      <Contact t={t} />
    </div>
  );
}

export default HomeV1;