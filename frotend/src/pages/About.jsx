import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Reveal from '../components/Reveal.jsx';

export default function About() {
  const { t } = useLanguage();
  const values = [
    { icon: 'bi-shield-check', title: t('about.value.reliability'), body: t('about.value.reliabilityBody') },
    { icon: 'bi-heart', title: t('about.value.passion'), body: t('about.value.passionBody') },
    { icon: 'bi-currency-exchange', title: t('about.value.transparency'), body: t('about.value.transparencyBody') },
    { icon: 'bi-globe2', title: t('about.value.security'), body: t('about.value.securityBody') },
  ];

  return (
    <>
      <PageHero
        kicker={t('nav.about')}
        title={<>El Bayadh <span className="text-copper">Travels</span></>}
        subtitle={t('about.intro')}
        align="center"
      />

      <section className="py-20">
        <div className="container-site">
          {/* Editorial intro */}
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light leading-tight mb-6">
                {t('about.intro')}
              </h2>
            </div>
          </Reveal>

          {/* Values grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {values.map((v, idx) => (
              <Reveal key={v.title} delay={idx % 4}>
                <div className="card p-7 text-center h-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
                    <i className={`bi ${v.icon}`}></i>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-forest-dark dark:text-sand-light">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-dark/60 dark:text-sand-dark">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Stats band */}
          <Reveal>
            <div className="py-16 border-t border-b border-forest-dark/5 dark:border-white/5 grid grid-cols-3 gap-8 text-center max-w-3xl mx-auto mb-16">
              <div>
                <div className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light mb-1">15+</div>
                <div className="text-xs uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark">{t('about.stats.years')}</div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light mb-1">4.9</div>
                <div className="text-xs uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark">{t('about.stats.rating')}</div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl text-forest-dark dark:text-sand-light mb-1">1000+</div>
                <div className="text-xs uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark">{t('about.stats.travelers')}</div>
              </div>
            </div>
          </Reveal>

          {/* Mission + Why Us */}
          <div className="card grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('about.mission')}</h2>
              <p className="mt-4 leading-relaxed text-forest-dark/70 dark:text-sand-dark">
                {t('about.missionBody')}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('about.whyUs')}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-forest-dark/70 dark:text-sand-dark">
                {[
                  t('about.whyUs.1'),
                  t('about.whyUs.2'),
                  t('about.whyUs.3'),
                  t('about.whyUs.4'),
                ].map((item) => (
                  <li key={item}>
                    <i className="bi bi-check-circle-fill text-copper"></i> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/destinations" className="btn-primary">
              {t('cta.seeMore')} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
