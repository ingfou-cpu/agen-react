import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { mediaUrl, formatDate, Stars } from '../lib/format.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Testimonials() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.testimonials(), api.destinations()])
      .then(([ts, dests]) => {
        const destMap = {};
        dests.forEach((d) => (destMap[d.id] = d));
        setItems(ts.map((x) => ({ ...x, _destination: destMap[x.destination] })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        kicker={t('testimonial.kicker')}
        title={t('testimonial.title')}
        subtitle={t('testimonial.subtitle')}
      />

      <section className="py-20">
        <div className="container-site">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
              ))}
            </div>
          ) : !items.length ? (
            <p className="text-center text-forest-dark/60 dark:text-sand-dark py-16">{t('testimonial.empty')}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((x, idx) => (
                <Reveal key={x.id} delay={idx % 3}>
                  <figure className="card flex flex-col p-7 h-full">
                    <Stars rating={x.rating} />
                    <blockquote className="mt-4 flex-1 leading-relaxed text-forest-dark/75 dark:text-sand-dark">
                      « {x.comment} »
                    </blockquote>
                    <figcaption className="mt-5 border-t border-forest-dark/5 pt-4 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-copper/15 text-copper">
                          <i className="bi bi-person"></i>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest-dark dark:text-sand-light">
                            {x.customer_name}
                          </p>
                          <p className="text-xs text-forest-dark/50 dark:text-sand-dark">
                            {x._destination ? x._destination.name : t('common.destination')} · {formatDate(x.created_at)}
                          </p>
                        </div>
                      </div>
                    </figcaption>
                    {x._destination?.image && (
                      <div className="mt-4 overflow-hidden rounded-2xl">
                        <img
                          src={mediaUrl(x._destination.image)}
                          alt={x._destination.name}
                          className="h-28 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
