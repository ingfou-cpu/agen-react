import { Link } from 'react-router-dom';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function DestinationCard({ destination }) {
  const { t } = useLanguage();
  return (
    <Link
      to={`/reselieuChoisi/${destination.id}/`}
      className="card group block overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-soft"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={mediaUrl(destination.image)}
          alt={destination.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="badge absolute left-4 top-4 bg-forest-darker/80 text-sand-light backdrop-blur">
          <i className="bi bi-geo-alt"></i> {destination.city_name || 'Algérie'}
        </span>
      </div>
      <div className="p-5">
        <h4 className="text-lg font-semibold text-forest-dark dark:text-sand-light">{destination.name}</h4>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-dark/60 dark:text-sand-dark">
          {destination.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-copper">
            {t('common.from')} {formatPrice(destination.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-copper transition group-hover:gap-2">
            {t('cta.details')} <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>
    </Link>
  );
}
