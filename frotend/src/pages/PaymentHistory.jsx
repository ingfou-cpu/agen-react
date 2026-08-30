import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { formatPrice, formatDate } from '../lib/format.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

const STATUS_STYLES = {
  completed: 'bg-green-500/15 text-green-600 dark:text-green-300',
  pending: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-300',
  failed: 'bg-red-500/15 text-red-600 dark:text-red-300',
  expired: 'bg-gray-500/15 text-gray-600 dark:text-gray-400',
  refunded: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
};

export default function PaymentHistory() {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.paymentRecords().then(setRecords).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        kicker={t('history.kicker')}
        title={t('history.title')}
        subtitle={t('history.subtitle')}
      />

      <section className="py-20">
        <div className="container-site">
          {loading ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : records.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-dark/10 text-3xl text-forest-dark/40 dark:bg-white/10 dark:text-sand-dark">
                <i className="bi bi-receipt"></i>
              </div>
              <p className="mt-4 text-forest-dark/60 dark:text-sand-dark">{t('history.empty')}</p>
              <Link to="/payment/" className="btn-primary mt-6 inline-block">{t('payment.pay')}</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((r, idx) => (
                <Reveal key={r.id} delay={idx % 4}>
                  <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-forest-dark/40 dark:text-sand-dark">#{r.id}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status] || STATUS_STYLES.pending}`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="font-semibold text-forest-dark dark:text-sand-light">
                        {r.customer_name || '—'}
                      </p>
                      <p className="text-sm text-forest-dark/50 dark:text-sand-dark">
                        {r.customer_email || '—'}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 sm:text-right">
                      <div>
                        <p className="text-xs text-forest-dark/40 dark:text-sand-dark">{t('common.amount')}</p>
                        <p className="font-display text-lg font-semibold text-copper">{formatPrice(r.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-forest-dark/40 dark:text-sand-dark">{t('common.date')}</p>
                        <p className="text-sm font-medium text-forest-dark dark:text-sand-light">{formatDate(r.created_at)}</p>
                      </div>
                      {r.booking && (
                        <Link
                          to={`/booking/confirmation/${r.booking}/`}
                          className="btn-outline !px-3 !py-1.5 text-xs"
                        >
                          <i className="bi bi-eye me-1"></i> {t('history.viewBooking')}
                        </Link>
                      )}
                      {r.reser_circuit && (
                        <Link
                          to={`/circuit/confirmation/${r.reser_circuit}/`}
                          className="btn-outline !px-3 !py-1.5 text-xs"
                        >
                          <i className="bi bi-eye me-1"></i> {t('history.viewCircuit')}
                        </Link>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
