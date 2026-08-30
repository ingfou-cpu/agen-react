import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, truncate, formatDate } from '../lib/format.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.blogPosts().then((all) => setPosts(all.filter((p) => p.published))).finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        kicker={t('blog.kicker')}
        title={t('nav.blog')}
        subtitle={t('blog.list.tagline')}
        dark
        pattern="pattern-dunes"
      />

      <section className="py-20">
        <div className="container-site">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
              ))}
            </div>
          ) : !posts.length ? (
            <p className="text-center text-forest-dark/60 dark:text-sand-dark py-16">{t('blog.list.empty')}</p>
          ) : (
            <>
              {featured && (
                <Reveal>
                  <Link
                    to={`/blog/${featured.slug}/`}
                    className="group block mb-12 overflow-hidden rounded-3xl bg-forest-darker shadow-soft transition hover:shadow-soft-lg"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="h-72 overflow-hidden lg:h-full">
                        <img
                          src={mediaUrl(featured.image)}
                          alt={featured.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-8 lg:p-12">
                        <span className="badge w-fit bg-copper-gradient text-white">{t('blog.list.featured')}</span>
                        <h2 className="mt-4 font-display text-3xl font-semibold text-sand-light">{featured.title}</h2>
                        <p className="mt-2 text-sm text-sand-dark">
                          <i className="bi bi-person me-1"></i>
                          {featured.author} · {formatDate(featured.created_at)}
                        </p>
                        <p className="mt-4 leading-relaxed text-sand-dark">{truncate(featured.excerpt, 220)}</p>
                        <span className="btn-outline mt-6 w-fit !text-sand-light">
                          {t('cta.details')} <i className="bi bi-arrow-right ms-1"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, idx) => (
                    <Reveal key={post.id} delay={idx % 3}>
                      <Link
                        to={`/blog/${post.slug}/`}
                        className="card group flex flex-col h-full overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-soft"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={mediaUrl(post.image)}
                            alt={post.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <p className="text-xs font-medium uppercase tracking-wide text-copper">
                            <i className="bi bi-person me-1"></i>
                            {post.author} · {formatDate(post.created_at)}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold leading-snug text-forest-dark dark:text-sand-light">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-dark/60 dark:text-sand-dark">
                            {truncate(post.excerpt, 140)}
                          </p>
                          <span className="mt-auto pt-4 text-sm font-semibold text-copper">
                            {t('cta.details')} <i className="bi bi-arrow-right ms-1"></i>
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
