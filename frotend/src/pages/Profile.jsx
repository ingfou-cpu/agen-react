import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../lib/api.js';
import { formatPrice, formatDate } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

const STATUS_COLORS = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  completed: 'bg-green-500/15 text-green-600 dark:text-green-300',
  failed: 'bg-red-500/15 text-red-600 dark:text-red-300',
  refunded: 'bg-forest-dark/10 text-forest-dark/70 dark:bg-white/10 dark:text-sand-dark',
  expired: 'bg-forest-dark/10 text-forest-dark/70 dark:bg-white/10 dark:text-sand-dark',
};

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([api.paymentRecords(), api.bookings()])
      .then(([ps, bs]) => {
        const mine = (x) =>
          x.customer_email && user.email && x.customer_email.toLowerCase() === user.email.toLowerCase();
        setPayments(ps.filter((p) => p.user === user.id || mine(p)));
        setBookingCount(bs.filter(mine).length);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>
    );
  }

  if (!user) {
    return (
      <section className="container-site py-20 text-center">
        <div className="card mx-auto max-w-md p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
            <i className="bi bi-person-lock"></i>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('profile.loginRequired')}</h2>
          <p className="mt-2 text-sm text-forest-dark/60 dark:text-sand-dark">
            {t('profile.loginRequiredMsg')}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login/" className="btn-primary">{t('auth.signIn')}</Link>
            <Link to="/register/" className="btn-outline">{t('auth.signUp')}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-site py-16">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-forest-darker to-forest-dark p-8 text-sand-light relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-30" />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-copper-gradient text-2xl text-white">
                <i className="bi bi-person"></i>
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold">{user.username}</h1>
                <p className="text-sm text-sand-dark">{user.email || t('profile.noEmail')}</p>
              </div>
            </div>
            <button className="btn-outline !text-sand-light !border-sand-light/40 hover:!bg-white/10" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i> {t('nav.logout')}
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-forest-dark/5 p-5 text-center dark:bg-white/5">
            <p className="font-display text-3xl font-semibold text-copper">{payments.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-forest-dark/60 dark:text-sand-dark">{t('nav.payments')}</p>
          </div>
          <div className="rounded-2xl bg-forest-dark/5 p-5 text-center dark:bg-white/5">
            <p className="font-display text-3xl font-semibold text-copper">{bookingCount}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-forest-dark/60 dark:text-sand-dark">{t('profile.bookings')}</p>
          </div>
          <div className="rounded-2xl bg-forest-dark/5 p-5 text-center dark:bg-white/5">
            <p className="font-display text-3xl font-semibold text-copper">
              {formatPrice(payments.filter((p) => p.status === 'completed').reduce((s, p) => s + Number(p.amount || 0), 0))}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-forest-dark/60 dark:text-sand-dark">{t('profile.paid')}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('profile.paymentHistory')}</h2>
        {loadingData ? (
          <div className="mt-6 flex justify-center py-8"><Spinner /></div>
        ) : payments.length === 0 ? (
          <div className="card mt-6 p-10 text-center">
            <i className="bi bi-wallet2 text-4xl text-forest-dark/20 dark:text-sand-dark"></i>
            <p className="mt-3 text-sm text-forest-dark/60 dark:text-sand-dark">{t('profile.noPayments')}</p>
            <Link to="/payment/" className="btn-primary mt-5">{t('profile.payNow')}</Link>
          </div>
        ) : (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-forest-dark/5 text-xs uppercase tracking-wide text-forest-dark/50 dark:border-white/5 dark:text-sand-dark">
                  <th className="px-6 py-4">{t('common.date')}</th>
                  <th className="px-6 py-4">{t('common.customer')}</th>
                  <th className="px-6 py-4">{t('common.amount')}</th>
                  <th className="px-6 py-4">{t('common.status')}</th>
                  <th className="px-6 py-4">{t('common.session')}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-forest-dark/5 last:border-0 dark:border-white/5">
                    <td className="px-6 py-4 text-forest-dark/70 dark:text-sand-dark">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-4 text-forest-dark dark:text-sand-light">{p.customer_name || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-copper">{formatPrice(p.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[p.status] || STATUS_COLORS.pending}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="max-w-[140px] truncate px-6 py-4 text-xs text-forest-dark/40 dark:text-sand-dark">
                      {p.stripe_checkout_session_id || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
