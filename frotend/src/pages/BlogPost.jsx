import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatDate, truncate } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Reveal from '../components/Reveal.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [post, setPost] = useState(null);
  const [recents, setRecents] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ author: '', email: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .blogPosts()
      .then(async (all) => {
        const published = all.filter((p) => p.published);
        const article = published.find((p) => p.slug === slug);
        if (!article) {
          setError(t('blog.post.notFound'));
          return;
        }
        setPost(article);
        setRecents(published.filter((p) => p.slug !== slug).slice(0, 3));
        const cs = await api.blogComments();
        setComments(cs.filter((c) => Number(c.post) === Number(article.id)));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const created = await api.createComment({
        post: Number(post.id),
        author: form.author,
        email: form.email || null,
        body: form.body,
      });
      setComments((c) => [...c, created]);
      setForm({ author: '', email: '', body: '' });
      setSaved(t('blog.post.saved'));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error || !post) return <ErrorState message={error || t('blog.post.notFound')} onRetry={() => window.location.reload()} />;

  const paragraphs = (post.content || '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="container-site py-12">
      <nav className="mb-8 text-sm text-forest-dark/50 dark:text-sand-dark">
        <Link to="/" className="hover:text-copper">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <Link to="/blog/" className="hover:text-copper">{t('nav.blog')}</Link>
        <span className="mx-2">/</span>
        <span className="text-copper">{post.title}</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wide text-copper">
          <i className="bi bi-person me-1"></i>
          {post.author} · {formatDate(post.created_at)}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-forest-dark dark:text-sand-light">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg italic text-forest-dark/60 dark:text-sand-dark">{post.excerpt}</p>
        )}
        {post.image && (
          <Reveal variant="image">
            <img src={mediaUrl(post.image)} alt={post.title} className="mt-8 max-h-[26rem] w-full rounded-3xl object-cover shadow-soft" />
          </Reveal>
        )}

        <div className="mt-8 space-y-5 leading-relaxed text-forest-dark/80 dark:text-sand-dark">
          {paragraphs.length
            ? paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'drop-cap' : undefined}>{p}</p>)
            : post.content}
        </div>

        {post.destination && (
          <p className="mt-10">
            <Link to={`/reselieuChoisi/${post.destination}/`} className="btn-primary">
              <i className="bi bi-geo-alt me-1"></i> {t('blog.post.viewDestination')}
            </Link>
          </p>
        )}
      </article>

      <section id="comments" className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">
          {t('blog.post.comments')} ({comments.length})
        </h2>

        {comments.length > 0 && (
          <div className="mt-6 space-y-5">
            {comments.map((c) => (
              <div key={c.id} className="card p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-forest-dark dark:text-sand-light">
                    <i className="bi bi-person-circle me-1 text-copper"></i>
                    {c.author}
                  </p>
                  <p className="text-xs text-forest-dark/50 dark:text-sand-dark">{formatDate(c.created_at)}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-forest-dark/70 dark:text-sand-dark">{c.body}</p>
              </div>
            ))}
          </div>
        )}

        <div className="card mt-8 p-7">
          <h3 className="text-lg font-semibold text-forest-dark dark:text-sand-light">{t('blog.post.leaveComment')}</h3>
          {saved && (
            <p className="mt-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
              <i className="bi bi-check-circle-fill me-1"></i>{saved}
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</p>
          )}
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="bp-author">{t('blog.post.nameLabel')}</label>
                <input id="bp-author" required className="input" value={form.author} onChange={set('author')} placeholder={t('blog.post.namePlaceholder')} />
              </div>
              <div>
                <label className="label" htmlFor="bp-email">{t('blog.post.email')}</label>
                <input id="bp-email" type="email" className="input" value={form.email} onChange={set('email')} placeholder={t('blog.post.emailPlaceholder')} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="bp-body">{t('blog.post.commentLabel')}</label>
              <textarea id="bp-body" required className="input min-h-[120px]" value={form.body} onChange={set('body')} placeholder={t('blog.post.messagePlaceholder')} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <Spinner className="!h-5 !w-5" /> : <><i className="bi bi-chat-dots"></i> {t('common.send')}</>}
            </button>
          </form>
        </div>
      </section>

      {recents.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('blog.post.readMore')}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {recents.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}/`} className="card group overflow-hidden">
                <div className="h-28 overflow-hidden">
                  <img src={mediaUrl(r.image)} alt={r.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-semibold text-forest-dark dark:text-sand-light">{r.title}</p>
                  <p className="mt-1 text-xs text-copper">{truncate(r.excerpt, 60)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
