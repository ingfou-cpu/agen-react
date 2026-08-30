import Reveal from './Reveal.jsx';

/**
 * Reusable section header with kicker line, heading, and subtitle.
 *
 * Props:
 *   kicker   – small uppercase label above title
 *   title    – main heading text
 *   subtitle – optional description paragraph
 *   align    – "center" (default) | "left"
 *   dark     – true for dark backgrounds
 *   className – extra wrapper classes
 */
export default function SectionTitle({
  kicker,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className = '',
}) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  const subtitleMax = align === 'left' ? 'max-w-xl' : 'max-w-2xl mx-auto';

  return (
    <Reveal className={`${alignClass} ${className}`}>
      {kicker && (
        <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">
          {kicker}
        </span>
      )}
      <h2
        className={`font-display text-3xl md:text-4xl lg:text-5xl ${
          dark ? 'text-sand-light' : 'text-forest-dark'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 ${subtitleMax} text-lg ${
            dark ? 'text-sand-dark' : 'text-forest-dark/60'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
