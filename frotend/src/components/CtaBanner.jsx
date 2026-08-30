import { useState } from 'react';
import api from '../lib/api.js';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from './Reveal.jsx';

/**
 * Full-width terracotta newsletter CTA banner.
 * Reusable across pages.
 */
export default function CtaBanner() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    api
      .newsletter(email)
      .then(() => {
        setSubmitted(true);
        setEmail('');
      })
      .catch(() => {});
  };

  return (
    <section className="py-24 bg-terracotta text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl mb-6">{t('home.cta.title')}</h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">{t('home.cta.body')}</p>
        </Reveal>
        <Reveal delay={2}>
          {submitted ? (
            <p className="text-white font-medium text-lg">{t('home.cta.thanks')}</p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('home.cta.placeholder')}
                className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-white text-terracotta px-6 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-forest-darker hover:text-white transition-colors"
              >
                {t('home.cta.button')}
              </button>
            </form>
          )}
        </Reveal>
      </div>
      <i className="bi bi-send-fill absolute -bottom-8 -right-8 text-[16rem] text-white/5 -rotate-12 pointer-events-none"></i>
    </section>
  );
}
