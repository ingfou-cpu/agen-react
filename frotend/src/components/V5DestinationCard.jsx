import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl, formatPrice, formatDate } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';

/* ------------------------------------------------------------------ */
/*  V5 — Dala / Void Constellation — DestinationCard (card-21 port)    */
/*  Re-skinned from 21st.dev card-21's 3D tilt + overlay pattern.      */
/*  No card chrome: image tile floats on the void (#000), bottom      */
/*  iris→black legibility gradient, saffron kicker hairline, weight-   */
/*  400 display type, saffron price, tilt-on-hover.                   */
/* ------------------------------------------------------------------ */

const IRIS = '#8052ff';
const SAFFRON = '#ffb829';

// Cycle iris ⇄ saffron so each tile gets a distinct tint while staying V5.
const V5_HUES = [
  '262 82% 66%', // iris violet
  '38 100% 58%', // saffron amber
  '268 78% 62%', // deep iris
  '42 96% 60%',  // warm saffron
  '255 80% 65%', // blue-iris
  '35 98% 57%',  // amber
];

function themeFor(index, override) {
  if (override) return override;
  return V5_HUES[index % V5_HUES.length];
}

export default function V5DestinationCard({ pack, index = 0, themeColor }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovering: false });

  const href = `/circuitChoisi/${pack.id}/`;
  const img = mediaUrl(pack.image || pack.image_circuit);
  const theme = themeFor(index, themeColor);
  // first line of description for the overlay
  const firstLine = (pack.description || '').split('\n')[0].trim().slice(0, 130);
  const idxLabel = String(index + 1).padStart(2, '0');

  const isIris = theme.startsWith('26') || theme.startsWith('25');
  const priceColor = SAFFRON;

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    // respect reduced motion / coarse pointers
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // clamp gentle: card-21 is subtle, V5 keeps it restrained on void
    const ry = dx * 8; // yaw
    const rx = dy * -7; // pitch
    setTilt({ rx, ry, hovering: true });
  }

  function onEnter() {
    setTilt((s) => ({ ...s, hovering: true }));
  }
  function onLeave() {
    setTilt({ rx: 0, ry: 0, hovering: false });
  }

  // Kicker: prefer date (using formatDate), fallback to circuit label — stays saffron with hairline
  const formattedDate = pack.date ? formatDate(pack.date) : '';
  const kickerText = formattedDate || `${t('nav.circuits')} · ${idxLabel}`;

  return (
    <div
      className="group/tilt"
      style={{ perspective: '1200px', perspectiveOrigin: 'center' }}
    >
      <Link
        ref={ref}
        to={href}
        aria-label={`${t('cta.details')}: ${pack.pack_name}`}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative flex h-[430px] flex-col justify-end overflow-hidden rounded-[22px] bg-[#080808] outline-none focus-visible:ring-2 focus-visible:ring-[#8052ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{
          transform: tilt.hovering
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.hovering
            ? 'transform 120ms ease-out'
            : 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Background image */}
        {img ? (
          <img
            src={img}
            alt={pack.pack_name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" />
        )}

        {/* Black legibility base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" aria-hidden="true" />

        {/* V5 accent tint — iris or saffron wash, bottom only */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.0] transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{
            background: `linear-gradient(to top, hsl(${theme} / 0.42) 0%, hsl(${theme} / 0.14) 32%, transparent 68%)`,
            mixBlendMode: 'screen',
          }}
        />
        {/* Subtle violet veil at bottom even at rest so text always legs */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.48) 38%, hsl(${theme} / 0.18) 62%, transparent 100%)`,
          }}
        />

        {/* Top meta — mono index + subtle iris dot */}
        <div
          className="absolute inset-x-0 top-0 flex items-start justify-between p-5 lg:p-6"
          style={{ transform: tilt.hovering ? 'translateZ(28px)' : 'translateZ(0)', transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)' }}
          aria-hidden="true"
        >
          <span className="font-mono text-xs tracking-[0.18em] text-white/70">{idxLabel}</span>
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: isIris ? IRIS : SAFFRON, boxShadow: `0 0 16px ${isIris ? IRIS : SAFFRON}` }}
          />
        </div>

        {/* Bottom content — lifted in Z for depth */}
        <div
          className="relative p-6 lg:p-7"
          style={{ transform: tilt.hovering ? 'translateZ(34px)' : 'translateZ(0)', transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          {/* Saffron kicker hairline */}
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 shrink-0" style={{ background: SAFFRON }} aria-hidden="true" />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.22em] leading-none"
              style={{ color: SAFFRON }}
            >
              {kickerText}
            </span>
          </div>

          <h3 className="font-display text-[26px] lg:text-[28px] font-normal leading-[1.05] tracking-[-0.03em] text-white line-clamp-2">
            {pack.pack_name}
          </h3>

          {firstLine && (
            <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-[#bdbdbd]">
              {firstLine}
            </p>
          )}

          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#9a9a9a]">
                {t('common.from')}
              </span>
              {pack.price != null && pack.price !== '' && (
                <span className="font-display text-[22px] font-normal leading-none tracking-tight" style={{ color: priceColor }}>
                  {formatPrice(pack.price)}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {pack.duration ? (
                <span className="hidden items-center gap-1.5 text-xs text-[#9a9a9a] sm:inline-flex">
                  <i className="bi bi-clock" aria-hidden="true" />
                  {pack.duration} {t('home.v2.days') || 'days'}
                </span>
              ) : null}
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-black/20 text-white backdrop-blur-sm transition-colors duration-300 group-hover/tilt:border-[#8052ff] group-hover/tilt:text-[#8052ff]"
                style={{ borderColor: 'rgba(255,255,255,0.14)' }}
                aria-hidden="true"
              >
                <i className="bi bi-arrow-up-right text-sm rtl:rotate-180" />
              </span>
              <span className="sr-only">{t('cta.details')}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Named export alias so `import { DestinationCard } from 'card-21'`-style code can be
// swapped to this file without rename, if desired.
export { V5DestinationCard as DestinationCard };
