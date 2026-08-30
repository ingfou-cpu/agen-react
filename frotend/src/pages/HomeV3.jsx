import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  V3 — Retro Travel Poster (WPA / screen-print aesthetic)            */
/*  Warm paper surface, flat lithographic planes, bold condensed       */
/*  display type, hard-edged geometric depth. All styling is scoped    */
/*  to the `.theme-retro` wrapper so nothing global is touched.        */
/* ------------------------------------------------------------------ */

const retroCss = `
.theme-retro {
  position: relative;
  background-color: #F3EAD3;
}
/* Paper grain — screen-print noise overlay (inline feTurbulence) */
.theme-retro::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  opacity: 0.07;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}
/* Bold condensed display type */
.theme-retro h1,
.theme-retro h2,
.theme-retro h3,
.theme-retro .font-display {
  font-family: 'Anton', 'Playfair Display', Georgia, serif;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  font-weight: 700;
}
/* Preserve Arabic font + natural case for RTL */
html[lang='ar'] .theme-retro h1,
html[lang='ar'] .theme-retro h2,
html[lang='ar'] .theme-retro h3,
html[lang='ar'] .theme-retro .font-display {
  font-family: 'Amiri', 'Playfair Display', Georgia, serif;
  text-transform: none;
  letter-spacing: 0;
}
.theme-retro .retro-kicker {
  color: #A83E36;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.7rem;
  font-weight: 700;
}
.theme-retro .retro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #A83E36;
  color: #F3EAD3;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  box-shadow: 0 6px 18px -10px rgba(62, 47, 38, 0.6);
  transition: background-color .15s ease, transform .15s ease, box-shadow .15s ease;
  cursor: pointer;
  text-decoration: none;
}
.theme-retro .retro-btn:hover {
  background: #91342c;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -10px rgba(62, 47, 38, 0.6);
}
.theme-retro .retro-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -8px rgba(62, 47, 38, 0.6);
}
.theme-retro .retro-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: #A83E36;
  border: 1.5px solid #A83E36;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  transition: background-color .15s ease, color .15s ease, transform .15s ease;
  cursor: pointer;
  text-decoration: none;
}
.theme-retro .retro-btn-outline:hover {
  background: #A83E36;
  color: #F3EAD3;
  transform: translateY(-2px);
}
.theme-retro .retro-btn-outline:active {
  transform: translateY(-1px);
}
.theme-retro .retro-icon {
  background: #3E2F26;
  color: #E8B67C;
  border-radius: 0.5rem;
}
.theme-retro .card {
  background: #FBF5E6;
  border: 1px solid rgba(62, 47, 38, 0.18);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px -14px rgba(0, 0, 0, 0.06);
}
.theme-retro .card:hover {
  box-shadow: 0 14px 30px -16px rgba(0, 0, 0, 0.10);
}
.theme-retro .label {
  color: #3E2F26 !important;
  opacity: 0.7;
}
.theme-retro .input {
  background: #FBF5E6;
  border: 1px solid rgba(62, 47, 38, 0.25);
  color: #3E2F26;
}
.theme-retro .input::placeholder {
  color: rgba(62, 47, 38, 0.45);
}
.theme-retro .input:focus {
  border-color: #A83E36;
  box-shadow: 0 0 0 2px rgba(168, 62, 54, 0.25);
}

/* ---- Shared component overrides (page-scoped to .theme-retro) ---- */

/* Weather band (WeatherWidget) */
.theme-retro section.bg-forest-darker {
  background-color: #3E2F26 !important;
}
.theme-retro .bg-forest-darker .text-sand-light {
  color: #F3EAD3 !important;
}
.theme-retro .bg-forest-darker .text-sand-dark {
  color: #D4A574 !important;
}
.theme-retro .bg-forest-darker .text-red-300,
.theme-retro .bg-forest-darker .text-red-400 {
  color: #E8B67C !important;
}
.theme-retro .bg-forest-darker .border-copper\\/50 {
  border-color: rgba(232, 182, 124, 0.5) !important;
}
.theme-retro .bg-forest-darker .bg-copper\\/10 {
  background: rgba(232, 182, 124, 0.12) !important;
}
.theme-retro .bg-forest-darker .btn-primary {
  background: #A83E36 !important;
  color: #F3EAD3 !important;
  box-shadow: none !important;
}

/* Newsletter CTA (CtaBanner) */
.theme-retro section.bg-terracotta {
  background-color: #A83E36 !important;
  color: #F3EAD3 !important;
}
.theme-retro section.bg-terracotta .text-white {
  color: #F3EAD3 !important;
}
.theme-retro section.bg-terracotta .text-white\\/80 {
  color: rgba(243, 234, 211, 0.82) !important;
}
.theme-retro section.bg-terracotta input {
  background: rgba(243, 234, 211, 0.12) !important;
  border-color: rgba(243, 234, 211, 0.35) !important;
  color: #F3EAD3 !important;
}
.theme-retro section.bg-terracotta input::placeholder {
  color: rgba(243, 234, 211, 0.6) !important;
}
.theme-retro section.bg-terracotta button[type=submit] {
  background: #F3EAD3 !important;
  color: #A83E36 !important;
}
.theme-retro section.bg-terracotta button[type=submit]:hover {
  background: #E8B67C !important;
  color: #3E2F26 !important;
}
`;

/* ---------------------- Hero + quick search ------------------------ */

function Hero({ t }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/search/?q=${encodeURIComponent(q.trim())}` : '/search/');
  };

  return (
    <section className="relative overflow-hidden bg-[#F3EAD3] pt-24 lg:pt-28 pb-20 lg:pb-28">
      {/* Flat screen-printed planes: sun, forest + tan dunes */}
      <div className="pointer-events-none absolute -top-24 right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-[#A83E36]" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[#5B8A72]"
        style={{ clipPath: 'polygon(0 100%, 0 55%, 18% 70%, 38% 35%, 58% 62%, 78% 30%, 100% 58%, 100% 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[#E8B67C]"
        style={{ clipPath: 'polygon(0 100%, 0 70%, 22% 50%, 45% 72%, 68% 48%, 100% 70%, 100% 100%)' }}
      />

      <div className="container-site relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A83E36]/10 border border-[#A83E36]/20 retro-kicker mb-7">
              <i className="bi bi-patch-check-fill"></i> {t('home.hero2.kicker')}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-tight text-[#3E2F26]">
              {t('home.editorial.title1')} <br />
              <span className="text-[#A83E36]">{t('home.editorial.title2')}</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-lg text-lg text-[#3E2F26]/75 leading-relaxed">
              {t('home.hero2.tagline')}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link to="/destinations/" className="retro-btn">
                {t('home.hero.ctaDestinations')}
              </Link>
              <Link to="/circuit/" className="retro-btn-outline">
                {t('home.hero.ctaCircuits')}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Quick-search widget */}
        <div className="lg:col-span-5">
          <Reveal delay={2}>
            <form
              onSubmit={submit}
              className="card p-6 md:p-8 rounded-lg max-w-md w-full lg:ms-auto"
            >
              <div className="flex items-center gap-2 text-[#A83E36] mb-5">
                <i className="bi bi-search"></i>
                <span className="retro-kicker">{t('search.kicker')}</span>
              </div>

              <label className="label" htmlFor="v3-city">{t('common.destination')}</label>
              <div className="relative mt-2">
                <i className="bi bi-geo-alt absolute start-4 top-1/2 -translate-y-1/2 text-[#3E2F26]/40"></i>
                <input
                  id="v3-city"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="input !ps-11"
                />
              </div>

              <button
                type="submit"
                className="retro-btn w-full mt-5"
              >
                <i className="bi bi-arrow-right me-2 rtl:rotate-180"></i>
                {t('common.search')}
              </button>

              <p className="mt-4 text-center text-xs text-[#3E2F26]/60">
                {t('home.hero.featGuided')} · {t('home.hero.featNomad')} · {t('home.hero.featTransport')}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Destinations — bento grid ------------------- */

function Bento({ t, destinations, loading }) {
  const [main, ...rest] = destinations;
  const tiles = rest.slice(0, 4);

  return (
    <section id="destinations" className="py-24 bg-[#F3EAD3]">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="retro-kicker block mb-3">{t('dest.kicker')}</span>
              <h2 className="font-display text-4xl md:text-5xl text-[#3E2F26] tracking-tight">{t('home.grid.title')}</h2>
            </div>
            <Link
              to="/destinations/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#A83E36] hover:gap-3 transition-all"
            >
              {t('cta.seeMore')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`card animate-pulse bg-[#3E2F26]/10 ${i === 0 ? 'lg:col-span-2 lg:row-span-2 h-96' : 'h-48'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[10rem] gap-4">
            {/* Main hero tile */}
            {main && (
              <Reveal className="sm:col-span-2 row-span-2">
                <Link
                  to={`/reselieuChoisi/${main.id}/`}
                  className="group relative block h-full overflow-hidden rounded-lg ring-1 ring-[#3E2F26]/10 hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.18)] transition duration-300"
                >
                  <img
                    src={mediaUrl(main.image)}
                    alt={main.name}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[#3E2F26]" />
                  <div className="absolute bottom-0 p-6 text-[#F3EAD3]">
                    <span className="badge bg-[#F3EAD3] text-[#3E2F26] border border-[#3E2F26]/15 mb-3">
                      <i className="bi bi-geo-alt"></i> {main.city_name || 'Algérie'}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl">{main.name}</h3>
                    <p className="mt-1 text-sm text-[#F3EAD3]/80 line-clamp-2">{main.description}</p>
                    {main.price && <span className="mt-3 inline-block text-[#E8B67C] font-semibold">{t('common.from')} {formatPrice(main.price)}</span>}
                  </div>
                </Link>
              </Reveal>
            )}

            {tiles.map((d, idx) => (
              <Reveal key={d.id} delay={idx + 1}>
                <Link
                  to={`/reselieuChoisi/${d.id}/`}
                  className="group relative block h-full overflow-hidden rounded-lg ring-1 ring-[#3E2F26]/10 hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.18)] transition duration-300"
                >
                  <img
                    src={mediaUrl(d.image)}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#3E2F26]" />
                  <div className="absolute bottom-0 p-4 text-[#F3EAD3]">
                    <h3 className="font-display text-lg">{d.name}</h3>
                    {d.price && <span className="text-xs text-[#E8B67C] font-semibold">{t('common.from')} {formatPrice(d.price)}</span>}
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

/* ------------------------------ Why us ----------------------------- */

function WhyUs({ t }) {
  const features = [
    { icon: 'bi-compass-fill', title: t('home.hero.featGuided'), desc: t('about.value.securityBody') },
    { icon: 'bi-sunset-fill', title: t('home.hero.featNomad'), desc: t('about.value.passionBody') },
    { icon: 'bi-truck', title: t('home.hero.featTransport'), desc: t('about.value.reliabilityBody') },
    { icon: 'bi-shield-lock-fill', title: t('nav.payments'), desc: t('about.value.transparencyBody') },
  ];

  return (
    <section className="py-20 bg-[#EDE3CA]">
      <div className="container-site grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => (
          <Reveal key={f.title} delay={idx}>
            <div className="flex gap-4">
              <div className="retro-icon w-12 h-12 shrink-0 flex items-center justify-center text-xl">
                <i className={`bi ${f.icon}`}></i>
              </div>
              <div>
                <h4 className="font-semibold text-[#3E2F26] mb-1">{f.title}</h4>
                <p className="text-sm text-[#3E2F26]/65">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Circuits — price-forward --------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#EDE3CA]">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  return (
    <section id="circuits" className="py-24 bg-[#EDE3CA]">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="retro-kicker block mb-3">{t('home.circuits.kicker')}</span>
              <h2 className="font-display text-4xl md:text-5xl text-[#3E2F26] tracking-tight">{t('home.circuits.title')}</h2>
            </div>
            <Link
              to="/circuit/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#A83E36] hover:gap-3 transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.slice(0, 6).map((pack, idx) => (
            <Reveal key={pack.id} delay={idx}>
              <Link
                to={`/circuitChoisi/${pack.id}/`}
                className="card group block overflow-hidden hover:-translate-y-1.5 transition duration-300 h-full rounded-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={mediaUrl(pack.image || pack.image_circuit)}
                    alt={pack.pack_name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {pack.price && (
                    <span className="absolute top-3 end-3 badge bg-[#F3EAD3] text-[#3E2F26] border border-[#3E2F26]/15 font-semibold">
                      {formatPrice(pack.price)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-[#3E2F26] group-hover:text-[#A83E36] transition-colors mb-1">
                    {pack.pack_name}
                  </h3>
                  <p className="text-sm text-[#3E2F26]/65 line-clamp-2">{pack.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#3E2F26]/50">{t('circuit.featured')}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#A83E36] transition group-hover:gap-2">
                      {t('cta.details')} <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Pilgrimage — promo band ------------------- */

function Pilgrimage({ t }) {
  return (
    <section id="pilgrimage" className="container-site pb-24">
      <Reveal>
        <Link
          to="/hadj-omra/"
          className="group relative block overflow-hidden rounded-2xl"
        >
          <div className="aspect-[16/7] md:aspect-[21/8] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1400&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-[#3E2F26]" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-14 max-w-xl">
            <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-[#E8B67C]/50 bg-[#3E2F26]/60 text-xs font-medium tracking-widest uppercase mb-5">
              <i className="bi bi-moon-stars-fill text-[#E8B67C]"></i>
              {t('home.pilgrimage.kicker')}
            </div>
            <h3 className="font-display text-3xl md:text-5xl text-[#F3EAD3] leading-tight mb-4">
              {t('home.pilgrimage.title1')} <span className="text-[#E8B67C] italic">{t('home.pilgrimage.title2')}</span>
            </h3>
            <p className="text-[#D4A574] text-base md:text-lg max-w-md mb-8 line-clamp-3">{t('home.pilgrimage.body')}</p>
            <span className="retro-btn w-fit">
              {t('home.pilgrimage.cta')}
            </span>
          </div>
        </Link>
      </Reveal>
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
          <span className="retro-kicker block mb-3">{t('contact.kicker')}</span>
          <h2 className="font-display text-4xl text-[#3E2F26] tracking-tight">{t('home.contact.title')}</h2>
          <p className="mt-3 text-[#3E2F26]/65">{t('home.contact.subtitle')}</p>
        </Reveal>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((c) => (
          <div key={c.title} className="card p-8 text-center">
            <div className="retro-icon mx-auto flex h-14 w-14 items-center justify-center rounded-lg text-2xl">
              <i className={`bi ${c.icon}`}></i>
            </div>
            <h4 className="mt-4 text-lg font-semibold text-[#3E2F26]">{c.title}</h4>
            <div className="mx-auto my-4 h-px w-12 bg-[#A83E36]/40" />
            {c.href ? (
              <a href={c.href} className="text-sm text-[#3E2F26]/70">{c.body}</a>
            ) : (
              <p className="text-sm text-[#3E2F26]/70">{c.body}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Composition --------------------------- */

function HomeV3() {
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
    <div className="theme-retro">
      <style>{retroCss}</style>

      <Hero t={t} />
      <WhyUs t={t} />
      <Bento t={t} destinations={destinations} loading={loading} />
      <Circuits t={t} />
      <Pilgrimage t={t} />

      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20">
        <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-50" />
        <div className="container-site relative">
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl text-[#F3EAD3] tracking-tight">{t('home.weather.title')}</h2>
            <p className="mt-3 text-[#D4A574] max-w-xl mx-auto">{t('home.weather.subtitle')}</p>
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

export default HomeV3;
