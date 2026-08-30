import WeatherWidget from '../components/WeatherWidget.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Weather() {
  const { t } = useLanguage();
  return (
    <section id="weather" className="relative overflow-hidden bg-forest-darker py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(var(--c-copper)/0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-50" />
      <div className="container-site relative z-10">
        <div className="section-title">
          <h2 className="!text-sand-light">{t('nav.weather')}</h2>
          <p className="!text-sand-dark">{t('weather.subtitle')}</p>
        </div>
        <div className="mt-10">
          <WeatherWidget initialCity="El Bayadh" />
        </div>
      </div>
    </section>
  );
}
