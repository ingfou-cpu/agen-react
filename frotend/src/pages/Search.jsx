import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import PackCard from '../components/PackCard.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';

export default function Search() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [destinations, setDestinations] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(q);

  useEffect(() => {
    Promise.all([api.destinations(), api.packs()])
      .then(([ds, ps]) => {
        setDestinations(ds);
        setPacks(ps);
      })
      .finally(() => setLoading(false));
  }, []);

  const normalized = (s) => (s || '').toLowerCase().trim();
  const matches = (obj, keys) => {
    if (!q) return true;
    return keys.some((k) => normalized(obj[k]).includes(normalized(q)));
  };

  const foundDests = useMemo(
    () => destinations.filter((d) => matches(d, ['name', 'city_name', 'description'])),
    [destinations, q]
  );
  const foundPacks = useMemo(
    () => packs.filter((p) => matches(p, ['pack_name', 'description', 'itinerary'])),
    [packs, q]
  );

  const doSearch = (e) => {
    e.preventDefault();
    setParams(text.trim() ? { q: text.trim() } : {});
  };

  return (
    <>
      <PageHero
        kicker={t('search.kicker')}
        title={t('nav.search')}
        subtitle={t('search.subtitle')}
        align="center"
      >
        <form onSubmit={doSearch} className="flex max-w-xl mx-auto gap-0 overflow-hidden rounded-full border border-forest-dark/15 bg-white p-1.5 focus-within:border-copper dark:border-white/10 dark:bg-white/5">
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent px-5 py-2.5 text-sm text-forest-dark outline-none placeholder-forest-dark/40 dark:text-sand-light dark:placeholder-sand-dark/50"
          />
          <button type="submit" className="btn-primary !py-2.5">
            <i className="bi bi-search"></i> {t('common.search')}
          </button>
        </form>
      </PageHero>

      <section className="py-20">
        <div className="container-site">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
              ))}
            </div>
          ) : (
            <>
              {q && (
                <p className="text-center text-sm text-forest-dark/60 dark:text-sand-dark mb-10">
                  {t('search.resultsCount')
                    .replace('{count}', String(foundDests.length + foundPacks.length))
                    .replace('{q}', q)}
                </p>
              )}

              {foundDests.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-forest-dark dark:text-sand-light mb-6">{t('nav.destinations')}</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {foundDests.map((d, idx) => (
                      <Reveal key={d.id} delay={idx % 3}>
                        <DestinationCard destination={d} />
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              {foundPacks.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-forest-dark dark:text-sand-light mb-6">{t('search.packsTitle')}</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {foundPacks.map((p, idx) => (
                      <Reveal key={p.id} delay={idx % 3}>
                        <PackCard pack={p} />
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              {!foundDests.length && !foundPacks.length && (
                <p className="text-center text-forest-dark/60 dark:text-sand-dark py-16">
                  {t('search.noResults')}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
