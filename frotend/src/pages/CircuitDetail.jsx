import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice, formatDate } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function CircuitDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    phone_number: '',
    adults: 1,
    children: 0,
  });

  useEffect(() => {
    api
      .pack(id)
      .then(setPack)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const itinerarySteps = useMemo(() => {
    if (!pack?.itinerary) return [];
    return pack.itinerary
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [pack]);

  const total = useMemo(() => {
    if (!pack) return 0;
    const price = Number(pack.price);
    return price * Number(form.adults || 1) + price * 0.5 * Number(form.children || 0);
  }, [pack, form.adults, form.children]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api.createCircuitBooking({
        pack_travel: Number(id),
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        phone_number: form.phone_number,
      });
      // Rediriger vers la page de confirmation circuit
      if (result?.id) {
        window.location.href = `/circuit/confirmation/${result.id}/`;
      } else {
        setSaved(t('circuit.detail.saved'));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error && !pack) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!pack) return <ErrorState message={t('circuit.detail.notFound')} />;

  return (
    <>
      <div className="relative h-80 overflow-hidden">
        <img
          src={mediaUrl(pack.image_circuit || pack.image)}
          alt={pack.pack_name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-darker via-forest-darker/40 to-transparent" />
        <div className="container-site absolute inset-x-0 bottom-0 pb-8">
          <Link to="/circuit/" className="text-sm text-sand-dark hover:text-copper-light">
            <i className="bi bi-arrow-left me-1"></i> {t('nav.circuits')}
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold text-sand-light">{pack.pack_name}</h1>
          {pack.date && (
            <p className="mt-2 text-sm text-sand-dark">
              <i className="bi bi-calendar-event me-1"></i> {formatDate(pack.date)}
            </p>
          )}
        </div>
      </div>

      <div className="container-site grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('circuit.detail.description')}</h2>
          <p className="mt-4 leading-relaxed text-forest-dark/70 dark:text-sand-dark">{pack.description}</p>

          {itinerarySteps.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-semibold text-forest-dark dark:text-sand-light">📅 {t('circuit.detail.itinerary')}</h2>
              <ol className="mt-6 space-y-0 border-s-2 border-copper/30 ps-6">
                {itinerarySteps.map((step, i) => (
                  <li key={i} className="relative pb-6 last:pb-0">
                    <span className="absolute -start-[1.9rem] flex h-9 w-9 items-center justify-center rounded-full bg-copper-gradient font-display text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <p className="pt-1.5 leading-relaxed text-forest-dark/75 dark:text-sand-dark">{step}</p>
                  </li>
                ))}
              </ol>
            </>
          )}

          {pack.fiche_technique && (
            <div className="card mt-10 p-6">
              <h3 className="text-lg font-semibold text-forest-dark dark:text-sand-light">
                <i className="bi bi-info-circle me-1 text-copper"></i> {t('circuit.detail.techSheet')}
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-forest-dark/70 dark:text-sand-dark">
                {pack.fiche_technique}
              </p>
            </div>
          )}

          <div className="card mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 p-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-forest-dark/50 dark:text-sand-dark">{t('circuit.detail.pricePerAdult')}</p>
              <p className="mt-1 font-semibold text-copper">{formatPrice(pack.price)}</p>
            </div>
            {pack.date && (
              <div>
                <p className="text-xs uppercase tracking-wide text-forest-dark/50 dark:text-sand-dark">{t('circuit.detail.departure')}</p>
                <p className="mt-1 font-semibold text-forest-dark dark:text-sand-light">{formatDate(pack.date)}</p>
              </div>
            )}
            {pack.galerie_photos && (
              <img
                src={mediaUrl(pack.galerie_photos)}
                alt={t('circuit.detail.galleryAlt')}
                className="h-16 w-24 rounded-xl object-cover"
              />
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-7">
            <h3 className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('circuit.detail.bookTitle')}</h3>

            {saved && (
              <p className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                <i className="bi bi-check-circle-fill me-1"></i>{saved}
              </p>
            )}
            {error && (
              <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label" htmlFor="cc-name">{t('circuit.detail.fullName')}</label>
                <input id="cc-name" required className="input" value={form.customer_name} onChange={set('customer_name')} placeholder={t('circuit.detail.namePlaceholder')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="cc-email">{t('circuit.detail.email')}</label>
                  <input id="cc-email" type="email" required className="input" value={form.customer_email} onChange={set('customer_email')} placeholder={t('circuit.detail.emailPlaceholder')} />
                </div>
                <div>
                  <label className="label" htmlFor="cc-phone">{t('circuit.detail.phone')}</label>
                  <input id="cc-phone" className="input" value={form.phone_number} onChange={set('phone_number')} placeholder="0555 12 34 56" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="cc-adults">{t('circuit.detail.adults')}</label>
                  <input
                    id="cc-adults"
                    type="number"
                    min="1"
                    className="input"
                    value={form.adults}
                    onChange={(e) => setForm((f) => ({ ...f, adults: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="cc-children">{t('circuit.detail.children')}</label>
                  <input
                    id="cc-children"
                    type="number"
                    min="0"
                    className="input"
                    value={form.children}
                    onChange={(e) => setForm((f) => ({ ...f, children: e.target.value }))}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-copper/10 px-5 py-3 text-sm text-forest-dark/70 dark:text-sand-dark">
                {t('circuit.detail.childrenDiscount')}
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-forest-dark/5 px-5 py-4 dark:bg-white/5">
                <span className="text-sm font-medium text-forest-dark/70 dark:text-sand-dark">{t('circuit.detail.estimatedTotal')}</span>
                <span className="font-display text-2xl font-semibold text-copper">{formatPrice(total)}</span>
              </div>

              <button type="submit" className="btn-primary w-full">
                <i className="bi bi-check2-circle"></i> {t('circuit.detail.confirm')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
