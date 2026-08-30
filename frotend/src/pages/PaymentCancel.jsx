import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';

export default function PaymentCancel() {
  const { t } = useLanguage();
  return (
    <section className="container-site py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-4xl text-amber-500">
          <i className="bi bi-x-lg"></i>
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-forest-dark dark:text-sand-light">
          {t('payment.cancelTitle')}
        </h1>
        <p className="mt-3 text-forest-dark/60 dark:text-sand-dark">
          {t('payment.cancelMsg')}
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/payment/" className="btn-primary">
            <i className="bi bi-arrow-left"></i> {t('payment.retry')}
          </Link>
          <Link to="/" className="btn-outline">{t('nav.home')}</Link>
        </div>
      </div>
    </section>
  );
}
