import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useTheme } from '../hooks/useTheme.js';
import ThemeVariantSwitcher from './ThemeVariantSwitcher.jsx';

const primaryLinks = [
  { to: '/', key: 'nav.home', icon: 'bi-house-door' },
  { to: '/destinations', key: 'nav.destinations', icon: 'bi-geo-alt' },
  { to: '/circuit/', key: 'nav.circuits', icon: 'bi-signpost-2' },
  { to: '/croisiere/', key: 'nav.cruise', icon: 'bi-life-preserver' },
  { to: '/blog/', key: 'nav.blog', icon: 'bi-journal-text' },
];

const moreLinks = [
  { to: '/hadj-omra/', key: 'nav.pilgrimage', icon: 'bi-moon-stars' },
  { to: '/map/', key: 'nav.map', icon: 'bi-map' },
  { to: '/search/', key: 'nav.search', icon: 'bi-search' },
  { to: '/weather/', key: 'nav.weather', icon: 'bi-cloud-sun' },
  { to: '/currency/', key: 'nav.currency', icon: 'bi-currency-exchange' },
  { to: '/temoignage/', key: 'nav.reviews', icon: 'bi-star' },
  { to: '/about/', key: 'nav.about', icon: 'bi-info-circle' },
  { to: '/contact/', key: 'nav.contact', icon: 'bi-envelope' },
];

const paymentsLink = { to: '/payment/', key: 'nav.payments', icon: 'bi-credit-card' };
const paymentHistoryLink = { to: '/payment/history/', key: 'nav.paymentHistory', icon: 'bi-clock-history' };

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  /* Hide on scroll down, show on scroll up */
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = headerRef.current;
      if (!el) return;
      const y = window.scrollY;
      if (y > 80 && y > lastScrollY.current) {
        el.style.transform = 'translateY(-100%)';
      } else {
        el.style.transform = 'translateY(0)';
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLang = (e) => setLang(e.target.value);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-copper/10 font-medium text-copper'
        : 'text-forest-dark/70 hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5'
    }`;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-forest-dark/5 bg-cream/80 backdrop-blur-lg dark:border-white/5 dark:bg-forest-darker/80 transition-transform duration-300">
      <nav className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 xl:px-10">
        <Link to="/" className="flex items-center gap-2" aria-label={t('nav.home')}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-copper-gradient text-white shadow-glow">
            <i className="bi bi-compass"></i>
          </span>
          <span className="font-display text-lg font-semibold text-forest-dark dark:text-sand-light">
            El Bayadh <span className="text-copper">Travels</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {primaryLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              <i className={`bi ${l.icon}`}></i>
              {t(l.key)}
            </NavLink>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm transition ${
                moreOpen
                  ? 'bg-copper/10 font-medium text-copper'
                  : 'text-forest-dark/70 hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5'
              }`}
            >
              {t('nav.more')} <i className={`bi ${moreOpen ? 'bi-chevron-up' : 'bi-chevron-down'} text-xs`}></i>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border border-forest-dark/10 bg-cream p-2 shadow-soft dark:border-white/10 dark:bg-forest-darker">
                {moreLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-copper/10 font-medium text-copper'
                          : 'text-forest-dark/70 hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5'
                      }`
                    }
                  >
                    <i className={`bi ${l.icon} w-4 text-center`}></i>
                    {t(l.key)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <div className="relative group">
            <button className="btn-outline !px-4 !py-2 flex items-center gap-1.5">
              <i className={`bi ${paymentsLink.icon}`}></i> {t(paymentsLink.key)}
              <i className="bi bi-chevron-down text-[10px]"></i>
            </button>
            <div className="absolute right-0 top-full z-50 mt-1 hidden min-w-[180px] rounded-xl border border-forest-dark/10 bg-white py-1 shadow-lg group-hover:block dark:border-white/10 dark:bg-forest-darker">
              <Link to={paymentsLink.to} className="flex items-center gap-2 px-4 py-2.5 text-sm text-forest-dark/80 transition hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5">
                <i className={`bi ${paymentsLink.icon}`}></i> {t(paymentsLink.key)}
              </Link>
              <Link to={paymentHistoryLink.to} className="flex items-center gap-2 px-4 py-2.5 text-sm text-forest-dark/80 transition hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5">
                <i className={`bi ${paymentHistoryLink.icon}`}></i> {t(paymentHistoryLink.key)}
              </Link>
            </div>
          </div>
          <ThemeVariantSwitcher />
          <button
            onClick={toggle}
            aria-label="Basculer le thème"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-dark/70 transition hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5"
          >
            <i className={`bi ${dark ? 'bi-sun' : 'bi-moon-stars'}`}></i>
          </button>
          <select
            value={lang}
            onChange={handleLang}
            aria-label="Langue"
            className="rounded-full border border-forest-dark/15 bg-transparent px-2 py-1.5 text-sm text-forest-dark/70 focus:outline-none dark:border-white/10 dark:text-sand-dark"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile/" className="btn-ghost !px-4">
                <i className="bi bi-person-circle"></i> {user.username}
              </Link>
              <button className="btn-outline !px-4 !py-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link to="/login/" className="btn-primary !px-5 !py-2">
              <i className="bi bi-box-arrow-in-right"></i> {t('nav.login')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeVariantSwitcher compact />
          <button
            onClick={toggle}
            aria-label="Basculer le thème"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-dark/70 dark:text-sand-dark"
          >
            <i className={`bi ${dark ? 'bi-sun' : 'bi-moon-stars'}`}></i>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-dark/70 dark:text-sand-dark"
          >
            <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'} text-xl`}></i>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-forest-dark/5 bg-cream dark:border-white/5 dark:bg-forest-darker xl:hidden">
          <div className="grid gap-1 px-4 py-4 sm:px-6 xl:px-10">
            {[...primaryLinks, ...moreLinks].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
                    isActive
                      ? 'bg-copper/10 font-medium text-copper'
                      : 'text-forest-dark/70 dark:text-sand-dark'
                  }`
                }
              >
                <i className={`bi ${l.icon} w-4 text-center`}></i>
                {t(l.key)}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-forest-dark/10 pt-3 dark:border-white/10">
              <select
                value={lang}
                onChange={handleLang}
                className="rounded-full border border-forest-dark/15 bg-transparent px-3 py-1.5 text-sm dark:border-white/10 dark:text-sand-dark"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
              {user ? (
                <button
                  className="btn-outline !px-4 !py-1.5"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <Link to="/login/" onClick={() => setOpen(false)} className="btn-primary !px-4 !py-1.5">
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
