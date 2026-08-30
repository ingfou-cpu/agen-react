import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatDate, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  V2 — Esprit Terres Touareg                                         */
/*  Warm editorial redesign in the spirit of terres-touareg.com:       */
/*  full-screen photo-slider hero, Agadez-cross motif, numbered        */
/*  circuit cards, photo-led immersion sections and a journal preview. */
/* ------------------------------------------------------------------ */

/* ------------------- Aurora Borealis page theme -------------------- */
/*  Page-scoped glassmorphism. Dark icy night with drifting aurora     */
/*  gradients, frosted panels and a system-ui typographic voice.        */
const auroraCss = `
.theme-aurora {
  --c-forest-darker: 6 10 24;
  --c-forest-dark: 11 18 32;
  --c-forest: 16 28 52;
  --c-forest-light: 28 46 78;
  --c-cream: 9 18 40;
  --c-sand: 20 34 60;
  --c-sand-light: 11 22 46;
  --c-sand-dark: 150 170 198;
  --c-copper: 138 108 232;
  --c-copper-light: 170 150 245;
  --c-copper-dark: 96 70 190;
  --c-gold: 63 216 232;
  --c-accent: 63 200 184;
  --c-accent-light: 92 222 204;
  --c-accent-dark: 40 150 138;
  color: #dce6f2;
  background:
    radial-gradient(1200px 700px at 15% -10%, rgba(138,108,232,0.18), transparent 60%),
    radial-gradient(900px 600px at 100% 0%, rgba(63,216,232,0.14), transparent 55%),
    radial-gradient(1000px 800px at 50% 120%, rgba(46,111,149,0.16), transparent 60%),
    #060a18;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color-scheme: dark;
}
html:has(.theme-aurora) body { background: #060a18 !important; }
.theme-aurora .font-display,
.theme-aurora h1, .theme-aurora h2, .theme-aurora h3 {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.theme-aurora .text-sand-light { color: #eaf1fb !important; }
.theme-aurora .text-forest-dark { color: #dce6f2 !important; }
.theme-aurora .text-forest-dark\\/60 { color: rgba(220,230,242,0.6) !important; }
.theme-aurora .text-forest-dark\\/70 { color: rgba(220,230,242,0.72) !important; }
.theme-aurora .text-forest-dark\\/50 { color: rgba(220,230,242,0.5) !important; }
.theme-aurora .text-sand-dark { color: #aab8ce !important; }
.theme-aurora .text-copper { color: #b9a6f7 !important; }
.theme-aurora .text-copper-light { color: #cdb6ff !important; }
.theme-aurora .bg-cream {
  background-color: rgba(9,18,40,0.55) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.theme-aurora .bg-white {
  background-color: rgba(220,230,242,0.05) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(220,230,242,0.12) !important;
  box-shadow: 0 30px 60px -30px rgba(3,5,14,0.6) !important;
}
.theme-aurora .card {
  background-color: rgba(220,230,242,0.05) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(220,230,242,0.12) !important;
  box-shadow: 0 30px 60px -30px rgba(3,5,14,0.6) !important;
}
.theme-aurora .border-forest-dark\\/5 { border-color: rgba(220,230,242,0.10) !important; }
.theme-aurora .border-forest-dark\\/10 { border-color: rgba(220,230,242,0.14) !important; }
.theme-aurora .ring-forest-dark\\/5 { --tw-ring-color: rgba(220,230,242,0.10) !important; }
.theme-aurora .btn.bg-copper,
.theme-aurora .bg-copper {
  background-color: rgba(138,108,232,0.22) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(170,150,245,0.5) !important;
  color: #f1eeff !important;
  box-shadow: 0 10px 30px -10px rgba(138,108,232,0.5) !important;
}
.theme-aurora .btn-outline {
  background-color: rgba(220,230,242,0.04) !important;
  border-color: rgba(170,150,245,0.45) !important;
  color: #cdb6ff !important;
  backdrop-filter: blur(10px);
}
.theme-aurora .btn-outline:hover { background-color: rgba(138,108,232,0.18) !important; }
.theme-aurora .hover\\:bg-white:hover {
  background-color: rgba(220,230,242,0.16) !important;
  color: #eaf1fb !important;
}
.theme-aurora section.bg-terracotta {
  background: linear-gradient(120deg, rgba(20,16,46,0.92), rgba(8,26,42,0.92)) !important;
  backdrop-filter: blur(6px);
}
.theme-aurora section.bg-terracotta .bg-white {
  background-color: rgba(220,230,242,0.16) !important;
  color: #eaf1fb !important;
  border: 1px solid rgba(220,230,242,0.4) !important;
  backdrop-filter: blur(10px);
}
.theme-aurora section.bg-terracotta .hover\\:bg-forest-darker:hover {
  background-color: rgba(220,230,242,0.28) !important;
  color: #eaf1fb !important;
}
.theme-aurora section.bg-terracotta .text-terracotta { color: #cdb6ff !important; }
.theme-aurora .text-red-300 { color: #ff9db0 !important; }
.theme-aurora .text-red-400 { color: #ff9db0 !important; }
.theme-aurora .aurora-blob { position: absolute; border-radius: 9999px; filter: blur(80px); mix-blend-mode: screen; pointer-events: none; opacity: 0.7; }
.theme-aurora .aurora-blob-1 { width: 46rem; height: 46rem; left: -8rem; top: -10rem; background: radial-gradient(circle, rgba(164,28,140,0.55), transparent 65%); animation: auroraDrift 16s ease-in-out infinite; }
.theme-aurora .aurora-blob-2 { width: 40rem; height: 40rem; right: -6rem; top: 6rem; background: radial-gradient(circle, rgba(63,216,232,0.5), transparent 65%); animation: auroraDrift 20s ease-in-out infinite reverse; }
.theme-aurora .aurora-blob-3 { width: 34rem; height: 34rem; left: 30%; bottom: -12rem; background: radial-gradient(circle, rgba(46,111,149,0.5), transparent 65%); animation: auroraDrift 24s ease-in-out infinite; }
@keyframes auroraDrift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, 4rem, 0) scale(1.12); }
}
html[lang='ar'] .theme-aurora h1,
html[lang='ar'] .theme-aurora h2,
html[lang='ar'] .theme-aurora h3,
html[lang='ar'] .theme-aurora .font-display { font-family: 'Amiri', system-ui, sans-serif !important; text-transform: none !important; }
.theme-aurora :focus-visible { outline-color: #dce6f2; }
`;

/* --------------------- Agadez-cross motif -------------------------- */

function Cross({ className = 'h-10 w-10' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="11" />
      <path d="M24 4v9M24 35v9M4 24h9M35 24h9" />
      <circle cx="24" cy="4" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="24" cy="44" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="24" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="44" cy="24" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ------------------- Hero — full-screen photo slider ---------------- */

function Hero({ t, destinations }) {
  const [idx, setIdx] = useState(0);
  const slides = destinations.filter((d) => d.image).slice(0, 5);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-forest-darker pb-20 pt-24">
      {/* Rotating backdrop */}
      {slides.map((d, i) => (
        <img
          key={d.id}
          src={mediaUrl(d.image)}
          alt={d.name}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
            i === idx ? 'opacity-40' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-darker/85 via-forest-darker/45 to-forest-darker" />
      <div className="pointer-events-none absolute inset-0 pattern-star opacity-20" />
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      {/* Cross watermark */}
      <Cross className="pointer-events-none absolute -bottom-14 -end-14 h-80 w-80 text-sand-light/10" />

      <div className="container-site relative z-10 mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-sand-light backdrop-blur">
            <Cross className="h-4 w-4 text-copper" />
            {t('home.v2.heroKicker')}
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="mx-auto mt-8 max-w-4xl font-display text-4xl leading-[1.08] text-sand-light md:text-6xl lg:text-7xl">
            {t('home.v2.heroTitle1')} <br className="hidden md:block" />
            <span className="italic text-copper-light">{t('home.v2.heroTitle2')}</span>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-sand-dark md:text-xl">
            {t('home.v2.heroSub')}
          </p>
        </Reveal>

        <Reveal delay={3}>
          <Link
            to="/circuit/"
            className="btn mt-10 bg-copper px-9 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-colors duration-300 hover:bg-white hover:text-forest-darker"
          >
            {t('home.v2.heroCta')}
          </Link>
        </Reveal>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-8 bg-copper' : 'w-3 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-widest text-sand-dark">
        <span>{t('cta.details')}</span>
        <i className="bi bi-chevron-down animate-bounce"></i>
      </div>
    </section>
  );
}

/* --------------------- Propos — intro editorial --------------------- */

function Propos({ t, packs }) {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const upcoming = packs
    .filter((p) => p.date && new Date(p.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  return (
    <section className="bg-cream py-24 text-center dark:bg-forest-darker md:py-32">
      <div className="container-site">
        <Reveal>
          <Cross className="mx-auto h-12 w-12 text-copper" />
        </Reveal>

        <Reveal delay={1}>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-tight text-forest-dark dark:text-sand-light md:text-5xl">
            {t('home.v2.proposTitle1')} <br className="hidden md:block" />
            <span className="italic text-copper">{t('home.v2.proposTitle2')}</span>
          </h2>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-5 font-display text-xl italic text-forest-dark/60 dark:text-sand-dark">
            {t('home.v2.proposSubtitle')}
          </p>
        </Reveal>

        <Reveal delay={2}>
          <p className="mx-auto mt-6 max-w-2xl font-light leading-relaxed text-forest-dark/70 dark:text-sand-dark">
            {t('home.v2.proposBody')}
          </p>
        </Reveal>

        {upcoming.length > 0 && (
          <Reveal delay={3}>
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-forest-dark/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-forest-dark md:p-8">
              <div className="mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-copper">
                <i className="bi bi-calendar-event"></i>
                {t('home.v2.departuresTitle')}
              </div>
              <ul className="space-y-1">
                {upcoming.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/circuitChoisi/${p.id}/`}
                      className="group flex flex-col gap-1 rounded-xl px-3 py-2 text-start transition hover:bg-copper/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm font-medium text-forest-dark transition-colors group-hover:text-copper dark:text-sand-light">
                        {p.pack_name}
                      </span>
                      <span className="text-xs text-forest-dark/60 dark:text-sand-dark">
                        <i className="bi bi-calendar2-week me-1"></i>
                        {formatDate(p.date)}
                        {p.duration ? ` · ${p.duration} ${t('home.v2.days')}` : ''}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        <Reveal delay={3}>
          <Link
            to="/circuit/"
            className="btn-outline mt-10 px-8 py-3.5 text-sm font-bold uppercase tracking-wider"
          >
            {t('home.v2.heroCta')}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------- Circuits — numbered cards -------------------- */

function Circuits({ t, packs, loading }) {
  if (loading) {
    return (
      <section className="bg-cream py-24 dark:bg-forest-darker">
        <div className="container-site flex justify-center py-16">
          <Spinner />
        </div>
      </section>
    );
  }
  if (!packs.length) return null;

  const show = packs.slice(0, 4);

  return (
    <section id="circuits" className="bg-cream pb-24 dark:bg-forest-darker md:pb-32">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-copper">
              {t('home.circuits.kicker')}
            </span>
            <h2 className="mt-3 font-display text-4xl text-forest-dark dark:text-sand-light md:text-5xl">
              {t('home.circuits.title')}
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 space-y-6">
          {show.map((pack, i) => (
            <Reveal key={pack.id} delay={(i % 2) + 1}>
              <Link
                to={`/circuitChoisi/${pack.id}/`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-forest-dark/5 transition duration-300 hover:-translate-y-1 hover:shadow-soft md:flex-row dark:bg-forest-dark dark:ring-white/5"
              >
                <div className="relative w-full shrink-0 overflow-hidden md:w-[42%]">
                  <img
                    src={mediaUrl(pack.image || pack.image_circuit)}
                    alt={pack.pack_name}
                    className="h-56 w-full object-cover transition duration-700 group-hover:scale-105 md:h-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6 md:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-copper">
                      {t('home.v2.circuitNum')}
                      {i + 1}
                      {pack.city_name ? ` — ${pack.city_name}` : ''}
                    </span>
                    {pack.price && (
                      <span className="text-lg font-semibold text-forest-dark dark:text-sand-light">
                        {formatPrice(pack.price)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-forest-dark/50 dark:text-sand-dark">
                    {pack.date ? formatDate(pack.date) : '—'}
                    {pack.duration ? ` · ${pack.duration} ${t('home.v2.days')}` : ''}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-forest-dark transition-colors group-hover:text-copper dark:text-sand-light">
                    {pack.pack_name}
                  </h3>
                  {pack.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-forest-dark/60 dark:text-sand-dark">
                      {pack.description}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-copper">
                    {t('home.v2.details')}
                    <i className="bi bi-arrow-right rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"></i>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Link
              to="/circuit/"
              className="btn bg-forest-dark px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-sand-light transition-colors duration-300 hover:bg-copper hover:text-white dark:bg-forest-darker"
            >
              {t('home.v2.viewAllCircuits')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------- Immersion — editorial split -------------------- */

function Immersion({ t, destinations }) {
  const imgs = destinations.filter((d) => d.image);
  const main = imgs[0];
  const sub = imgs[1];

  return (
    <section className="bg-sand-light/60 py-24 dark:bg-white/[0.02] md:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Collage */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {main ? (
            <Reveal variant="image" className="overflow-hidden rounded-[2rem] shadow-soft-lg">
              <img
                src={mediaUrl(main.image)}
                alt={main.name}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </Reveal>
          ) : (
            <div className="aspect-[4/5] w-full animate-pulse rounded-[2rem] bg-forest-dark/10 dark:bg-white/5" />
          )}
          {sub && (
            <Reveal
              delay={2}
              className="absolute -bottom-8 -end-4 w-2/5 overflow-hidden rounded-2xl border-4 border-cream shadow-2xl dark:border-forest-darker"
            >
              <img
                src={mediaUrl(sub.image)}
                alt={sub.name}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </Reveal>
          )}
          <Cross className="pointer-events-none absolute -start-6 -top-6 h-16 w-16 text-copper/30" />
        </div>

        {/* Text */}
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-copper">
              <Cross className="h-4 w-4" />
              {t('home.v2.immersionKicker')}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-5 font-display text-3xl leading-tight text-forest-dark dark:text-sand-light md:text-5xl">
              {t('home.v2.immersionTitle')}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-lg font-light leading-relaxed text-forest-dark/70 dark:text-sand-dark">
              {t('home.v2.immersionBody')}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <Link
              to="/about/"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-copper transition-all hover:gap-3"
            >
              {t('home.v2.immersionLink')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Gallery — full-bleed strip ------------------- */

function Gallery({ t, destinations }) {
  const imgs = destinations.filter((d) => d.image).slice(0, 8);
  if (!imgs.length) return null;

  return (
    <section aria-label={t('home.grid.title')} className="bg-cream dark:bg-forest-darker">
      <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
        {imgs.map((d) => (
          <Link
            key={d.id}
            to={`/reselieuChoisi/${d.id}/`}
            className="group relative h-52 overflow-hidden md:h-64"
          >
            <img
              src={mediaUrl(d.image)}
              alt={d.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-forest-darker/0 transition duration-300 group-hover:bg-forest-darker/40" />
            <span className="absolute bottom-3 start-3 translate-y-2 text-xs font-semibold uppercase tracking-wider text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {d.city_name || d.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------- Engagements — commitments band ----------------- */

function Engagements({ t }) {
  const items = [
    { icon: 'bi-people-fill', title: t('home.v2.eng1Title'), desc: t('home.v2.eng1Desc') },
    { icon: 'bi-emoji-smile', title: t('home.v2.eng2Title'), desc: t('home.v2.eng2Desc') },
    { icon: 'bi-signpost-2-fill', title: t('home.v2.eng3Title'), desc: t('home.v2.eng3Desc') },
    { icon: 'bi-leaf', title: t('home.v2.eng4Title'), desc: t('home.v2.eng4Desc') },
  ];

  return (
    <section className="relative overflow-hidden bg-forest-darker py-24 text-sand-light md:py-32">
      <div className="pointer-events-none absolute -end-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-copper/10 blur-[120px]" />
      <div className="pointer-events-none absolute -start-32 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-terracotta/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 pattern-star opacity-25" />

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-copper">
              <Cross className="h-4 w-4" />
              {t('home.v2.engagementsKicker')}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-5 font-display text-3xl leading-tight text-sand-light md:text-5xl">
              {t('home.v2.engagementsTitle')}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-lg font-light leading-relaxed text-sand-dark">
              {t('home.v2.engagementsBody')}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <Link
              to="/about/"
              className="btn mt-10 bg-copper px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-colors duration-300 hover:bg-white hover:text-forest-darker"
            >
              {t('home.v2.engagementsCta')}
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) + 1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition duration-300 hover:border-copper/40 hover:bg-white/[0.07]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper/15 text-lg text-copper">
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <h3 className="mt-4 font-medium text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-sand-dark">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------- Pilgrimage — full-bleed invitation band ----------- */

function PilgrimageBand({ t }) {
  return (
    <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1565552643982-27ce6f4ed6f6?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-forest-darker/70" />
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-20" />

      <div className="container-site relative z-10 py-24 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-sand-light backdrop-blur">
            <i className="bi bi-moon-stars-fill text-copper"></i>
            {t('home.v2.bandKicker')}
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-tight text-sand-light md:text-6xl">
            {t('home.v2.bandTitle')}
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mx-auto mt-5 max-w-xl font-light text-sand-dark md:text-lg">
            {t('home.v2.bandBody')}
          </p>
        </Reveal>
        <Reveal delay={3}>
          <Link
            to="/hadj-omra/"
            className="btn mt-9 bg-copper px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-colors duration-300 hover:bg-white hover:text-forest-darker"
          >
            {t('home.v2.bandCta')}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------- Journal — blog preview ------------------------ */

function Journal({ t }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .blogPosts()
      .then((all) => setPosts(all.filter((p) => p.published).slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="journal" className="bg-cream py-24 dark:bg-forest-darker">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-copper">
                {t('home.v2.journalKicker')}
              </span>
              <h2 className="mt-3 font-display text-4xl text-forest-dark dark:text-sand-light md:text-5xl">
                {t('home.v2.journalTitle')}
              </h2>
            </div>
            <Link
              to="/blog/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-copper transition-all hover:gap-3"
            >
              {t('home.v2.journalAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-white/60 dark:bg-white/5" />
              ))
            : posts.map((post, i) => (
                <Reveal key={post.id} delay={i + 1}>
                  <Link
                    to={`/blog/${post.slug}/`}
                    className="group block h-full overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-forest-dark/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft dark:bg-forest-dark dark:ring-white/5"
                  >
                    {post.image && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={mediaUrl(post.image)}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-wide text-forest-dark/50 dark:text-sand-dark">
                        {formatDate(post.created_at)}
                      </p>
                      <h3 className="mt-2 font-display text-xl leading-snug text-forest-dark transition-colors group-hover:text-copper dark:text-sand-light">
                        {post.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copper">
                        {t('home.v2.readArticle')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Contact ------------------------------- */

function Contact({ t }) {
  const items = [
    { icon: 'bi-geo-alt', title: t('home.contactAddress'), body: 'El Bayadh, Algérie' },
    {
      icon: 'bi-envelope',
      title: t('home.contactEmail'),
      body: 'contact@elbayadhtravels.dz',
      href: 'mailto:contact@elbayadhtravels.dz',
    },
    { icon: 'bi-phone', title: t('home.contactPhone'), body: '+213 (0) 00 00 00 00' },
  ];

  return (
    <section id="contact" className="bg-cream py-24 dark:bg-forest-darker">
      <div className="container-site">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-copper">
              {t('contact.kicker')}
            </span>
            <h2 className="mt-3 font-display text-4xl text-forest-dark dark:text-sand-light">
              {t('home.contact.title')}
            </h2>
            <p className="mt-3 text-forest-dark/60 dark:text-sand-dark">{t('home.contact.subtitle')}</p>
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((c) => (
            <Reveal key={c.title}>
              <div className="rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-forest-dark/5 dark:bg-forest-dark dark:ring-white/5">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-copper/15 text-2xl text-copper">
                  <i className={`bi ${c.icon}`}></i>
                </div>
                <h4 className="mt-4 text-lg font-semibold text-forest-dark dark:text-sand-light">{c.title}</h4>
                <div className="mx-auto my-4 h-px w-12 bg-copper/40" />
                {c.href ? (
                  <a href={c.href} className="text-sm text-forest-dark/70 dark:text-sand-dark">
                    {c.body}
                  </a>
                ) : (
                  <p className="text-sm text-forest-dark/70 dark:text-sand-dark">{c.body}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Terres Touareg info bar ------------------ */

function InfoBar({ t }) {
  const items = [
    { icon: 'bi-geo-alt', value: 'El Bayadh, Algérie' },
    { icon: 'bi-envelope', value: 'contact@elbayadhtravels.dz' },
    { icon: 'bi-phone', value: '+213 (0) 00 00 00 00' },
  ];
  return (
    <div className="bg-forest-dark py-3.5 text-sand-light">
      <div className="container-site flex flex-col items-center justify-center gap-2.5 text-xs sm:flex-row sm:gap-10">
        {items.map((f) => (
          <span key={f.icon} className="inline-flex items-center gap-2">
            <i className={`bi ${f.icon} text-copper`}></i>
            {f.value}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Composition ----------------------------- */

function HomeV2() {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.destinations(), api.packs()])
      .then(([d, p]) => {
        setDestinations(d);
        setPacks(p);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="theme-aurora">
      <style>{auroraCss}</style>
      <Hero t={t} destinations={destinations} />
      <InfoBar t={t} />
      <Propos t={t} packs={packs} />
      <Circuits t={t} packs={packs} loading={loading} />
      <Immersion t={t} destinations={destinations} />
      <Gallery t={t} destinations={destinations} />
      <Engagements t={t} />
      <PilgrimageBand t={t} />
      <Journal t={t} />

      <section
        id="weather"
        className="border-t border-forest-dark/5 bg-sand-light/60 py-20 dark:border-white/5 dark:bg-white/[0.02]"
      >
        <div className="container-site">
          <div className="text-center">
            <h2 className="font-display text-4xl text-forest-dark dark:text-sand-light md:text-5xl">
              {t('home.weather.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-forest-dark/60 dark:text-sand-dark">
              {t('home.weather.subtitle')}
            </p>
          </div>
          <div className="mt-10">
            <WeatherWidget initialCity="El Bayadh" />
          </div>
        </div>
      </section>

      <CtaBanner />
      <Contact t={t} />
    </div>
  );
}

export default HomeV2;
