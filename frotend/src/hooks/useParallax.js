import { useRef, useEffect } from 'react';

/**
 * Simple scroll-linked parallax — moves the element at a fraction of scroll speed.
 * Returns a ref to attach to the parallaxed element.
 * @param {number} speed – fraction of scroll (0.1 = slow, 0.5 = fast)
 */
export default function useParallax(speed = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * 100 * speed;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}
