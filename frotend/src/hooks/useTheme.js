import { useEffect, useState } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('ebt_theme');
    if (saved) return saved === 'dark';
    return true; // cohérent avec le site Django (data-theme="dark" par défaut)
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ebt_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark((d) => !d);
  return { dark, toggle };
}
