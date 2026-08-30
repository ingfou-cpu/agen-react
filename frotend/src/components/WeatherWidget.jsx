import { useState } from 'react';
import Spinner from './Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

const WMO = {
  0: ['Dégagé', '☀️'],
  1: ['Principalement dégagé', '🌤️'],
  2: ['Partiellement nuageux', '⛅'],
  3: ['Couvert', '☁️'],
  45: ['Brouillard', '🌫️'],
  48: ['Brouillard givrant', '🌫️'],
  51: ['Bruine légère', '🌦️'],
  53: ['Bruine modérée', '🌦️'],
  55: ['Bruine intense', '🌧️'],
  61: ['Pluie légère', '🌧️'],
  63: ['Pluie modérée', '🌧️'],
  65: ['Pluie forte', '🌧️'],
  66: ['Pluie verglaçante', '🌧️'],
  67: ['Pluie verglaçante forte', '🌧️'],
  71: ['Neige légère', '❄️'],
  73: ['Neige modérée', '❄️'],
  75: ['Neige forte', '❄️'],
  77: ['Grésil', '❄️'],
  80: ['Averses', '🌦️'],
  81: ['Averses modérées', '🌧️'],
  82: ['Averses violentes', '⛈️'],
  85: ['Averses de neige', '🌨️'],
  86: ['Averses de neige fortes', '🌨️'],
  95: ['Orage', '⛈️'],
  96: ['Orage avec grêle', '⛈️'],
  99: ['Orage violent', '⛈️'],
};

function describe(code) {
  return WMO[code] || ['—', '🌡️'];
}

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(city) {
  const geoRes = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`);
  const geo = await geoRes.json();
  const place = geo?.results?.[0];
  if (!place) throw new Error('city_not_found');
  const res = await fetch(
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      '&current=temperature_2m,relative_humidity_2m,surface_pressure,weather_code' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
      '&timezone=auto&forecast_days=7'
  );
  const data = await res.json();
  const currentDesc = describe(data.current.weather_code);
  const days = (data.daily.time || []).map((date, i) => ({
    date,
    code: data.daily.weather_code[i],
    max: Math.round(data.daily.temperature_2m_max[i]),
    min: Math.round(data.daily.temperature_2m_min[i]),
  }));
  return {
    city: `${place.name}${place.country ? ', ' + place.country : ''}`,
    country: place.country || '',
    temp: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    pressure: Math.round(data.current.surface_pressure),
    description: currentDesc[0],
    emoji: currentDesc[1],
    days,
  };
}

export default function WeatherWidget({ initialCity = '' }) {
  const { t } = useLanguage();
  const weekdays = [
    t('weather.weekday.sun'),
    t('weather.weekday.mon'),
    t('weather.weekday.tue'),
    t('weather.weekday.wed'),
    t('weather.weekday.thu'),
    t('weather.weekday.fri'),
    t('weather.weekday.sat'),
  ];
  const [city, setCity] = useState(initialCity);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      setData(await fetchWeather(city.trim()));
    } catch (err) {
      setError(err.message === 'city_not_found' ? t('weather.cityNotFound') : err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={search} className="mx-auto flex max-w-xl gap-0 overflow-hidden rounded-full bg-white/5 p-1.5 ring-1 ring-white/10 focus-within:ring-copper/60">
        <label className="sr-only" htmlFor="weather-city">{t('nav.weather')}</label>
        <input
          id="weather-city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('weather.searchPlaceholder')}
          className="flex-1 bg-transparent px-5 py-2.5 text-sm text-sand-light placeholder-sand-dark/50 outline-none"
        />
        <button type="submit" className="btn-primary !py-2.5">
          <i className="bi bi-search"></i> {t('common.search')}
        </button>
      </form>

      {error && (
        <p className="mx-auto mt-4 max-w-xl rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          <i className="bi bi-exclamation-circle me-1"></i>{error}
        </p>
      )}

      {loading && (
        <div className="mt-10 flex justify-center">
          <Spinner />
        </div>
      )}

      {data && !loading && (
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="card !bg-white/5 p-8 text-center ring-1 ring-white/10">
            <p className="text-lg font-medium text-sand-light">
              <i className="bi bi-geo-alt text-red-400"></i> {data.city}
            </p>
            <div className="my-2 text-6xl">{data.emoji}</div>
            <p className="font-display text-6xl font-semibold text-sand-light">{data.temp}°</p>
            <p className="mt-1 text-sand-dark capitalize">{data.description}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-8 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-sand-dark">💧 {t('weather.humidity')}</div>
                <div className="mt-1 font-semibold text-sand-light">{data.humidity}%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-sand-dark">🔽 {t('weather.pressure')}</div>
                <div className="mt-1 font-semibold text-sand-light">{data.pressure} hPa</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-sand-dark">☁️ {t('weather.conditions')}</div>
                <div className="mt-1 font-semibold text-sand-light capitalize">{data.description}</div>
              </div>
            </div>
          </div>

          <div className="nice-scroll mt-6 flex gap-3 overflow-x-auto pb-2">
            {data.days.map((d, i) => {
              const [desc, emoji] = describe(d.code);
              const dt = new Date(d.date + 'T00:00:00');
              return (
                <div
                  key={d.date}
                  className={`min-w-[7.5rem] rounded-2xl border p-4 text-center ${
                    i === 0
                      ? 'border-copper/50 bg-copper/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <p className="text-sm font-medium text-sand-light">{weekdays[dt.getDay()]}</p>
                  <p className="text-xs text-sand-dark">{d.date.slice(5)}</p>
                  <div className="my-2 text-2xl">{emoji}</div>
                  <p className="text-xs text-sand-dark">{desc}</p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-sand-light">{d.max}°</span>
                    <span className="ml-1 text-sand-dark">{d.min}°</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
