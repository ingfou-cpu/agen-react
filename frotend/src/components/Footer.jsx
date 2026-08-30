import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';
import { useVariant } from '../hooks/useVariant.js';
import { getTheme } from '../lib/themes.jsx';
import { api } from '../lib/api.js';

export default function Footer() {
  const { t } = useLanguage();
  const { variant } = useVariant();
  const pattern = getTheme(variant).pattern;
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.newsletter(email);
      setDone(true);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-forest-dark/5 bg-forest-darker text-sand-light">
      <div className={`pointer-events-none absolute inset-0 ${pattern} opacity-70`} />
      <div className="container-site relative grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-copper-gradient text-white">
              <i className="bi bi-compass"></i>
            </span>
            <span className="font-display text-lg font-semibold">
              El Bayadh <span className="text-copper-light">Travels</span>
            </span>
          </div>
          <p className="mt-3 font-arabic text-base leading-relaxed text-gold/90">الجزائر</p>
          <p className="mt-3 text-sm text-sand-dark">{t('footer.tagline')}</p>
          <a href="mailto:contact@elbayadhtravels.dz" className="mt-3 inline-flex items-center gap-2 text-sm text-sand-dark hover:text-copper-light">
            <i className="bi bi-envelope"></i> contact@elbayadhtravels.dz
          </a>
        </div>

        <div>
          <h6 className="mb-3 text-sm font-semibold uppercase tracking-wide text-copper-light">
            {t('footer.newsletter')}
          </h6>
          {done ? (
            <p className="rounded-xl bg-white/5 px-4 py-3 text-sm text-sand-light">
              <i className="bi bi-check-circle-fill text-copper-light"></i> Merci pour votre inscription !
            </p>
          ) : (
            <form onSubmit={submit} className="flex gap-2">
              <label className="sr-only" htmlFor="newsletter-email">{t('footer.email')}</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.email')}
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-sand-light placeholder-sand-dark/60 outline-none focus:border-copper"
              />
              <button
                type="submit"
                aria-label={t('footer.subscribe')}
                className="rounded-full bg-copper-gradient px-4 text-white shadow-glow transition hover:brightness-110"
              >
                <i className="bi bi-send"></i>
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
        </div>

        <div className="text-sm">
          <h6 className="mb-3 text-sm font-semibold uppercase tracking-wide text-copper-light">Navigation</h6>
          <div className="grid grid-cols-2 gap-2 text-sand-dark">
            <Link to="/about/" className="hover:text-copper-light">{t('nav.about')}</Link>
            <Link to="/contact/" className="hover:text-copper-light">{t('nav.contact')}</Link>
            <Link to="/blog/" className="hover:text-copper-light">{t('nav.blog')}</Link>
            <Link to="/currency/" className="hover:text-copper-light">{t('nav.currency')}</Link>
            <Link to="/map/" className="hover:text-copper-light">{t('nav.map')}</Link>
            <Link to="/search/" className="hover:text-copper-light">{t('nav.search')}</Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/5 py-5">
        <div className="container-site flex flex-col items-center justify-between gap-2 text-xs text-sand-dark sm:flex-row">
          <span>
            {t('footer.copyright')} © {new Date().getFullYear()} — {t('footer.rights')}
          </span>
          <div className="flex gap-4">
            <a href="#!" aria-label="Facebook" className="hover:text-copper-light"><i className="bi bi-facebook"></i></a>
            <a href="#!" aria-label="Instagram" className="hover:text-copper-light"><i className="bi bi-instagram"></i></a>
            <a href="#!" aria-label="WhatsApp" className="hover:text-copper-light"><i className="bi bi-whatsapp"></i></a>
            <a href="#!" aria-label="YouTube" className="hover:text-copper-light"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
