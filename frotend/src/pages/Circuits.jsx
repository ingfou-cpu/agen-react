import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import PackCard from '../components/PackCard.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Reveal from '../components/Reveal.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Circuits() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setItems).finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = items;

  return (
    <>
      <PageHero
        kicker={t('circuit.kicker')}
        title={t('nav.circuits')}
        subtitle={t('circuit.list.tagline')}
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
            <>
              {/* Featured circuit — editorial card */}
              {featured && (
                <Reveal>
                  <Link
                    to={`/circuitChoisi/${featured.id}/`}
                    className="group block mb-12 overflow-hidden rounded-3xl bg-forest-darker text-sand-light shadow-soft-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={mediaUrl(featured.image || featured.image_circuit)}
                          alt={featured.pack_name}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-terracotta text-xs font-bold uppercase tracking-widest mb-4">{t('circuit.featured')}</span>
                        <h3 className="font-display text-3xl md:text-4xl mb-4 group-hover:text-terracotta transition-colors">{featured.pack_name}</h3>
                        <p className="text-sand-dark text-sm leading-relaxed mb-6 line-clamp-3">{featured.description}</p>
                        {featured.price && (
                          <div className="text-copper-light font-semibold text-lg">{formatPrice(featured.price)}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, idx) => (
                  <Reveal key={p.id} delay={idx % 3}>
                    <PackCard pack={p} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-forest-dark/60 dark:text-sand-dark py-16">{t('circuit.list.empty')}</p>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
