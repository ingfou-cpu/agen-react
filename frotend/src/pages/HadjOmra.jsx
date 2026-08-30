import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  Hero — dark immersive                                              */
/* ------------------------------------------------------------------ */

function HadjHero({ t }) {
  return (
    <section className="relative min-h-[80dvh] pt-20 flex items-center bg-forest-darker overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pattern-star opacity-30" />
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-terracotta/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-white/3 rounded-full blur-[80px]" />

      <div className="container-site relative z-10 py-16">
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-terracotta" />
              <span className="text-xs font-medium uppercase tracking-widest text-terracotta">{t('hadj.kicker')}</span>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-sand-light leading-tight mb-8">
              {t('hadj.title')} <br />
              <span className="text-sand-dark/60 italic font-light font-arabic text-4xl md:text-5xl">
                {t('hadj.titleArabic')}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="text-sand-dark text-lg md:text-xl max-w-xl leading-relaxed mb-10">
              {t('hadj.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#packages" className="group flex items-center justify-between border border-white/20 rounded-full px-6 py-4 hover:border-terracotta transition-colors w-full sm:w-auto">
                <span className="text-sm font-medium uppercase tracking-wide text-sand-light mr-8">{t('hadj.cta')}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
                  <i className="bi bi-arrow-down-right text-sm"></i>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pilgrimage cards — asymmetric bento                                 */
/* ------------------------------------------------------------------ */

function PilgrimageCards({ t, hadj, omra }) {
  if (!hadj && !omra) return null;

  return (
    <section id="packages" className="py-24 bg-white dark:bg-forest-darker">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('hadj.packagesKicker')}</span>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">{t('hadj.packagesTitle')}</h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Hadj — main card */}
          {hadj && (
            <Reveal className="md:col-span-7">
              <Link
                to={`/reselieuChoisi/${hadj.id}/`}
                className="group block relative overflow-hidden rounded-3xl bg-sand-light dark:bg-forest-dark shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 transition hover:-translate-y-1.5 hover:shadow-soft"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={mediaUrl(hadj.image)}
                    alt={hadj.name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3">
                    <i className="bi bi-moon-stars-fill text-terracotta-light"></i>
                    {t('hadj.hadjLabel')}
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-2">{hadj.name}</h3>
                  <p className="text-white/70 text-sm mb-4 max-w-md line-clamp-2">{hadj.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold text-lg">{formatPrice(hadj.price)}</span>
                    <span className="text-white/50 text-sm">{t('hadj.perPerson')}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Omra — side card */}
          {omra && (
            <div className="md:col-span-5 flex flex-col">
              <Reveal delay={1} className="flex-1">
                <Link
                  to={`/reselieuChoisi/${omra.id}/`}
                  className="group block h-full relative overflow-hidden rounded-2xl bg-sand-light dark:bg-forest-dark shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 transition hover:-translate-y-1"
                >
                  {omra.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={mediaUrl(omra.image)}
                        alt={omra.name}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-copper/10 rounded-full text-xs font-bold uppercase tracking-wider text-copper mb-3">
                      {t('hadj.omraLabel')}
                    </div>
                    <h3 className="font-display text-xl text-forest-dark dark:text-sand-light group-hover:text-terracotta transition-colors mb-2">{omra.name}</h3>
                    <p className="text-sm text-forest-dark/60 dark:text-sand-dark line-clamp-2 mb-4">{omra.description}</p>
                    <span className="text-copper font-semibold">{formatPrice(omra.price)}</span>
                  </div>
                </Link>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Hotels strip                                                        */
/* ------------------------------------------------------------------ */

function HotelsStrip({ t, hotels }) {
  if (!hotels.length) return null;

  return (
    <section className="py-16 bg-sand-light/50 dark:bg-white/[0.02]">
      <div className="container-site">
        <Reveal>
          <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('hadj.hotelsKicker')}</span>
          <h2 className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light mb-10">{t('hadj.hotelsTitle')}</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, idx) => (
            <Reveal key={hotel.id} delay={idx % 3}>
              <div className="card overflow-hidden group">
                {hotel.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={mediaUrl(hotel.image)}
                      alt={hotel.hotel_name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg text-forest-dark dark:text-sand-light">{hotel.hotel_name}</h3>
                    <span className="text-copper text-sm font-semibold">{formatPrice(hotel.price)}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: hotel.calification_stars || 0 }).map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-gold text-xs"></i>
                    ))}
                  </div>
                  <p className="text-sm text-forest-dark/60 dark:text-sand-dark line-clamp-2">{hotel.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Rituals timeline                                                    */
/* ------------------------------------------------------------------ */

function RitualsTimeline({ t }) {
  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`hadj.ritual${n}Title`),
    desc: t(`hadj.ritual${n}Desc`),
  }));

  return (
    <section className="py-24 bg-white dark:bg-forest-darker">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <Reveal>
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('hadj.ritualsKicker')}</span>
              <h2 className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light mb-8">{t('hadj.ritualsTitle')}</h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="text-forest-dark/60 dark:text-sand-dark text-lg leading-relaxed max-w-md">
                {t('hadj.ritualsBody')}
              </p>
            </Reveal>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-copper/20" />

            <div className="space-y-10">
              {steps.map((step, idx) => (
                <Reveal key={idx} delay={idx}>
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 rounded-full bg-copper/10 flex items-center justify-center shrink-0 relative z-10">
                      <span className="text-copper font-display font-semibold text-sm">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-forest-dark dark:text-sand-light mb-2">{step.title}</h3>
                      <p className="text-forest-dark/60 dark:text-sand-dark text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why us                                                              */
/* ------------------------------------------------------------------ */

function WhyUs({ t }) {
  const features = [
    { icon: 'bi-passport', title: t('hadj.why1Title'), desc: t('hadj.why1Desc') },
    { icon: 'bi-people', title: t('hadj.why2Title'), desc: t('hadj.why2Desc') },
    { icon: 'bi-building', title: t('hadj.why3Title'), desc: t('hadj.why3Desc') },
  ];

  return (
    <section className="py-24 bg-sand-light/50 dark:bg-white/[0.02]">
      <div className="container-site">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('hadj.whyKicker')}</span>
            <h2 className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light">{t('hadj.whyTitle')}</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <Reveal key={idx} delay={idx}>
              <div className="card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper mb-6">
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <h3 className="font-display text-xl text-forest-dark dark:text-sand-light mb-3">{f.title}</h3>
                <p className="text-sm text-forest-dark/60 dark:text-sand-dark leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HadjOmra — composition                                             */
/* ------------------------------------------------------------------ */

export default function HadjOmra() {
  const { t } = useLanguage();
  const [hadj, setHadJ] = useState(null);
  const [omra, setOmra] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.destinations(), api.hotels()])
      .then(([dests, allHotels]) => {
        const meccaDests = dests.filter(
          (d) => d.city_name && d.city_name.toLowerCase().includes('mecque'),
        );
        const h = meccaDests.find((d) => /hadj|hajj/i.test(d.name));
        const o = meccaDests.find((d) => /omra|umra/i.test(d.name));
        setHadJ(h || meccaDests[0] || null);
        setOmra(o || meccaDests[1] || null);

        const meccaIds = new Set(meccaDests.map((d) => d.id));
        setHotels(allHotels.filter((h) => meccaIds.has(h.destination)));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <HadjHero t={t} />
      <PilgrimageCards t={t} hadj={hadj} omra={omra} />
      <HotelsStrip t={t} hotels={hotels} />
      <RitualsTimeline t={t} />
      <WhyUs t={t} />
      <CtaBanner />
    </>
  );
}
