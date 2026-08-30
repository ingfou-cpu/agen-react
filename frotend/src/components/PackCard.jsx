import { Link } from 'react-router-dom';
import { mediaUrl, formatPrice, formatDate } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function PackCard({ pack }) {
  const { t } = useLanguage();
  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className="relative h-56 overflow-hidden">
        <img
          src={mediaUrl(pack.image || pack.image_circuit)}
          alt={pack.pack_name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="badge absolute right-4 top-4 bg-copper-gradient text-white">
          {t('common.from')} {formatPrice(pack.price)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-lg font-semibold leading-snug text-forest-dark dark:text-sand-light">
          {pack.pack_name}
        </h4>
        {pack.date && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-copper">
            <i className="bi bi-calendar-event me-1"></i>
            {formatDate(pack.date)}
          </p>
        )}
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-dark/60 dark:text-sand-dark">
          {pack.description}
        </p>
        <div className="mt-auto flex gap-2 pt-4">
          <Link to={`/circuitChoisi/${pack.id}/`} className="btn-outline flex-1 !py-2 text-sm">
            {t('cta.details')}
          </Link>
          <Link to={`/circuitChoisi/${pack.id}/`} className="btn-primary flex-1 !py-2 text-sm">
            {t('cta.book')}
          </Link>
        </div>
      </div>
    </article>
  );
}
