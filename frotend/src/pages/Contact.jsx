import React, { useState } from 'react';
import api from '../lib/api.js';
import Spinner from '../components/Spinner.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      await api.contacts(form);
      setForm({ name: '', email: '', phone: '', message: '' });
      setResult({ ok: true, text: t('contact.success') });
    } catch (err) {
      setResult({ ok: false, text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        kicker={t('contact.kicker')}
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />

      <section className="py-20">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Info cards */}
            <div className="space-y-5">
              {[
                { icon: 'bi-geo-alt', title: t('contact.address'), body: 'El Bayadh, Algérie' },
                { icon: 'bi-envelope', title: t('contact.email'), body: 'contact@elbayadhtravels.dz', href: 'mailto:contact@elbayadhtravels.dz' },
                { icon: 'bi-telephone', title: t('contact.phone'), body: '+213 (0) 00 00 00 00', href: 'tel:+213000000000' },
                { icon: 'bi-clock', title: t('contact.hours'), body: t('contact.hoursValue') },
              ].map((c, idx) => (
                <Reveal key={c.title} delay={idx}>
                  <div className="card flex items-start gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-copper/10 text-xl text-copper">
                      <i className={`bi ${c.icon}`}></i>
                    </div>
                    <div>
                      <p className="font-semibold text-forest-dark dark:text-sand-light">{c.title}</p>
                      {c.href ? (
                        <a href={c.href} className="mt-0.5 block text-sm text-forest-dark/60 dark:text-sand-dark">{c.body}</a>
                      ) : (
                        <p className="mt-0.5 text-sm text-forest-dark/60 dark:text-sand-dark">{c.body}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Form */}
            <Reveal>
              <form onSubmit={submit} className="card p-8">
                <h3 className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('contact.formTitle')}</h3>
                {result && (
                  <p
                    className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                      result.ok
                        ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300'
                        : 'border-red-400/30 bg-red-500/10 text-red-600 dark:text-red-300'
                    }`}
                  >
                    <i className={`bi ${result.ok ? 'bi-check-circle-fill' : 'bi-exclamation-circle'} me-1`}></i>
                    {result.text}
                  </p>
                )}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="label" htmlFor="ct-name">{t('contact.fullName')}</label>
                    <input id="ct-name" required className="input" value={form.name} onChange={set('name')} placeholder={t('contact.namePlaceholder')} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="ct-email">{t('contact.emailLabel')}</label>
                      <input id="ct-email" type="email" required className="input" value={form.email} onChange={set('email')} placeholder="vous@exemple.com" />
                    </div>
                    <div>
                      <label className="label" htmlFor="ct-phone">{t('contact.phone')}</label>
                      <input id="ct-phone" className="input" value={form.phone} onChange={set('phone')} placeholder="0555 12 34 56" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="ct-message">{t('contact.messageLabel')}</label>
                    <textarea id="ct-message" required className="input min-h-[150px]" value={form.message} onChange={set('message')} placeholder={t('contact.messagePlaceholder')} />
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary w-full">
                    {sending ? <Spinner className="!h-5 !w-5" /> : <><i className="bi bi-send"></i> {t('contact.sendMessage')}</>}
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
