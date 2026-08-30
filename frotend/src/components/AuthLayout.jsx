import { useLanguage } from '../lib/i18n.jsx';
import Reveal from './Reveal.jsx';

/**
 * Split-screen auth layout — dark brand panel left, centered form right.
 * Props:
 *   children – the form content (centered in the right panel)
 */
export default function AuthLayout({ children }) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[80dvh]">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-5/12 bg-forest-darker relative overflow-hidden items-center justify-center">
        <div className="pointer-events-none absolute inset-0 pattern-star opacity-30" />
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-terracotta/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[25vw] h-[25vw] bg-white/3 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-md px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-copper-gradient text-white shadow-glow">
                <i className="bi bi-compass text-xl"></i>
              </span>
              <span className="font-display text-2xl font-semibold text-sand-light">
                El Bayadh <span className="text-copper">Travels</span>
              </span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-3xl md:text-4xl text-sand-light leading-tight mb-6">
              {t('auth.panelTitle')}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-sand-dark text-lg leading-relaxed">
              {t('auth.panelBody')}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
              <div>
                <div className="font-display text-3xl text-sand-light mb-1">15+</div>
                <div className="text-xs uppercase tracking-wider text-sand-dark">{t('auth.panelStat1')}</div>
              </div>
              <div>
                <div className="font-display text-3xl text-sand-light mb-1">1000+</div>
                <div className="text-xs uppercase tracking-wider text-sand-dark">{t('auth.panelStat2')}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream dark:bg-forest-darker">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
