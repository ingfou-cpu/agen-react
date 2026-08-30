import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[80dvh] flex flex-col items-center justify-center bg-forest-darker overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pattern-star opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-terracotta/5 rounded-full blur-[150px]" />

      <div className="relative z-10 text-center px-4">
        <Reveal>
          <p className="font-display text-[8rem] md:text-[12rem] font-bold leading-none text-copper/20">404</p>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-sand-light">{t('404.title')}</h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-4 max-w-md mx-auto text-sand-dark text-lg">
            {t('404.message')}
          </p>
        </Reveal>
        <Reveal delay={3}>
          <Link to="/" className="btn bg-white text-forest-darker px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-terracotta hover:text-white transition-colors duration-300 mt-8 inline-flex">
            <i className="bi bi-house-door"></i> {t('common.backHome')}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
