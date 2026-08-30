import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice, formatDate } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { fetchWeather } from '../components/WeatherWidget.jsx';
import { useLanguage } from '../lib/i18n.jsx';

const TRANSPORTS = ['avion', 'train', 'bus', 'voiture'];

export default function DestinationDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [saved, setSaved] = useState('');

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    phone_number: '',
    hotel: '',
    check_in: '',
    check_out: '',
    means_of_transport: 'avion',
    persons: 1,
  });

  useEffect(() => {
    api
      .destination(id)
      .then(async (d) => {
        setDestination(d);
        const hs = await api.hotels();
        setHotels(hs.filter((h) => Number(h.destination) === Number(d.id)));
        if (d.city_name) {
          fetchWeather(d.city_name)
            .then(setWeather)
            .catch(() => setWeather(null));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const selectedHotel = useMemo(
    () => hotels.find((h) => Number(h.id) === Number(form.hotel)),
    [hotels, form.hotel]
  );

  const total = useMemo(() => {
    const base = selectedHotel ? Number(selectedHotel.price) : Number(destination?.price || 0);
    return base * Number(form.persons || 1);
  }, [selectedHotel, destination, form.persons]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api.createBooking({
        destination: Number(id),
        hotel: form.hotel ? Number(form.hotel) : null,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        phone_number: form.phone_number,
        check_out_date: form.check_out ? `${form.check_out}T00:00:00` : null,
        means_of_transport: form.means_of_transport,
      });
      // Rediriger vers la page de confirmation Django (via le proxy Vite)
      if (result?.id) {
        window.location.href = `/booking/confirmation/${result.id}/`;
      } else {
        setSaved(t('detail.savedMessage'));
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
  if (error && !destination) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!destination) return <ErrorState message={t('detail.notFound')} />;

  return (
    <>
      <div className="relative h-80 overflow-hidden">
        <img src={mediaUrl(destination.image)} alt={destination.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-darker via-forest-darker/40 to-transparent" />
        <div className="container-site absolute inset-x-0 bottom-0 pb-8">
          <Link to="/destinations" className="text-sm text-sand-dark hover:text-copper-light">
            <i className="bi bi-arrow-left me-1"></i> {t('nav.destinations')}
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold text-sand-light">{destination.name}</h1>
          <p className="mt-1 text-sm text-sand-dark">
            <i className="bi bi-geo-alt text-red-400"></i> {destination.city_name}
          </p>
        </div>
      </div>

      <div className="container-site grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('detail.about')}</h2>
          <p className="mt-4 leading-relaxed text-forest-dark/70 dark:text-sand-dark">{destination.description}</p>

          <h2 className="mt-10 text-2xl font-semibold text-forest-dark dark:text-sand-light">
            🏨 {t('detail.accommodation')}
          </h2>
          {hotels.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {hotels.map((h) => (
                <div key={h.id} className="card overflow-hidden">
                  {h.image && (
                    <img src={mediaUrl(h.image)} alt={h.hotel_name} className="h-36 w-full object-cover" />
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-forest-dark dark:text-sand-light">{h.hotel_name}</p>
                    <p className="text-xs text-copper">{"⭐".repeat(h.calification_stars || 0)}</p>
                    <p className="mt-2 text-sm font-semibold text-copper">{formatPrice(h.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-forest-dark/60 dark:text-sand-dark">
              {t('detail.noHotels')}
            </p>
          )}

          {weather && (
            <div className="card mt-10 p-6">
              <h3 className="text-lg font-semibold text-forest-dark dark:text-sand-light">{t('detail.currentWeather')}</h3>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-5xl">{weather.emoji}</span>
                <div>
                  <p className="font-display text-3xl font-semibold text-forest-dark dark:text-sand-light">
                    {weather.temp}°
                  </p>
                  <p className="text-sm text-forest-dark/60 capitalize dark:text-sand-dark">{weather.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-7">
            <h3 className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('cta.book')}</h3>
            <p className="mt-1 text-sm text-forest-dark/60 dark:text-sand-dark">
              {t('detail.perPerson').replace('{price}', formatPrice(destination.price))}
            </p>

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
                <label className="label" htmlFor="dc-name">{t('detail.labelFullName')}</label>
                <input id="dc-name" required className="input" value={form.customer_name} onChange={set('customer_name')} placeholder={t('detail.placeholderName')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="dc-email">{t('detail.labelEmail')}</label>
                  <input id="dc-email" type="email" required className="input" value={form.customer_email} onChange={set('customer_email')} placeholder={t('detail.placeholderEmail')} />
                </div>
                <div>
                  <label className="label" htmlFor="dc-phone">{t('detail.labelPhone')}</label>
                  <input id="dc-phone" className="input" value={form.phone_number} onChange={set('phone_number')} placeholder="0555 12 34 56" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="dc-hotel">{t('detail.labelHotel')}</label>
                <select id="dc-hotel" className="input" value={form.hotel} onChange={set('hotel')}>
                  <option value="">{t('detail.optionNone')}</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hotel_name} — {formatPrice(h.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="dc-in">{t('detail.labelCheckIn')}</label>
                  <input id="dc-in" type="date" className="input" value={form.check_in} onChange={set('check_in')} />
                </div>
                <div>
                  <label className="label" htmlFor="dc-out">{t('detail.labelCheckOut')}</label>
                  <input id="dc-out" type="date" className="input" value={form.check_out} onChange={set('check_out')} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="dc-transport">{t('detail.labelTransport')}</label>
                <select id="dc-transport" className="input" value={form.means_of_transport} onChange={set('means_of_transport')}>
                  {TRANSPORTS.map((tr) => (
                    <option key={tr} value={tr}>{tr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="dc-persons">{t('detail.labelPersons')}</label>
                <input
                  id="dc-persons"
                  type="number"
                  min="1"
                  className="input"
                  value={form.persons}
                  onChange={(e) => setForm((f) => ({ ...f, persons: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-copper/10 px-5 py-4">
                <span className="text-sm font-medium text-forest-dark/70 dark:text-sand-dark">{t('detail.totalEstimated')}</span>
                <span className="font-display text-2xl font-semibold text-copper">{formatPrice(total)}</span>
              </div>

              <button type="submit" className="btn-primary w-full">
                <i className="bi bi-check2-circle"></i> {t('detail.confirmBooking')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
