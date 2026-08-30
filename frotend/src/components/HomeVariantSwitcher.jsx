import { Link } from 'react-router-dom';

/**
 * Floating pill to flip between the accueil design variants.
 * Shown only on the home route (rendered by App). "Actuel" is the
 * production Home.jsx; v1 / v2 / v3 / v4 are the alternative concepts.
 */
const VARIANTS = [
  { v: null, label: 'Actuel' },
  { v: '1', label: 'V1' },
  { v: '2', label: 'V2' },
  { v: '3', label: 'V3' },
  { v: '4', label: 'V4' },
];

export default function HomeVariantSwitcher({ activeV }) {
  return (
    <nav
      aria-label="Variantes de la page d'accueil"
      className="fixed bottom-4 end-4 z-50 flex items-center gap-1 rounded-full glass-panel px-2 py-1.5 shadow-soft"
    >
      {VARIANTS.map(({ v, label }) => {
        const active = (activeV ?? null) === v;
        return (
          <Link
            key={label}
            to={v ? `/?v=${v}` : '/'}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              active
                ? 'bg-terracotta text-white'
                : 'text-forest-dark/70 dark:text-sand-dark hover:text-terracotta dark:hover:text-sand-light'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
