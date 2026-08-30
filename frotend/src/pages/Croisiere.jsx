import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import PackCard from '../components/PackCard.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Croisiere() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        kicker={t('croisiere.kicker')}
        title={t('croisiere.title')}
        subtitle={t('croisiere.tagline')}
        dark
        pattern="pattern-dunes"
      />

      <section className="py-20">
        <div className="container-site">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
              ))}
            </div>
          ) : items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, idx) => (
                <Reveal key={p.id} delay={idx % 3}>
                  <PackCard pack={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-forest-dark/60 dark:text-sand-dark py-16">{t('croisiere.empty')}</p>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
