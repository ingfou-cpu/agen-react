import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password1: '', password2: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password1 !== form.password2) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await register({ username: form.username, password1: form.password1, password2: form.password2 });
      navigate('/profile/');
    } catch (err) {
      let msg = err.message;
      try {
        const parsed = JSON.parse(err.message);
        msg = Object.entries(parsed)
          .map(([k, v]) => `${k} : ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n');
      } catch { /* message déjà lisible */ }
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
            <i className="bi bi-person-plus"></i>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('auth.registerTitle')}</h2>
          <p className="mt-1 text-sm text-forest-dark/60 dark:text-sand-dark">{t('auth.registerSubtitle')}</p>
        </div>

        {error && (
          <p className="mt-5 whitespace-pre-line rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            <i className="bi bi-exclamation-circle me-1"></i>{error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="rg-user">{t('auth.username')}</label>
            <input
              id="rg-user"
              className="input"
              autoComplete="username"
              required
              value={form.username}
              onChange={set('username')}
              placeholder={t('auth.usernamePlaceholder')}
            />
          </div>
          <div>
            <label className="label" htmlFor="rg-pass1">{t('auth.password')}</label>
            <input
              id="rg-pass1"
              type="password"
              className="input"
              autoComplete="new-password"
              required
              value={form.password1}
              onChange={set('password1')}
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-forest-dark/50 dark:text-sand-dark">{t('auth.passwordHint')}</p>
          </div>
          <div>
            <label className="label" htmlFor="rg-pass2">{t('auth.confirmPassword')}</label>
            <input
              id="rg-pass2"
              type="password"
              className="input"
              autoComplete="new-password"
              required
              value={form.password2}
              onChange={set('password2')}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Spinner className="!h-5 !w-5" /> : <><i className="bi bi-check2-circle"></i> {t('auth.signUp')}</>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-forest-dark/60 dark:text-sand-dark">
          {t('auth.alreadyRegistered')}{' '}
          <Link to="/login/" className="font-semibold text-copper hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
