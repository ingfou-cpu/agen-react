import React, { useEffect, useMemo, useState } from 'react';
import Spinner from '../components/Spinner.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { useLanguage } from '../lib/i18n.jsx';

const CURRENCIES = ['EUR', 'USD', 'DZD', 'GBP', 'CHF', 'MAD', 'TND', 'CNY', 'JPY', 'CAD'];
const RATES_URL = '/api/rates/';

export default function Currency() {
  const { t } = useLanguage();
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('DZD');

  useEffect(() => {
    fetch(`${RATES_URL}?from=EUR`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success || !data.rates) throw new Error(data.error || t('currency.ratesUnavailable'));
        setRates({ EUR: 1, ...data.rates });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const result = useMemo(() => {
    if (!rates) return null;
    const base = Number(rates[from]);
    const target = Number(rates[to]);
    if (!base || !target) return null;
    return (Number(amount || 0) / base) * target;
  }, [rates, amount, from, to]);

  const swap = () => { setFrom(to); setTo(from); };

  const fmt = (v) =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v ?? 0);

  return (
    <>
      <PageHero
        kicker={t('currency.kicker')}
        title={t('currency.title')}
        subtitle={t('currency.subtitle')}
      />

      <section className="py-20">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <div className="card p-8">
                {loading ? (
                  <div className="flex justify-center py-10"><Spinner /></div>
                ) : error ? (
                  <p className="text-center text-sm text-red-500">{error}</p>
                ) : (
                  <>
                    <div className="grid gap-5 items-end sm:grid-cols-[1fr_auto_1fr]">
                      <div>
                        <label className="label" htmlFor="cur-amount">{t('currency.amount')}</label>
                        <input
                          id="cur-amount"
                          type="number"
                          min="0"
                          step="any"
                          className="input"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <label className="label">{t('currency.from')}</label>
                        <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
                          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={swap}
                        className="hidden sm:flex self-end h-[46px] w-[46px] items-center justify-center rounded-xl border border-forest-dark/15 text-forest-dark/40 hover:border-copper hover:text-copper dark:border-white/10 dark:text-sand-dark transition-colors"
                        aria-label="Swap currencies"
                      >
                        <i className="bi bi-arrow-left-right"></i>
                      </button>
                      <div className="flex flex-col items-center gap-1">
                        <label className="label">{t('currency.to')}</label>
                        <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
                          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between rounded-2xl bg-copper/10 px-6 py-5">
                      <span className="text-sm font-medium text-forest-dark/70 dark:text-sand-dark">
                        {fmt(amount)} {from} =
                      </span>
                      <span className="font-display text-2xl md:text-3xl font-semibold text-copper">
                        {fmt(result)} {to}
                      </span>
                    </div>
                    <p className="mt-3 text-center text-xs text-forest-dark/50 dark:text-sand-dark">
                      {t('currency.rate')} 1 {from} = {fmt((Number(rates[to]) || 0) / (Number(rates[from]) || 1))} {to}
                    </p>
                  </>
                )}
              </div>

              <div className="card mt-8 overflow-hidden">
                <p className="border-b border-forest-dark/5 px-6 py-4 font-semibold text-forest-dark dark:border-white/5 dark:text-sand-light">
                  {t('currency.baseRate')}
                </p>
                <div className="grid grid-cols-2 divide-x divide-y divide-forest-dark/5 sm:grid-cols-3 dark:divide-white/5">
                  {rates &&
                    CURRENCIES.filter((c) => c !== 'EUR').map((c) => (
                      <div key={c} className="flex items-center justify-between px-6 py-3 text-sm">
                        <span className="font-medium text-forest-dark dark:text-sand-light">{c}</span>
                        <span className="text-forest-dark/60 dark:text-sand-dark">{fmt(rates[c])}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
