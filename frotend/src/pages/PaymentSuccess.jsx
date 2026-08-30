import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api.js';
import { formatPrice, formatDate } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function PaymentSuccess() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [record, setRecord] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    api
      .paymentRecords()
      .then(async (ps) => {
        const found = ps.find((p) => p.stripe_checkout_session_id === sessionId) || null;
        setRecord(found);
        // Charger les détails de la réservation si elle existe
        if (found?.booking) {
          try {
            const b = await api.booking(found.booking);
            setBooking(b);
          } catch {
            /* booking peut ne pas encore exister si le webhook tourne encore */
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <section className="container-site py-20">
      <div className="mx-auto max-w-lg text-center">
        {/* Icône succès animée */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 text-4xl text-green-500 animate-[scaleIn_0.5s_ease-out_0.3s_both]">
          <i className="bi bi-check-lg"></i>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-forest-dark dark:text-sand-light">
          {t('confirm.reservationDone')}
        </h1>
        <p className="mt-2 text-lg font-medium text-green-600 dark:text-green-400">
          {t('confirm.paymentConfirmed')}
        </p>

        {loading ? (
          <div className="mt-8 flex justify-center"><Spinner /></div>
        ) : record ? (
          <>
            {/* Carte réservation */}
            {booking && (
              <div className="card mt-8 p-6 text-left">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-copper">
                  <i className="bi bi-calendar-check me-1"></i> {t('confirm.bookingDetails')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.destination')}</span>
                    <span className="font-semibold text-forest-dark dark:text-sand-light">{booking.destination_name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.customer')}</span>
                    <span className="font-semibold text-forest-dark dark:text-sand-light">{booking.customer_name}</span>
                  </div>
                  {booking.phone_number && (
                    <div className="flex justify-between">
                      <span className="text-forest-dark/60 dark:text-sand-dark">{t('detail.labelPhone')}</span>
                      <span className="font-semibold text-forest-dark dark:text-sand-light">{booking.phone_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-forest-dark/60 dark:text-sand-dark">{t('confirm.bookingRef')}</span>
                    <span className="font-semibold text-copper">#{booking.id}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Carte paiement */}
            <div className="card mt-4 p-6 text-left">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                <i className="bi bi-credit-card me-1"></i> {t('confirm.paymentDetails')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.amount')}</span>
                  <span className="font-semibold text-forest-dark dark:text-sand-light">{formatPrice(record.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.customer')}</span>
                  <span className="font-semibold text-forest-dark dark:text-sand-light">{record.customer_name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.status')}</span>
                  <span className="rounded-full bg-green-500/15 px-3 py-0.5 text-xs font-medium text-green-600 dark:text-green-300">
                    {record.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.date')}</span>
                  <span className="font-semibold text-forest-dark dark:text-sand-light">{formatDate(record.created_at)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-8 text-sm text-forest-dark/50 dark:text-sand-dark">
            {t('common.session')} : {sessionId || t('payment.noSession')}
          </p>
        )}

        <div className="alert mx-auto mt-6 max-w-md rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-center text-sm text-blue-700 dark:text-blue-300">
          <i className="bi bi-envelope me-1"></i> {t('payment.successMsg')}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-primary">{t('common.backHome')}</Link>
          <Link to="/destinations" className="btn-outline">{t('nav.destinations')}</Link>
        </div>
      </div>
    </section>
  );
}
