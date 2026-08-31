import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatDate, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';
import V5DestinationCard from '../components/V5DestinationCard.jsx';

/* ------------------------------------------------------------------ */
/*  V5 — Dala / Void Constellation                                     */
/*  Pure black void, monolithic weight-400 display type, a single      */
/*  electric-iris violet pill CTA, saffron-amber kickers. No cards,    */
/*  no borders, no shadows — everything floats on the void.            */
/* ------------------------------------------------------------------ */

const VOID = 'bg-[#000000]';
const IRIS = '#8052ff';
const SAFFRON = '#ffb829';
const TEXT_PRIMARY = 'text-[#ffffff]';
const TEXT_SECONDARY = 'text-[#9a9a9a]';
const TEXT_TERTIARY = 'text-[#bdbdbd]';

/* ------------------------------------------------------------------ */
/*  VoidBackdrop — cinematic desaturated backdrop, always dark-glazed  */
/*  Renders an absolute inset-0 image with multi-layer black veils    */
/*  so the void ethos + violet/saffron accents stay dominant.         */
/* ------------------------------------------------------------------ */
function VoidBackdrop({
  src,
  alt = '',
  opacityClass = 'opacity-[0.26]',
  veilClass = 'bg-black/55',
  gradientClass = 'bg-gradient-to-b from-black/30 via-black/45 to-black',
  imgClass = '',
  eager = false,
}) {
  if (!src) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover scale-105 ${opacityClass} ${imgClass}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <div className={`absolute inset-0 ${veilClass}`} />
      {gradientClass && <div className={`absolute inset-0 ${gradientClass}`} />}
      {/* faint vignette to keep constellation/cards floating */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_50%_30%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.55)_85%)]" />
    </div>
  );
}

/* Small amber kicker label used above each section */
function Kicker({ children, className = '' }) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.25em] text-[#ffb829] ${className}`}
    >
      {children}
    </span>
  );
}

/* Single violet pill — the only filled CTA */
function IrisButton({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center justify-center gap-2 rounded-[22px] px-7 py-4 text-sm font-medium uppercase tracking-[0.025em] text-white transition duration-300 hover:brightness-110"
      style={{ background: IRIS }}
    >
      {children}
      <i className="bi bi-arrow-right rtl:rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
    </Link>
  );
}

/* Ghost text link — secondary action, never a filled button */
function GhostLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.025em] text-[#ffffff] transition-colors hover:text-[#ffb829]"
    >
      {children}
      <i className="bi bi-arrow-right rtl:rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
    </Link>
  );
}

/* ----------------------------- Hero --------------------------------- */

function Hero({ t, destinations }) {
  const [main, ...stack] = destinations;
  const second = stack[0];
  const third = stack[1];

  // Cinematic backdrop — a real, striking Saharan photograph from the web.
  // Rendered visibly (not ultra-dim) so the page actually shows a real image
  // behind the void typography, while keeping text legible via the dark glaze.
  const heroBackdrop =
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2400&q=85';

  return (
    <section className={`relative overflow-hidden ${VOID} pt-32 lg:pt-40 pb-24 lg:pb-32`} aria-labelledby="hero-title">
      {/* Full-bleed real desert photograph — visible but dark-glazed for legibility */}
      <VoidBackdrop
        src={heroBackdrop}
        opacityClass="opacity-[0.85]"
        veilClass="bg-black/60"
        gradientClass="bg-gradient-to-b from-black/70 via-black/40 to-black"
        imgClass=""
        eager
      />
      {/* Ambient constellation particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { top: '12%', left: '8%', c: IRIS, s: '10px' },
          { top: '20%', left: '30%', c: SAFFRON, s: '8px' },
          { top: '6%', left: '70%', c: '#15846e', s: '9px' },
          { top: '35%', left: '90%', c: IRIS, s: '7px' },
          { top: '62%', left: '5%', c: SAFFRON, s: '10px' },
          { top: '75%', left: '40%', c: IRIS, s: '8px' },
          { top: '85%', left: '80%', c: '#15846e', s: '9px' },
          { top: '55%', left: '75%', c: SAFFRON, s: '7px' },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute block rounded-[2px] rotate-45 opacity-70"
            style={{ top: p.top, left: p.left, width: p.s, height: p.s, background: p.c }}
          />
        ))}
      </div>

      <div className="container-site relative grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-end min-h-[80vh] lg:min-h-[85vh]">
        {/* Text column - left, oversized */}
        <div className="lg:col-span-7 z-10 pb-8 lg:pb-0">
          <Reveal className="mb-8 flex items-center gap-4">
            <span className="h-px w-10" style={{ background: SAFFRON }} />
            <Kicker>{t('home.hero2.kicker')}</Kicker>
          </Reveal>

          <Reveal delay={1} id="hero-title">
            <h1 className="font-display display-text text-[#ffffff] leading-[0.9] tracking-[-0.04em] font-normal max-w-4xl">
              {t('home.hero2.tagline').split(' ').slice(0, -1).join(' ')}
              <br />
              <span style={{ color: SAFFRON }}>{t('home.hero2.tagline').split(' ').pop()}</span>
            </h1>
          </Reveal>

          <Reveal delay={2} className="mt-8 max-w-xl">
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#bdbdbd]">
              {t('home.editorial.body')}
            </p>
          </Reveal>

          <Reveal delay={3} className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <IrisButton to="/circuit/">{t('home.hero2.cta')}</IrisButton>
            <GhostLink to="/destinations/">
              <i className="bi bi-geo-alt" aria-hidden="true" />
              {t('nav.destinations')}
            </GhostLink>
          </Reveal>

          {/* Stats bar - minimal, floating */}
          <Reveal delay={3} className="mt-16 flex gap-10 lg:gap-16 pt-4">
            {[
              { value: '15+', label: t('home.hero2.yearsLabel') },
              { value: '4.9', label: t('home.hero2.ratingLabel') },
              { value: '120+', label: t('home.statTravelers') },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <div className="font-display text-4xl lg:text-5xl text-[#ffffff] tracking-tight font-normal">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#9a9a9a]">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Right column - featured destination floating on the void */}
        <div className="lg:col-span-5 relative">
          {main && (
            <Reveal variant="image" className="relative rounded-[24px] overflow-hidden">
              <Link to={`/reselieuChoisi/${main.id}/`} className="block" aria-label={`${t('cta.details')}: ${main.name}`}>
                <img
                  src={mediaUrl(main.image)}
                  alt={main.name}
                  className="w-full h-[480px] lg:h-[580px] object-cover transition-transform duration-1000 ease-expo hover:scale-105"
                  loading="eager"
                />
                {/* subtle bottom fade for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 start-0 end-0 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full"
                      style={{ background: 'rgba(128,82,255,0.18)', color: SAFFRON }}
                    >
                      {main.city_name || t('home.hero2.featuredLocation')}
                    </span>
                    {main.rating && (
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: SAFFRON }}>
                        <i className="bi bi-star-fill" aria-hidden="true" />
                        {main.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-3xl lg:text-4xl text-[#ffffff] leading-tight font-normal">{main.name}</h3>
                  <div className="mt-4 flex items-center gap-6 text-[#bdbdbd]">
                    {main.duration && (
                      <span className="flex items-center gap-1.5">
                        <i className="bi bi-clock" aria-hidden="true" />
                        {main.duration} {t('common.nights')}
                      </span>
                    )}
                    {main.price && (
                      <span className="font-semibold text-lg" style={{ color: SAFFRON }}>{formatPrice(main.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Floating mini cards for 2nd & 3rd destinations */}
          {second && third && (
            <div className="absolute -bottom-6 -start-4 lg:-start-8 lg:-bottom-14 grid gap-3 sm:grid-cols-2 z-20" role="list" aria-label={t('home.featuredDestinations')}>
              {[second, third].map((d, idx) => (
                <Reveal key={d.id} delay={idx + 2} variant="image" className="group relative rounded-[18px] overflow-hidden" role="listitem">
                  <Link to={`/reselieuChoisi/${d.id}/`} className="block h-[170px] lg:h-[190px]" aria-label={`${t('cta.details')}: ${d.name}`}>
                    <img
                      src={mediaUrl(d.image)}
                      alt={d.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 start-4 end-4 text-[#ffffff]">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: SAFFRON }}>
                        {d.city_name || t('home.hero2.featuredLocation')}
                      </p>
                      <h4 className="font-display text-lg lg:text-xl leading-tight font-normal">{d.name}</h4>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Editorial Split ------------------------- */

function EditorialSplit({ t }) {
  return (
    <section className={`relative overflow-hidden ${VOID} py-24 lg:py-32`} aria-labelledby="editorial-title">
      {/* Vivid Tassili rock-arch backdrop — clearly visible but dark-glazed for white text */}
      <VoidBackdrop
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2200&q=85"
        opacityClass="opacity-[0.70]"
        veilClass="bg-black/42"
        gradientClass="bg-gradient-to-r from-black/70 via-black/35 to-black/55"
        imgClass=""
      />
      {/* subtle violet wash on the image half for constellation continuity */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_75%_50%,rgba(128,82,255,0.06),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left - oversized text block */}
        <div>
          <Reveal className="mb-6 flex items-center gap-4">
            <span className="h-px w-10" style={{ background: SAFFRON }} />
            <Kicker>{t('home.editorial.kicker')}</Kicker>
          </Reveal>
          <Reveal>
            <h2 id="editorial-title" className="font-display text-5xl md:text-6xl lg:text-7xl text-[#ffffff] leading-[1.02] tracking-[-0.03em] font-normal max-w-xl">
              {t('home.editorial.title1')}
              <span style={{ color: IRIS }}> {t('home.editorial.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={1} className="mt-8 max-w-lg">
            <p className="text-lg font-light leading-relaxed text-[#bdbdbd]">{t('home.editorial.body')}</p>
          </Reveal>
          <Reveal delay={2} className="mt-10">
            <GhostLink to="/about/">{t('cta.details')}</GhostLink>
          </Reveal>
        </div>

        {/* Right - atmospheric image floating on void */}
        <div className="relative">
          <Reveal variant="image" className="relative rounded-[24px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"
              alt={t('home.editorial.imageAlt')}
              className="w-full h-[480px] lg:h-[580px] object-cover transition-transform duration-1000 ease-expo hover:scale-[1.02]"
              loading="lazy"
            />
          </Reveal>

          {/* Floating stat chip */}
          <Reveal delay={2} className="absolute -bottom-6 -start-6 lg:-start-10 hidden lg:block px-6 py-4">
            <div className="flex items-baseline gap-3">
              <div className="font-display text-5xl font-normal" style={{ color: IRIS }}>03</div>
              <div className="text-[#9a9a9a]">
                <p className="text-xs uppercase tracking-widest">{t('home.editorial.statLabel')}</p>
                <p className="font-medium text-[#ffffff]">{t('home.editorial.statValue')}</p>
              </div>
            </div>
          </Reveal>

          {/* Floating badge chip */}
          <Reveal delay={3} className="absolute -top-6 -end-6 hidden md:flex items-center gap-2 px-5 py-3 rounded-full border border-white/10">
            <i className="bi bi-shield-check" style={{ color: IRIS }} aria-hidden="true" />
            <span className="text-xs font-semibold text-[#ffffff]">{t('home.editorial.badge')}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Circuits ------------------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="circuits" className={`py-24 ${VOID}`}>
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const list = rest.slice(0, 3);

  return (
    <section id="circuits" className={`relative overflow-hidden py-24 lg:py-32 ${VOID}`} aria-labelledby="circuits-title">
      {/* Scenic desert-road circuit — winding asphalt through dunes, clearly a curated tour-route */}
      <VoidBackdrop
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2200&q=85"
        opacityClass="opacity-[0.72]"
        veilClass="bg-black/42"
        gradientClass="bg-gradient-to-b from-black/65 via-black/28 to-black/75"
        imgClass=""
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_500px_at_30%_10%,rgba(255,184,41,0.05),transparent_65%)]" aria-hidden="true" />
      <div className="container-site relative">
        <Reveal className="mb-6 flex items-center gap-4">
          <span className="h-px w-10" style={{ background: SAFFRON }} />
          <Kicker>{t('home.circuits.kicker')}</Kicker>
        </Reveal>
        <Reveal>
          <h2 id="circuits-title" className="font-display text-5xl md:text-6xl lg:text-7xl text-[#ffffff] leading-[1.02] tracking-[-0.03em] font-normal max-w-4xl">
            {t('home.circuits.title')}
          </h2>
        </Reveal>
        {t('home.circuits.subtitle') && (
          <Reveal delay={1} className="mt-6 max-w-xl">
            <p className="text-lg font-light text-[#bdbdbd]">{t('home.circuits.subtitle')}</p>
          </Reveal>
        )}

        {/* Featured pack - cinematic split, no card chrome */}
        <Reveal delay={2} className="mt-16">
          <Link
            to={`/circuitChoisi/${main.id}/`}
            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch"
            aria-label={`${t('cta.details')}: ${main.pack_name}`}
          >
            {/* Image side */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[400px] overflow-hidden rounded-[24px]">
              <img
                src={mediaUrl(main.image || main.image_circuit)}
                alt={main.pack_name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 start-6 end-6 text-[#ffffff]">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {main.date && (
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full" style={{ background: 'rgba(128,82,255,0.18)', color: SAFFRON }}>
                      {formatDate(main.date)}
                    </span>
                  )}
                  {main.duration && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full border border-white/20">
                      <i className="bi bi-clock mr-1" aria-hidden="true" />
                      {main.duration} {t('common.nights')}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-3xl lg:text-4xl leading-tight font-normal">{main.pack_name}</h3>
              </div>
            </div>

            {/* Content side */}
            <div className="lg:col-span-5 lg:pl-12 flex flex-col justify-center pt-8 lg:pt-0">
              <div className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: SAFFRON }}>
                {t('home.circuits.featured')}
              </div>
              <p className="text-[#bdbdbd] font-light leading-relaxed mb-8 line-clamp-4">{main.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {main.price && (
                  <span className="font-display text-3xl font-normal" style={{ color: IRIS }}>{formatPrice(main.price)}</span>
                )}
                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.025em] text-[#ffffff] group-hover:text-[#ffb829] transition-colors">
                  {t('cta.details')}
                  <i className="bi bi-arrow-right rtl:rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* V5 card-21 grid — 3D tilt tiles on the void (replaces editorial text rows) */}
        {list.length > 0 && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((pack, idx) => (
              <Reveal key={pack.id} delay={idx % 3}>
                <V5DestinationCard pack={pack} index={idx + 1} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={4} className="mt-14">
          <GhostLink to="/circuit/">{t('home.circuits.viewAll')}</GhostLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- Pilgrimage ------------------------------ */

function Pilgrimage({ t }) {
  const features = [
    { icon: 'bi-buildings-fill', title: t('home.pilgrimage.feat1Title'), desc: t('home.pilgrimage.feat1Desc') },
    { icon: 'bi-people-fill', title: t('home.pilgrimage.feat2Title'), desc: t('home.pilgrimage.feat2Desc') },
    { icon: 'bi-shield-check', title: t('home.pilgrimage.feat3Title'), desc: t('home.pilgrimage.feat3Desc') },
  ];

  return (
    <section id="pilgrimage" className={`relative overflow-hidden py-24 lg:py-32 ${VOID}`} aria-labelledby="pilgrimage-title">
      {/* Reverent Kaaba / Masjid al-Haram — pilgrims in Ihram circling, unmistakably Mecca / devotion */}
      <VoidBackdrop
        src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=2200&q=85"
        opacityClass="opacity-[0.70]"
        veilClass="bg-black/44"
        gradientClass="bg-gradient-to-b from-black/62 via-black/30 to-black/72"
        imgClass=""
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_600px_at_20%_80%,rgba(128,82,255,0.07),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left - Image collage floating on void */}
        <div className="relative">
          <Reveal variant="image" className="relative rounded-[24px] overflow-hidden">
            <img
              src={mediaUrl('/media/destination_images/la-mecque-hadj.jpg')}
              alt={t('hadj.title')}
              className="w-full h-[440px] lg:h-[540px] object-cover transition-transform duration-1000 ease-expo hover:scale-[1.02]"
              loading="lazy"
            />
          </Reveal>

          <Reveal delay={2} className="absolute bottom-0 start-0 w-full lg:w-1/2 h-1/2 lg:h-2/3 min-h-[260px] rounded-[18px] overflow-hidden border-4 border-[#000000] z-10">
            <img
              src={mediaUrl('/media/destination_images/la-mecque-omra.jpg')}
              alt={t('hadj.titleArabic')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>

          {/* Floating badge chip */}
          <Reveal delay={3} className="absolute -top-4 -end-4 hidden lg:flex items-center gap-2 px-5 py-3 rounded-full border border-white/10">
            <i className="bi bi-star-fill" style={{ color: SAFFRON }} aria-hidden="true" />
            <span className="text-xs font-semibold text-[#ffffff]">{t('home.pilgrimage.badge')}</span>
          </Reveal>
        </div>

        {/* Right - oversized text block */}
        <div>
          <Reveal className="mb-6 flex items-center gap-4">
            <span className="h-px w-10" style={{ background: SAFFRON }} />
            <Kicker>{t('home.pilgrimage.kicker')}</Kicker>
          </Reveal>
          <Reveal>
            <h2 id="pilgrimage-title" className="font-display text-5xl md:text-6xl lg:text-7xl text-[#ffffff] leading-[1.02] tracking-[-0.03em] font-normal max-w-xl">
              {t('home.pilgrimage.title1')}
              <span style={{ color: IRIS }}> {t('home.pilgrimage.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={1} className="mt-8 max-w-lg">
            <p className="text-lg font-light leading-relaxed text-[#bdbdbd]">{t('home.pilgrimage.body')}</p>
          </Reveal>

          {/* Feature items - floating, no cards */}
          <Reveal delay={2} className="mt-12 grid sm:grid-cols-1 sm:max-w-lg gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(128,82,255,0.14)', color: IRIS }}>
                  <i className={`bi ${f.icon} text-xl`} aria-hidden="true"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-[#ffffff] mb-1">{f.title}</h4>
                  <p className="text-sm font-light text-[#9a9a9a]">{f.desc}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={3} className="mt-12">
            <IrisButton to="/hadj-omra/">{t('home.pilgrimage.cta')}</IrisButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Destinations ---------------------------- */

function Destinations({ t, destinations, loading }) {
  return (
    <section id="destinations" className={`relative overflow-hidden py-24 lg:py-32 ${VOID}`} aria-labelledby="destinations-title">
      {/* Vivid Sahara twilight rocks — saffron dusk for the film-strip */}
      <VoidBackdrop
        src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=2200&q=85"
        opacityClass="opacity-[0.72]"
        veilClass="bg-black/38"
        gradientClass="bg-gradient-to-b from-black/60 via-black/30 to-black/70"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_70%_50%,rgba(255,184,41,0.05),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative">
        <Reveal className="mb-6 flex items-center gap-4">
          <span className="h-px w-10" style={{ background: SAFFRON }} />
          <Kicker>{t('dest.kicker')}</Kicker>
        </Reveal>
        <Reveal>
          <h2 id="destinations-title" className="font-display text-5xl md:text-6xl lg:text-7xl text-[#ffffff] leading-[1.02] tracking-[-0.03em] font-normal max-w-4xl">
            {t('home.grid.title')}
          </h2>
        </Reveal>
        <Reveal delay={1} className="mt-6 max-w-xl">
          <p className="text-lg font-light text-[#bdbdbd]">{t('home.grid.subtitle')}</p>
        </Reveal>

        <DestinationSelector t={t} destinations={destinations} loading={loading} />        

        <Reveal delay={3} className="mt-16">
          <GhostLink to="/destinations/">{t('cta.seeMore')}</GhostLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- Weather ------------------------------ */

function WeatherSection({ t }) {
  return (
    <section id="weather" className={`relative overflow-hidden py-24 lg:py-32 ${VOID}`} aria-labelledby="weather-title">
      {/* Vivid Sahara starlit camp — Milky Way over dunes, clearly visible */}
      <VoidBackdrop
        src="https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=2200&q=85"
        opacityClass="opacity-[0.66]"
        veilClass="bg-black/44"
        gradientClass="bg-gradient-to-b from-black/55 via-black/30 to-black/70"
        imgClass=""
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_0%,rgba(128,82,255,0.06),transparent_65%)]" aria-hidden="true" />
      <div className="container-site relative">
        <div className="max-w-3xl mx-auto mb-14 text-center">
          <Reveal className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-10" style={{ background: SAFFRON }} />
            <Kicker>{t('home.weather.kicker')}</Kicker>
            <span className="h-px w-10" style={{ background: SAFFRON }} />
          </Reveal>
          <Reveal>
            <h2 id="weather-title" className="font-display text-5xl md:text-6xl lg:text-7xl text-[#ffffff] leading-[1.02] tracking-[-0.03em] font-normal">
              {t('home.weather.title')}
            </h2>
          </Reveal>
          <Reveal delay={1} className="mt-6">
            <p className="text-lg font-light text-[#bdbdbd]">{t('home.weather.subtitle')}</p>
          </Reveal>
        </div>
        <Reveal delay={2} className="max-w-2xl mx-auto">
          <WeatherWidget initialCity="El Bayadh" />
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- Contact ------------------------------ */
/* ------------------------------------------------------------------ */
/*  Interactive destination selector — expanding film strip on void    */
/*  Port of the 21st.dev "interactive-selector" interaction, re-cast   */
/*  for the Dala aesthetic: no card chrome, no borders, images float   */
/*  on the void; the active panel irises violet + saffron.             */
/* ------------------------------------------------------------------ */
function DestinationSelector({ t, destinations, loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  // Staggered entrance: each panel slides in from the left (180ms apart)
  useEffect(() => {
    setVisibleCount(0);
    const items = destinations || [];
    const timers = items.map((_, i) => setTimeout(() => setVisibleCount(i + 1), 180 * i));
    return () => timers.forEach(clearTimeout);
  }, [destinations]);

  const items = destinations || [];

  return (
    <Reveal delay={2} className="mt-16">
      {loading ? (
        <div className="h-[460px] rounded-[24px] animate-pulse bg-white/5" />
      ) : (
        <div className="flex w-full h-[460px] overflow-hidden" role="group" aria-label={t('home.grid.title')}>
          {items.map((d, index) => {
            const active = activeIndex === index;
            const entered = index < visibleCount;
            return (
              <Link
                key={d.id}
                to={`/reselieuChoisi/${d.id}/`}
                aria-label={`${t('cta.details')}: ${d.name}`}
                className="relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out"
                style={{
                  backgroundImage: `url('${mediaUrl(d.image)}')`,
                  backgroundSize: active ? 'auto 100%' : 'auto 120%',
                  backgroundPosition: 'center',
                  opacity: entered ? 1 : 0,
                  transform: entered ? 'translateX(0)' : 'translateX(-60px)',
                  minWidth: '56px',
                  flex: active ? '7 1 0%' : '1 1 0%',
                  borderRight: '2px solid #000',
                  borderLeft: '2px solid #000',
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* bottom legibility gradient, lifting when active */}
                <div
                  className="absolute left-0 right-0 bottom-0 pointer-events-none transition-all duration-700 ease-in-out"
                  style={{
                    height: '160px',
                    boxShadow: active
                      ? 'inset 0 -140px 120px -90px rgba(0,0,0,0.92)'
                      : 'inset 0 -120px 60px -140px rgba(0,0,0,0.92)',
                  }}
                />

                {/* label row — icon chip + name/city/price */}
                <div className="absolute left-0 right-0 bottom-5 flex items-center gap-3 px-4 pointer-events-none">
                  <div
                    className="w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
                    style={{
                      background: active ? 'rgba(128,82,255,0.22)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? IRIS : 'rgba(255,255,255,0.14)'}`,
                      color: '#ffffff',
                    }}
                  >
                    <i className="bi bi-geo-alt" aria-hidden="true" />
                  </div>
                  <div className="text-white whitespace-pre">
                    <div
                      className="font-medium text-lg transition-all duration-700 ease-in-out"
                      style={{ opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(25px)' }}
                    >
                      {d.name}
                    </div>
                    <div
                      className="text-sm text-[#bdbdbd] transition-all duration-700 ease-in-out"
                      style={{ opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(25px)' }}
                    >
                      <span className="uppercase tracking-wider text-xs" style={{ color: SAFFRON }}>
                        {d.city_name || 'Algérie'}
                      </span>
                      <span className="mx-2 text-[#9a9a9a]">·</span>
                      <span>{t('common.from')} {formatPrice(d.price)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Reveal>
  );
}

function Contact({ t }) {
  const items = [
    { icon: 'bi-geo-alt', title: t('home.contactAddress'), body: 'El Bayadh, Algérie' },
    { icon: 'bi-envelope', title: t('home.contactEmail'), body: 'contact@elbayadhtravels.dz', href: 'mailto:contact@elbayadhtravels.dz' },
    { icon: 'bi-phone', title: t('home.contactPhone'), body: '+213 (0) 00 00 00 00' },
  ];

  return (
    <section id="contact" className={`relative overflow-hidden py-24 ${VOID}`} aria-labelledby="contact-title">
      {/* Vivid closing dunes at dusk — golden-hour farewell, clearly visible */}
      <VoidBackdrop
        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2200&q=85"
        opacityClass="opacity-[0.60]"
        veilClass="bg-black/48"
        gradientClass="bg-gradient-to-t from-black/75 via-black/40 to-black/45"
        imgClass=""
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_50%_100%,rgba(255,184,41,0.04),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
        <Reveal className="mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-10" style={{ background: SAFFRON }} />
          <Kicker>{t('contact.kicker')}</Kicker>
          <span className="h-px w-10" style={{ background: SAFFRON }} />
        </Reveal>
        <Reveal>
          <h2 id="contact-title" className="font-display text-5xl md:text-6xl lg:text-7xl text-[#ffffff] leading-[1.02] tracking-[-0.03em] font-normal">
            {t('home.contact.title')}
          </h2>
        </Reveal>
        <Reveal delay={1} className="mt-6">
          <p className="text-lg font-light text-[#bdbdbd]">{t('home.contact.subtitle')}</p>
        </Reveal>
        </div>
        <Reveal delay={2} className="grid gap-12 md:grid-cols-3 max-w-4xl mx-auto">
        {items.map((c) => (
          <div key={c.title} className="text-center flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-[16px] text-2xl" style={{ background: 'rgba(128,82,255,0.14)', color: IRIS }}>
              <i className={`bi ${c.icon}`} aria-hidden="true"></i>
            </div>
            <h4 className="mt-5 text-lg font-medium text-[#ffffff]">{c.title}</h4>
            <div className="mx-auto my-3 h-px w-8" style={{ background: 'rgba(255,184,41,0.5)' }} />
            {c.href ? (
              <a href={c.href} className="text-sm text-[#9a9a9a] hover:text-[#ffb829] transition-colors">{c.body}</a>
            ) : (
              <p className="text-sm text-[#9a9a9a]">{c.body}</p>
            )}
          </div>
        ))}
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- Composition --------------------------- */

function HomeV5() {
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
    <>
      <Hero t={t} destinations={destinations} />
      <EditorialSplit t={t} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />
      <WeatherSection t={t} />
      <CtaBanner />
      <Contact t={t} />
    </>
  );
}

export default HomeV5;
