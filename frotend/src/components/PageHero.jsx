import Reveal from './Reveal.jsx';

/**
 * Full-width page hero band.
 *
 * Props:
 *   kicker   – small uppercase label
 *   title    – main heading (rendered as display-2)
 *   subtitle – optional description
 *   dark     – dark background mode
 *   pattern  – pattern-* class name (e.g. "pattern-zellige")
 *   align    – "left" (default) | "center"
 *   children – optional slot (search bars, stats, etc.)
 *   className – extra wrapper classes
 */
export default function PageHero({
  kicker,
  title,
  subtitle,
  dark = false,
  pattern = null,
  align = 'left',
  children,
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const containerAlign = align === 'center' ? 'mx-auto' : '';
  const subtitleMax = align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl';

  const bgDark = dark
    ? 'bg-forest-darker text-sand-light relative overflow-hidden'
    : 'bg-cream dark:bg-forest-darker border-b border-forest-dark/5 dark:border-white/5';

  return (
    <section className={`${bgDark} ${className}`}>
      {/* Pattern overlay for dark mode */}
      {dark && pattern && (
        <div className={`pointer-events-none absolute inset-0 ${pattern} opacity-50`} />
      )}

      {/* Blur blobs for dark mode */}
      {dark && (
        <>
          <div className="pointer-events-none absolute top-0 right-0 w-[40vw] h-[40vw] bg-terracotta/8 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-[25vw] h-[25vw] bg-white/3 rounded-full blur-[80px]" />
        </>
      )}

      <div className={`container-site relative z-10 pt-28 pb-16 md:pt-36 md:pb-24 ${alignClass}`}>
        <div className={containerAlign} style={align === 'center' ? { maxWidth: '56rem' } : undefined}>
          <Reveal>
            {kicker && (
              <div className={`flex items-center gap-3 mb-6 ${align === 'center' ? 'justify-center' : ''}`}>
                {align === 'left' && <div className="w-8 h-px bg-terracotta" />}
                <span className="text-xs font-medium uppercase tracking-widest text-terracotta">
                  {kicker}
                </span>
              </div>
            )}
          </Reveal>

          <Reveal delay={1}>
            <h1
              className={`font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 ${
                dark ? 'text-sand-light' : 'text-forest-dark'
              }`}
            >
              {title}
            </h1>
          </Reveal>

          {subtitle && (
            <Reveal delay={2}>
              <p
                className={`text-lg md:text-xl ${subtitleMax} leading-relaxed ${
                  dark ? 'text-sand-dark' : 'text-forest-dark/60'
                }`}
              >
                {subtitle}
              </p>
            </Reveal>
          )}

          {children && <Reveal delay={3}>{children}</Reveal>}
        </div>
      </div>
    </section>
  );
}
