import { useRef, useCallback } from 'react';

/**
 * Magnetic button effect — subtle translate on mousemove, spring back on mouseout.
 * Returns a ref to attach to the element.
 */
export default function useMagnetic(strength = 0.2) {
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, 400);
  }, []);

  const onMouseEnter = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transition = '';
  }, []);

  return { ref, onMouseMove, onMouseLeave, onMouseEnter };
}
