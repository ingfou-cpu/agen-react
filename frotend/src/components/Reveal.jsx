import { useRef, useEffect } from 'react';

/**
 * Scroll-reveal wrapper using IntersectionObserver.
 *
 * Props:
 *   as      – element tag (default "div")
 *   delay   – 0 | 1 | 2 | 3 (maps to reveal-delay-N)
 *   variant – "image" for clip-path entrance (uses @keyframes imageReveal)
 *   className – additional classes
 *   children
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  variant,
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delayClass = delay ? `reveal-delay-${delay}` : '';
  const variantClass = variant === 'image' ? 'reveal-image' : '';

  return (
    <Tag
      ref={ref}
      className={`reveal ${delayClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
