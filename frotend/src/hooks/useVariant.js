import { useEffect, useState } from 'react';

const KEY = 'ebt_variant';

export function useVariant() {
  const [variant, setVariant] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return saved && saved.length ? saved : 'zellige';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-variant', variant);
    localStorage.setItem(KEY, variant);
  }, [variant]);

  return { variant, setVariant };
}
