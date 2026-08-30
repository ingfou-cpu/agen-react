import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function BookingRecap() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .destination(id)
      .then(setDestination)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>
    );
  }
  if (error || !destination) return <ErrorState message={error || t('booking.notFound')} onRetry={() => window.location.reload()} />;

  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('booking.recapTitle')}</h2>
        <p>{t('booking.recapMsg')}</p>
      </div>

      <div className="mx-auto mt-10 max-w-lg">
        <div className="card overflow-hidden">
          {destination.image && (
            <img src={mediaUrl(destination.image)} alt={destination.name} className="h-48 w-full object-cover" />
          )}
          <div className="p-7">
            <p className="text-xs font-medium uppercase tracking-wide text-copper">{t('common.destination')}</p>
            <h3 className="mt-1 text-2xl font-semibold text-forest-dark dark:text-sand-light">{destination.name}</h3>
            <p className="mt-1 text-sm text-forest-dark/60 dark:text-sand-dark">
              <i className="bi bi-geo-alt me-1 text-copper"></i>{destination.city_name}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-forest-dark/5 pt-5 dark:border-white/5">
              <span className="text-sm text-forest-dark/60 dark:text-sand-dark">{t('booking.totalDue')}</span>
              <span className="font-display text-2xl font-semibold text-copper">{formatPrice(destination.price)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/reselieuChoisi/${destination.id}/`} className="btn-outline flex-1">
            <i className="bi bi-arrow-left"></i> {t('booking.modify')}
          </Link>
          <Link to="/payment/" className="btn-primary flex-1">
            {t('booking.proceed')} <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
