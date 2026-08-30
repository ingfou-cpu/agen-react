/** Formate un prix en euros (ou devise donnée) de façon lisible. */
export function formatPrice(value, currency = 'EUR') {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)} ${currency}`;
  }
}

/** Coupe un texte long avec une ellipsis. */
export function truncate(text, max = 180) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/** URL complète d'une image Django (relative -> servie par le proxy). */
export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

/** Date lisible en français. */
export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Étoiles de notation 1-5. */
export function Stars({ rating, size = 'text-base' }) {
  const r = Number(rating) || 0;
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`} aria-label={`${r}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          className={`bi ${i <= r ? 'bi-star-fill' : 'bi-star'} ${i <= r ? 'text-copper' : 'text-forest-dark/20'}`}
        />
      ))}
    </span>
  );
}

export default { formatPrice, truncate, mediaUrl, formatDate, Stars };
