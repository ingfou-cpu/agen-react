import React, { useEffect, useRef, useState } from 'react';
import { themes, getTheme } from '../lib/themes.jsx';
import { useVariant } from '../hooks/useVariant.js';
import { useLanguage } from '../lib/i18n.jsx';

export default function ThemeVariantSwitcher({ compact }) {
  const { lang } = useLanguage();
  const { variant, setVariant } = useVariant();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = getTheme(variant);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const label = current.names[lang] || current.names.en;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Thème / Theme"
        title="Thème / Theme"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-forest-dark/70 transition hover:bg-forest-dark/5 dark:text-sand-dark dark:hover:bg-white/5"
      >
        <span className="flex h-6 w-6 items-center justify-center">
          <i className="bi bi-palette"></i>
        </span>
        {!compact && <span className="hidden max-w-[10rem] truncate lg:block">{label}</span>}
        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} text-xs`}></i>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-forest-dark/10 bg-cream p-2 shadow-soft dark:border-white/10 dark:bg-forest-darker">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-forest-dark/50 dark:text-sand-dark">
            {lang === 'ar' ? 'نُسخ الثيم' : lang === 'en' ? 'Theme variants' : 'Variantes de thème'}
          </p>
          {themes.map((th) => {
            const active = th.id === variant;
            return (
              <button
                key={th.id}
                onClick={() => {
                  setVariant(th.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active ? 'bg-copper/10' : 'hover:bg-forest-dark/5 dark:hover:bg-white/5'
                }`}
              >
                <span className="mt-0.5 flex shrink-0 -space-x-1.5">
                  {th.swatches.map((c) => (
                    <span
                      key={c}
                      className="h-6 w-6 rounded-full border-2 border-cream dark:border-forest-darker"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate text-sm font-medium ${active ? 'text-copper' : 'text-forest-dark dark:text-sand-light'}`}>
                    {th.names[lang] || th.names.en}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-forest-dark/60 dark:text-sand-dark">
                    {th.desc[lang] || th.desc.en}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
